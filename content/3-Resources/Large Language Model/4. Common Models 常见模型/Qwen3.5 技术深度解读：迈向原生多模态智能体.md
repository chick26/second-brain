---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Qwen3.5 技术深度解读：迈向原生多模态智能体"
source: feishu-export
imported: 2026-05-24
---

> **扩展阅读参考链接：**
> 1. **官方 GitHub 仓库** QwenLM/Qwen3.5
> https://github.com/QwenLM/Qwen3.5
> 2. **Hugging Face 模型卡** Qwen/Qwen3.5-397B-A17B
> https://huggingface.co/Qwen/Qwen3.5-397B-A17B
> 3) **NVIDIA NIM 模型卡**
> https://build.nvidia.com/qwen/qwen3.5-397b-a17b/modelcard
> 4) **官方博客页面**
> https://qwen.ai/blog?id=qwen3.5
> 5. **Transformers 源码**
> * `src/transformers/models/qwen3_5/modular_qwen3_5.py, modeling_qwen3_5.py`
> * `src/transformers/models/qwen3_5_moe/modular_qwen3_5_moe.py, modeling_qwen3_5_moe.py`
> * `src/transformers/models/qwen3_next/modular_qwen3_next.py, modeling_qwen3_next.py`
> * `src/transformers/models/qwen3_vl/modular_qwen3_vl.py, modeling_qwen3_vl.py`
> 6. **Transformers 文档**：Qwen3.5 MoE 模型说明
> https://huggingface.co/docs/transformers/main/en/model\_doc/qwen3\_5\_moe
> 7) **相关论文：** GATED DELTA NETWORKS : IMPROVING MAMBA 2 WITH DELTA RULE https://arxiv.org/pdf/2412.06464，Parallelizing Linear Transformers with the Delta Rule over Sequence Length https://arxiv.org/pdf/2406.06484
> 8) **知乎：** https://zhuanlan.zhihu.com/p/2005306558997882654
> 9) **Qwen系列模型：**[[4.6 Qwen系列]]
> **Qwen3.5** 是 Qwen 团队在 2026 年 2 月发布的新一代基座模型系列，定位为集成 **Linear Attention + Full Attention 混合架构** 的 **原生多模态** 模型，强调面向智能体应用场景。首发 **Qwen3.5-397B-A17B** 是 **带视觉编码器的因果语言模型（Causal Language Model with Vision Encoder）**，支持 **文本、图像、视频** 输入，输出文本（`Image-Text-to-Text`）
> 核心工程路线：
> 1. 多模态不再是外挂模块，而是 **早期融合（early fusion）** 进统一 token 流里共同训练
> 2. 为超长上下文与高吞吐，采用 **Gated Delta Networks、线性注意力** 与 **稀疏 MoE** 的混合架构
> 3) 后训练把重点放在 **大规模强化学习的泛化** 与 **工具调用的可用性** 上，默认带思考输出，可关闭
> Qwen3.5 有两个变体：
> * **Qwen3.5 Dense**：MLP 层为标准 SwiGLU
> * **Qwen3.5 MoE**：稀疏混合专家架构，MLP 层替换为 SparseMoeBlock
* **核心技术亮点：**

| 技术 | 说明 |
| ---------------------- | -------------------------------------------------- |
| 混合注意力 | GatedDeltaNet (线性) + Gated Full Attention，75:25 交替 |
| MRoPE | 多模态旋转位置编码，3D 位置 (temporal, height, width) |
| Gated Attention | Q 投影输出翻倍，一半做 query，一半做 sigmoid 门控 |
| MoE with Shared Expert | 256 路由专家 + 共享专家 + sigmoid 门控（MoE 变体） |
| (1+w) RMSNorm | weight 初始化为 0，前向计算 `x * (1 + weight)` |

# 1. 概览

## 1.1 大模型架构的演进瓶颈

Transformer 架构的 **全注意力机制（Full Attention）** 拥有优秀的并行计算能力和长距离依赖捕捉能力，但却存在计算复杂度问题：计算量和 KV Cache 显存占用与序列长度 $L$ 的关系为平方级 $O(L^2)$

应用场景从短文本对话到长文档分析（100k+ tokens）、代码库级理解（1M+ tokens）以及长视频流处理演进，$O(L^2)$ 的复杂度不再可承受：

* **显存墙（Memory Wall）**：极大降低推理吞吐量。在处理长上下文序列时，KV cache 显存占用会迅速上升，导致 batch size 与吞吐受限
* **推理延迟**：随着上下文变长，生成每个 Token 的延迟线性增加，严重影响体验

## 1.2 两条技术路线

解决 $O(L^2)$ 问题，主要有两条技术路线：

* **线性注意力（Linear Attention）与状态空间模型（SSM）**：RWKV、Mamba 等架构，尝试将注意力机制的复杂度降低至 $O(L)$ 或 $O(1)$（推理时）。虽然在效率上很有吸引力，但在 **处理复杂的 大海捞针（Needle-in-a-Haystack）任务和逻辑推理时，往往难以达到全注意力模型的精度**
* **混合专家模型（MoE）**：将大模型拆分为多个专家 experts，每次仅激活其中一小部分，在保持总参数量（知识容量）不变的情况下，显著降低 FLOPs

**这两条路线并不互斥，** Qwen3.5 通过 **Gated DeltaNet 将线性注意力与全注意力的优势结合**，加上 MoE 架构，同时解决了序列长度和参数效率两个问题

## 1.3 三个核心点

**长上下文推理要可控**

用 Gated Delta Networks 这类递推式线性注意力层承担大部分长序列混合（约 75% 的层），同时保留少量全注意力层负责更强的全局交互（约 25% 的层），再叠加稀疏 MoE 在不按 expert 总数线性增加每 token FLOPs 的前提下提升参数容量（top-k 路由，k 固定）

对于推理阶段，**线性注意力层不需要随序列长度增长的 KV cache，而是维护固定大小的递推状态，因此这些层的额外缓存显存随长度 $L$ 近似为常数 $O(1)$ **。由于仍保留 25% 的全注意力层，模型整体推理显存的随 $L$ 增长部分通常仍由这部分层的 KV cache 主导，从而让长上下文推理更可控

**原生多模态**

把图像与视频也变成 token 流的一部分，进行早期融合（Early Fusion）训练，同一基座同时覆盖推理、编码、智能体与视觉理解

当前 **主流多模态模型大多采用后融合策略**：先训一个 LLM，再训一个 ViT，最后用轻量 Projector 连接，存在信息瓶颈

Qwen3.5 通过 **Early Fusion 让视觉信号直接参与 LLM 深层计算**。这对 Agent 任务至关重要，尤其是需要操作 GUI 界面时，必须精确知道按钮的坐标，而非仅仅知道有一个按钮

**强化学习规模化，智能体泛化**

智能体任务里更稳健，减少一碰到真实工具链就崩的现象。官方描述为在百万级智能体环境上扩展强化学习，任务分布逐步复杂化

## 1.4 Qwen 系列的演进轨迹

* **Qwen1.0 & 1.5**：高质量数据清洗和基础 Transformer 架构
* **Qwen2 & 2.5**：全注意力架构下将参数规模推向 72B，并在代码和数学能力上取得突破
* **Qwen3**：开始探索长上下文和推理能力（Thinking Mode）的结合，引入 MoE 架构
* **Qwen3VL**：加入视觉编码器和 MRoPE，引入 DeepStack 多层级视觉特征注入
* **Qwen3Next**：**引入 GatedDeltaNet + Gated Attention 混合注意力 + 共享专家**
* **Qwen3.5**：在 **Qwen3Next 基础上加入 MRoPE + Vision，拆分投影层，去掉 DeepStack**

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-11.png]]

