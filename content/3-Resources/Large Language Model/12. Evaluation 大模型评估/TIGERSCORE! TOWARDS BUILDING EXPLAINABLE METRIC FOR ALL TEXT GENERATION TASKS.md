---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "TIGERSCORE! TOWARDS BUILDING EXPLAINABLE METRIC FOR ALL TEXT GENERATION TASKS"
source: feishu-export
imported: 2026-05-24
---

**分类：无需参考文本**

# 一、研究背景

> 随着大型预训练语言模型的进步和文本生成模型在实际应用中的广泛应用，评估自然语言生成任务的需求变得越来越重要。尽管GPT-4已经表现出较强的与人类评估的相关性，但目前开源评估指标仍存在明显滞后。因此，开发可靠的评估指标成为了一个迫切的需求。

# 二、研究方法

> 提出了TIGERSCORE，这是一种经过训练的度量标准，遵循指导说明执行可解释且无需参考的评估，涵盖了广泛的文本生成任务。与其他仅提供晦涩分数的自动评估方法不同，TIGERScore是由自然语言指导引导的，以提供错误分析，精确定位生成文本中的错误。
> TIGERSCORE基于三个设计标准构建：
> * 它由指令驱动，易于适应任何文本生成任务。
> * 评估过程无需参考答案或完美示例进行比较。
> * 它具有高度的可解释性，因为该模型能生成错误分析，帮助用户理解每个识别出的错误及其相关的惩罚。

![[_Attachments/Images/TIGERSCORE! TOWARDS BUILDING EXPLAINABLE METRIC FOR ALL TEXT GENERATION TASKS-image.png]]

> **过程细节：**
> TIGERScore是一个无参考的度量，有一个函数F定义，以三元组 $[I(instruction),x(input\;context),\hat{y}(output) ]$ 作为输入，产生一个结构化的错误列表 $[E_{1},E_{2} ,..,E_{M} ]$ 输出，对于每个错误来说有 $E_{i}=(l_{i},a_{i},e_{i},s_{i} )$ 其中 $l\_{i}$ 表示错误的位置， $a_{i}$ 表示错误类型， $e_{i}$ 表示对此错误的修改意见， $s_{i}$ 错误的惩罚分数。最后会输出一个总的惩罚分数。

![[_Attachments/Images/TIGERSCORE! TOWARDS BUILDING EXPLAINABLE METRIC FOR ALL TEXT GENERATION TASKS-image-1.png]]

> **训练数据：** MetricInstruct数据集，该数据集用于对TIGERSCORE进行微调。数据集构建的三个基本标准是：
> * 数据集多样性：选择了23个不同的数据集作为源上下文，以覆盖足够的生成任务。
> * 错误覆盖：采用50多个文本生成系统生成的系统输出，以覆盖所有类型的错误，并保证分布平衡。
> * 质量保证：为确保MetricInstruct能够根据生成文本内容进行深入的错误分析，通过提示GPT-4来获取它，然后通过不同的启发式方法过滤，以消除低质量的错误分析。
> MetricInstruct整合了来自23个不同文本生成数据集的样本，这些数据集被分类为文本生成任务的6个主要类别。虽然该集合涵盖了一些研究充分的任务，如总结（Summ）、翻译（Trans）和数据生成文本（D2T），但它还引入了一些新的热门任务，如长格式问答（LF-QA）、数学问答（MathQA）和指令遵循（Instruct）。
> * **TIGERScore模型**
> * TIGERScore模型基于Llama-2-7B and Llama-2-13B 微调。
> * **测评Benchmark**
> 收集了一些较为常见的数据集以比较TIGERSCORE与现有基准度量标准的性能。例如SummEval、WebNLG-2020、WMT-22和OpenMEVA，A-F-E-C、GSM8K、LIMA和AlpacaEval。

# 三、实验结果

![[_Attachments/Images/TIGERSCORE! TOWARDS BUILDING EXPLAINABLE METRIC FOR ALL TEXT GENERATION TASKS-image-2.png]]

> 上图结果突显了TIGERSCORE在与其他无参考文献度量标准的比较中的显著优势。值得注意的是，TIGERSCORE在Kendall相关性方面超过了所有其他无参考文献度量标准。在相关性方面，TIGERSCORE在7个任务中有6个是最高的。这突显了TIGERSCORE在评估文本生成任务时的鲁棒性和一致性。此外，与API替代品GPT-3.5-Turbo（few-shot）和Llama-2-13b-chat（0-shot）相比，TIGERSCORE实现了显著更高的总体相关性，证明了其有效性。值得注意的是，TIGERSCORE-13b在某些任务上（如总结、翻译、数据生成文本和故事生成）可以达到与GPT-4（0-shot）相当甚至更高的相关性性能。在所有7个任务中的平均分数也接近GPT-4。

# 四、实验结论

> 在这篇论文中，作者们提出了一种新颖的度量标准TIGERSCORE，它能够评估由自然语言指令引导的任何文本生成任务。通过其与人类偏好的高相关性展示了TIGERSCORE的卓越性能，还展示了其生成的理由的高准确性。
