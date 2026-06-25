---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Large Language Models are not Fair Evaluators"
source: feishu-export
imported: 2026-05-24
---

# 一、问题背景

> 随着生成式 AI 的快速发展，怎么评测模型生成的内容成为了一个非常有意思的问题。传统的生成的指标像 n-gram based metrics（BLEU、ROUGE）以及基于语义距离的指标 BERT-Score 都不太适合开放域，因此考虑利用大语言模型来进行生成文本的评估确实是一个不错的选择，但是大型语言模型（如GPT-4）评估不同模型表现时存在系统性偏见: 通过改变不同模型的答案在评价模版中的顺序，可以轻松篡改它们的质量排名，从而扭曲评估结果。这显然并不是我们想看到的。

![[_Attachments/Images/Large Language Models are not Fair Evaluators-image.png]]

# 二、研究方法

> 提出了针对校准的指标。
> * **平衡位置校准 （Balanced Position Calibration，BPC）**：通过交换两个答案的位置。为了确定特定答案的最终评分，计算其作为第一个回答和第二个回答时的平均分数。这种平均化过程有助于确保更平衡的评估，并减少评分过程中位置偏差的影响
> * **多证据校准(Multiple Evidence Calibration， MEC)**：让模型先生成解释，然后给出评分。这样，评分可以通过更多的支持证据进行校准。此外，模型不仅生成一条证据，而是采样多个证据链，并将平均分数作为最终评分。
> **过程细节**：为验证方案有效性，请三组标注员从帮助性、相关性、准确性和详细程度评估 Vicuna-13b 和 ChatGPT回复的质量，并且用三组标注员的众数作为最终的结果，来检验不同评测方法和人类评估的相关度;

# 三、实验结果

![[_Attachments/Images/Large Language Models are not Fair Evaluators-image-1.png]]

从上图可以看出；GPT-4整体优于 ChatGPT，且两种校准策略显著提高评估器与人工标注的一致性，特别对比较弱的 ChatGPT准确性提高14.3％，kappa相关系数增加0.25。

# 四、实验结论

> 研究揭示了在使用先进的ChatGPT/GPT-4模型进行对齐评估时存在系统性偏见。通过操纵评估过程中候选回复的顺序，可以显著影响它们的排名。为了减轻这种偏见，作者们引入了两种有效的策略，即多重证据校准（MEC）和平衡位置校准（BPC）。MEC要求评估者首先提供多个详细的证据片段来支持他们随后的评分，而BPC汇总来自不同顺序的结果以确定最终得分。这些策略成功减少了偏见并提高了与人类判断的一致性。