从 import 语句可以清晰地看到 Qwen3.5 的继承链，Qwen3.5MoE 的 **文本能力** 继承自 Qwen3Next（混合注意力 + MoE），**多模态能力** 继承自 Qwen3VL（VisionModel + MRoPE），并做了关键的简化和改进

```python
# modular_qwen3_5.py
from ..qwen3.modeling_qwen3 import Qwen3ForCausalLM
from ..qwen3_next.configuration_qwen3_next import Qwen3NextConfig
from ..qwen3_next.modeling_qwen3_next import (
    Qwen3NextAttention,
    Qwen3NextDynamicCache,
    Qwen3NextGatedDeltaNet,
    Qwen3NextMLP,
    Qwen3NextModel,
    Qwen3NextPreTrainedModel,
    Qwen3NextRMSNorm,
    apply_mask_to_padding_states,
)
from ..qwen3_vl.configuration_qwen3_vl import Qwen3VLConfig, Qwen3VLVisionConfig
from ..qwen3_vl.modeling_qwen3_vl import (
    Qwen3VLForConditionalGeneration,
    Qwen3VLModel,
    Qwen3VLModelOutputWithPast,
    Qwen3VLTextRotaryEmbedding,
    Qwen3VLVisionModel,
    Qwen3VLVisionRotaryEmbedding,
)
```

```python
# modular_qwen3_5_moe.py
from ..qwen3_5.configuration_qwen3_5 import Qwen3_5VisionConfig
from ..qwen3_5.modeling_qwen3_5 import (
    Qwen3_5GatedDeltaNet,
    Qwen3_5MLP,
    Qwen3_5Model,
    Qwen3_5TextModel,
    Qwen3_5TextRotaryEmbedding,
    Qwen3_5VisionModel,
    Qwen3_5VisionRotaryEmbedding,
)
from ..qwen3_next.configuration_qwen3_next import Qwen3NextConfig
from ..qwen3_next.modeling_qwen3_next import (
    Qwen3NextAttention,
    Qwen3NextDecoderLayer,
    Qwen3NextDynamicCache,
    Qwen3NextExperts,
    Qwen3NextForCausalLM,
    Qwen3NextPreTrainedModel,
    Qwen3NextRMSNorm,
    Qwen3NextSparseMoeBlock,
)
from ..qwen3_vl.configuration_qwen3_vl import Qwen3VLConfig
from ..qwen3_vl_moe.modeling_qwen3_vl_moe import (
    Qwen3VLMoeCausalLMOutputWithPast,
    Qwen3VLMoeForConditionalGeneration,
    Qwen3VLMoeModelOutputWithPast,
    Qwen3VLMoeTextTopKRouter,
)
```

# 2. 整体架构纵览

## 2.1 复合结构：VisionModel + TextModel

Qwen3.5 的完整模型`Qwen3_5ForConditionalGeneration`是一个复合结构：

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-12.png]]

视觉输入经过 VisionModel 编码后，通过 PatchMerger 映射到文本隐层维度，然后与文本 embedding 拼接，一起送入 TextModel。TextModel`Qwen3_5TextModel`遵循标准的 Transformer Decoder 架构：

```plaintext
Input IDs → Embedding → [DecoderLayer × N] → RMSNorm → LMHead → Logits
```

## 2.2 混合层设计：75% Linear + 25% Full

Qwen3.5 的关键创新在于 DecoderLayer 有两种类型，根据层索引交替使用：

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-8.png]]

层类型分配遵循 `[L, L, L, F, L, L, L, F, ...]` 的 pattern——每 4 层中 3 层 Linear Attention、1 层 Full Attention（`full_attention_interval=4`），即 **75% Linear + 25% Full**

直觉解释：

1. 长上下文主要消耗在注意力的二次复杂度上，全注意力层越多越贵
2. 线性注意力层把复杂度从 $O(L^2)$ 压到 $O(L)$，适合承担大部分 token 混合
3) 完全不放全注意力会损失某些强全局交互能力，所以用稀疏的全注意力层作为全局校正点

对应的 `DecoderLayer.__init__` 代码（`modular_qwen3_5.py`）：

```python
class Qwen3_5DecoderLayer(GradientCheckpointingLayer):
    def __init__(self, config: Qwen3_5TextConfig, layer_idx: int):
        super().__init__()
        self.hidden_size = config.hidden_size
        self.layer_type = config.layer_types[layer_idx]
        if self.layer_type == "linear_attention":
            self.linear_attn = Qwen3_5GatedDeltaNet(config, layer_idx)
        elif self.layer_type == "full_attention":
            self.self_attn = Qwen3_5Attention(config, layer_idx)
        self.mlp = Qwen3_5MLP(config, config.intermediate_size)
        self.input_layernorm = Qwen3_5RMSNorm(config.hidden_size, eps=config.rms_norm_eps)
        self.post_attention_layernorm = Qwen3_5RMSNorm(config.hidden_size, eps=config.rms_norm_eps)
```

`layer_types` 列表在配置类中自动生成 `configuration_qwen3_5.py` ：

```python
self.layer_types = layer_types
if self.layer_types is None:
    interval_pattern = kwargs.get("full_attention_interval", 4)
    self.layer_types = [
        "linear_attention" if bool((i + 1) % interval_pattern) else "full_attention"
        for i in range(self.num_hidden_layers)
    ]
```

## 2.3 规格表

| **维度** | **数值或描述** |
| ----------------------- | -------------------------------------------------------------------- |
| 总参数量 | 397B |
| 激活参数量 | 17B |
| 模态 | 文本 + 图像 + 视频输入，文本输出 |
| 词表大小 | 248320 |
| 层数 | 60 |
| 隐藏维度 | 4096 |
| head\_dim | 256 |
| partial\_rotary\_factor | 0.25（RoPE 维度 64） |
| 原生上下文 | 262144 tokens |
| 可扩展上下文 | 最高约 1010000 tokens（YaRN RoPE scaling） |
| 混合层布局 | 15 组，每组 3 个 Gated DeltaNet 层加 1 个 Gated Attention 层，且两类层的 FFN 都是 MoE |
| FFN（Dense） | 不单独使用 Dense FFN（该模型每层 FFN 为 MoE） |
| FFN（MoE） | 512 专家，每 token 激活 10 routed + 1 shared |
| MoE 专家中间维度 | 1024 |
| GQA（Full Attn） | Q 头数 32，KV 头数 2（GQA 比例 16:1） |
| Linear Attn 头配置（MoE） | QK 头数 16，V 头数 64，head dim 128 |

## 2.4 与 Qwen3 的对比

**Qwen3 [[4.6 Qwen系列]]** 使用的是 **全 Full Attention** 架构，且在高层使用 Sliding Window Attention：

