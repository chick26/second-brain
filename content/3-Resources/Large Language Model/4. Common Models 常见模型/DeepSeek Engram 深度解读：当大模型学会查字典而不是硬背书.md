---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书"
source: feishu-export
imported: 2026-05-24
---

> ***论文: [Conditional Memory via Scalable Lookup: A New Axis of Sparsity for Large Language Models](https://arxiv.org/pdf/2601.07372)***
> ***代码: <https://github.com/deepseek-ai/Engram>***
> 想象你到了别人家，需要连 WiFi。你有两种策略：
> **策略 A**：从第一性原理出发，先推导电磁波传播方程，再分析路由器的信号编码方式，然后逆向计算出可能的密码组合，经过 6 层复杂推理，你得出结论，密码大概是 12345678
> **策略 B**：看一下墙上的纸条，上面写着 WiFi: 12345678
> 当你问 大模型 "黑曼巴是谁"，模型并不是翻笔记找到答案，而是用好几层 Attention + FFN 从零开始推导出这个实体，每次都重新算，每次都浪费算力
> * 现有 Transformer，尤其是 MoE Transformer，已经很擅长做条件计算：遇到复杂推理、代码生成、数学求解这类任务时，模型可以把算力集中到更合适的计算路径上（*<u>MoE 通过稀疏激活专家来扩展计算容量。但对于知识检索，当前的 Transformer MoE 架构完全没有原生支持）</u>*
> * 但对于另一类同样常见的需求，也就是命名实体识别、事实回忆、固定短语匹配这类更接近静态模式检索的能力，现有架构并没有原生的 lookup primitive，往往只能靠多层 Attention 和 FFN 把本该直接命中的知识重新算一遍
> **DeepSeek Engram 做的事情，就是给大模型配一张纸条，** 一个 O(1) 复杂度的条件记忆模块，让模型在需要查事实时直接查表，把宝贵的计算深度留给真正需要推理的任务
> > Engram 把随着记忆表规模增长而扩张的知识容量与每 token 的计算量解耦了。它对每个位置只做固定数量的 N-gram 哈希检索，因此 memory 变大主要增加参数容量，而不线性增加 per-token FLOPs

# 1. 为什么需要 Engram？

## 1.1 两种任务

语言建模本质上包含两种不同的子任务，Engram 的核心假设是在大模型内部，存在一类更接近静态模式匹配的依赖，它们不一定需要反复消耗深层计算去重建：

| | 组合推理 | 知识检索 |
| -------- | ------------------ | ------------------ |
| **典型任务** | 数学推导、逻辑链分析、代码生成 | 识别命名实体、回忆事实、匹配固定短语 |
| **计算特征** | 需要深度、动态的计算 | 局部、静态、高度模式化 |
| **理想实现** | 多层 Attention + FFN | O(1) 查表 |
| **当前实现** | MoE 条件计算 | 没有专门机制，被迫用计算模拟 |

## 1.2 一个直观的例子

论文引用了一个经典案例，大模型如何识别 "Diana, Princess of Wales"（戴安娜王妃）

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image.png>)

| 层 | 潜状态翻译（模型的内部理解） | 解释 |
| --------- | -------------------------- | --------- |
| Layer 1-2 | Wales = 英国的一个地方 | 只识别出最后一个词 |
| Layer 3 | Wales = 欧洲某个国家 | 稍微好一点 |
| Layer 4 | Princess of Wales = 某个王妃头衔 | 开始拼接 |
| Layer 5 | = 威尔士亲王之妻 | 更具体了 |
| Layer 6 | = 戴安娜王妃 (1961-1997) | 终于识别出来 |

**6 层网络，只为识别一个实体名。** 这些计算深度本可以用于更复杂的推理任务，却被浪费在了重建一个本该直接查到的事实上

> 上面是一个 interpretability 案例，用来帮助理解静态模式重建会占用早层表示空间，不是一个对所有实体识别过程的普适定理

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-6.png>)

***传统 Transformer 需要逐层计算重建实体（左），Engram 通过 O(1) 哈希查表直接获取（右）***

## 1.3 Engram 不是什么

