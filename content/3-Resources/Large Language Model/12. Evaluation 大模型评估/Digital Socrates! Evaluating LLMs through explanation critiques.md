---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Digital Socrates! Evaluating LLMs through explanation critiques"
source: feishu-export
imported: 2026-05-24
---

**分类：无需参考文本**

# 一、研究背景

> 虽然大型语言模型（LLMs）在回答问题时可以提供经过推理的解释，但这些解释的性质和质量仍然不够清楚，也就是说并没有一个定量或者定性的方法来进行生成文本的评估。

# 二、研究方法

> 定义了一种详细的方式来表征现代模型的解释能力，并创建一个细致且可解释的解释评估工具，该工具能够自动生成这些表征从而进行定量和定性的分析，而不依赖昂贵的API调用或人工注释。

![Digital Socrates! Evaluating LLMs through explanation critiques-image-5.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714919652_img-ed0ec440f2e2af329372.png)

**过程细节：**

首先作者们对推理过程中出现的错误进行了总结与分类，见图：

![Digital Socrates! Evaluating LLMs through explanation critiques-image-3.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714872505_img-606ec6c325a122cffcf7.png)

> 除了定位错误类型和针对错误提出意见外，解释性批评任务还涉及对解释质量提供一个量化指标，解释分数 **ESC** 的评分范围为0-5。
> Student Models：GPT-4、GPT-3.5-、Llama2-7B-chat和Llama2-70B-chat（需要被批评的模型）
> Critique Models：GPT-4, DS-7B and DS-13B（对产生的文本进行评估的模型）
> Critique模型对Student模型进行评价并产生一些解释，然后人工在对Critique模型产生的解释进行评价，评价分数的范围为0-3。
> * **训练数据**
> 创建了一个批评数据集DS Critique Bank，其中每个实例包括一个多项选择问题（连同答案选项和正确答案），一个模型生成的解释和答案，对模型生成的解释的批评，以及在该实例上收集到的人工注释。DS Critique Bank侧重于科学和常识推理问题并涵盖了来自流行解释风格的不同模型的模型生成的解释还包括了众包和专家注释的解释批评。
> * **Digital Socrates模型**
> DS-7B和DS-13B两个模型分别基于Llama2-7B-chat和Llama2-13B-chat进行微调的。
> * **评估数据**
> 在DS Critique Bank开发集的一个子集上进行评估，即从所有10个数据集中抽样270个问题（每个ARC数据集50个，每个RAINBOW数据集20个，以及OBQA和CommonsenseQA各25个），并让人工对每个解释和批评进行注释。

# 三、实验结果

> 有必要说一下文章的行文顺序，本文首先通过一些图表说明GPT4对Student模型评估的有效性，然后再说自身所训模型和与GPT4相差不大，间接证明自训模型的有效性。

![Digital Socrates! Evaluating LLMs through explanation critiques-image-4.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714891808_img-55468213b1703eb947f8.png)

> 上图中，分别绘制了解释分数 ESC 的分布，针对Student模型在回答问题时准确（acc = 1）与不准确（acc = 0）的情况。即使模型回答正确，它仍可能给出一个有缺陷的推理链，从轻微的缺陷（ESC = 4）到完全错误的情况（ESC = 0）。另一方面，当模型在答案上错误时，它仍可能提出一些有效的观点（ESC = 2），因此并非所有不正确的最终答案都应被视为对问题所需理解的完全缺乏。这样的趋势在各种模型中都能看到，而不受模型大小和类型的影响。

![Digital Socrates! Evaluating LLMs through explanation critiques-image-1.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714834913_img-7e13922f55cc645e007e.png)

> 使用由人工评定为高质量的GPT-4生成的评论（评论分数为2和3），在图17中展示了模型推理链中不同重要错误的总体比例。发现当模型正确回答问题时，有许多合理的解释没有缺陷，但仍然存在一些推理链中存在缺陷的情况，比如不正确的信息。当模型回答不正确时，存在广泛的缺陷，比如对问题或答案选项的误解，不正确的信息或推理，以及与给定答案不一致的推理。

![Digital Socrates! Evaluating LLMs through explanation critiques-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714933057_img-f1903aa02fc011f68f23.png)

> 上图比较了两个学生模型GPT-3.5和Llama2-70B。这两个模型的准确性相当，但是Llama2-70B模型的解释得分较低，表明其理解更为浅显。展示缺陷维度的饼图为模型的弱点提供了一个高效的快照。对于错误答案，可以看到Llama2-70B模型有更高比例的不正确信息，这可能通过信息检索或其他方式提高事实性来缓解。而GPT-3.5模型则在不一致答案上有明显较大的比例，其中答案与解释中的推理不匹配。这可能通过自我反思来改进，询问答案是否真的来自于解释。他们将这些有趣的假设留待未来的工作。

![Digital Socrates! Evaluating LLMs through explanation critiques-image-2.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714853880_img-1b32167b5e878e3357d3.png)

> * **Rated good**: 由人工评定为良好的批评的数量占比。
> * **Rated good**\*：重新调整测评比例后，被评定为良好的问题数量。
> * **Dimension overlap**: 错误维度与人类注释的重叠频率，即批评模型识别出的错误与人工注释的一致性程度。
> * **ESC match**: 解释得分（ESC），即模型生成的解释得分与人类评定的解释得分之差在1以内的匹配程度。
> 上图总结了由人工评价的不同模型产生的评论的质量。每个评论由3名工作者评分，计算其评分的平均值。对评论质量的人类判断显示，由GPT-4生成的评论中有92%被评为良好或完美。当考虑到完整测评集时这个数字增加到96%。还观察到，GPT-4的评论与众包解释批评之间存在很好的相关性。具体来说，81%的GPT-4的评论在与注释者确定的缺陷维度上重叠。而88%的GPT-4评论给出的解释分数与注释者给出的分数相差不超过1分，在5分制上意味着它们足够接近进行类似的分析。所有这些指标都显示，直接使用由GPT-4生成的评论进行分析应该与使用人工验证数据进行的分析具有非常高的相关性。

同时也可以看到DS-7B与DS-13B有着出色的表现，DS模型在解释中识别缺陷维度方面甚至更接近人类判断。

# 四、实验结论

> 作者们开发了Digital Socrates模型，它为大型语言模型（LLM）的性能提供了量化和质化的洞察，超越了答案准确性的层面。通过分析突显了仔细检查模型生成的解释的价值，这不仅是理解其推理过程的窗口，也有助于深入理解模型的推理能力。
