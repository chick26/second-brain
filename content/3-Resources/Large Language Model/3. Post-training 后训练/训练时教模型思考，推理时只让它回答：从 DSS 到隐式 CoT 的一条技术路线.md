---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线"
source: feishu-export
imported: 2026-05-24
---

> ***<u>“能不能在训练的时候输出 CoT，但是推理的时候不输出 CoT，同时让答案的准确率和整体质量都有提升？”</u>***
> 这个问题表面上像是在问训练 trick，实际上问得很深，涉及一个很核心的技术判断：**CoT 到底应该被当成推理阶段的显式产物，还是训练阶段的辅助监督**
> 但如果答案是后者，问题就变成了：**能不能在训练阶段用 CoT 帮模型学会更强的推理能力，而在真正推理时只保留更短、更直接的答案输出路径，关注的是训练范式和部署范式能不能解耦**
> 这个和 **自适应思考** 不一样，自适应思考是：**模型在推理阶段自己判断一道题值不值得思考、思考多久，关注的是推理时的计算分配**

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-1.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782782946467_img-a455b885cb57e0188d1e.png)

# 1. DSS：把 CoT 从推理输出改成训练监督

> 论文：https://arxiv.org/abs/2305.02301，Distilling Step-by-Step! Outperforming Larger Language Models with Less Training Data and Smaller Model Sizes

DSS 的核心：

1. 先用大模型对输入样本生成 rationale 和 label
2. 再让小模型做双任务训练
3. 训练阶段学两件事，推理阶段只走答案任务

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783129500_img-b2c29efacb6bc43f8418.png)

论文里最值得注意的一点是 **任务拆分的方式，** DSS 不是把 `question -> CoT -> answer` 直接拼成一个长 target 去硬训，而是显式地用两个 **task prefix** 来区分输出模式：

$L = L_{label} + \lambda L_{rationale}$

同一个输入问题 `x` 会衍生出两条训练样本：

* `[label] + x -> y`
* `[rationale] + x -> t`

推理的时候，只需要保留第一条，**把 CoT 从在线推理时必须生成的文本变成了训练时帮助表示学习的监督信号**

# 2. 双任务训练的重要性

双任务训练比 **CoT + 答案串成一个 target** 更稳，这一点非常重要，但在很多复现里反而最容易被忽略。如果把目标直接写成：`x -> t -> y`，表面上看起来简单，实际上有一个结构性问题：

***<u>答案 token 往往只占整个 target 的很小一段，训练信号会被长 CoT 序列稀释。</u>**<u> 模型会学到很多关于 CoT 文风、句式组织、解释习惯的东西，但这些东西不一定直接服务于最后那一下答案预测</u>*

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-5.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783068917_img-07390d39fb47c60685a1.png)

工程实现里，推荐把数据整理成两个任务，而不是一个大串联 target。最小可用的数据格式可以直接写成下面这样：

```python
def build_examples(question, answer, cot):
    return [
        {
            "task": "label",
            "prompt": f"[label]\nQuestion: {question}\nAnswer:",
            "target": answer,
        },
        {
            "task": "rationale",
            "prompt": f"[rationale]\nQuestion: {question}\nReasoning:",
            "target": cot,
        },
    ]
```

# 3. MI-CoT：双任务怎么耦合

> 论文：https://arxiv.org/pdf/2403.03348，**Learning to Maximize Mutual Information for Chain-of-Thought Distillation**

MI-CoT，解决的就是任务拆完之后怎么更好地协同，切入点很直接：

DSS 虽然用了双任务框架，但 **没有显式建模答案任务和 rationale 任务之间的内在关系**。MI-CoT 从 Information Bottleneck 的角度出发，把问题形式化成 **最大化两个任务表征之间的互信息**，并给出一个变分求解框架

这一步很关键，说明了一个问题：**CoT 不是加了就有用，关键在于它和主任务是否发生了高质量的信息对齐**

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-6.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783099581_img-07c68226e814b93178ef.png)

# 4. 从显式 CoT 到隐式 CoT

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-2.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782782976470_img-49260763949cd5796a74.png)

## 4.1 Stepwise Internalization

> **论文：From Explicit CoT to Implicit CoT: Learning to Internalize CoT Step by Step，https://arxiv.org/pdf/2405.14838**

**这篇论文** 提出了一个很有启发性的想法：不是一下子把 CoT 全删掉，而是 **逐步删除中间步骤并继续 finetune**。这样模型会被逼着把原本写在文本里的推理过程逐渐迁移到 hidden states 里

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-3.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783003754_img-305e20bac0e6f0fbdd8f.png)

## 4.2 CODI：把 CoT 压进 continuous latent

> **CODI: Compressing Chain-of-Thought into Continuous Space via Self-Distillation** ，https://arxiv.org/abs/2502.21074

CODI 把 reasoning 从自然语言 token 空间压进 **continuous space**，通过 teacher task 和 student task 的 hidden-state alignment，**让模型在潜空间里完成 reasoning**

![训练时教模型思考，推理时只让它回答：从 DSS 到隐式 CoT 的一条技术路线-image-4.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783037158_img-cc69578b061c54d6bdc3.png)