* **Engram 不是 RAG**。RAG 的基本范式是先从外部语料库检索文档，再把文档内容拼回上下文里让模型继续读。而 Engram 的数据流是输入 token 先经过压缩、N-gram 提取、多头哈希、嵌入查表，再通过门控和残差直接注入隐藏状态。**整个过程发生在模型内部，不需要外部文档，不返回原文片段，也不是把检索到的字符串再塞回 prompt**
* **Engram 不是 KV Cache**。KV Cache 存的是当前上下文在推理过程中动态生成的 key 和 value，本质上属于运行时状态，而 **Engram 查的是一个预先训练好的静态记忆表，索引由输入 token 的 N-gram 直接决定，服务的是可复用的长期模式，而不是本轮上下文刚刚产生的局部注意力状态**
* Engram 不是要取代 MoE。论文要证明的是 conditional memory 和 conditional computation 是两条互补的稀疏轴。下面第四节可以 U 型 scaling law 给出了结论：纯 MoE 不是最优，纯 Engram 也不是最优，最好的结果出现在两者混合的时候。**Engram 是在专家负责复杂计算的同时，额外给模型一条更适合静态模式检索的通路**

# 2. 整体架构

> Engram 记忆痕迹的核心思想极其直白，就是在 Transformer 的特定层旁边，外挂一个条件记忆模块，给 Transformer 装一个小抄本

整个数据流可以类比为一个 **查字典** 的过程：

1. **归一化**（CompressedTokenizer）：把`Apple / apple / APPLE `统一成`apple`，避免查字典时一个词有三个词条
2. **提取关键词**（N-gram）：把相邻的 2-3 个 token 组合起来作为查询词
3) **查字典**（多头哈希 + 嵌入表）：用哈希函数定位到字典的页码，O(1) 取出对应的释义（嵌入向量）
4) **判断是否采纳**（上下文感知门控）：根据当前语境决定这条释义是否有用
5. **融合**（ShortConv + 残差）：将有用的记忆信息注入 Transformer 主干

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-arch.png>)

***Engram 论文原始架构图。模块仅插入特定层（Layer 2 和 Layer 15），通过残差连接融入主干***

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-5.png>)

***Engram 架构简化流程图，展示从输入 Token 到输出的完整数据流***

具体公式链如下：

* 先看压缩映射。设原始 token 序列为：$x = (x_1, x_2, \dots, x_T)$，C **ompressed Tokenizer 定义了一个从旧词表到新词表的映射**：
  $c:\mathcal{V}{\text{old}} \rightarrow \mathcal{V}{\text{new}}$
  于是压缩后的 token 序列写成 $z_t = c(x_t)$
* 接下来，在压缩后的序列上构造局部 N-gram。对于位置 $t$，Engram **主要使用后缀 2-gram 和 3-gram**：

$g_t^{(2)} = (z_{t-1}, z_t)$

$g_t^{(3)} = (z_{t-2}, z_{t-1}, z_t)$

* 由于 **不可能为所有可能的 N-gram 显式建立一张完全无冲突的大表，所以 Engram 采用多头哈希的方式，把每个 N-gram 映射到固定大小的 embedding table** 中。记第 $j$ 个哈希头在 n-gram 分支上的哈希函数为 $$
  h_j^{(n)}$，则对应索引为：$ i_{t,j}^{(n)} = h_j^{(n)}!\left(g_t^{(n)}\right), \qquad n \in {2,3}$，然后从对应的嵌入表中取出向量：$ e_{t,j}^{(n)} = E_j^{(n)}!\left(i_{t,j}^{(n)}\right)$$，把所有头、所有阶数取出的向量拼接起来，就得到该位置的静态记忆表示：
  $e_t = \operatorname{Concat}\Big({e_{t,j}^{(2)}}j,{e{t,j}^{(3)}}_j\Big)$
* 到这里为止，Engram 还只是完成了候选记忆检索。**但真正关键的问题不是查到了什么，而是查到的内容该不该用**。因此，Engram 不会把这个记忆向量直接加回主干，而是先做上下文感知的门控。设当前位置主干隐藏状态为：$h_t$，对于第 $b$ 个分支，记忆向量会被投影成 key 和 value，而当前隐藏状态则作为 query：

$k_t^{(b)} = W_K^{(b)} e_t$

$v_t^{(b)} = W_V^{(b)} e_t$

$q_t^{(b)} = h_t^{(b)}$

然后通过 query 和 key 的相似性来计算门控系数。抽象地写，可以表示为：

$\alpha_t^{(b)} = \sigma!\Big(\phi\big(\langle \operatorname{Norm}(q_t^{(b)}), \operatorname{Norm}(k_t^{(b)}) \rangle\big)\Big)$

其中， $\sigma(\cdot)$ 表示 sigmoid， $\phi(\cdot)$ 表示对相似度分数做平滑变换的激活函数。**如果当前上下文认为这段静态记忆是相关的，就打开门；如果不相关，就尽量压低其影响**

