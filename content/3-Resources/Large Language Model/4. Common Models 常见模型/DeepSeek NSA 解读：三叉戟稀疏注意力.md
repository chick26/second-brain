---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "DeepSeek NSA 解读：三叉戟稀疏注意力"
source: feishu-export
imported: 2026-05-24
---

> 论文：**Native Sparse Attention: Hardware-Aligned and Natively Trainable Sparse Attention**
> 论文链接：**https://arxiv.org/abs/2502.11089**

# 推荐阅读
>
> * ⭐⭐⭐⭐⭐ **Native Sparse Attention 原论文**：主线，重点看 Methodology、Kernel Design、Efficiency Analysis
> * ⭐⭐⭐⭐ **FlashAttention-2**：理解为什么连续 block + SRAM 复用 + work partitioning比理论 FLOPs 更重要 https://arxiv.org/abs/2307.08691
> * ⭐⭐⭐⭐ **MInference**：理解 inference-stage sparse attention 和 prefill 稀疏化的思路https://arxiv.org/abs/2407.02490
> * ⭐⭐⭐⭐ **MoBA: Mixture of Block Attention**：和 NSA 同期的 block-wise 长上下文注意力方案，可用于横向比较 https://arxiv.org/abs/2502.13189
> * ⭐⭐⭐⭐ **GQA / MQA**：理解为什么 NSA 的 selection 要在同一 KV group 内共享 block index 　[**从MHA到MLA**](https://kcnd4kn8i6ap.feishu.cn/wiki/SUHDwvtwLiyigUkbMk5c49sPnHW#AZZrdNvmQoABBOxmCcnc7ehxnb1)
> * ⭐⭐⭐ **fla-org/native-sparse-attention / NVIDIA cuDNN NSA**：看真实 kernel / API 怎样把论文算法落到工程里　https://github.com/fla-org/native-sparse-attention，https://docs.nvidia.com/deeplearning/cudnn/frontend/v1.18.0/fe-oss-apis/nsa.html

## 核心结论
>
> * **NSA 不是推理后处理剪枝，而是原生稀疏注意力结构**：模型从 **训练阶段就使用 sparse attention pattern**，避免 dense 模型训练完再强行稀疏导致的结构错配
> * **三路并行注意力是 NSA 的核心**：*<u>Compression 负责粗粒度全局扫描，Selection 负责恢复关键原始 token 的细粒度信息，Sliding Window 负责最近局部上下文</u>*
> * **Selection 的 trick 是复用 Compression attention score**：不再为选块额外计算全量 `QK^T`，而是 **把压缩分支的注意力分数映射成 block importance**，再做 top-n
> * **硬件对齐比稀疏率更关键**：NSA 选择连续 block，而不是随机 token，目的是让 GPU 访存连续、Tensor Core 可用、GQA/MQA 的 KV cache 读取能复用
> * **实验配置下，NSA 在 64k 上下文的训练 forward / backward 和 decode 都有显著加速**：论文报告 **在不损失甚至超越 Full Attention 精度的前提下** 64k 时 forward 最高 9.0×、backward 最高 6.0×，decode 等价 KV 读取量对应 11.6× 的预期加速

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-418b2bc767dfc51ba60dc76db31962cf29976636291f5b096032a982736f322d.jpg]]

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-22e005b01acc8852a9c8a75764f150e25a978c5a6b824028a6aec36a55520589.jpg]]

# 1. 为什么需要 NSA：长上下文 attention 的真瓶颈

标准 causal self-attention 对当前 query `q_t` 会读取所有历史 key/value：

$o_t = \mathrm{Attn}(q_t, k_{:t}, v_{:t}) = \sum_{i=1}^t \mathrm{softmax}\left( \frac{q_t^\top k_i}{\sqrt{d_k}} \right) v_i$

计算量是 $O(N^2)$。当 $N$ 从 4K 增长到 64K，计算量翻了 256 倍。论文估算，在 64K 上下文解码时，注意力计算占总延迟的 **70–80%**

> **类比**：想象你在一个图书馆（序列），你拿着一张便签（Query）写着你想查的内容，图书馆每本书的目录（Key）告诉你它讲什么，书的正文（Value）是实际内容。注意力机制就是你挨个翻遍每本书的目录，根据相关程度给每本书打分，然后按打分加权摘抄正文

$O(N^2)$ 太贵了，但好消息是：**并不是所有 token 都值得关注**。softmax 注意力天然具有稀疏性，大多数 attention score 接近于零，**只有少数关键的 Query-Key 对贡献了绝大部分信息**

> **类比**：继续图书馆场景，其实你不需要翻遍所有书，你可以 **先看书架标签**（粗筛），**再打开最可能相关的几本**（精选），**加上身边随手够得着的几本**（局部窗口）。这就是稀疏注意力的基本思想

当上下文长度进一步扩展到128k、1M 时，问题也并不只是一句复杂度 O(n2)这么简单，而是训练 / prefill / decode 的瓶颈不一样：

| **阶段** | **主要瓶颈** | **直觉** | **优化目标** |
| --------------------- | ------------- | ----------------------------- | ---------------------------- |
| pretraining / prefill | compute-bound | 大块矩阵乘较多，算力占主导 | **减少参与 attention 的 token 数** |
| autoregressive decode | memory-bound | 每步只生成 1 个 token，但要读长 KV cache | **减少 KV cache 读取量** |
| kernel 实现 | 访存 + 调度 | 稀疏 token 如果随机散落，GPU 不一定真快 | 连续块访存、SRAM 复用、GQA group 共享 |

