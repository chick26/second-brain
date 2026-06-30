---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Are Machine Rationales (Not) Useful to Humans! Measuring and Improving Human Utility of Free-Text Ra"
source: feishu-export
imported: 2026-05-24
---

**分类：无需参考文本**

# 一、研究背景：

> 最新的大型语言模型（LLMs）研究显示，它们能生成看似合理的自然语言文本（**自由文本合理化**），这反过来又能显著提高它们在排行榜上的表现。
> 然而，尽管这些合理化在特定任务中效果显著，但其对于人类实际应用的有效性尚不确定。特别是当人们依赖这些模型生成的解释或理由时，是否真的帮助他们理解问题和找到正确答案还有待观察。目前，评估这些合理化对人类的实用性既昂贵又困难，且缺乏有效指标，因此在无人参与的情况下评估这种自然语言的实用性是具有挑战性的
> "自由文本合理化（Free Text Rationalization）"与"思维链（Chain of Thought）"的本质区别；
> 自由文本合理化（Free Text Rationalization）：定义：这种方法涉及在回答问题时提供详细的解释或论证，说明为什么给出了特定的答案。它的目的是在回答的同时展示思考过程，使回答更加透明和容易理解。
> 特点：解释性：它强调对答案的合理化，解释为什么这个答案是正确的或合理的。教育性：通过解释和论证，它可以帮助用户更好地理解复杂概念或答案背后的逻辑。应用场景：适用于需要解释或论证以增加信任度和理解度的场景，例如在教育、法律建议或复杂的科学解释中。
> 思维链（Chain of Thought）：定义：这是一种解决问题的方法，其中模型展示了从问题到答案的逐步思考过程。它类似于一个人在解决问题时的内部对话，展示了逐步的推理过程。特点：步骤化：它通过分步骤的方式来解决问题，每一步都是推理过程的一部分。透明性：通过展示完整的思考过程，它提高了回答的透明度。应用场景：特别适用于数学问题、逻辑推理题或任何需要逐步解析的复杂问题。总的来说，自由文本合理化侧重于解释和论证，强调为什么一个答案是正确的，而思维链则侧重于展示解决问题的步骤和过程，更像是一个逐步揭示的思考旅程。这两种方法都旨在提高大型语言模型的透明度和用户对回答的信任度。

# 二、研究方法

> **动作**：展示了评估相关理由在回答未见实例时对人类的帮助程度，可以更好地衡量其对人类的实用性，并将这一发现转化为自动评分方法GEN-U，以此可以改进LLMs生成具有更好人类实用性的理由。最后，发布了项目的所有代码和收集的数据。
> **过程细节**：从人类效用方面定义"理由"的有效性。LLM\_model为一个大语言模型，给定一个输入输出对(x,y),LLM\_model以x为输入，生成预测 $y$ 和与该预测相对应的理由 $r_p$,设置人类判断为H,一方面H以x为 $y_p$ 输入，输出为 $y_h$,另一方面H以x和 $r_p$ 为输入，输出为 $y_{hr}$ ，于是有：
> $$\begin{cases}Useful \qquad y_{h}\ne y \;and\; y_{hr}= y
> \\Not\;useful\qquad y_{hr}\ne y
> \\Unsure\qquad y_{h}= y \;and\; y_{hr}= y
> \end{cases}$$
> 为了全面评估LLMs在处理不同类型问题时的泛化能力，作者对每个问题都设置了三种风格的改写（非平凡改述、反事实改写、相似推理问题）。下面详细介绍GEN-U的计算方法及利用。

![Are Machine Rationales (Not) Useful to Humans! Measuring and Improving Human Utility of Free-Text Ra-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714108758_img-a54d54251b29f98e3c9d.png)

> **1.** 对于一个给定的输入输出对 $(X,Y)$,存在一组泛化问题 $(X_{g},Y_{g} )=[(x_{g1} ,y_{g1}),(x_{g2} ,y_{g2}),..,(x_{gm} ,y_{gm})]$。
> **2.** 使用两个模型( $F^{IR}$ 和 $F^{I}$)来替换掉H并针对泛化问题进行预测；
> 1. $F^{I}$ 接受泛化问题 $X_{g}$ 作为输入，并预测一组标签 $Y_{gI}$.
> 2. $F^{IR}$ 接受泛化问题 $X_{g}$ 与原始问题的理由 $r_{p}$ 作为输入，并预测一组标签 $Y_{gIR}$.
> **3.** GEN-U 分数的计算方式如下：
> $GEN-U=MODE_{i=1}^{n} \begin{cases} & (1-1(y_{gIi}=y_{gi} ))\qquad y_{gIRi}=y_{gi} \\ & -1\qquad y_{gIRi}\ne y_{gi} \end{cases}$
> **4.** 反馈更新；GEN-U 被用作奖励信号（reward）来更新语言模型（LLM）。在文本中提到了使用 Quark 算法，该算法结合了 GEN-U 来提高语言模型生成的理由的人类效用。通过这个过程，希望更新的语言模型能够生成更加人类友好、有用和不误导的理由，提高其在处理泛化问题时的性能。在更新后的 LLM 上进行了人类效用评估，表明通过使用 GEN-U 这一奖励信号，可以在保留任务性能的同时改进生成的理由的质量。

# 三、实验结果

![Are Machine Rationales (Not) Useful to Humans! Measuring and Improving Human Utility of Free-Text Ra-image-2.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714087108_img-8584ea1d4657ffeffa58.png)

![Are Machine Rationales (Not) Useful to Humans! Measuring and Improving Human Utility of Free-Text Ra-image-1.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714067423_img-a3a13075ff6ca083b205.png)

注意到，更新后的语言模型能够保留大部分任务性能，同时将有用（USEFUL）理由的百分比提高了2%。GEN-U还有助于消除4%误导性（NOT USEFUL）的理由。将更新后的语言模型与GPT-3进行了比较，后者在理由的人类效用方面表现最佳。GEN-U能够使更新后的语言模型在人类效用方面更接近GPT-3，同时确保更新后的语言模型的任务性能仍然优于GPT-3。

# 四、实验结论

> 在这项工作中，作者们研究了自由文本理由的人类效用，通过衡量普通人在其帮助下能够解决任务的能力。通过广泛的人类评估，他们发现当前语言模型生成的理由的人类效用相当不令人满意，并且现有的可用度量与之关联不强。他们发现，在以理由作为上下文的情况下的泛化能力是人类效用的一个良好代理，并将其用作奖励来提高语言模型的人类效用，同时实现了不错的效果。
