---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "CRITIQUELLM! Scaling LLM-as-Critic for Effective and Explainable Evaluation of Large Language Model"
source: feishu-export
imported: 2026-05-24
---

**分类：无参考文本 / 有参考文本**

# 一、问题背景

> 传统的评价指标（如BLEU、ROUGE）基于参考文本和生成文本的n-gram重合度计算评价分数，缺乏对生成文本整体语义的把握；而基于模型的评价方法则严重依赖基座模型的选取，只有GPT-4这样“顶级”的大模型才能取得令人满意的评价效果，但其仅能通过API访问的特性又给研究者带来花费高昂、访问困难、数据泄露等一系列挑战。

# 二、研究方法

> 提出了一个名为CritiqueLLM的新的评论生成模型，其中包括一种基于对话的提示方法，用于生成高质量的参考/无参考文本的评估分析文本及对应得分。

![](<../images/CRITIQUELLM! Scaling LLM-as-Critic for Effective and Explainable Evaluation of Large Language Model -image-1.png>)

**过程细节：**

> * **训练数据**
> 从少量公开平台收集的用户询问增广得到覆盖面较广的大量询问数据，并根据多样性和回答难度进行了精心的筛选和过滤最终得到1000个问题。随后，收集了各种能力层次的LLMs在该询问集合上的生成结果。设计提示让GPT-4根据用户询问、参考文本和模型生成文本生成评价结果。提示包含详细的评价标准，使GPT-4生成的评价结果能和人类较好地对齐。具体流程如下图所示：

![](<../images/CRITIQUELLM! Scaling LLM-as-Critic for Effective and Explainable Evaluation of Large Language Model -image.png>)

作者采用了一种基于对话的提示方法，以获取参考和非参考评估数据。具体而言，该方法首先引导GPT-4生成参考评估结果，随后通过修订上一轮的输出，得到非参考结果。操作步骤为;先让GPT4生成带有参考答案的评估，然后在下一轮对话中，要求GPT-4忽略之前提供的参考评估，并限制本轮输出的评估分数与上一轮有参考答案给出的评估分数保持一定关联，以防止评估分数差异过大。

> * **CRITIQUELLM模型**
> 对指令调整后的大型语言模型（如ChatGLM）进行监督式微调，使用构建的训练数据来获得一个用于大型语言模型评估的批评生成模型。值得注意的是，参考和非参考设置中的提示略有不同。
> * **测评Benchmark**
> 采用了基准数据集AlignBench，该数据集旨在评估大型语言模型（LLM）在中文环境下对齐人类指令的程度。数据集包括八大类任务，覆盖了真实场景中大多数用户查询。为了评估生成文本的质量，该基准提供了一个包含250个用户查询和每个查询下由8个不同LLMs生成的文本的评估数据集，并进行了人工注释。

# 三、实验结果

![](<../images/CRITIQUELLM! Scaling LLM-as-Critic for Effective and Explainable Evaluation of Large Language Model -image-2.png>)

> CRITIQUELLM-66B在特别是在有参考文本中能够达到与GPT-4相当的性能。可以观察到，CRITIQUELLM-66B在设置参考文本中的System-Level的Spearman和Kendall相关性甚至接近1.0，这表明他们的模型能够区分所有八个LLM的整体性能。尽管无参考文本更具挑战性，CRITIQUELLM-66B仍然能够超过大多数基准，并在System-Level相关性中实现超过90%的GPT-4评估能力。比较CRITIQUELLM-6B到CRITIQUELLM-66B的性能，还可以观察到良好的扩展性能。这表明，如果继续增加基础模型的参数数量，他们的解决方案有望成为GPT-4的可靠替代品。

![](<../images/CRITIQUELLM! Scaling LLM-as-Critic for Effective and Explainable Evaluation of Large Language Model -image-3.png>)

> 从上图可以看出，CRITIQUELLM-66B在生成解释的质量上大大超过ChatGPT，并且能够与GPT-4达到相当的表现。从中间的图可以看出，尽管CRITIQUELLM-6B/12B在特别是在设置有参考文本的System-Level的相关性上可以获得与CRITIQUELLM-66B相似的评估结果，但在生成解释方面仍然比CRITIQUELLM-66B表现差，且差距相对较大。右图比较了不同的解码策略，展示了这些解码方法在66B模型规模下生成解释的质量是可比的。

# 四、实验结论

> 提出了一个名为CRITIQUELLM的Critical模型，该模型是通过设计的基于对话的提示方法获得的高质量参考或无参考评估数据进行训练。实验结果显示，CRITIQUELLM在Systenm-Level相关性方面可以达到与GPT-4相当的性能，甚至在无参考设置中在8项任务中有3项超过了GPT-4。CRITIQUELLM还表现出良好的扩展性，并提供可扩展的反馈，有助于提高LLM生成的质量。