一个关键概念：**算术强度（Arithmetic Intensity）**。

每块 GPU 都有一个"临界算术强度"，由其峰值算力和内存带宽之比决定：

* 如果算法的算术强度 **高于** 临界值 → **计算瓶颈**（Compute-bound）：GPU 的算力先跑满
* 如果算法的算术强度 **低于** 临界值 → **内存瓶颈**（Memory-bound）：数据搬运速度先打满

对于注意力机制来说：

* **训练/Prefill 阶段**：批量矩阵乘法，算术强度高 → **计算瓶颈** → 优化目标是减少计算量
* **解码阶段**：每次只生成一个 token，但要加载整个 KV-Cache → **内存瓶颈** → 优化目标是减少内存访问量

这意味着 **同一种稀疏策略在不同阶段有不同的加速路径**，这也是 NSA 的出发点：**不是只追求理论 sparse ratio，而是把 sparse pattern 设计成训练可用、推理可快、kernel 友好的形式**

# 2. 问题：现有稀疏注意力缺了什么？

> 在 NSA 之前，稀疏注意力方法已经不少了，**H2O、Quest、InfLLM、ClusterKV、MagicPIG、HashAttention，** 但为什么 DeepSeek 要从头设计一个新架构？

## 2.1 高效推理的幻觉：理论加速 ≠ 实际加速

很多方法宣称理论上减少了 80% 的计算，但实际跑起来加速远没那么大。原因有两个：

* **阶段受限的稀疏性**。比如 H2O 在解码阶段做稀疏化，但 prefill 阶段需要先计算完整的注意力分数来构建索引，prefill 没有省到。MInference 反过来，只在 prefill 做稀疏，解码原封不动。结果是：至少有一个阶段的计算量还是跟 Full Attention 一样大。对于 **书籍摘要（prefill 主导）或长链式推理（解码主导）** 这类 workload，半吊子稀疏帮不了多少忙
* **与 GQA 架构不兼容**。现代大模型普遍使用 **Grouped-Query Attention（GQA）**，多个 Query head 共享同一组 KV。但像 Quest 这样的方法，**每个 head 独立选择自己要看的 KV 子集**。在 MHA 模型里这没问题，但在 GQA 模型里，**实际需要加载的 KV 是所有 head 选择集合的并集，** 选择集越分散，节省的内存访问越少

## 2.2 可训练稀疏的迷思：梯度断了，模型学不好

更深层的问题是：**绝大多数稀疏注意力方法只在推理阶段使用，训练时仍然是 Full Attention**。这带来两个问题：

1. **性能退化**：模型在 Full Attention 下训练好了，推理时突然砍掉一大半注意力，相当于强行修改了优化过的计算路径。**即使保留 Top 20% 的注意力分数，也只能覆盖 \~70% 的总分数**
2. **训练效率**：长序列训练本身就很贵，如果稀疏方法不能在训练时也发挥作用，那么长文本预训练、长上下文微调、强化学习这些阶段的计算量一点没省

有些方法尝试在训练中引入稀疏，但遇到了新麻烦：

* **不可微组件**：ClusterKV 用 k-means 聚类，MagicPIG 用 SimHash 哈希，这些 **离散操作让梯度无法反向传播**，模型没法学会该选什么
* **低效反向传播**：HashAttention 虽然理论上可训练，但它是 **token 粒度的选择，导致 KV 加载不连续**。FlashAttention 之所以快，正是因为它按 **连续块** 加载，token 粒度的随机访问直接打破了这个前提

下表总结了现有方法在四个维度上的表现：

| 方法 | 训练阶段支持 | 全阶段推理加速 | 硬件对齐 | GQA 兼容 |
| ------------- | ------- | ------------- | -------- | -------- |
| H2O | ✗ | ✗ (仅解码) | △ | ✗ |
| Quest | ✗ | ✗ (仅解码) | ✓ | ✗ (并集问题) |
| InfLLM | ✗ | ✗ (仅解码) | △ | ✗ |
| MInference | ✗ | ✗ (仅 prefill) | △ | △ |
| ClusterKV | ✗ (不可微) | △ | ✗ (负载不均) | △ |
| HashAttention | △ (低效) | △ | ✗ (随机访问) | ✗ |
| **NSA** | **✓** | **✓ (全阶段)** | **✓** | **✓** |

NSA 的目标很明确：**设计一种端到端可训练、全阶段加速、对硬件友好的原生稀疏注意力架构**。

# 3. NSA 总览

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image.png]]

**整体框架：压缩 + 选择 + 滑动窗口**

NSA 的核心思想是：不直接对原始的 $\mathbf{k}_{:t}, \mathbf{v}_{:t}$ 做注意力计算，而是将它们 **重映射** 为一组更紧凑、信息密度更高的表示 $\tilde{K}_t, \tilde{V}_t$，然后在这个小得多的集合上计算注意力

**NSA 的总公式可以写成：**

$\tilde{K}_t = f_K\left( \mathbf{q}_t, \mathbf{k}_{:t}, \mathbf{v}_{:t} \right), \quad \tilde{V}_t = f_V\left( \mathbf{q}_t, \mathbf{k}_{:t}, \mathbf{v}_{:t} \right)$

然后 **不再对完整 $k_{:t}, v_{:t}$ 做 attention，而是对重映射后的 KV 做**：

$\mathbf{o}_t^* = \sum_{c \in \{\text{cmp}, \text{slc}, \text{win}\}} g_t^c \cdot \text{Attn}\left( \mathbf{q}_t, \tilde{K}_t^c, \tilde{V}_t^c \right)$

