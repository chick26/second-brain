---
id: "7457087813796759975"
cubox_url: https://cubox.pro/web/card/7457087813796759975
url: https://juejin.cn/post/7620357552527327267
tags: []

---
# AI Agent 几种架构模式大家好，我是双越。wangEditor 作者，前百度 滴滴 资深前端工程师，慕课网金牌讲师 - 掘金

https://juejin.cn/post/7620357552527327267

大家好，我是双越。[wangEditor](https://link.juejin.cn/?target=https%3A%2F%2Fwww.wangeditor.com%2F "https://www.wangeditor.com/") 作者，前百度 滴滴 资深前端工程师，慕课网金牌讲师，PMP，[前端面试派](https://link.juejin.cn/?target=https%3A%2F%2Fwww.mianshipai.com%2F "https://www.mianshipai.com/") 作者。

我正致力于两个项目的开发和升级，感兴趣的可以私信我，加入项目小组。

* [划水AI](https://link.juejin.cn/?target=https%3A%2F%2Fwww.huashuiai.com%2F "https://www.huashuiai.com/") Node 全栈 AIGC 知识库，包括 AI 写作、多人协同编辑。复杂业务，真实上线。
* [智语](https://link.juejin.cn/?target=https%3A%2F%2Fzhitalk.chat%2F "https://zhitalk.chat/") AI Agent 智能体项目。一个智能面试官，可以优化简历、模拟面试、解答题目等。

本文介绍 AI Agent 智能体的几种常见的架构模式，帮助你理解 agent 运行原理。

## 开始

在 AI 发展初期，和 AI 简单的聊天，调用 LLM 是一问一答，输入和输出，比较简单。那时候主要是研究 prompt engeering 提示词工程，即如何利用提示词让每一次回答的质量更高。

现在 Agent 要应对很多复杂任务，要结合 tools memory 和 RAG 一起完成，可能是做一个综合性的调研，可能是设计一个长期的计划，可能是写代码实现一个复杂功能... 再简单的一问一答肯定是满足不了需求的。

要实现这些功能，Agent 需要专门的架构和流程，本文就介绍 3 个最常见的架构模式。

## ReAct（Reason + Act）

ReAct 是最经典的架构，适用于常见的搜索、问答场景。他的模式是：先 **思考 (Reason)** → 决定 **调用工具 (Act)** → 再根据结果继续思考。可能是一个循环。

    User Question │ ▼ +-----------+ | LLM | | Thought | +-----------+ │ ▼ Decide Tool ? / \ yes no │ │ ▼ ▼ Call Tool Final Answer │ ▼ Observation │ ▼ Back to LLM (loop) 

上面的 loop 就是 Agent 内部循环。一般情况下，需要 agent 控制这个循环次数，否则可能会失控。

    Thought -> Action -> Observation -> Thought -> ... 

例如你问"北京天气如何"，Agent 将做如下思考

    Thought: 我需要查询天气 Action: weather_api("Beijing") Observation: 25°C sunny Thought: 已经有答案 Final Answer: 北京今天 25°C 晴天 

代码示例如下

    while (true) { const prompt = ` Question: ${userInput} History: ${steps} Think step by step. You can use tools. ` const response = await llm(prompt) if (response.type === "tool") { const result = await tools[response.tool](response.args) steps.push({ action: response.tool, observation: result }) } else { return response.answer } } 

ReAct 模式的优点是实现简单，非常灵活，可以动态的扩展工具。缺点是 LLM 调用次数过多，循环多了容易失控，所以一般要限制最大的轮询次数。

## Plan-and-Execute

这个模式解决 **复杂任务拆解问题**。先让 LLM 做整体计划，再一步一步执行（调用 tool）。

    User Request │ ▼ +-------------+ | Planner LLM | +-------------+ │ ▼ Task List │ ▼ +-------------+ | Executor | | (tools) | +-------------+ │ ▼ Combine Results │ ▼ Final Answer 

例如用户问"帮我制定一个 5 天马拉西亚的旅行计划"

LLM 会先制定计划

    1. 搜索吉隆坡景点 2. 搜索槟城景点 3. 规划每天路线 4. 生成旅行文档 

Agent 再按照计划去调用相应的 tool 去一步一步执行，并记录执行结果

    task1 -> google search task2 -> travel API task3 -> LLM route planner task4 -> PDF generator 

代码示例如下：

    async function createPlan(goal: string) { const prompt = ` Break the task into steps. Task: ${goal} ` return await llm(prompt) } async function executePlan(plan) { const results = [] for (const step of plan.steps) { const result = await runStep(step) results.push(result) } return results } const plan = await createPlan(userInput) const result = await executePlan(plan) return summarize(result) 

Plan-and-Execute 模式的优点是长任务稳定、结构清晰，缺点是计划可能不够完美，所以现在很多 Agent 在列出计划后，都允许用户自行修改，然后再执行。

## Reflection / Self-Critique

这是 **让 Agent 自我检查输出**，适合写代码、写论文、写博客。AI 编程工具如 Cursor 会用这种模式。

LLM 输出 → 再让 LLM 评估 → 如果不好 → 修改。

    User Task │ ▼ +----------+ | LLM | | Draft | +----------+ │ ▼ +----------+ | Critic | | Review | +----------+ │ ▼ Good ? / \ No Yes │ │ ▼ ▼ Rewrite Final Answer │ └── loop 

例如你让 Cursor 写一段 nodejs 代码，实现 xxx 缓存

它第一次写出的代码，进行 Critic Review ，结果是：没有 TTL 逻辑不清晰

它得到这些 review 意见之后，再重写，就会得到更好的代码。可以再进行 review ，但一般在 3 次以内。

    let draft = await llm(task) for (let i = 0; i < 3; i++) { const critique = await llm(` Review this answer: ${draft} List problems. `) if (critique.includes("no problem")) { break } draft = await llm(` Improve the answer based on critique: ${critique} Original: ${draft} `) } return draft 

## 对比

三种架构模式的对比
架构 特点 适合 ReAct 思考 + 工具循环 搜索、问答 Plan-Execute 任务拆解 长任务 Reflection 自我优化 写作、代码

## 组合使用

生产环境下，3 种模式会结合使用。先制定计划，在 ReAct 执行，最后让 LLM 检验结果，根据不同的任务类型，步骤都是可取舍的。

     +------------+ User Request -> | Planner | +------------+ │ ▼ +------------+ | Executor | | (ReAct) | +------------+ │ ▼ +------------+ | Reflection | +------------+ │ ▼ Final Result 

还要结合 momery RAG tools 等这些一起使用。整个 agent 是一个非常复杂的软件系统。


[Read in Cubox](https://cubox.pro/web/card/7457087813796759975)  
[Read Original](https://juejin.cn/post/7620357552527327267)  

---