* 最终，被门控后的记忆注入量为：$y_t^{(b)} = \alpha_t^{(b)} , v_t^{(b)}$，为了让局部相邻位置之间的静态模式能够稍作传播，Engram 还会加一个轻量的 short convolution。于是第 $b$ 个分支更新后的隐藏状态写成：
  $h_t^{(b)\prime} = h_t^{(b)} + y_t^{(b)} + \operatorname{ShortConv}(y_t^{(b)})$

```plaintext
输入 Tokens → CompressedTokenizer → N-gram提取 → 多头哈希 → 嵌入查表 → 门控融合 → 残差连接
```

# 3. 四大核心组件

## 3.1 CompressedTokenizer 词表压缩

标准分词器比如 BPE 的一个问题是语义相同的 token 可能有不同的 ID。比如 `Apple`、`apple`会分别编码为不同的整数，导致 N-gram 哈希时同一个词占多个词条，既浪费空间又增加冲突

> **Normalization Form KC**（兼容性标准化形式 KC）是 Unicode 标准定义的四种核心文本规范化形式之一
> NFKC 的处理逻辑是两步：
> 1. **兼容分解 (Compatibility Decomposition)**：将所有“兼容性字符”（如全角数字、罗马数字、特殊符号变体）拆分为基础字符序列
> 2. **规范组合 (Canonical Composition)**：再按 Unicode 规范将可组合的字符（如带重音的字母）重新组合为最简形式
> 应用场景：
> * **文本搜索与匹配**：统一全角/半角、大小写、特殊符号，确保“１２３”与“123”、“ＣＡＦÉ”与“café”能被正确匹配
> * **数据清洗与预处理**：在 NLP、数据库、表单验证中，消除因字符编码差异导致的重复或错误
> * **用户名/文件名标准化**：防止通过视觉相似字符（如全角字母）绕过系统校验

CompressedTokenizer 通过 NFKC 归一化 + 小写化 + 去空格等操作，将原始词表投射到一个更紧凑的规范词表：

```python
class CompressedTokenizer:
    def __init__(self, tokenizer_name_or_path):
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name_or_path)

        SENTINEL = "\uE000"
        # 归一化流水线: NFKC → 去重音 → 小写 → 合并空白
        self.normalizer = normalizers.Sequence([
            normalizers.NFKC(),          # Unicode 兼容分解
            normalizers.NFD(),           # 规范分解
            normalizers.StripAccents(),  # 去除重音符号
            normalizers.Lowercase(),     # 统一小写
            normalizers.Replace(Regex(r"[ \t\r\n]+"), " "),  # 合并空白
            normalizers.Strip(),
        ])

        # 构建 old_id → new_id 映射表
        self.lookup_table, self.num_new_token = self._build_lookup_table()

    def _build_lookup_table(self):
        old2new, key2new, new_tokens = {}, {}, []
        for tid in range(len(self.tokenizer)):
            text = self.tokenizer.decode([tid], skip_special_tokens=False)
            # 对每个 token 做归一化，语义相同的映射到同一 new_id
            key = self.normalizer.normalize_str(text) if "�" not in text else \
                  self.tokenizer.convert_ids_to_tokens(tid)
            nid = key2new.get(key)
            if nid is None:
                nid = len(new_tokens)
                key2new[key] = nid
                new_tokens.append(key)
            old2new[tid] = nid
        # 生成查找表: lookup_table[old_id] = new_id
        lookup = np.empty(len(self.tokenizer), dtype=np.int64)
        for tid in range(len(self.tokenizer)):
            lookup[tid] = old2new[tid]
        return lookup, len(new_tokens)
```

**效果**：128K 词表经压缩后减少约 **23%**，既缩小了检索空间，又提升了语义一致性

## 3.2 NgramHashMapping：多头哈希映射

NgramHashMapping 是 Engram 的核心检索引擎

> 问题：直接存储所有可能的 N-gram 组合是不可能的（3-gram 组合数可达 10¹⁵），所以用 **哈希映射** 将 N-gram 压缩到有限大小的嵌入表中

**Step 1：移位构建 N-gram**

```python
# 通过移位操作提取后缀 N-gram
def shift_k(k: int) -> np.ndarray:
    """将序列向右移动 k 位，前面补 pad_id"""
    if k == 0: return x
    shifted = np.pad(x, ((0, 0), (k, 0)),
                     mode='constant', constant_values=self.pad_id)[:, :T]
    return shifted

# 对于位置 t, 2-gram = (x[t-1], x[t]), 3-gram = (x[t-2], x[t-1], x[t])
base_shifts = [shift_k(k) for k in range(self.max_ngram_size)]
```