| 特性 | Qwen3 | Qwen3.5 |
| --------- | --------------------- | ------------------------------ |
| 注意力类型 | Full + Sliding Window | Hybrid (Linear 75% + Full 25%) |
| 推理复杂度 | O(n²) | 大部分 O(n)，少量 O(n²) |
| 长序列友好 | 有限（靠 SWA 缓解） | 原生高效（Linear Attention） |
| GQA 配比 | 32:32 (MHA) | 16:4 (Dense) / 16:2 (MoE) |
| head\_dim | 128 | 256 |
| RoPE | 标准 1D, 全维度 | MRoPE 3D, 仅 25% 维度 |
| RMSNorm | 标准 (ones 初始化) | (1+w) 变体 (zeros 初始化) |
| 视觉编码器 | 无 | ViT (去掉 DeepStack) |

# 3. GatedDeltaNet 线性注意力详解

它是一种基于 Delta Rule 的门控线性注意力机制。在自回归推理场景中，相比传统 Softmax Attention 随序列长度呈二次增长的计算与中间量开销，对处理长序列（文档、视频）构成了瓶颈，Gated DeltaNet 这类线性递推结构对 $L$ 的复杂度是线性的，并且可在推理时用固定大小的状态进行常量内存更新

> 相关论文：
> GATED DELTA NETWORKS : IMPROVING MAMBA 2 WITH DELTA RULE https://arxiv.org/pdf/2412.06464
> Parallelizing Linear Transformers with the Delta Rule over Sequence Length https://arxiv.org/pdf/2406.06484

线性注意力的另一种常用视角是递推状态形式：维护一个与序列长度无关的记忆矩阵（recurrent state）

$S_t\in\mathbb{R}^{d_v\times d_k}$

每来一个 token 只做一次低秩更新，并用 $S_t$ 与当前查询得到输出，从而使复杂度对 $L$ 呈线性（单步代价主要由状态矩阵更新的 $O(d_v d_k)$ 决定）

然而，若采用简单叠加式写入（在很多线性注意力或其等价的 gated linear/SSM 视角下可写成）

$S_t=\alpha_t S_{t-1}+v_t k_t^\top$

当模型需要改写某条已存信息（例如把变量X的值从 1 更新为 2）时，**纯叠加会让旧值与新值在同一记忆槽中混合，造成记忆干扰与更新不彻底**

> **Delta Rule** 的核心思想来自在线学习与最小二乘回归的增量更新：每个新 token 到来时，不是简单地将 key-value 对累加到记忆矩阵中，而是计算当前值与记忆矩阵中已有预测的 **差值（delta）**，并按学习率更新记忆矩阵，使得模型能更好地修正旧信息，增强长距离依赖建模

## 3.1 从标准注意力到线性注意力

* 标准自注意力可写成：
  $\mathrm{Attn}(Q,K,V) = \mathrm{Softmax}\left(\frac{QK^\top}{\sqrt{d}}\right)V$
  其中序列长度为 $L$ 时，$QK^\top$ 是 $L \times L$，计算与显存都是瓶颈
* **线性注意力[[1.3 Attention 注意力]]** 的思想是引入特征映射 $\phi(\cdot)$，把 Softmax 核近似成可分解形式：
  $\mathrm{Attn}(Q,K,V) \approx \frac{\phi(Q)\left(\phi(K)^\top V\right)}{\phi(Q)\left(\phi(K)^\top \mathbf{1}\right)}$
  这样就能通过前缀累计把复杂度压到接近线性

## 3.2 Delta Rule 理论

**Delta Rule（增量规则）** 引入了一种减法机制：在写入新信息之前，先从记忆中减去旧信息

其理想形式为：$S_t \leftarrow S_{t-1} + \beta_t (v_t - S_{t-1} k_t) k_t^\top$，这里的 $(v_t - S_{t-1} k_t)$ 是预测误差。

> 要理解这个公式，需要搞清两个关键问题：
> * **为什么用 $k_t$ 而不是 $q_t$ ？**
> $S \in \mathbb{R}^{d_k \times d_v}$ 是一个 **从 key 空间到 value 空间的映射矩阵**，本质上记录的是"给定一个 key，应该检索出什么 value"的关联关系（ $S \approx \sum_i v_i k_i^\top$）。这里要区分两种操作：
> * ** $S_{t-1}^\top q_t$ ** — 这是 **读取（查询）** 操作：用 query 去检索记忆，得到最终输出 $o_t$
> * ** $S_{t-1}^\top k_t$ ** — 这是 **写入前的自检** 操作：用当前 token 自己的 key 去探测记忆，看"记忆中已经为这个 key 地址存了什么 value"
> Delta Rule 的逻辑是：要把 $(k_t, v_t)$ 写入 $S$ 之前，先用 $k_t$ 查出旧值 $\hat{v}_t = S_{t-1}^\top k_t$，然后只写入差值 $v_t - \hat{v}_t$。这类似 key-value store 的 upsert——**用 k 查是因为要更新 k 对应的位置，用 q 查是因为要读取需要的信息**，写入和读取用的"地址"不同
> * **为什么用 $S_{t-1}$ 而不是 $S_t$ ？**
> 因为这是一个严格的递推过程：在时刻 $t$，$S\_t$ 正是要算出来的结果，还不存在。手里只有上一步的 $S\_{t-1}$。这与梯度下降的逻辑一致——用当前参数（ $S_{t-1}$）计算误差，然后更新得到新参数（ $S_t$）。
> 通过这种"先查旧值、只写差值"的方式，模型能够更精确地重写记忆，避免简单累加导致的信息模糊。

这样更新的含义是：**新信息到来时优先纠错式重写，而不是无条件叠加，从而更擅长处理值变化、指代更新等需要覆盖旧信息的场景**

将上式改写可得到一个更直观的形式：

$S_t=S_{t-1}\big(I-\beta_t k_t k_t^\top\big)+\beta_t v_t k_t^\top$

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-9.png]]

> Qwen3.5 采用的 Gated DeltaNet 在 Delta Rule 的基础上加入了 **数据依赖的遗忘门 $\alpha_t$ **：$S_t = S_{t-1} \alpha_t (I - \beta_t k_t k_t^\top) + \beta_t v_t k_t^\top$
> * $S_{t-1}$ (**Memory State**)：上一时刻的记忆矩阵，$S_t \in \mathbb{R}^{d_v \times d_k}$
> * $\alpha_t \in (0, 1)$ (**Decay Factor**)：数据依赖的遗忘门。当遇到段落分隔符或话题转换时，$\alpha_t \to 0$ 快速清空无关记忆
> * $\beta_t \in (0, 1)$ (**Writing Strength**)：写入强度，控制新信息 $v_t$ 被写入记忆的程度
> * $(I - \beta_t k_t k_t^\top)$ (**Projection Matrix**)：Householder 变换矩阵，将记忆状态投影到与当前 Key $k_t$ 正交的子空间中，在写入新信息之前先腾出旧空间，防止信息重叠

## 3.3 投影层设计：Qwen3.5 vs Qwen3Next 的关键差异

Qwen3.5 对 GatedDeltaNet 做了一个看似简单但意义重大的改动：**拆分投影层**

* **Qwen3Next**`modular_qwen3_next.py` 使用 2 个合并的投影，并且需要一个复杂的 `fix_query_key_value_ordering` 方法来正确拆分这些合并的张量，尤其是在 GQA 分组下

```python
# Qwen3Next: 合并投影
projection_size_qkvz = self.key_dim * 2 + self.value_dim * 2  # Q+K+V+Z 合并
projection_size_ba = self.num_v_heads * 2                      # beta+alpha 合并
self.in_proj_qkvz = nn.Linear(self.hidden_size, projection_size_qkvz, bias=False)
self.in_proj_ba = nn.Linear(self.hidden_size, projection_size_ba, bias=False)
```

