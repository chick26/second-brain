---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "Proactive Agent技术发展梳理：不是更主动，而是更会介入"
source: feishu-export
imported: 2026-05-24
---

> 过去一年，proactive agent 之所以突然变热，不是因为大家第一次想到 让 agent 主动一点，而是因为这个问题终于被当成了一个独立方向来处理。对于产品侧来说，LangChain 在 2025 年初提出 ambient agents，强调 agent 持续接收环境信号，只在检测到重要机会或确实需要反馈时才向用户要注意力；OpenAI 在 2025 年 7 月发布 ChatGPT agent 时，也把 自主选工具、必要时主动追问、支持任务周期运行 放进了统一 agent 能力框架里。到这一步，proactive 已经不再是 prompt 层的小修补，而是在走向一种新的交互范式。
> 近一年的工作给出倾向于，proactive agent 不是模型能不能抢先回答，而是系统能否在用户尚未明确发起请求时，基于连续上下文判断 **是否该介入、该以什么方式介入、以及这次介入是否值得**。这也是为什么这条线迅速从一般 agent 研究里分化出来，它天然带着 mixed-initiative interaction、用户成本、长期上下文和策略学习这几层约束，而不再只是一个会不会推理的问题。

![Proactive Agent技术发展梳理：不是更主动，而是更会介入-image-2.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715376818_img-454d1802512f670d2e21.png)

## 一、问题定义

从 2025 年中到 2026 年春，最明显的变化是 benchmark 开始从 <u>猜用户下一步想干什么</u> ，转向 <u>在真实连续轨迹里判断系统是否应该开口 </u>。

这条线的起点之一是 **ContextAgent**。它把 proactive 从封闭桌面环境拉到开放世界感知：不是只看聊天记录和工具结果，而是结合可穿戴设备的视频、音频以及历史 persona 去判断是否需要主动服务，并配套提出 ContextAgentBench。

![Proactive Agent技术发展梳理：不是更主动，而是更会介入-image-1.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715356656_img-1c58764bab61fe96d37a.png)

紧接着，**FingerTip 20K** 把主动性和个性化一起放进长期手机使用轨迹里，强调用户过去的 intents 和 actions 对未来建议的重要性。到了 2026 年，**ProactiveMobile** 已经把问题进一步形式化为：基于多维设备上下文推断 latent intent，并生成可执行的函数序列。换句话说，主动性开始从 <u>自然语言理解</u> 变成 <u>上下文感知 + 行动生成 </u>的联合任务。

![Proactive Agent技术发展梳理：不是更主动，而是更会介入-image-4.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715415517_img-02f69824e3d5cfeec993.png)

> 评测数据本身也在发生变化。**ProAgentBench** 明确指出，过去很多数据集依赖 LLM 合成样本，缺少真实工作流里的 pre-assistance behavioral context，于是它转向 500 多小时真实用户工作会话和 2.8 万多个事件，显式把 proactive assistance 拆成两层：一层是 timing prediction，另一层是 assist content generation。
> **ProactiveVideoQA** 不再只看回答文本，而是把响应发生的时间也纳入评测，并提出 PAUC 指标；**ProactiveBench** 在多模态场景中测试模型是否会在视觉信息不足时主动请求用户做最小干预：当前 MLLM 普遍缺乏这种主动性，单纯在 prompt 里 提醒模型更主动 只带来很有限的收益；而 **PROBE** 则把 proactive problem solving 拆成搜索未明说的问题、识别具体瓶颈、执行解决三步，说明真正难的不是回答一条明确 query，而是在开放环境里先发现哪里值得解决。近一年这批工作拼在一起，已经把 proactive 的问题边界定义清楚了，它不是 reaction 的加强版，而是 intervention 的建模。

## 二、主动性的核心变量是介入策略

如果只看表面，很多 proactive 工作像是在研究 <u>如何更好地猜用户意图</u>。但从我自己的判断看，近一年真正收敛出来的共识其实是，**最难的不是 goal inference，而是 intervention policy**。

**BAO** 直接把 proactive agent 的训练写成一个多目标优化问题：一边是任务表现，一边是用户参与成本。论文点得很透，更多交互当然可能换来更高的完成质量，但反复向用户索取反馈，也会迅速消耗用户对 agent 能力的信任。**Training Proactive and Personalized LLM Agents** 说明了真实 agent 不能只优化 productivity，还要同时优化 proactivity 和 personalization。这里的 proactivity，不是多说话，而是在真正必要的节点上问出必要的问题。

![Proactive Agent技术发展梳理：不是更主动，而是更会介入-image-3.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715393213_img-0677d31a6dfaa1978eb4.png)

![Proactive Agent技术发展梳理：不是更主动，而是更会介入-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715427146_img-fdf6cf33e8ac54943a06.png)

> 这也是为什么我认为 **clarification 应该被当成 proactive agent 的第一类动作，而不是 fallback**。**IntentRL** 在 deep research 场景里给出的动机非常有代表性：长时研究任务成本高、执行时间长，如果一开始就在模糊需求上盲目开跑，代价往往比多问一句更大。它的核心不是让 agent 少打断用户，而是先把 latent intent 澄清，再进入昂贵的长链条执行。这个思路其实很工程：真正好的主动性，不是省掉所有交互，而是在关键分叉点上，用最小交互换最大确定性。
> **Morae** 则把这个观点推进到了 UI agent 场景。它做的不是更自动，而是更会暂停：在任务执行过程中识别 decision points，然后主动停下来，把选择权还给用户。这个设计对 BLV 用户场景尤其有价值，但它的启发不只在 accessibility。更一般地说，Morae 说明了一个经常被忽视的事实：很多时候，主动性的高质量体现，不是替用户做更多，而是准确识别哪些决策不该替用户做。