**Step 2：乘法-XOR 哈希**

```python
# 将 N-gram 中的每个 token 乘以随机奇数系数，然后 XOR 混合
for n in range(2, self.max_ngram_size + 1):
    tokens = base_shifts[:n]
    # 核心哈希: token[0]*m[0] XOR token[1]*m[1] XOR ...
    mix = tokens[0] * multipliers[0]
    for k in range(1, n):
        mix = np.bitwise_xor(mix, tokens[k] * multipliers[k])
```

**Step 3：素数取模 + 多头降冲突**

```python
    # 每个 N-gram 阶数配 K=8 个独立哈希头
    for j in range(num_heads_for_this_ngram):
        mod = int(head_vocab_sizes[j])  # 质数大小的嵌入表
        head_hash = mix % mod           # 取模得到索引
        all_hashes.append(head_hash)
```

> * 为什么用 **质数** 作为嵌入表大小？因为质数取模能增大哈希分布的均匀性。prime-size table 常用于减弱某些规则性冲突模式，通常有利于更均匀的散列分布
> * 为什么用 **多头**？multi-hash ensemble的思路，8 个独立哈希函数同时查表，同一个 N-gram 获得 8 个不同的嵌入向量，大幅降低了单一哈希冲突带来的信息损失

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-7.png>)

***N-gram 哈希查表的完整过程。从分词压缩到最终拼接记忆向量***

## 3.3 Context-aware Gating：上下文感知门控

查到的记忆不能无脑使用，哈希冲突可能带来噪声，同一个 N-gram 在不同语境下含义也可能不同（比如 "apple" 在科技文和菜谱里），门控机制的作用就是 **让当前上下文来决定是否采纳记忆**

下面代码用于解释 Engram 的数据流，不代表完整生产实现，其中 Query 已含上下文理解为来自前序层累积后的隐藏状态

```python
def forward(self, hidden_states, input_ids):
    # 1. 哈希查表获取静态记忆嵌入
    hash_input_ids = torch.from_numpy(
        self.hash_mapping.hash(input_ids)[self.layer_id])
    embeddings = self.multi_head_embedding(hash_input_ids).flatten(start_dim=-2)

    gates = []
    for hc_idx in range(backbone_config.hc_mult):  # 遍历 4 个分支
        # 2. Key: 对记忆向量做线性投影
        key = self.key_projs[hc_idx](embeddings)
        normed_key = self.norm1[hc_idx](key)          # RMSNorm

        # 3. Query: 当前隐藏状态（已经过 Attention，含全局上下文）
        query = hidden_states[:, :, hc_idx, :]
        normed_query = self.norm2[hc_idx](query)       # RMSNorm

        # 4. 计算门控值: Query·Key 相似度 → sqrt 平滑 → sigmoid
        gate = (normed_key * normed_query).sum(dim=-1) / math.sqrt(d)
        gate = gate.abs().clamp_min(1e-6).sqrt() * gate.sign()  # sqrt 激活
        gate = gate.sigmoid().unsqueeze(-1)  # α ∈ (0, 1)
        gates.append(gate)

    gates = torch.stack(gates, dim=2)
    # 5. 门控调制: α × Value
    value = gates * self.value_proj(embeddings).unsqueeze(2)
    # 6. ShortConv + 残差
    output = value + self.short_conv(value)
    return output
```

**门控的语义很清晰**：

* **α ≈ 1**：记忆与上下文高度匹配 → 全量注入（如识别到 "Alexander the Great" 这个实体）
* **α ≈ 0**：记忆与上下文矛盾 → 抑制噪声（如哈希冲突导致的无关嵌入）

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-4.png>)

***上下文感知门控机制。h\_t 作为 Query，e\_t 同时提供 Key 和 Value，通过 sigmoid 门控控制融合强度***

## 3.4 ShortConv：深度因果卷积

门控输出后，还有一个轻量级的深度因果卷积层，用于扩展感受野

```python
class ShortConv(nn.Module):
    def __init__(self, hidden_size, kernel_size=4, dilation=1, ...):
        self.conv = nn.Conv1d(
            in_channels=total_channels,
            out_channels=total_channels,
            kernel_size=kernel_size,     # 窗口大小 = 4
            groups=total_channels,       # 深度可分离: 每个通道独立卷积
            padding=(kernel_size - 1) * dilation,  # 因果: 不看未来
            dilation=dilation,           # 空洞 = 3 (最大 N-gram 阶数)
        )
```