* **Qwen3.5**`modular_qwen3_5.py` 拆分为 4 个独立投影：

```python
class Qwen3_5GatedDeltaNet(Qwen3NextGatedDeltaNet):
    def __init__(self, config: Qwen3_5Config, layer_idx: int):
        super().__init__(config, layer_idx)

        del projection_size_qkvz   # 删除父类的合并变量
        del projection_size_ba
        del self.in_proj_qkvz      # 删除父类的合并投影层
        del self.in_proj_ba

        # 拆分为 4 个独立的 Linear
        self.in_proj_qkv = nn.Linear(self.hidden_size, self.key_dim * 2 + self.value_dim, bias=False)
        self.in_proj_z = nn.Linear(self.hidden_size, self.value_dim, bias=False)
        self.in_proj_b = nn.Linear(self.hidden_size, self.num_v_heads, bias=False)
        self.in_proj_a = nn.Linear(self.hidden_size, self.num_v_heads, bias=False)

    def fix_query_key_value_ordering(self):
        raise AttributeError("Not needed for Qwen3.5 Series")
```

这个改动的好处是：

1. **代码更清晰**：不再需要复杂的张量重排函数 `fix_query_key_value_ordering`
2. **语义更明确**：每个投影层的职责一目了然，`in_proj_qkv` 负责 Q/K/V，`in_proj_z` 负责输出门控，`in_proj_b` 负责 beta（学习率），`in_proj_a` 负责 alpha（衰减）
3) **更灵活**：便于对各组件独立做优化（如量化、并行化）

## 3.4 前向计算 6 步骤

GatedDeltaNet 的 forward 过程 `modular_qwen3_5.py` 可分为 6 个步骤：

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-13.png]]

### 步骤 1：输入投影

```python
mixed_qkv = self.in_proj_qkv(hidden_states)  # → [B, L, key_dim*2 + value_dim]
mixed_qkv = mixed_qkv.transpose(1, 2)         # → [B, D, L] 用于 Conv1d

z = self.in_proj_z(hidden_states)              # gate z：[B, L, value_dim]
z = z.reshape(batch_size, seq_len, -1, self.head_v_dim)

b = self.in_proj_b(hidden_states)              # beta 原始值：[B, L, num_v_heads]
a = self.in_proj_a(hidden_states)              # alpha 原始值：[B, L, num_v_heads]
```

注意 `z`（gate）不经过 Conv1d，直接用于后续的 RMSNormGated；`b` 和 `a` 也不经过 Conv1d，分别用于计算 beta（学习率）和 g（衰减系数）

### 步骤 2：因果卷积 (Causal Conv1d)

QKV **拼接后** 经过 **一个** `kernel_size=4` 的 depthwise 因果卷积 + **SiLU 激活**。SiLU 是在 Conv1d 内部对拼接后的 QKV **整体** 施加的，而不是分别对 Q/K/V 施加。这是一种轻量级的局部上下文融合，类似于 Mamba 的设计：

```python
if use_precomputed_states:
    # decode 阶段：增量更新卷积状态
    mixed_qkv = self.causal_conv1d_update(
        mixed_qkv, conv_state,
        self.conv1d.weight.squeeze(1), self.conv1d.bias,
        self.activation,
    )
else:
    # prefill 阶段：完整因果卷积
    if self.causal_conv1d_fn is not None:
        mixed_qkv = self.causal_conv1d_fn(
            x=mixed_qkv,
            weight=self.conv1d.weight.squeeze(1),
            bias=self.conv1d.bias,
            activation=self.activation,
        )
    else:
        mixed_qkv = F.silu(self.conv1d(mixed_qkv)[:, :, :seq_len])
```

卷积之后，按维度拆分出 Q、K、V 并 reshape 为多头格式

### 步骤 3：门控参数计算

```python
beta = b.sigmoid()                                              # 学习率 ∈ (0, 1)
g = -self.A_log.float().exp() * F.softplus(a.float() + self.dt_bias)  # 衰减系数 < 0
```

* `beta = sigmoid(b)`：控制每个 token 的记忆更新强度
* `g = -exp(A_log) * softplus(a + dt_bias)`：控制记忆的指数衰减，`g < 0` 保证 `exp(g) ∈ (0, 1)` 实现遗忘

### 步骤 4：GQA 扩展

Linear Attention 也支持 GQA

```python
if self.num_v_heads // self.num_k_heads > 1:
    query = query.repeat_interleave(self.num_v_heads // self.num_k_heads, dim=2)
    key = key.repeat_interleave(self.num_v_heads // self.num_k_heads, dim=2)
```

### 步骤 5：核心计算

根据是 prefill（处理完整序列）还是 decode（逐 token 生成），选择不同的计算路径：

```python
if not use_precomputed_states:
    # prefill: 分块并行版本，chunk_size=64
    core_attn_out, last_recurrent_state = self.chunk_gated_delta_rule(
        query, key, value, g=g, beta=beta,
        initial_state=None,
        output_final_state=cache_params is not None,
        use_qk_l2norm_in_kernel=True,
    )
else:
    # decode: 逐 token 递推版本
    core_attn_out, last_recurrent_state = self.recurrent_gated_delta_rule(
        query, key, value, g=g, beta=beta,
        initial_state=recurrent_state,
        output_final_state=cache_params is not None,
        use_qk_l2norm_in_kernel=True,
    )
```

递推核里会做 `scale = 1/sqrt(d)` 乘到 query 上，而且在 `use_qk_l2norm_in_kernel=True` 时会对 q 和 k 做 L2 norm

### 步骤 6：输出门控与投影

```python
core_attn_out = core_attn_out.reshape(-1, self.head_v_dim)
z = z.reshape(-1, self.head_v_dim)
core_attn_out = self.norm(core_attn_out, z)    # RMSNormGated(attn_out, gate_z)
core_attn_out = core_attn_out.reshape(batch_size, seq_len, -1)
output = self.out_proj(core_attn_out)           # 线性投影回 hidden_size
```

`RMSNormGated` 先做 RMSNorm，再乘以 `SiLU(gate_z)`，将门控信号融入输出

## 3.5 Delta Rule 递推公式与代码

`torch_recurrent_gated_delta_rule`（`modeling_qwen3_5.py` ）实现了逐 token 的递推公式：

```python
for i in range(sequence_length):
    q_t = query[:, :, i]
    k_t = key[:, :, i]
    v_t = value[:, :, i]
    g_t = g[:, :, i].exp().unsqueeze(-1).unsqueeze(-1)   # 衰减因子
    beta_t = beta[:, :, i].unsqueeze(-1)                  # 学习率

    # 1. 记忆衰减
    last_recurrent_state = last_recurrent_state * g_t

    # 2. 从记忆矩阵检索当前 key 对应的预测值
    kv_mem = (last_recurrent_state * k_t.unsqueeze(-1)).sum(dim=-2)

    # 3. 计算 delta = (实际值 - 预测值) * 学习率
    delta = (v_t - kv_mem) * beta_t

    # 4. 更新记忆矩阵：S += k_t ⊗ delta
    last_recurrent_state = last_recurrent_state + k_t.unsqueeze(-1) * delta.unsqueeze(-2)

    # 5. 用 query 从记忆矩阵中查询输出
    core_attn_out[:, :, i] = (last_recurrent_state * q_t.unsqueeze(-1)).sum(dim=-2)
```

用数学公式表示：

