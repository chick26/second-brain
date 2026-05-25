---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "RECEVAL! Evaluating Reasoning Chains via Correctness and Informativeness"
source: feishu-export
imported: 2026-05-24
---

**分类：无需参考文本**

# 一、研究背景

> 多步推理能力对许多自然语言任务至关重要，然而什么构成一个好的推理链以及如何评估它们尚不清楚。大多数现有方法仅关注推理链是否可以推导出正确的答案，而没有把太多的注意力放在中间的推理过程分析上。

# 二、研究方法

> 提出了RECEVAL（推理链评估），这是一个通过两个关键属性评估推理链的框架；
> * **正确性**，即每一步都基于该步、前面的步骤和输入上下文中包含的信息进行有效推理；
> * **信息量**，即每一步提供对生成答案有帮助的新信息。

![](<../images/RECEVAL! Evaluating Reasoning Chains via Correctness and Informativeness-image.png>)

> 过程细节：下图展示了针对正确性与信息量的相关Case；
> 作者对于推理链中的每一步的是否正确与是否含有有用信息进行详细的讨论，具体如下；

![](<../images/RECEVAL! Evaluating Reasoning Chains via Correctness and Informativeness-image-1.png>)

> * **正确性**
> 为了使推理链正确，每个步骤都必须是正确的。此外，他们认为，如果相应的结论 $RCU_{c}^{(i)}$ 是正确的，那么思维链中的步骤 $s^{(i)}$ 就是正确的，步骤间的正确性衡量了全局一致性。通过计算步骤 $s^{(i)}$ 中给出前提 $RCU_{p}^{(i)}$ 的结论 $RCU_{c}^{(i)}$ 的蕴含概率来定义其的正确性，即有；
> $intra-correct_{entail}^{(i)}=P_{entail}(RCU_{p}^{(i)} ;RCU_{c}^{(i)} )$
> 考虑到这方法要求前提-RCUs与结论-RCU之间严格的蕴涵关系。然而，在自然语言中，推理步骤可以是非正式的，并且即使省略了一些前提-RCUs，仍然可以被认为是正确的。为了提供这种灵活性，引入了一个放宽的标准，用于评估从前提得出结论的容易程度。即有
> $intra-correct_{PVI}^{(i)}=PVI(RCU_{p}^{(i)} ->RCU_{c}^{(i)} )$
> 且有 $PVI(x->y )=-log^{'} [\emptyset ] (y)+log^{'} [x] (y)$
> 在有许多步骤的推理链中，确保任何新的结论-RCU与所有已知信息保持一致是至关重要的，为此他们还计算了了验证当前 $RCU^{(i)}_{c}$ 与先前信息之间没有矛盾的概率如下；
> $intra-correct^{(i)}=1-max_{r}( P_{contr.}(r ;RCU_{c}^{(i)} ))$
> * **信息量**
> 测量将其添加到迄今为止构建的链中后信息的增益，也就是说需要明确前面的推理过程对后面推理过程的信息增益。

伪代码详如图：

![](<../images/RECEVAL! Evaluating Reasoning Chains via Correctness and Informativeness-image-2.png>)

# 三、实验结果

> 对于推理过程存在一些问题，作者进行了汇总，如；事实性问题（FACT）、逻辑推理错误（LOGIC），幻觉（HALL）、冗余或无关信息（RED），不必要的转述（REP）、常识错误（COM）和算术错误（MATH）、衡量质量（QUAL）、连贯性（COH）。
> 如上图所示，尽管DROP该数据集主要由单步理由组成（多步理由比例< 20%）但是ECEVAL在所有基线文本生成度量中表现最佳，并且与ROSCOE在整体质量（QUAL）和连贯性（COH）度量上达到了相当甚至更好的相关性。此外，与ROSCOE相比，还在RED错误上提高了相关性（从0.80提高到0.83）。

# 四、实验结论

> 介绍了RECEVAL，一个基于正确性和信息性评估推理链的框架。他们提出了用于测量这些属性的无参考度量标准，这些度量标准基于蕴涵和PVI，利用推理链中称为Reasoning Content Units（RCUs）的细粒度主张。正如在多个数据集上的元评估所示，他们的方法明显优于先前的基线度量标准。最后他们还对他们的度量进行了详细分析，并展示了RECEVAL在各种环境中的有效性，并导致任务性能的改善。