* **kernel\_size=4, dilation=3**：有效感受野 = 1 + (4-1)×3 = 10 个 token，覆盖了常见实体的长度
* **深度可分离**：每个通道独立卷积，计算量极小
* **因果填充**：保证推理时不泄露未来信息

卷积后通过 SiLU 激活和残差连接，作为最终输出注入 Transformer 主干

Engram 的关键收益主要来自 compressed tokenization、multi-head hashing、context-aware gating 和多分支融合，ShortConv 是一个轻量增强组件

# 4. U 型 Scaling Law

有了 Engram 之后，一个自然的问题是：在固定的参数预算下，应该把多少参数分配给 MoE 专家，多少分配给 Engram 记忆？

定义分配比例 **ρ ∈ \[0, 1]**：

* ρ = 1：纯 MoE（所有稀疏参数给专家）
* ρ = 0：纯 Engram（所有稀疏参数给嵌入表）
* 0 < ρ < 1：混合模型

实验给出了一个的结论，**不是记忆越多越好，也不是计算越多越好**：

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-scaling_law.png>)

***论文原图。左图为分配比例实验，右图为无限记忆缩放实验，最优分配比例稳定在 ρ≈75-80%***

两个关键发现：

1. **纯 MoE（ρ=100%）并非最优**：把 20-25% 的稀疏参数从 MoE 专家重新分配给 Engram 记忆，反而能降低验证集 Loss
2. **U 型曲线的两端都很差**：
   * MoE 主导 (ρ→100%)：模型缺少专门的记忆组件，被迫用计算模拟检索
   * Engram 主导 (ρ→0%)：模型丧失条件计算能力，无法处理需要推理的任务

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-3.png>)

***三种架构的参数分配对比。Engram-27B 将 5.7B 参数从 MoE 专家重新分配给嵌入表***

* 更有趣的是：如果不限制 Engram 的参数量，性能会如何变化？
  实验发现验证集 Loss 与嵌入数量呈 **对数线性关系，** 每增加 10 倍记忆容量，Loss 稳定下降。这意味着 Engram 提供了一个 **可预测的缩放旋钮**：更大的记忆表持续带来回报，且不需要额外计算

# 5. 实验结果

## 5.1 实验设置

| 设置 | Dense-4B | MoE-27B | Engram-27B | Engram-40B |
| --------- | ----------- | ------------ | ------------ | ------------ |
| 总参数 | 4.1B | 26.7B | 26.7B | 39.5B |
| 激活参数 | 3.8B | 3.8B | 3.8B | 3.8B |
| 训练数据 | 262B tokens | 262B tokens | 262B tokens | 262B tokens |
| 专家数 | - | 2+72 (top-6) | 2+55 (top-6) | 2+55 (top-6) |
| Engram 参数 | - | - | 5.7B | 18.5B |

三个同等条件：**同参数量（26.7B）、同激活量（3.8B）、同数据（262B tokens）**

## 5.2 核心结果

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-27b_exp_results.png>)

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-2.png>)

***精选 8 个 Benchmark 的对比。Engram-27B 在所有类别上全面领先 MoE-27B***

**Engram-27B vs MoE-27B：**

| 任务类别 | Benchmark | 提升 |
| ------- | --------------------------------------- | --------- |
| 知识检索 | MMLU +3.0, CMMLU +4.0, CCPM +7.5 | 静态事实查询更准 |
| 通用推理 | BBH +5.0, ARC-Challenge +3.7, DROP +3.3 | 复杂逻辑推理增强 |
| 代码 & 数学 | HumanEval +3.0, MATH +2.4, GSM8K +2.2 | 编程和数学也提升了 |

* **最令人意外的发现**：Engram 不仅提升了查资料类任务（MMLU、CMMLU），连代码和数学这类 **看起来不需要记忆** 的任务也提升了。这说明 **减少知识检索的计算浪费，确实能让模型把算力花在刀刃上**

## 5.3 长上下文表现

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-long_context_results.png>)

***长上下文（32K）实验结果。Engram 在多查询 NIAH 上从 84.2 提升到 97.0***

* 通过将局部依赖卸载到查表，Engram 释放了注意力带宽用于全局上下文，在 RULER(32k) 下 Multi-Query NIAH （大海捞针多查询）任务上实现了 **84.2 → 97.0** 的巨大提升

# 6. 机理分析：为什么 Engram 能让模型更深？

## 6.1 LogitLens 分析