$\tilde S_{t-1} = \exp(g_t)\, S_{t-1}$

$$
S_t = \tilde S_{t-1} + k_t \otimes \big[\beta_t (v_t - \tilde S_{t-1}^\top k_t)\big]$$

$S_t = \exp(g_t) \cdot S_{t-1} + k_t \otimes [\beta_t \cdot (v_t - S_{t-1}^\top k_t)]$

$o_t = S_t^\top q_t$

其中 $S_t \in \mathbb{R}^{d_k \times d_v}$ 是记忆矩阵，$g_t < 0$ 控制遗忘，$\beta_t \in (0,1)$ 控制学习率

## 3.6 分块并行版本

`torch_chunk_gated_delta_rule`（`modeling_qwen3_5.py`）将序列按 `chunk_size=64` 分块，块内利用矩阵乘法并行计算，块间维护递推状态。这是 prefill 阶段的高效版本，比逐 token 递推快得多

核心思路是：

1. 将序列切成 64 个 token 一组的 chunk
2. 计算每个 chunk 内的 decay mask 和 intra-chunk attention
3) 通过构造三角矩阵实现因果性
4) 块间传递 recurrent\_state 完成跨 chunk 依赖

## 3.7 DynamicCache 统一管理

Qwen3.5 的 Cache 需要同时管理两种不同的状态：

* **Full Attention 层**：传统的 `key_cache` / `value_cache`（KV-Cache）
* **Linear Attention 层**：`conv_states`（卷积状态）和 `recurrent_states`（递推记忆矩阵）

在 modular 文件`Qwen3_5DynamicCache`（`modular_qwen3_5.py`）直接继承自 `Qwen3NextDynamicCache`：

```python
class Qwen3_5DynamicCache(Qwen3NextDynamicCache):
    pass
```

`Qwen3NextDynamicCache` 的实现为每一层都初始化了四种 cache 槽：

```python
self.conv_states = [None for _ in range(config.num_hidden_layers)]
self.recurrent_states = [None for _ in range(config.num_hidden_layers)]
self.key_cache = [None for _ in range(config.num_hidden_layers)]
self.value_cache = [None for _ in range(config.num_hidden_layers)]
```

Full Attention 层只使用 `key_cache` / `value_cache`，Linear Attention 层只使用 `conv_states` / `recurrent_states`，其余槽保持 `None`。这种统一管理使得混合架构模型可以无缝集成到现有的 serving 系统中

# 4. Gated Full Attention 详解

占 25% 的 Full Attention 层并不是传统的 Attention，加入了门控机制，成为 **Gated Attention**

> 这里 **看[[1.3 Attention 注意力]]的 Gated Attention 部分详解**

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-5.png]]

## 4.1 Q 维度翻倍 + sigmoid 门控

关键设计：**Q 投影的输出维度翻倍**，前一半是真正的 query，后一半是 sigmoid 门控信号。

```python
# modeling_qwen3_5.py
self.q_proj = nn.Linear(
    config.hidden_size, config.num_attention_heads * self.head_dim * 2,  # ×2 !
    bias=config.attention_bias
)
```

forward 中的拆分和门控应用（`modeling_qwen3_5.py`）：

```python
# 1. Q 投影后拆分为 query 和 gate
query_states, gate = torch.chunk(
    self.q_proj(hidden_states).view(*input_shape, -1, self.head_dim * 2), 2, dim=-1
)
gate = gate.reshape(*input_shape, -1)

# 2. 标准 Attention 计算
query_states = self.q_norm(query_states.view(hidden_shape)).transpose(1, 2)
key_states = self.k_norm(self.k_proj(hidden_states).view(hidden_shape)).transpose(1, 2)
value_states = self.v_proj(hidden_states).view(hidden_shape).transpose(1, 2)

cos, sin = position_embeddings
query_states, key_states = apply_rotary_pos_emb(query_states, key_states, cos, sin)
# ... attention 计算 ...

# 3. 门控：attn_output = attn_output * sigmoid(gate)
attn_output = attn_output.reshape(*input_shape, -1).contiguous()
attn_output = attn_output * torch.sigmoid(gate)

attn_output = self.o_proj(attn_output)
```

门控的直觉是：gate 是对 `num_attention_heads * head_dim` 这整个通道做逐元素门控，决定 Attention 信息的传播强度。这与 GatedDeltaNet 输出端的 `RMSNormGated(x, gate_z)` 类似，二者都是输出端门控，但非线性不同，attention 用 sigmoid，linear 用 SiLU

## 4.2 QK Norm

Qwen3.5 在 Q 和 K 投影后、RoPE 前，对每个 head 独立做 RMSNorm：

```python
# modeling_qwen3_5.py
self.q_norm = Qwen3_5RMSNorm(self.head_dim, eps=config.rms_norm_eps)
self.k_norm = Qwen3_5RMSNorm(self.head_dim, eps=config.rms_norm_eps)
```

Per-head RMSNorm 的好处是稳定 attention logits 的数值范围，防止随训练进行出现的数值爆炸问题，这在大 head\_dim（256）下尤为重要。

## 4.3 Partial Rotary Factor = 0.25

Qwen3.5 只对 **25% 的 head\_dim** 施加旋转位置编码：

```python
# configuration_qwen3_5.py
kwargs.setdefault("partial_rotary_factor", 0.25)  # assign default for BC
```

具体来说，head\_dim=256 时，只有前 64 维参与 RoPE 旋转，剩下 192 维保持原始值。这在 `apply_rotary_pos_emb` 中实现：

```python
# modeling_qwen3_5.py
rotary_dim = cos.shape[-1]                            # = 64
q_rot, q_pass = q[..., :rotary_dim], q[..., rotary_dim:]  # 64 / 192
k_rot, k_pass = k[..., :rotary_dim], k[..., rotary_dim:]

q_embed = (q_rot * cos) + (rotate_half(q_rot) * sin)
k_embed = (k_rot * cos) + (rotate_half(k_rot) * sin)

q_embed = torch.cat([q_embed, q_pass], dim=-1)        # 拼接回 256
k_embed = torch.cat([k_embed, k_pass], dim=-1)
```

对比 Qwen3：head\_dim=128，100% 参与 RoPE。Qwen3.5 用更大的 head\_dim，但只让一小部分参与位置编码，这意味着大部分维度承载的是纯内容信息

# 5. MoE 架构详解

Qwen3.5 MoE 变体将 Dense 模型的 SwiGLU MLP 替换为 SparseMoeBlock

## 5.1 MoE 替换 MLP

| 层类型 | Dense | MoE |
| ------- | ------------------------------ | ------------------------------------------------ |
| 注意力（不变） | GatedDeltaNet / GatedAttention | GatedDeltaNet / GatedAttention |
| FFN | SwiGLU MLP | SparseMoeBlock (Router + Experts + SharedExpert) |

在 MoE 的 DecoderLayer 中（`modular_qwen3_5_moe.py` ）：

```python
class Qwen3_5MoeDecoderLayer(Qwen3NextDecoderLayer):
    def __init__(self, config: Qwen3_5MoeTextConfig, layer_idx: int):
        GradientCheckpointingLayer.__init__(self)
        self.hidden_size = config.hidden_size
        self.layer_type = config.layer_types[layer_idx]
        if self.layer_type == "linear_attention":
            self.linear_attn = Qwen3_5MoeGatedDeltaNet(config, layer_idx)
        elif self.layer_type == "full_attention":
            self.self_attn = Qwen3_5MoeAttention(config, layer_idx)
        self.mlp = Qwen3_5MoeSparseMoeBlock(config)   # 所有层都用 MoE！
        self.input_layernorm = Qwen3_5MoeRMSNorm(config.hidden_size, eps=config.rms_norm_eps)
        self.post_attention_layernorm = Qwen3_5MoeRMSNorm(config.hidden_size, eps=config.rms_norm_eps)
```