其中三条路径分别是：

* `cmp`：Compression，压缩 token
* `slc`：Selection，被选中的原始 token block
* `win`：Sliding Window，最近 $w$ 个 token
* $g_t^c \in [0,1]$ ：learned gate，用 MLP + sigmoid 从输入特征算出来，负责合并三路输出
> **很有意思的类比**：机场安检有三道关卡
> * **X 光粗扫**（压缩分支）：行李过 X 光机，快速扫描全部行李的概况
> * **人工精查**（选择分支）：根据 X 光结果挑出可疑行李，人工仔细检查
> * **就近搜身**（滑窗分支）：直接搜查最近几位乘客，确保不遗漏身边的威胁
> 三道关的结果再去 **综合判断**，既全面又高效

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-6.png]]

**关键超参数**（论文的实验设置）：



| 参数 | 含义 | 值 |
| --- | --- | --- |
| l | 压缩块长度 | 32 |
| d | 压缩滑动步长 | 16 |
| l' | 选择块大小 | 64 |
| n | 选择块数量 | 16 |
| w | 滑动窗口大小 | 512 |



# 4. 三路注意力模式

## 4.1 Compression：重叠块压缩，先获得粗粒度全局视野

只靠 sliding window 会丢全局；只靠随机 sparse 又不硬件友好。Compression 的目标是把历史 KV 按时间连续块压成较短序列，目标是获取 **粗粒度的全局语义信息**：

具体做法是：将 Key 序列按块划分，每 $l=32$ 个 token 为一块，用一个带位置编码的可学习 MLP $\varphi$ 将整块压缩成一个单独的向量：

$\tilde{K}_t^{\text{cmp}} = \left\{\varphi(\mathbf{k}_{id+1:id+l}) \mid 0 \leq i \leq \left\lfloor\frac{t-l}{d}\right\rfloor\right\}$

`V` 也做同样的压缩

注意这里有个巧妙的设计：**滑动步长** $d=16$ **小于块长** $l=32$，**相邻的压缩块之间有 16 个 token 的重叠**

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-7.png]]

***压缩过程的细节。每 32 个 token 为一个压缩块，相邻块以 stride=16 滑动，产生 16 token 的重叠——就像会议纪要，不同段落稍有重叠以保证上下文连贯***

**为什么要重叠？** 如果完全不重叠（$d=l$），相邻块的边界处就会出现信息断裂，就像把一段话从中间截断分给两个人总结，接缝处的信息容易丢失。**重叠滑动让边界信息被相邻的两个压缩块都看到，减少了信息断裂**

**教学代码**

下面是一个偏教学的 PyTorch 版本，不追求 kernel 性能，只演示 compression 的数据流：

```python
import torch
import torch.nn as nn

class ToyNSACompressor(nn.Module):
    """
    教学版 NSA compressor：
    - 输入: x [B, T, H, D]
    - 输出: compressed [B, T_cmp, H, D]
    - l: block size
    - d: stride
    注意：真实实现会考虑 fused kernel、layout、dtype、GQA/MQA 等问题。
    """def __init__(self, head_dim: int, block_size: int = 32, stride: int = 16):
        super().__init__()
        self.block_size = block_size
        self.stride = stride
        self.pos = nn.Parameter(torch.zeros(block_size, head_dim))
        self.mlp = nn.Sequential(
            nn.Linear(head_dim, 2 * head_dim),
            nn.SiLU(),
            nn.Linear(2 * head_dim, head_dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, H, D = x.shape
        blocks = []
        for start in range(0, T - self.block_size + 1, self.stride):
            block = x[:, start:start + self.block_size]              # [B, l, H, D]
            block = block + self.pos[None, :, None, :]              # 块内位置编码# 简化：先 MLP，再对块内 token 求平均
            comp = self.mlp(block).mean(dim=1)                      # [B, H, D]
            blocks.append(comp)
        return torch.stack(blocks, dim=1)                           # [B, T_cmp, H, D]
```

**Compression 的压缩率不是极限压缩。它要保留一个粗但全的视图，使每个 query 至少能用较少代价扫过整个历史。后面 Selection 再把关键位置的原始 token 精读回来**

## 4.2 Selection：复用压缩分数做 top-n 原始块选择

如果只看压缩 token，重要细节会丢。例如代码里的某一行、数学证明里的某个条件、长文档里的具体数值，可能在压缩时被平均掉

最直接的办法是：对所有原始 token 算 `QK^T`，然后 top-k。问题是这已经接近 full attention 了。NSA 的设计是：

> **Compression 分支已经算过 query 对压缩块的 attention score，就把这个 score 当作 block importance 的低成本代理。**

* **Selection 数据流**

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-8.png]]

先计算压缩 attention score：

$\mathbf{p}_t^{cmp} = \mathrm{Softmax}\left(\mathbf{q}_t^\top \tilde{K}_t^{cmp}\right)$

如果 compression block 和 selection block 的划分完全一致，那么 selection block score 可以直接用 `p_cmp`。但 NSA 的典型设置是：

* compression：`l = 32, d = 16`
* selection：`l' = 64`

所以 **一个 selection block 会被多个压缩块覆盖，需要根据空间关系将压缩分数累加映射到选择块上**

论文里的核心关系可以用更工程化的话描述为：

```plain
selection_block_score[j]
= sum of compression_attention_scores whose compressed windows overlap selection_block[j]
```