使用 LogitLens 工具（将中间层的隐藏状态投射到词表空间），论文发现 Engram 模型的 **早期层 KL 散度显著更低，这意味着模型在更浅的层就已经形成了接近最终预测的表示**

直觉理解就是，以前模型需要用前 6 层重建实体信息，现在 Engram 直接提供了，所以前几层就已经准备好了

## 6.2 CKA 分析

CKA（中心核对齐）是衡量不同模型/层之间表示相似度的工具，分析结果表示 **Engram 第 5 层的表示，与纯 MoE 模型第 12 层的表示最为相似**

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-1759375339a84c6db8803e334a47369f.png>)

***CKA 相似度热力图。白色虚线表示 Engram 各层对应的 MoE 等效深度，明显偏离对角线，向上偏移***

* 类比一下，想象一栋 30 层的办公楼，传统模型的邮递员需要从 1 楼开始逐层询问戴安娜王妃在哪，走到 6 楼才找到。Engram 相当于在 1 楼就放了一个信息台，邮递员扫一眼就知道答案，然后可以直接上 7 楼处理更复杂的事务（拙劣的比喻🤣）

## 6.3 功能分工分析

论文做了一个破坏性实验，在推理时完全关闭 Engram 模块，只用 Transformer 主干：

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-91640905288346699916b99f0ad0d9ad.png>)

***关闭 Engram 后的性能保留率。事实知识暴跌，阅读理解基本不变***

| 任务类型 | 性能保留率 | 说明 |
| ----------------- | ------ | ------------------- |
| 事实知识 (TriviaQA 等) | 29-44% | Engram 是事实知识的主要存储库 |
| 阅读理解 (C3, RACE 等) | 81-93% | 上下文理解主要依赖 Attention |

* 这证实了 Engram 实现了预期的 **功能分离，静态事实存在 Engram 里，动态推理留在 Transformer 主干**
* 这是一个 **post-hoc ablation**，会引入训练和推理不一致，因此复杂混合型任务会带噪声，所以论文里主要拿 factual knowledge 和 reading comprehension 这两个极端来分析

## 6.4 门控可视化

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-case.png>)

***门控激活值可视化。红色表示强激活，Engram 在命名实体和固定短语处选择性激活***

门控值 α 的可视化清晰展示了 Engram 的选择性：

* 在 **"Alexander the Great"、"the Milky Way"** 等命名实体处强激活
* 在 **"By the way"、"Princess of Wales"** 等固定短语处强激活
* 在中文中，对 **"四大发明"、"张仲景"** 等成语和历史实体同样有效
* 在普通功能词 "the"、"is"、"of" 处几乎不激活

# 7. 系统效率：把内存墙变成内存优势

## 7.1 确定性预取

Engram 相比 MoE 的一个关键系统优势，**查表索引完全由输入 token 决定，不依赖中间计算状态**。这意味着在 GPU 执行前一层计算的同时，CPU 就可以 **异步预取** 下一层 Engram 需要的嵌入向量。通信与计算完全重叠，几乎零开销

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-287c7604e3de4ae6a8c1173cf85b0fd4.jpeg>)

***训练和推理阶段的系统架构。训练时 GPU 分片存储 + All-to-All 通信；推理时 CPU 内存卸载 + 异步预取***

![](<../images/DeepSeek Engram 深度解读：当大模型学会查字典而不是硬背书-image-1.png>)

***推理流水线时序图。CPU 预取和 PCIe 传输与 GPU 计算完全重叠***

## 7.2 多级缓存

自然语言 N-gram 服从 **Zipfian 分布，** 少数高频模式（如 "of the"、"in the"）占大多数访问，据此设计了三级缓存：

> **Zipfian 分布（齐普夫分布）** 是一种描述 **少数高频、多数低频** 的离散概率分布，核心是 **频率与排名成反比幂律关系**，广泛存在于自然、社会与技术系统中
> 1. **齐普夫定律（Zipf's Law）**
> 经验规律：将元素按频率降序排名（第1名最频繁），**频率 ≈ 常数 / 排名^α**，α 通常接近 1。
> * 公式：$f(r) \propto \frac{1}{r^\alpha}$，其中 $r$ = 排名， $\alpha$ = 幂次参数；直观：排名第 $k$ 的元素频率 ≈ 第 1 名的 $1/k$
> - **概率质量函数（PMF）**
> 有限范围 $n$ 时的标准形式：
> $P(X=k) = \frac{1}{H_{n,\alpha} \cdot k^\alpha}$
> * $k \in \{1,2,...,n\}$（排名）；$H_{n,\alpha} = \sum_{i=1}^n \frac{1}{i^\alpha}$（广义调和数，归一化常数）
> 当 $n \to \infty$，退化为 **齐普夫（Zeta）分布**：$P(X=k) = \frac{1}{\zeta(\alpha) \cdot k^\alpha}$， $\zeta(\alpha)$ 为黎曼ζ函数
> * **分布特征**
> - **高度偏斜**：头部集中、长尾稀疏
> - **对数线性**： $\log(f) \propto -\alpha \cdot \log(r)$，双对数图呈直线
> - **参数 α**：α 越大，分布越集中；α=1 为经典齐普夫分布

