---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Shepherd! A Critic for Language Model Generation"
source: feishu-export
imported: 2026-05-24
---

**分类：无需参考文本**

# 一、研究背景

> 随着大型语言模型的改进，越来越多人对利用这些模型提升自研模型输出表现表现出兴趣。

# 二、研究方法

> 在这项工作中，他们介绍了Shepherd，这是一个专门调校的语言模型，用于批评模型的响应并提出改进建议，能够识别各种错误并提供相应的建议。采用定性的方式来衡量生成文本。

![[_Attachments/Images/Shepherd! A Critic for Language Model Generation-image-1.png]]

> **过程细节**：重点介绍下训练数据与评估benchmark的构造。
> * **训练数据**
> * 社区反馈数据
> * 从两个社区问答网站获取反馈数据：Stack Exchange 和 Pushshift Reddit 数据集。把帖子的标题和副标题看作问题，帖子的顶级评论为答案，对这些评论的回复为评论。一切都与社区投票得分有关，通过总赞数减去总踩数计算。为了明确，称为问题分数、答案分数和评论分数。
> * 人工标注数据
> * 选择8个语言理解和蕴涵数据集及2个摘要数据集，旨在收集各种上下文中的自然语言反馈。所选数据集涵盖了从逻辑到常识等多种推理类型。为了提高标注的质量和准确性，使用了专业审阅员进行人工标注。标注过程包括为每个问题提供上下文、正确答案和候选答案（使用LLaMA-65B或LIMA-30B这样的模型，以零样本或少样本方式产生候选答案），让标注员识别出候选答案中的错误。
> * **Shepherd模型**
> * 用LLaMA-7B作为基础模型来训练Shepherd。
> * **测评Benchmark**
> 为了全面评估，研究者们从六个不同的公共数据集中精心选择了实例，包括Alpaca-Farm、FairEval、CommonsenseQA、OBQA、PIQA和TruthfulQA，这些数据集涵盖了广泛的主题和各类推理技能，如常识推理、物理推理和数学推理。每个数据集中选取了50个实例，共300个实例用于最终评估。

# 三、实验结果

![[_Attachments/Images/Shepherd! A Critic for Language Model Generation-image-2.png]]

![[_Attachments/Images/Shepherd! A Critic for Language Model Generation-image.png]]

总的来说，对于不同的Critical model来说，不同的不管是人类评估还是GPT4评估，Shepherd非常具有优势，且在对照组中的得分最高。

# 四、实验结论

> 通过自训Critical模型用于批评大型语言模型生成的结果。通过在多个数据集和不同评估设置上进行广泛的实验，同时展示了模型能够有效地批评答案，达到与ChatGPT相当的性能水平，同时Shepherd对于改进生成质量并减少幻觉非常有帮助。