对于 GQA / MQA，**多个 query heads 共享同一组 KV cache**。如果每个 head 单独 top-n，就会导致同一 group 内 KV 读取的并集变大，decode 时 memory load 又涨回去。**所以 NSA 对同一 KV group 内的 heads 聚合分数**：

$\mathbf{p}_{t}^{slc\prime} = \sum_{h=1}^{H} \mathbf{p}_{t}^{slc,(h)}$

然后做 top-n：

$I_t = \{ i \mid \mathrm{rank}(\mathbf{p}_{t}^{slc\prime}[i]) \le n \}$

最终保留：

$\tilde{K}_t^{slc} = \mathrm{Cat}\left(\{ k_{i l' + 1:(i+1)l'} \mid i \in I_t \}\right)$

`V` 同理

* **教学版代码**

```python
import torch

def compression_scores_to_selection_scores(
    p_cmp: torch.Tensor,
    comp_block_size: int = 32,
    comp_stride: int = 16,
    sel_block_size: int = 64,
) -> torch.Tensor:
    """
    p_cmp: [B, T_q, H_q, T_cmp]
    返回 p_slc: [B, T_q, H_q, T_sel]

    这里用直观 overlap 逻辑写，便于理解；真实 kernel 会避免 Python 循环。
    """
    B, T_q, H_q, T_cmp = p_cmp.shape
    # 压缩窗口的 token 覆盖区间: [start, end)
    comp_ranges = []
    for i in range(T_cmp):
        start = i * comp_stride
        end = start + comp_block_size
        comp_ranges.append((start, end))

    max_token = comp_ranges[-1][1]
    T_sel = (max_token + sel_block_size - 1) // sel_block_size
    p_slc = p_cmp.new_zeros(B, T_q, H_q, T_sel)

    for j in range(T_sel):
        sel_start = j * sel_block_size
        sel_end = sel_start + sel_block_size
        for i, (c_start, c_end) in enumerate(comp_ranges):
            overlap = not (c_end <= sel_start or c_start >= sel_end)
            if overlap:
                p_slc[..., j] += p_cmp[..., i]
    return p_slc

def group_shared_topk_blocks(
    p_slc: torch.Tensor,
    heads_per_group: int,
    top_n: int,
) -> torch.Tensor:
    """
    p_slc: [B, T_q, H_q, T_sel]
    返回 block_indices: [B, T_q, H_kv, top_n]

    同一 GQA group 内 heads 共享选中的 KV block。
    """
    B, T_q, H_q, T_sel = p_slc.shape
    assert H_q % heads_per_group == 0
    H_kv = H_q // heads_per_group

    grouped = p_slc.view(B, T_q, H_kv, heads_per_group, T_sel)
    group_scores = grouped.sum(dim=3)                    # [B, T_q, H_kv, T_sel]
    topk = torch.topk(group_scores, k=top_n, dim=-1)
    return topk.indices.sort(dim=-1).values              # 连续块按位置排序，方便访存
```

**关键坑点：**

* Selection 的 top-n 是离散选择，不能简单理解为所有索引连续可导。NSA 的natively trainable更准确的理解是：**训练阶段原生使用这套 sparse attention 计算图，并为稀疏 attention / kernel 实现可训练的 forward-backward，而不是把一个 dense 模型训练完再做后处理稀疏**
* block selection 的粒度是连续块，不是任意 token。这样可能牺牲一点极端细粒度，但换来硬件友好
* GQA group 共享选择是 decode 加速的关键；否则每个 head 的选择集合并起来可能接近 dense

## 4.3 Sliding Window：显式承接局部模式，避免局部 shortcut 干扰全局分支

> **为什么需要单独的滑窗分支？**
> 因为注意力机制中，**局部信息**（最近的几百个 token）通常非常重要，**句子的语法结构、代码的局部变量引用、对话的上下文承接，** 如果把局部信息跟压缩/选择混在一起，论文特别指出，local pattern 学得更快，容易在训练中主导注意力，导致模型懒得去学远距离的依赖关系。如果 **没有独立的 sliding window 分支，Compression 和 Selection 可能被迫同时学习最近上下文和远距离依赖，训练不稳定分工不清**

NSA 的做法是直接把最近窗口拿出来单独算：

$\tilde{K}_t^{win} = k_{t-w:t},\quad \tilde{V}_t^{win}=v_{t-w:t}$

典型值：`w = 512`

这条分支的意义不是多一个 local attention 就完事，而是：

1. **最近 token 保留原始精度，不经过压缩**
2. Compression / Selection 可以专心处理长程信息，不会被局部信息绑架
3. 三条路径通过 gate 合并，模型可以按 token 动态分配权重
4. 更进一步，NSA 为三个分支提供 **独立的 Key 和 Value 投影**。这意味着压缩分支看到的 K/V 和滑窗分支看到的 K/V 可以学到不同的表示，避免了梯度干扰。代价是多了一些投影参数，但相比整个模型的参数量来说微乎其微

教学版代码：

```python
def sliding_window_kv(k: torch.Tensor, v: torch.Tensor, t: int, window_size: int = 512):
    """
    k, v: [B, T, H_kv, D]
    t: 当前 query 位置，Python 风格右开区间
    """
    left = max(0, t - window_size)
    return k[:, left:t], v[:, left:t]
```

## 4.4 Gate 合并：三路输出不是简单拼接

NSA 把三条分支的输出加权求和：

$\mathbf{o}_t^* = g_t^{cmp}\mathbf{o}_t^{cmp} + g_t^{slc}\mathbf{o}_t^{slc} + g_t^{win}\mathbf{o}_t^{win}$