注意：与 Qwen3Next 不同（Qwen3Next 中部分层用 MoE、部分层用普通 MLP），Qwen3.5 MoE **每一层都使用 SparseMoeBlock**

## 5.2 TopKRouter：softmax → topk(10) → renormalize

Router 负责将每个 token 分配到 top-k 个专家（`modeling_qwen3_5_moe.py` ）：

```python
class Qwen3_5MoeTopKRouter(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.top_k = config.num_experts_per_tok     # 10
        self.num_experts = config.num_experts         # 512
        self.hidden_dim = config.hidden_size
        self.weight = nn.Parameter(torch.zeros(self.num_experts, self.hidden_dim))

    def forward(self, hidden_states):
        hidden_states = hidden_states.reshape(-1, self.hidden_dim)
        router_logits = F.linear(hidden_states, self.weight)          # [L, 512]
        router_logits = torch.nn.functional.softmax(router_logits, dtype=torch.float, dim=-1)
        router_top_value, router_indices = torch.topk(router_logits, self.top_k, dim=-1)  # [L, 8]
        router_top_value /= router_top_value.sum(dim=-1, keepdim=True)  # renormalize
        router_top_value = router_top_value.to(router_logits.dtype)
        return router_logits, router_top_value, router_indices
```

* 路由逻辑：**softmax → topk(10) → renormalize**。先对所有 512 个专家计算 softmax 概率，选出 top-10，再将这 10 个权重归一化。
* MoE 省了什么：省的是每个 token 不用跑完 512 个专家，只跑 top-10 加共享专家，实际激活计算量仅为全部专家的一小部分

## 5.3 细粒度专家网络

512 个路由专家以 3D 张量存储，每个专家是一个标准的 SwiGLU 结构`modeling_qwen3_5_moe.py` ：

```python
class Qwen3_5MoeExperts(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.num_experts = config.num_experts                    # 512
        self.hidden_dim = config.hidden_size
        self.intermediate_dim = config.moe_intermediate_size     # 1024
        # 3D 张量：[num_experts, 2*intermediate, hidden]
        self.gate_up_proj = nn.Parameter(
            torch.empty(self.num_experts, 2 * self.intermediate_dim, self.hidden_dim)
        )
        # 3D 张量：[num_experts, hidden, intermediate]
        self.down_proj = nn.Parameter(
            torch.empty(self.num_experts, self.hidden_dim, self.intermediate_dim)
        )
```

每个专家的前向计算等价于：`output = down_proj(SiLU(gate_proj(x)) * up_proj(x))`，其中 `gate_proj` 和 `up_proj` 合并存储在 `gate_up_proj` 中

## 5.4 共享专家 + sigmoid 门控

SparseMoeBlock 的完整结构包含路由专家和共享专家（`modeling_qwen3_5_moe.py`）：

```python
class Qwen3_5MoeSparseMoeBlock(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.gate = Qwen3_5MoeTopKRouter(config)
        self.experts = Qwen3_5MoeExperts(config)
        self.shared_expert = Qwen3_5MoeMLP(config,
            intermediate_size=config.shared_expert_intermediate_size)
        self.shared_expert_gate = torch.nn.Linear(config.hidden_size, 1, bias=False)

    def forward(self, hidden_states):
        batch_size, sequence_length, hidden_dim = hidden_states.shape
        hidden_states_reshaped = hidden_states.view(-1, hidden_dim)

        # 共享专家
        shared_expert_output = self.shared_expert(hidden_states_reshaped)

        # 路由专家
        _, routing_weights, selected_experts = self.gate(hidden_states_reshaped)
        expert_output = self.experts(hidden_states_reshaped, selected_experts, routing_weights)

        # 共享专家 sigmoid 门控
        shared_expert_output = F.sigmoid(
            self.shared_expert_gate(hidden_states_reshaped)
        ) * shared_expert_output

        # 合并
        expert_output += shared_expert_output
        return expert_output.reshape(batch_size, sequence_length, hidden_dim)
```

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-4.png]]

最终输出公式： $\text{output}=\sum_i w_i\cdot \text{expert}_i(x)+\sigma(g(x))\cdot \text{shared}(x)$

共享专家确保每个 token 都有一个基线处理，sigmoid 门控让模型自适应地调节共享专家的贡献

# 6. 多模态 RoPE (MRoPE)

## 6.1 3D 位置编码原理

作为原生多模态模型，Qwen3.5 使用多模态旋转位置编码（MRoPE），将位置信息从 1D 扩展到 3D：**temporal（时间）、height（高度）、width（宽度）**

`position_ids` 的 shape 为 `(3, B, L)`，分别对应 T、H、W 三个维度。

在 `Qwen3_5TextModel.forward`（`modular_qwen3_5.py`）中处理：

```python
# mrope: the hard coded `3` is for temporal, height and width.
if position_ids is None:
    position_ids = cache_position.view(1, 1, -1).expand(3, inputs_embeds.shape[0], -1)
elif position_ids.ndim == 2:
    position_ids = position_ids[None, ...].expand(3, position_ids.shape[0], -1)
```

> 如果传进来的 `position_ids` 是 4 个平面，就把第 0 个平面当作“文本 position\_ids”，剩下 3 个平面才是 MRoPE 的 3D 位置

## 6.2 MRoPE Section 与交错排列

RoPE 的频率向量被分成 3 段，分别分配给 T、H、W（`modular_qwen3_5.py` ）：

```python
self.mrope_section = config.rope_parameters.get("mrope_section", [11, 11, 10])
```

32 个 RoPE 维度被分为 `[11, 11, 10]`（总共 32 个 inv\_freq 对应 64 维旋转空间，cos,sin 拼接）

关键细节是 **交错排列** 而非拼接。频率向量按 `[T, H, W, T, H, W, ...]` 的方式排列

`compute_default_rope_parameters` 只负责计算 `inv_freq`；MRoPE 的交错排列是在 rotary embedding 的 `forward` 中，通过 `apply_interleaved_mrope` 把频率布局从分块 `[TTT...HHH...WWW]` 变成交错 `[THWTHW...]`。

## 6.3 Partial Rotary 与 MRoPE 结合

Qwen3.5 的 MRoPE 只作用于 25% 的 head\_dim（`partial_rotary_factor=0.25`），这在 `compute_default_rope_parameters`（`modular_qwen3_5.py` ）中计算：

```python
@staticmethod
def compute_default_rope_parameters(config, device=None, seq_len=None):
    base = config.rope_parameters["rope_theta"]
    partial_rotary_factor = config.rope_parameters.get("partial_rotary_factor", 1.0)
    head_dim = getattr(config, "head_dim", None) or config.hidden_size // config.num_attention_heads
    dim = int(head_dim * partial_rotary_factor)  # 256 * 0.25 = 64

    inv_freq = 1.0 / (
        base ** (torch.arange(0, dim, 2, dtype=torch.int64).to(device=device, dtype=torch.float) / dim)
    )
    return inv_freq, attention_factor
```

