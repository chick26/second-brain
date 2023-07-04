---
title: Prompt
creation date:  2023-03-31 09:16 
status: review
tags:  
- Development/AI/NLP/GPT
- Development/AI/NLP/GPT/Prompt
---
up:: [[• TOC for GPT]]

## 如何编写清晰简洁的 Prompt

>[!Hint] Prompt
> - **定义对话的目的和焦点** 明确对话的目的和重点是什么，制作具有吸引力和信息性的提示
> - **使用特定和相关的语言** 使用特定、与主题相关的语言, 避免使用含糊不清的语言或行话
> - **避免开放式或过于宽泛的提示** 尽可能具体和明确地定义对话的目的和重点
> - **保持对话正常进行** 确保对话涵盖主题并提供有用的信息，避免引入不相关的话题
> - **对话式不断深入** 逐步提出更具体和深入的问题，以获得更准确和全面的回答

### ICIO 模型

- Instruction (必须) : 指令, 即我们模型执行的具体任务。
- Context (选填) : 背景信息, 或者说是上下文信息, 这可以引导模型做出更好的反应。
- Input Data (选填) : 输入数据, 告知模型需要处理的数据。
- Output Indicator (选填) : 输出指示器, 告知模型我们要输出的类型或格式。

### CRISPE 模型

- CR: Capacity and Role (能力与角色) 。我们希望 ChatGPT 扮演怎样的角色。
- I: Insight (洞察力) , 背景信息和上下文 (告知 ChatGPT 应该具备什么样的上下文) 。
- S: Statement (指令) , 我们希望 ChatGPT 做什么。
- P: Personality (个性) , 我们希望 ChatGPT 以什么风格或方式回答你。
- E: Experiment (尝试) ，要求 ChatGPT 为我们提供多个答案

| Step              | Example                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Capacity And Role | Act as a n expert on software development on the topic Of machine Learning frameworks, and an expert blog writer. 把你想象成机器学习框架主题的软件开发专家，以及专业博客作者。                                                                                                                                                                                                                         |
| Insight           | The audience for this blog is technical professionals who are interested in learning about the Latest advancements in machine Learning. 这个博客的读者主要是有兴趣了解机器学习最新进展技术的专业。                                                                                                                                                                                                     |
| Statement         | Provide a comprehensive overview of the most popular machine learning frameworks, including their strengths and weaknesses. Include real-life examples and case studies to illustrate how these frameworks have been successfully used in various industries. 提供最流行的机器学习框架的全面概述，包括它们的优点和缺点。包括现实生活中的例子，和研究案例，以说明这些框架如何在各个行业中成功地被使用。 |
| Personality       | When responding, use a mix of the writing styles of Andrej Karpathy, Francois Chollet, Jeremy Howard, and Yann LeCun. 在回应时，混合使用 Andrej Karpathy、Francois Chollet、Jeremy Howard 和 Yann LeCun 的写作风格。                                                                                                                                                                                   |
| Experiment        | Give me multiple different examples. 给我多个不同的例子。                                                                                                                                                                                                                                                                                                                                              |

## 对话场景

### 问答问题 Zero-shot prompt

如果只是想要一个答案，可以在开始的时候就告诉 ChatGPT “DO NOT ASK FOR INTERESTS. DO NOT ASK FOR PERSONAL INFORMATION.”（意思是不要询问我对什么感兴趣，或者问我的个人信息）

### 基于实例回答

有的时候我们知道告诉 ChatGPT 该做什么，不该做什么。但有的时候我们可能没办法通过一个简单的话术来表达。比如我们想要起一个产品名字：产品描述：家用奶昔制作机 关键字：快速，健康，紧凑。

### 内容润色

可以给 AI 一些已有的内容，让 AI 进行修改和优化，使内容更好。这种方法可以应用于不同的场景，例如：

- **翻译文档**: 使用 AI 将中文文档翻译成英文，或将英文文档翻译成中文。尤其是像 ChatGPT 这样的 AI，不仅可以翻译人类语言，还可以翻译编程语言，例如将 Python 代码翻译成 Haskell 代码。
- **修改内容**: 使用 AI 帮助我们修正语法错误和拼写错误。
- **润色修饰**: 使用 AI 改进文章，将其转化成另一种风格。

### 信息解释

信息解释和改写内容相似，但是信息解释更多的场景是对于某件事情不太理解，然后让 ChatGPT 进一步解释比如：

- **解释代码**: 比如你看到一段 Python 的代码，但你看不懂，可以让 ChatGPT 解释下代码的含义
- **解释论文**: 看某篇论文看不懂，或者论文里的某一段看不懂，也可以让 ChatGPT 解释。

### 信息总结

使用双引号将指令和需要处理的文本分开，这样可以让 ChatGPT 识别的更加准确比如：

请总结一下内容，使得其更容易被理解`"对话内容"` 

### 写代码

无中生有写代码。可以告诉 ChatGPT 需求，然后一步一步的引导 ChatGPT，就可以生成出来具体的实现。虽然说 ChatGPT 可以编写代码，但还是需要有一定的编码基础，才能更好的和 ChatGPT 对话。