| 缓存层级 | 存储位置 | 缓存内容 | 延迟 |
| ---- | -------- | ------------- | ------- |
| L1 | GPU HBM | Top 高频 N-gram | 最低 |
| L2 | 主机 DRAM | 中高频 N-gram | 低 |
| L3 | NVMe SSD | 长尾低频 N-gram | 较高但容量极大 |

## 7.3 实际性能

论文测试了一个极端场景，将 **100B 参数** 的 Engram 嵌入表完全卸载到主机内存：

| 配置 | 吞吐量 (tok/s) | 损失 |
| ------------------------------- | ----------- | ---------- |
| Dense-4B 基线 | 9,031 | |
| Dense-4B + 100B Engram (CPU 卸载) | 8,858 | **仅 1.9%** |
| Dense-8B 基线 | 6,315 | |
| Dense-8B + 100B Engram (CPU 卸载) | 6,140 | **仅 2.8%** |

* 把 1000 亿参数放在便宜的 DDR5 内存条上而不是昂贵的 GPU HBM 里，吞吐量损失不到 3%。这组实验至少说明，Engram 的参数扩展路径在系统上比传统全部参数都留在 HBM更友好

# 8. 代码理解

下面的代码基于官方 demo，而不是完整训练栈

## 8.1 配置结构

```python
@dataclass
class EngramConfig:
    tokenizer_name_or_path: str = "deepseek-ai/DeepSeek-V3"
    engram_vocab_size: List[int] = field(
        default_factory=lambda: [129280*5, 129280*5]  # 2-gram 和 3-gram 的嵌入表大小
    )
    max_ngram_size: int = 3         # 最大 N-gram 阶数
    n_embed_per_ngram: int = 512    # 每个 N-gram 的嵌入维度
    n_head_per_ngram: int = 8       # 每个 N-gram 的哈希头数
    layer_ids: List[int] = field(
        default_factory=lambda: [1, 15]  # Engram 插入的层 ID
    )
    pad_id: int = 2
    seed: int = 0
    kernel_size: int = 4            # ShortConv 的卷积核大小
```

## 8.2 Engram.forward 完整注释版

```python
class Engram(nn.Module):
    def forward(self, hidden_states, input_ids):
        """
        hidden_states: [B, L, HC_MULT, D] — 来自多分支主干的隐藏状态
        input_ids:     [B, L]             — 原始 token ID 序列
        """
        # =================== 检索阶段 ===================
        # 1. 哈希映射: input_ids → 压缩 → N-gram → 多头哈希 → 索引
        hash_input_ids = torch.from_numpy(
            self.hash_mapping.hash(input_ids)[self.layer_id])
        # hash_input_ids: [B, L, num_heads_total]

        # 2. 嵌入查表: 索引 → 向量, 然后拼接所有头
        embeddings = self.multi_head_embedding(hash_input_ids).flatten(start_dim=-2)
        # embeddings: [B, L, d_mem]  (d_mem = (max_ngram-1) * n_embed_per_ngram)

        # =================== 融合阶段 ===================
        gates = []
        for hc_idx in range(backbone_config.hc_mult):  # 遍历 4 个分支
            # 3. Key 投影: 将记忆嵌入映射到与隐藏状态相同的空间
            key = self.key_projs[hc_idx](embeddings)       # [B, L, D]
            normed_key = self.norm1[hc_idx](key)            # RMSNorm

            # 4. Query: 第 hc_idx 个分支的隐藏状态
            query = hidden_states[:, :, hc_idx, :]          # [B, L, D]
            normed_query = self.norm2[hc_idx](query)        # RMSNorm

            # 5. 门控: 点积相似度 → sqrt 激活 → sigmoid
            gate = (normed_key * normed_query).sum(dim=-1) / math.sqrt(D)
            gate = gate.abs().clamp_min(1e-6).sqrt() * gate.sign()
            gate = gate.sigmoid().unsqueeze(-1)             # α ∈ (0,1), [B,L,1]
            gates.append(gate)

        gates = torch.stack(gates, dim=2)  # [B, L, HC_MULT, 1]

        # 6. Value 投影 + 门控调制
        value = gates * self.value_proj(embeddings).unsqueeze(2)  # [B,L,HC_MULT,D]

        # 7. ShortConv: 深度因果卷积 + SiLU + 残差
        output = value + self.short_conv(value)
        return output  # 最终通过残差连接: H = H + output
```