最终 `inv_freq` 的长度为 32（64/2），恰好对应 `mrope_section` 的总和 `[11+11+10]`。

| 特性 | Qwen3 | Qwen3VL | Qwen3.5 |
| ----------------------- | ----- | ------------- | ------------- |
| RoPE 类型 | 标准 1D | MRoPE 3D | MRoPE 3D |
| mrope\_section | - | \[24, 20, 20] | \[11, 11, 10] |
| head\_dim | 128 | 128 | 256 |
| partial\_rotary\_factor | 1.0 | 1.0 | 0.25 |
| RoPE 有效维度 | 128 | 128 | 64 |
| 排列方式 | - | 交错 | 交错 |

Qwen3.5 用更大的 head\_dim 但更小的 rotary factor，使得 RoPE 有效维度（64）反而比 Qwen3VL（128）小。这意味着位置信息更加"紧凑"，更多维度留给内容表示

# 7. 视觉编码器

## 7.1 基本结构

Qwen3.5 的视觉编码器继承自 Qwen3VL，基本结构相同：

```plaintext
Video/Image → Conv3d PatchEmbed → + Position Embedding →
→ VisionBlocks × depth → PatchMerger → Visual Tokens
```

* **PatchEmbed**：Conv3d，kernel\_size 为 `(temporal_patch_size, patch_size, patch_size)`
* **Position Embedding**：学习型位置嵌入 + 双线性插值
* **VisionBlocks**：标准 ViT block，含 Attention + MLP
* **PatchMerger**：空间维度合并，`spatial_merge_size=2`

## 7.2 关键简化：去除 DeepStack

Qwen3.5 相对于 Qwen3VL 的最重要改动是 **完全移除了 DeepStack 机制**。

**Qwen3VL 的 DeepStack**（`modular_qwen3_vl.py` ）：

* 在 Vision Encoder 的第 8、16、24 层提取中间特征
* 每个中间层都有独立的 PatchMerger
* 这些多层级特征被注入 LLM，提供多尺度视觉信息

```python
# Qwen3VL VisionModel.__init__
self.deepstack_visual_indexes = config.deepstack_visual_indexes  # [8, 16, 24]
self.deepstack_merger_list = nn.ModuleList([
    Qwen3VLVisionPatchMerger(config, use_postshuffle_norm=True)
    for _ in range(len(config.deepstack_visual_indexes))
])
```

**Qwen3.5 的简化**（`modular_qwen3_5.py`）：

```python
class Qwen3_5VisionModel(Qwen3VLVisionModel):
    def __init__(self, config, *inputs, **kwargs) -> None:
        super().__init__(config, *inputs, **kwargs)
        del self.deepstack_visual_indexes     # 删除 DeepStack 索引
        del self.deepstack_merger_list        # 删除 DeepStack merger 列表
```

Qwen3.5 的 forward 变得更简洁，直接遍历所有 VisionBlock，最后只用一个 PatchMerger 输出：

```python
# Qwen3.5 VisionModel.forward L598-606
for blk in self.blocks:
    hidden_states = blk(hidden_states, cu_seqlens=cu_seqlens, ...)

merged_hidden_states = self.merger(hidden_states)
return BaseModelOutputWithPooling(
    last_hidden_state=hidden_states,
    pooler_output=merged_hidden_states,
)
```

> 去除 DeepStack 的可能原因：
> 1. 混合注意力（GatedDeltaNet + Full Attention）本身已能有效融合多尺度信息
> 2. 简化训练和推理流程，减少参数量
> 3) 避免多级特征注入带来的训练不稳定性

# 8. RMSNorm 与初始化策略

## 8.1 (1+w) RMSNorm

Qwen3.5 使用了一种改进的 RMSNorm（`modeling_qwen3_5.py`），继承自 `Gemma3RMSNorm`：

```python
class Qwen3_5RMSNorm(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.zeros(dim))  # 注意：初始化为 0
    def _norm(self, x):
        return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
    def forward(self, x):
        output = self._norm(x.float())
        output = output * (1.0 + self.weight.float())  # (1+w) 乘法
        return output.type_as(x)
```

关键区别在于 `weight` 的初始化和使用方式：

| 对比 | Qwen3 (标准 RMSNorm) | Qwen3.5 ((1+w) RMSNorm) |
| ---------- | ----------------------- | --------------------------- |
| weight 初始化 | `torch.ones(dim)` | `torch.zeros(dim)` |
| 前向计算 | `norm(x) * weight` | `norm(x) * (1 + weight)` |
| 初始状态 | `norm(x) * 1 = norm(x)` | `norm(x) * (1+0) = norm(x)` |

两者在初始状态下行为完全相同，但 (1+w) 变体在训练中有优势：

* **梯度特性不同**：weight 在 0 附近时梯度更稳定
* **与 residual 的协同**：当 weight 趋向 -1 时，该层等效于被关闭（输出趋向 0），为模型提供了跳层能力

初始化逻辑在 `_init_weights` 中强制确认（`modular_qwen3_5.py`）：

```python
elif isinstance(module, Qwen3_5RMSNorm):
    init.zeros_(module.weight)
```

## 8.2 GatedRMSNorm

GatedDeltaNet 的输出端使用了带门控的 RMSNorm（`modeling_qwen3_5.py`）：

```python
class Qwen3_5RMSNormGated(nn.Module):
    def __init__(self, hidden_size, eps=1e-6, **kwargs):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(hidden_size))  # 注意：这里是 ones
        self.variance_epsilon = eps
    def forward(self, hidden_states, gate=None):
        input_dtype = hidden_states.dtype
        hidden_states = hidden_states.to(torch.float32)
        variance = hidden_states.pow(2).mean(-1, keepdim=True)
        hidden_states = hidden_states * torch.rsqrt(variance + self.variance_epsilon)
        hidden_states = self.weight * hidden_states.to(input_dtype)
        hidden_states = hidden_states * F.silu(gate.to(torch.float32))   # RMSNorm(x) * SiLU(gate)
        return hidden_states.to(input_dtype)
```

GatedRMSNorm 的计算流程：`output = RMSNorm(x) * SiLU(gate_z)`。注意这里 `weight` 用的是 `ones` 初始化（标准做法），因为这个 Norm 的角色不同，它需要在训练初期就能正常传递梯度

# 9. 训练与推理

## 9.1 预训练：三大维度推进

Qwen3.5 预训练在 **能力、效率、通用性** 三个维度上推进：

* **能力（Power）**：在更大规模的视觉-文本语料上训练，加强中英文、多语言、STEM 与推理数据，采用更严格的过滤。官方声称 Qwen3.5-397B-A17B 的 base 模型与参数量超过 1T 的 Qwen3-Max-Base 表现相当
* **效率（Efficiency）**：基于 Qwen3-Next 架构，更高稀疏度的 MoE、Gated DeltaNet + Gated Attention 混合注意力、稳定性优化与 **多 token 预测（Multi-Token Prediction）**。官方给出的效率数据：
  * 在 32k 上下文下，Qwen3.5-397B-A17B 的解码吞吐量是 Qwen3-Max 的 **8.6 倍**
  * 在 256k 上下文下，解码吞吐量是 Qwen3-Max 的 **19.0 倍**
  * 是 Qwen3-235B-A22B 的 **3.5 倍**（32k）/ **7.2 倍**（256k）