教学版代码：

```python
class ToyNSAGate(nn.Module):
    def __init__(self, hidden_size: int):
        super().__init__()
        self.gate = nn.Sequential(
            nn.Linear(hidden_size, 3),
            nn.Sigmoid(),
        )

    def forward(self, x, o_cmp, o_slc, o_win):
        # x: [B, T, C]
        # o_*: [B, T, C]
        g = self.gate(x)  # [B, T, 3]
        return (
            g[..., 0:1] * o_cmp
            + g[..., 1:2] * o_slc
            + g[..., 2:3] * o_win
        )
```

> 注意：gate 用 sigmoid，每个门控独立取值 $[0,1]$，不一定要求三路权重和为 1。它更像每路开关强度，而不是 softmax mixture。这让模型更灵活：**有些位置可能三个分支都很重要，有些位置可能只需要一个**

# 5. NSA的硬件对齐

设计出好的算法只是第一步，如果实现不好，理论上的稀疏优势可能完全无法兑现为实际加速。NSA 的第二个核心贡献就是 **硬件对齐的 kernel 设计**

## 5.1 为什么 blockwise 比 tokenwise 快？

* 现代 GPU（特别是 A100/H100 上的 Tensor Core）的设计哲学是 **批量化、连续化**。Tensor Core 一次处理一个 16×16 或更大的矩阵块；GPU 的内存控制器对 **连续地址** 的读取效率远高于随机跳读
* 如果稀疏注意力是 token 粒度的（像 HashAttention 那样），需要从 KV-Cache 中挑出分散的单个 token，就像 **一本一本从书架上挑书搬，** 每次只搬一本，反复来回
* 而 NSA 的 blockwise 选择（每个块 64 个 token）就像 **把同一层的书打成箱搬，** 一次搬一整箱，连续内存访问，Tensor Core 吃满
* **类比**：搬家时，把书打箱（blockwise）比一本本搬（tokenwise）高效得多。虽然可能装了几本不需要的书，但节省的搬运时间远超多搬几本书的代价

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-3.png]]

## 5.2 GQA 友好设计：同组共享，一次加载

前面提到 NSA 通过跨 head 汇总分数让同一 GQA 组内的 head 选择相同的 KV 块。这不仅是为了算法简洁，更是为了硬件效率，同组的所有 head 共享相同的稀疏 KV 集合意味着：

* **解码时**：每个 GQA 组只需加载一份稀疏 KV 到 GPU HBM，所有 head 复用 → 内存访问量最小化
* **训练时**：组内 head 的 KV 在 SRAM 中只需加载一次 → 最大化数据复用

**类比**：四个同事（GQA 组内的 head）去同一个仓库（KV 块）取货。如果他们要的东西在同一个货架上（共享选择），只需要跑一趟；如果各要各的（独立选择），就得跑四趟

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-4.png]]

## 5.3 Triton Kernel 设计：Group-Centric 数据编排

FlashAttention-2 的 kernel 策略是：外循环遍历 Query 块（连续的一组 Query），内循环遍历所有 KV 块。这种 **Query-Centric的编排在全注意力下很高效，但不适合稀疏场景，同一个 Query 块内的不同 Query 可能需要完全不同的稀疏 KV 集，加载变得杂乱无章**

NSA 的核心优化是改用 **Group-Centric** 编排：

1. **外循环（Grid Loop）**：遍历序列位置 $t$，在每个位置加载该 GQA 组内 **所有 head 的 Query**
2. **内循环（Inner Loop）**：按索引 $\mathcal{I}_t$ 顺序加载 **该位置共享的稀疏 KV 块** 到 SRAM
3) **一次加载、多 head 复用**：KV 块在 SRAM 中被所有 head 共享计算

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-d81eb73a5629c16ea075ac75d9a72cc7b7b982e03bf474639bbc5d98486565e4.jpg]]

*NSA kernel 的数据流。绿色块在 SRAM 上，蓝色块在 HBM 上。Grid Loop 按 GQA 组位置遍历，Inner Loop 按稀疏索引加载 KV 块，只加载共享的稀疏 KV 块，兼顾稀疏性和算术强度。FlashAttention-2 vs NSA kernel 的对比。FlashAttention 按 Query 块遍历、加载所有 KV（无法有效稀疏）*

简化版的 kernel 核心循环：

```python
# NSA Triton Kernel 简化伪代码 (Group-Centric)
# Grid Loop: 每个 thread block 处理一个 (位置 t, GQA 组 g)
for t, g in grid_schedule:
    # 加载该位置、该 GQA 组的所有 head 的 Query
    Q = load_queries(t, group=g)       # shape: [num_heads, d_k]
    indices = load_sparse_indices(t, g) # shape: [n] — 共享的稀疏块索引

    # 初始化输出累加器
    O = zeros(num_heads, d_v)
    l_sum = zeros(num_heads)  # log-sum-exp 分母

    # Inner Loop: 顺序加载共享的稀疏 KV 块
    for idx in indices:
        K_block = load_kv_block(idx, "key")   # shape: [block_size, d_k]
        V_block = load_kv_block(idx, "value")  # shape: [block_size, d_v]

        # 所有 head 共用同一个 KV 块计算注意力
        scores = Q @ K_block.T / sqrt(d_k)     # [num_heads, block_size]
        O, l_sum = online_softmax_update(O, l_sum, scores, V_block)

    store_output(t, g, O / l_sum)
```