## 8.3 TransformerBlock 集成方式

集成非常简洁，Engram 通过残差连接注入，位于 Attention 和 MoE 之前：

```python
class TransformerBlock(nn.Module):
    def __init__(self, layer_id):
        self.attn = ...   # Multi-head Latent Attention
        self.moe  = ...   # DeepSeekMoE
        # 仅在指定层插入 Engram
        self.engram = Engram(layer_id) if layer_id in engram_cfg.layer_ids else None

    def forward(self, input_ids, hidden_states):
        # 先 Engram (如果该层有的话)
        if self.engram is not None:
            hidden_states = self.engram(hidden_states, input_ids) + hidden_states
        # 再 Attention
        hidden_states = self.attn(hidden_states) + hidden_states
        # 最后 MoE
        hidden_states = self.moe(hidden_states) + hidden_states
        return hidden_states
```

# 9. Engram 创新点和局限性

## 9.1 Engram 不只是加了一张表

Engram 不等同于把老式 N-gram memory 重新包装了一下，其创新点主要分成三层：**建模层、工程层、系统层**

* 建模层。MoE 代表的是 conditional computation，也就是让不同 token 按需走不同的计算路径；而 Engram 代表的是 conditional memory，就是让不同 token 按需访问不同的静态记忆槽位。Engram 的第一个贡献，就是明确提出：**除了算得更稀疏，大模型还可以记得更稀疏，这实际上是在 Transformer 稀疏化设计空间里又开了一条轴**
* 工程层。单独看哈希查表并不新，但 Engram 把几个原本分散的想法打包成了一条可以训练、可以扩展、可以插进大模型主干的完整数据流。先用 CompressedTokenizer 缩小并规整词表空间，再用 2-gram 和 3-gram 做局部模式编码，再通过多头哈希降低单一映射带来的信息损失，最后加上 query-aware gating 和 short conv 来完成选择性融合。**Engram 的工程创新不在某一个小技巧，而在把可扩展查表 memory从一个概念变成了一个能工作的模块化方案**
* 系统层。传统 MoE 的难点之一是专家选择依赖中间状态，因此调度和通信路径比较动态；而 Engram 的查表索引直接由输入 token 决定，这使得预取、分层缓存和 host memory offload（主机内存卸载）变得天然可行。**Engram 不只是精度小改进，同时是一种对内存层级更友好的模型**

## 9.2 Engram 的局限性

Engram 还远没有把模型记忆这个问题彻底解决：

* **记忆更新与遗忘**。Engram 把一部分事实性模式压进了静态记忆表里，这对稳定知识是优势，但对变化知识就会变成挑战。实体关系会更新，政策、产品、人物信息也会变化。**当知识过时时，应该如何局部更新 memory，而不是重新训练整个模型？进一步说，旧知识如何被遗忘，新知识如何避免被旧槽位干扰？**
* **冲突与歧义**。Engram 之所以需要上下文门控，就是因为哈希检索并不天然干净，碰撞噪声和多义词歧义始终存在。对于多义词、长尾实体、罕见组合，当前的 **多头哈希和局部门控到底能在多大程度上区分正确记忆、冲突记忆和看起来相似但其实错误的记忆**，仍然是开放问题
* **能力分工的证据还不算终局性**。机理分析里的结论：关闭 Engram 后，事实知识性能只剩 29% 到 44%，而阅读理解还能保留 81% 到 93%，于是看起来像是静态事实在 Engram，动态理解在主干。它说明了功能依赖，却还不能完全等价于干净的因果归因。**Engram 确实承担了大量事实知识，但主干到底还剩多少冗余记忆、两者之间是否存在更复杂的补偿关系，还需要更细致的实验去拆解**
* **跨模态扩展**。文本里的局部稳定模式适合用 N-gram 做编码，**图像、音频、视频，多模态输入的记忆单元是什么，局部模式该如何离散化，是否存在类似文本 N-gram 的高效地址结构**，这些都还完全没有定型。如果 Engram能迁移到多模态，才更接近通用架构基础设计

Engram 给我们的启示不仅是一个具体的技术方案，更是一种 **思维方式的转变**：