## 三、proactive 正在变成 runtime 问题

> 如果论文回答的是 agent 为什么该主动、该怎么学会主动 ，那么 OpenClaw、Hermes 和 ambient agents 这类系统工作的价值，在于它们回答了另一个更落地的问题：**一套真正可长期运行的 proactive agent，到底需要什么样的底层结构。**
> LangChain 的 ambient agents 已经把这件事说得很明确：agent 不应该总靠用户把它拉进一个新对话窗口，而应该持续接收 ambient signals，只在重要机会或必须要反馈时才占用用户注意力。这个定义听起来像产品表达，但本质上是一个系统设计约束：你的 agent 必须是常驻的、可恢复的、可注入上下文的，同时还要有一套可控的打扰机制。
> **OpenClaw** 的价值就在这里。它并没有直接给出一套新的 proactive policy，但它已经把很多主动能力做成了 runtime 默认能力：heartbeat 作为主会话里的周期性 agent turn，默认每 30 分钟跑一次；cron 负责精确调度；standing orders 提供持久化的上下文和授权边界；hooks 响应工具调用、session reset 等事件。更关键的是，OpenClaw 明确区分了 heartbeat 和后台任务：heartbeat 是主会话里的定期观察，不是 detached work ledger。这个区分很专业，因为它把“持续观察”和“异步执行”拆成了两种不同机制。
> **Hermes Agent** 走的是另一条路。它的核心卖点不是 proactive policy，而是 persistent self-improving substrate：封闭学习回路、agent-curated memory、复杂任务后的技能生成、使用中的技能自我改进、跨 session 搜索和总结、长期用户建模，以及自然语言驱动的 cron scheduler。再加上 home channel 这样的消息投递机制，Hermes 已经具备了“长期运行、持续积累、主动回送结果”的底层条件。它和 OpenClaw 的差异在于：前者更像把“成长”做进 agent，后者更像把“常驻运行和调度”做进 agent。二者都覆盖 proactive 的一部分，但都不等于 proactive policy 本身。
> 这一层区分非常重要。过去很多讨论容易把 OpenClaw、Hermes 这类系统，和 proactive benchmark 或 policy work 混成一件事。其实它们解决的是不同层面的难题。前者解决的是 **常驻、调度、状态保持、上下文注入、消息交付**；后者解决的是 **是否该打断用户、该提醒还是追问、该不该先做一半再等确认**。从这个角度看，下一代真正有竞争力的 proactive agent，很可能不会来自某一篇单独的 benchmark 论文，也不会来自某一个单独的 runtime，而是来自两者的结合：系统层提供稳定的长期运行框架，算法层提供可学习的介入策略。

## 四、接下来真正值得做的

> 第一，**离线反事实评估会成为 proactive agent 的关键基础设施**。
> 今天很多 benchmark 已经证明，真实行为轨迹和 stateful environment 比静态样本更重要。**ProAgentBench** 通过真实工作会话把 pre-assistance context 带回来了，**Pare** 则更进一步，直接批评把 app 扁平化成 tool API 会低估主动介入的难度，于是改用 FSM 和 active user simulation 来建模环境。下一步真正缺的，不再是“多造几个样本”，而是如何从历史行为链里估计：如果当时 agent 介入了，用户会不会接受；如果没有介入，是否真的错过了高价值闭环。这本质上是一个 counterfactual policy evaluation 问题。
> 第二，**interruptibility 建模会比 intent 建模更稀缺，也更值钱**。
> 现在很多工作都在建模“用户想做什么”，但产品里更难的问题其实常常是“用户现在愿不愿意被打断”。为什么同样一句建议，在一个时刻被认为很贴心，换个时刻就变成噪音？这件事在 **BAO**、**Morae** 以及 LangChain 的 ambient agents 定义里其实已经出现了同一个答案：主动性的成本，不是语义错误，而是注意力占用。谁先把任务负载、交互阶段、当前焦点窗口、失败代价和历史容忍度纳入统一时机模型，谁就更接近真正可用的 proactive agent。
> 第三，**memory 的对象需要被重写**。
> 今天很多 agent memory 还主要存 profile、偏好和历史事实。但对 proactive agent 来说，更有价值的往往不是“用户喜欢什么”，而是“系统还欠用户什么”。换句话说，未来的长期记忆里应该有一类一等公民式的 pending commitments：没做完的任务、做到一半等待确认的任务、用户提过但尚未闭环的意图。OpenClaw 的 standing orders 和 heartbeat，Hermes 的 memory、skills、cross-session recall，都已经为这种方向提供了工程抓手，但研究上对这类 pending-state memory 的建模还远远不够。
> 第四，**clarification 将逐渐从“能力不够”的信号，变成“策略成熟”的信号**。
> 这一点在近一年的工作里已经越来越明显：**IntentRL** 把澄清当作 deep research 前的必要动作，**PPP** 把 ask-user 行为正式纳入多目标优化，**Morae** 用主动暂停来维护用户决策权，**ChatGPT agent** 也明确把“必要时主动追问”作为交互能力的一部分。未来成熟的 proactive agent，不会以“从不问问题”为荣，而会以“只在最关键的节点问最少的问题”为荣。