这种设计的精妙之处在于：

* **消除了冗余的 KV 传输**（组内共享）
* **内循环长度几乎恒定**（每个位置都是 $n$ 个块），适合 Triton 的 grid 调度
* **KV 块的连续加载** 保持了高算术强度

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-5.png]]

## 5.4 训练 vs 推理：不同阶段的优化侧重

根据 1.3 节的分析，训练/prefill 和解码面临不同的瓶颈：



| 阶段 | 瓶颈类型 | NSA 优化策略 |
| --- | --- | --- |
| 训练/Prefill | 计算瓶颈 | 稀疏 kernel 减少 FLOPS：只计算选中块的注意力 |
| 解码 | 内存瓶颈 | 减少 KV-Cache 加载量：从 N 降到 $\sim N_t \ll N$ |



在 decode 阶段，Full Attention 每生成一个 token 要读取整个历史 KV cache。如果上下文长度是 `s`，等价读取量就是 `s` 个 token。

NSA 每步大致读取：

$\underbrace{\left\lfloor \frac{s-l}{d}\right\rfloor + 1}_{\text{compression tokens}} + \underbrace{n l'}_{\text{selected tokens}} + \underbrace{w}_{\text{local window}}$

套入论文典型值：`l=32, d=16, n=16, l'=64, w=512`：

| Context length | Full Attention 读取量 | NSA 等价读取量 | Expected speedup |
| -------------- | ------------------ | --------- | ---------------- |
| 8,192 | 8,192 | 2,048 | 4.0× |
| 16,384 | 16,384 | 2,560 | 6.4× |
| 32,768 | 32,768 | 3,584 | 9.1× |
| 65,536 | 65,536 | 5,632 | 11.6× |

也就是在 32K 上下文下，NSA 每个 Query 只需激活约 3584 个 token（压缩 \~2046 + 选择 1024 + 滑窗 512），相比 Full Attention 的 32768 个，**稀疏比约 11%**

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-1.png]]

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-image-2.png]]

直观上，NSA 的读取量里有一项 `s/d` 的 compression 全局扫描，所以不是常数复杂度；但相对 full attention 的 `s`，它的斜率小很多。上下文越长，节省越明显

# 6. **代码实现参考**

## 6.1 fla-org/native-sparse-attention 的使用方式

`fla-org/native-sparse-attention` 提供了 Triton 实现。README 里的核心调用方式大致如下：

```python
from native_sparse_attention.ops.parallel import parallel_nsa

B, T, H_kv, H_q, D = 4, 2048, 4, 64, 64
block_size = 64
window_size = 64

q = torch.randn((B, T, H_q, D), dtype=dtype, device="cuda").requires_grad_(True)
k = torch.randn((B, T, H_kv, D), dtype=dtype, device="cuda").requires_grad_(True)
v = torch.randn((B, T, H_kv, D), dtype=dtype, device="cuda").requires_grad_(True)

# selection / sliding window gate
g_slc = torch.rand((B, T, H_q), dtype=dtype, device="cuda").requires_grad_(True)
g_swa = torch.rand((B, T, H_q), dtype=dtype, device="cuda").requires_grad_(True)

# block_indices: 每个 query、每个 KV head 选中的 block ids
block_indices = torch.full((B, T, H_kv, S), T, dtype=torch.long, device="cuda")
block_counts = torch.randint(1, S + 1, (B, T, H_kv), device="cuda")

out = parallel_nsa(
    q=q,
    k=k,
    v=v,
    g_slc=g_slc,
    g_swa=g_swa,
    block_indices=block_indices,
    block_counts=block_counts,
    block_size=block_size,
    window_size=window_size,
)
```

| 参数 | 对应概念 | 说明 |
| --------------- | ------------------- | ---------------------------------------------- |
| `q` | query | shape 通常是 `[B, T, H_q, D]` |
| `k`, `v` | 原始 KV | shape 通常是 `[B, T, H_kv, D]`；GQA 下 `H_q > H_kv` |
| `g_slc` | selection gate | 控制 selection 输出权重 |
| `g_swa` | sliding window gate | 控制 window 输出权重 |
| `block_indices` | `I_t` | 每个 query 选中的 sparse blocks |
| `block_counts` | 有效 block 数 | 支持不同 query 有不同数量的 selected blocks |
| `block_size` | `l'` | selection block 粒度 |
| `window_size` | `w` | local window 大小 |

## 6.2 NVIDIA cuDNN Frontend NSA API 的流水线

NVIDIA 的 cuDNN Frontend 文档把 NSA 拆成四个组件：

1. `CompressionAttention`
2. `TopKReduction`
3) `SelectionAttention`
4) `SlidingWindowAttention`

伪代码如下：