* **通用性（Versatility）**：通过早期文本-视觉融合与扩展的视觉/STEM/视频数据实现原生多模态，在相近规模下优于 Qwen3-VL。多语言覆盖从 119 增至 **201 种语言/方言**；词表从 \~150K 扩展至 **248,320**（25 万词表），在多数语言上带来约 **10-60% 的编码/解码效率提升**

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-2.png]]

从工程角度，预训练 pipeline 如下：

1. 文本经过 tokenizer 变成 token id
2. 图像或视频帧进入视觉编码器，得到一串视觉 token 表示
3) 把视觉 token 与文本 token 拼接成统一序列
4) 用标准因果语言建模损失训练：$\mathcal{L}_{\text{CLM}} = -\sum{t=1}^{T} \log p_\theta(x_t \mid x_{<t})$。多模态早期融合下，序列里的 $x_t$ 可以同时来自文本 token 与视觉 token，只是它们的 embedding 来源不同

## 9.2 基础设施

* **异构训练基础设施**：在视觉与语言组件上解耦并行策略，利用稀疏激活实现跨模块计算重叠，在混合文本-图像-视频数据上相比纯文本基线达到 **近 100% 的训练吞吐**
* **原生 FP8 流水线**：对激活、MoE 路由与 GEMM 运算采用低精度，通过运行时监控在敏感层保持 BF16，实现约 **50% 的激活显存降低** 与 **超过 10% 的加速**，稳定扩展至数万亿 token
* **可扩展异步 RL 框架**：支持全尺寸模型的强化学习训练，全面覆盖文本、多模态及多轮交互场景。采用训推分离（Actor-Learner 解耦）架构，配合 FP8 训推、**Rollout 路由回放**、投机采样以及多轮 Rollout 锁定等技术，取得 **3x-5x 的端到端加速**。框架面向原生智能体工作流设计，可扩展百万级规模的 Agent 脚手架与环境

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-7.png]]

## 9.3 后训练：SFT + RL

Qwen3.5 的 Post-training 性能提升主要来自于对各类 **RL 任务和环境的全面扩展**，更强调 RL 环境的难度与可泛化性，而非针对特定指标的优化。官方博客展示了通用 Agent 能力随 RL Environment Scaling 带来的增益曲线（基于 BFCL-V4、VITA-Bench、DeepPlanning、Tool-Decathlon 和 MCP-Mark 的平均排名）

能确定的事实：

1. 模型默认输出带 `<think>...</think>` 的思考内容，然后才给最终答复
2. 可以通过参数关闭思考，得到直接回答
3) Qwen3.5 不再提供 Qwen3 那种 `/think` `/nothink` 的软切换，而是走接口参数控制
4) **Qwen3.5-Plus** 为 API 版本（通过阿里云百炼提供），支持 1M token 上下文、官方工具及自适应调用
5. 提供三种模式：**自动**（auto，自适应思考 + 工具调用）、**思考**（thinking，深度思考）、**快速**（fast，直接回答）

## 9.4 推理部署：262K → 1M 上下文扩展

* **原生上下文：** 默认最大上下文长度是 **262,144 tokens**。
* **扩展到 1010000：** YaRN RoPE scaling。官方给了具体的配置字段，核心是修改 `rope_parameters`，包括 `rope_type: yarn`、`factor: 4.0`、`original_max_position_embeddings: 262144` 等。RoPE 的本质是给 QK 注入相对位置信息，长上下文扩展需要做 RoPE scaling，否则频率范围不够会导致外推性能塌陷
* **部署框架：** 官方推荐使用 vLLM、SGLang 等主流 serving 框架部署。Hugging Face 格式权重和主流框架的适配使得这一模型从"能跑"变成"能上线"。NVIDIA NIM 也同步提供了部署支持

# 10. 实验与评估

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-3.png]]

## 10.1 自然语言评估

对比模型包括 GPT5.2、Claude 4.5 Opus、Gemini-3 Pro、Qwen3-Max-Thinking、K2.5-1T-A32B

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-10.png]]

## 10.2 视觉语言评估

视觉语言对比中，竞品替换 Qwen3-Max-Thinking 为 Qwen3-VL-235B-A22B

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-6.png]]

## 10.3 基座模型对比

以下为 **base model**（未经后训练）的评估结果：

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image.png]]

基座模型评估中，Qwen3.5-397B-A17B 在几乎所有基准上都取得了最高分，尤其在 SuperGPQA（57.96 vs 其他模型的 42-44）、GPQA（54.64）、SWE-agentless（43.26）等基准上优势明显。官方指出：Qwen3.5-397B-A17B 的 base 性能与参数量超过 1T 的 Qwen3-Max-Base 相当，但激活参数量仅为 17B

## 10.4 RL Environment Scaling

官方展示了通用 Agent 能力随 RL Environment scaling 的增益曲线。整体性能由各模型在 BFCL-V4、VITA-Bench、DeepPlanning、Tool-Decathlon 和 MCP-Mark 上的平均排名计算。官方强调的训练策略是"***更加强调 RL 环境的难度与可泛化性，而非针对特定指标或狭隘类别的 query 进行优化"***

![[_Attachments/Images/Qwen3.5 技术深度解读：迈向原生多模态智能体-image-1.png]]

# 11. 总结

Qwen3.5 的代码利用 HuggingFace 的 modular 设计，通过精确的继承和增量修改实现。以下是完整的继承链：

```plaintext
Qwen3_5TextConfig         → Qwen3NextConfig
Qwen3_5GatedDeltaNet      → Qwen3NextGatedDeltaNet
Qwen3_5Attention           → Qwen3NextAttention → Qwen3MoeAttention → Qwen3Attention
Qwen3_5RMSNorm            → Qwen3NextRMSNorm → Gemma3RMSNorm
Qwen3_5TextModel           → Qwen3NextModel
Qwen3_5Model               → Qwen3VLModel
Qwen3_5DynamicCache        → Qwen3NextDynamicCache
Qwen3_5TextRotaryEmbedding → Qwen3VLTextRotaryEmbedding

Qwen3_5MoeSparseMoeBlock   → Qwen3NextSparseMoeBlock → Qwen2MoeSparseMoeBlock
Qwen3_5MoeForCausalLM      → Qwen3NextForCausalLM → MixtralForCausalLM
Qwen3_5MoeTopKRouter       → Qwen3VLMoeTextTopKRouter
```

* **文本骨干** 来自 Qwen3Next（混合注意力架构）
* **多模态外壳** 来自 Qwen3VL（VisionModel + MRoPE + 位置编码）
* **MoE 机制** 追溯到 Qwen2Moe 和 Mixtral
* **RMSNorm** 设计来自 Gemma3

**关键架构决策总结**

1. **混合注意力是核心**：75% 的层用 $O(n)$ 的 GatedDeltaNet 处理，仅 25% 用 $O(n^2)$ 的 Full Attention。这在保持模型表达力的同时大幅提升长序列效率
2. **投影层拆分是实用性改进**：Qwen3.5 将 Qwen3Next 的 2 个合并投影拆分为 4 个独立投影，删除了 `fix_query_key_value_ordering` 方法，代码更清晰，实现更灵活
3) **去 DeepStack 是简化之举**：混合注意力架构本身的多尺度建模能力可能已足够，不再需要 Vision Encoder 的多层级特征注入
5. **(1+w) RMSNorm 贯穿全局**：这一从 Gemma3 借鉴的设计在 Qwen3Next 和 Qwen3.5 中被全面采用，为训练稳定性做出了贡献