```python
from cudnn import NSA
import math

# Step 1: Compression Attention
o_cmp, lse_cmp = NSA.compression_attention_wrapper(
    q_tensor=q,
    k_tensor=k,
    v_tensor=v,
    cum_seqlen_q_tensor=cum_seqlen,
    cum_seqlen_k_tensor=cum_seqlen,
    enable_lse=True,
    o_dtype=torch.bfloat16,
)

# Step 2: Top-K Reduction，使用 compression attention 产出的 LSE / score 相关信息
topk_scores, topk_indices = NSA.topk_reduction_wrapper(
    q_tensor=q,
    k_tensor=k,
    lse_tensor=lse_cmp,
    cum_seqlen_q_tensor=cum_seqlen,
    cum_seqlen_k_tensor=cum_seqlen,
    k_value=16,
    selection_block_size=64,
    compress_stride=32,
    is_causal=True,
)

# Step 3: Selection Attention
o_sel, l_sel, m_sel = NSA.selection_attention_wrapper(
    q_tensor=q,
    k_tensor=k,
    v_tensor=v,
    block_indices_tensor=topk_indices,
    block_counts_tensor=block_counts,
    cum_seqlen_q_tensor=cum_seqlen,
    cum_seqlen_k_tensor=cum_seqlen,
    block_size=64,
)

# Step 4: Sliding Window Attention
o_swa, stats_swa = NSA.sliding_window_attention_wrapper(
    q_tensor=q,
    k_tensor=k,
    v_tensor=v,
    seq_len_q_tensor=seq_lengths,
    seq_len_kv_tensor=seq_lengths,
    left_bound=512,
    right_bound=0,
    is_infer=False,
    attn_scale=1.0 / math.sqrt(head_dim),
)

# Step 5: 输出合并。真实模型使用 learned gating；这里仅示意。
final_output = o_cmp + o_sel + o_swa
```

需要注意 cuDNN 文档里的硬件约束：Selection Attention 最低支持到 Hopper（SM90），Compression Attention 和 Top-K Reduction 在文档版本中要求 Blackwell（SM100+），Sliding Window 使用 cuDNN backend，支持更低的 SM。这个约束说明：**NSA 的工程落地确实高度依赖专门 kernel**

# 7. **实验结果**

论文使用一个 27B total / 3B active 的 GQA + MoE backbone 做对比，NSA 和 Full Attention 都训练到收敛。这里摘取几个关键结果。

## 7.1 通用 benchmark

| Model | MMLU | MMLU-PRO | CMMLU | BBH | GSM8K | MATH | DROP | MBPP | HumanEval | Avg. |
| --------- | ----- | -------- | ----- | ----- | ----- | ----- | ----- | ----- | --------- | ----- |
| Full Attn | 0.567 | 0.279 | 0.576 | 0.497 | 0.486 | 0.263 | 0.503 | 0.482 | 0.335 | 0.443 |
| NSA | 0.565 | 0.286 | 0.587 | 0.521 | 0.520 | 0.264 | 0.545 | 0.466 | 0.348 | 0.456 |

NSA 平均分略高于 Full Attention。尤其 DROP、GSM8K、BBH 等推理相关项有提升。可以理解为：**原生 sparse 训练会迫使模型学会更明确地分配注意力资源，但这个解释属于合理推断，不能脱离实验设置泛化**

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-d7fad856bbea9c2ef202cf220e06b97eb2de9e2dd500e599efc8a3534abc6ac4.jpg]]

*预训练 loss 曲线对比。NSA 全程 loss 低于 Full Attention，收敛平稳*

## 7.2 LongBench

| Model | Avg. |
| --------- | ----- |
| H2O | 0.303 |
| InfLLM | 0.383 |
| Quest | 0.392 |
| Exact-Top | 0.423 |
| Full Attn | 0.437 |
| NSA | 0.469 |

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-96c1a96ee29cddaee24367ca78486fa95931df283477e398726bc0074fc955d1.jpg]]

论文还报告 NSA 在 64k Needle-in-a-Haystack 测试中 across all positions 达到 perfect retrieval accuracy。这个结果与 NSA 的设计目标一致：**Compression 负责全局定位，Selection 负责把定位到的细粒度原始 token 拿回来**

## 7.3 长链路数学推理 SFT 后的 AIME

| Generation token limit | Full Attention-R | NSA-R |
| ---------------------- | ---------------- | ----- |
| 8192 | 0.046 | 0.121 |
| 16384 | 0.092 | 0.146 |

这里比较的是经过 DeepSeek-R1 蒸馏数据 SFT 后的模型。论文结论是 NSA-R 在 8k 和 16k generation limit 下都高于 Full Attention-R，原因是：

1. **预训练学到的稀疏注意力模式能更高效地捕获长距离逻辑依赖**
2. **硬件友好的设计让模型在有限上下文内维持了足够的信息密度，支撑深度推理**

## 7.4 速度

论文在 8-GPU A100 上对比 Triton-based NSA 和 Triton-based FlashAttention-2：

| Context length | Forward speedup | Backward speedup |
| -------------- | --------------- | ---------------- |
| 8k | 2.1× | 1.1× |
| 16k | 3.8× | 2.0× |
| 32k | 6.3× | 3.4× |
| 64k | 9.0× | 6.0× |

加速随上下文变长而放大，这与 token budget 公式一致

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-4b86504a4e3a3d3e521671feff9d3a98b0de89dda1183958bcabaeeb6e30361b.jpg]]

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-34d197f6a61d0aecbbc8e1d1c7999bdaf8bf7ce0d6b21fb20ae1211647c7bef0.jpg]]

一个关键观察：**加速比随序列长度增长而增大**。这是因为 NSA 的激活 token 数量增长远慢于 Full Attention，Full Attention 线性增长，而 NSA 的增长主要来自压缩 token 数（与序列长度成正比但分母是 $d=16$），选择和滑窗部分基本不变。序列越长，节省比例越大

![[_Attachments/Images/DeepSeek NSA 解读：三叉戟稀疏注意力-fig_sparsity_ratio.png]]

# 8. **NSA 和相邻技术的关系**

| 技术 | 主要目标 | 发生阶段 | 核心机制 | 和 NSA 的区别 |
| ---------------- | ---------------------------- | ------- | --------------------------------------------- | -------------------------------------------------------------- |
| MQA / GQA | 降低 decode KV 读取 | 模型架构 | 多个 query heads 共享 KV heads | NSA 进一步减少“读哪些 KV token/block”；二者可配合 |
| MLA | 降低 KV cache 维度 / 存储 | 模型架构 | latent KV 压缩与上投影 | MLA 压的是特征维度；NSA 稀疏的是 KV 序列位置 |
| FlashAttention-2 | 精确 attention 的高性能实现 | kernel | tiling + SRAM + parallelism | 不改变 attention 数学结果；NSA 改变参与 attention 的 KV 集合 |
| MInference | 长上下文 prefill 稀疏 | 多为推理阶段 | 识别 A-shape / vertical-slash / block-sparse 模式 | NSA 强调训练阶段原生稀疏和 decode/prefill/training 全链路收益 |
| MoBA | block-level sparse attention | 训练 / 推理 | 用 MoE 思想选择 attention blocks | MoBA 强调 less-structure 和可在 full/sparse 间切换；NSA 强调三路层次稀疏 + 硬件对齐 |
| H2O / SnapKV | KV cache eviction | 推理阶段 | 保留 heavy hitters / 关键 KV | 通常是后处理或推理优化；NSA 是模型结构的一部分 |

一句话区分 NSA 和 MLA：

> **MLA 主要让每个 token 的 KV 表示更小，压缩 KV-Cache 的维度；NSA 主要让每个 query 读取的 KV token/block 更少，压缩 KV-Cache 的长度。两者是正交的优化方向，不互斥，理论上可以组合使用，用 MLA 减少每个 token 的 KV 大小，再用 NSA 减少需要关注的 token 数量**

# 9. **复现和使用时的注意事项**

1\. **不要把 NSA 当成 dense 模型的无痛替换层**

   NSA 论文的关键是 native sparse pretraining。直接把已有 dense checkpoint 的 attention 替换成 NSA，质量很可能不可控

2\. **block 参数影响质量和速度的平衡**

   `l, d, l', n, w` 决定了全局扫描密度、细粒度恢复能力和局部上下文精度。`n` 太小会漏信息，`w` 太小会损局部连贯性，`d` 太大会让 compression 过粗

3\. **top-k index 的工程代价不能忽略**

   论文设计通过复用 compression score 降低 selection overhead，但真实系统里 top-k reduction 仍然需要专门 kernel 才能快

4\. **GQA/MQA 是 NSA decode 加速的重要前提**

   如果每个 head 独立选择，KV 读取并集可能变大，硬件收益会下降

5\. **平台支持不一致**

   不同开源实现 / cuDNN API 对 layout、dtype、SM 架构支持不同。比如 cuDNN Frontend 文档中 Top-K Reduction 和 Compression Attention 对硬件要求较高

# 10. **总结**

NSA 的价值可以概括成一句话：

> **把长上下文 attention 从“所有 token 都精读”改成“全局粗读 + 重点精读 + 局部盯读”，并且从训练开始就让模型适应这种读法。**

它的核心贡献不只是提出一种 sparse pattern，而是把算法、训练、推理和 kernel 约束放在一起设计：

* 算法上，用 Compression / Selection / Sliding Window 三路信息源平衡全局、关键细节和局部连续性
* 训练上，避免 dense 预训练后再稀疏带来的后处理错配
* 推理上，decode 只需要读取压缩 token、selected blocks 和 local window
* kernel 上，blockwise 选择 + GQA group 共享 KV index，让稀疏访存尽量连续并可复用

如果把长上下文模型比作阅读一本 1000 页的书，Full Attention 是每回答一个问题都翻完全书；**NSA 是先看目录和索引，再翻重点页，同时保持眼前几页不丢。真正难的不是少看，而是让模型从训练开始就学会该看哪里**

# 附：一个最小 NSA forward 伪代码

```python
def toy_nsa_forward(q, k, v, x, compressor_k, compressor_v, gate_mlp,
                    block_size=64, top_n=16, window_size=512, heads_per_group=16):
    """
    q: [B, T, H_q, D]
    k, v: [B, T, H_kv, D]
    x: [B, T, C]，用于 gate

    这是教学伪代码：展示 NSA 的逻辑，不代表高性能实现。
    """
    # 1. Compression branch
    k_cmp = compressor_k(k)                         # [B, T_cmp, H_kv, D]
    v_cmp = compressor_v(v)                         # [B, T_cmp, H_kv, D]
    o_cmp, p_cmp = attention_return_scores(q, k_cmp, v_cmp)

    # 2. Selection branch
    p_slc = compression_scores_to_selection_scores(p_cmp)
    block_indices = group_shared_topk_blocks(
        p_slc,
        heads_per_group=heads_per_group,
        top_n=top_n,
    )
    k_sel, v_sel = gather_blocks(k, v, block_indices, block_size=block_size)
    o_sel = attention(q, k_sel, v_sel)

    # 3. Sliding window branch
    k_win, v_win = build_sliding_window_kv(k, v, window_size=window_size)
    o_win = attention(q, k_win, v_win)

    # 4. Learned gate fusion
    g = torch.sigmoid(gate_mlp(x))                  # [B, T, 3]
    out = g[..., 0:1] * o_cmp + g[..., 1:2] * o_sel + g[..., 2:3] * o_win
    return out
```

这里没有写 `attention_return_scores / gather_blocks / build_sliding_window_kv` 的高性能细节，因为真实实现的重点正是这些函数背后的 layout、block index、SRAM tiling 和 fused kernel
