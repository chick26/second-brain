---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "RL又整花活，Rubric for Non-Verifiable RL 是个啥"
source: feishu-export
imported: 2026-05-24
---

## 背景与定义

> RL在可验证任务中通过自动打分信号（如单元测试、标准答案）进行优化，取得了显著成果。
> 然而，对于开放式、主观性的任务通常缺乏唯一正确答案，无法直接得出明确奖励。在此类任务中，我们常用RLHF或问答式评估来提供反馈，但这些方法往往依赖难以解释的奖励模型且样本成本高。Rubric在此背景下被引入：Rubric 是一组明确的评价准则，将“优质答案”的标准分解为具体、可检验的子目标。通过rubric，可以将多样化的主观评判转化为结构化的奖励信号，为不可验证任务提供了新的可训练目标。

## Rubric的价值

![RL又整花活，Rubric for Non-Verifiable RL 是个啥-image-2.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715974094_img-2b36a11a5a7f6ba8682b.png)

> Rubric 将复杂的质量判断拆分成可理解的评价标准，弥补了二元正确性信号与粗糙偏好打分之间的空白。在缺乏唯一标准答案的场景下，rubric可以提供细化的、多维度的奖励反馈；例如，一道医学问答可以设立多个Rubric项并按权重计算最终得分。相对于黑盒的奖励模型，Rubric的规则明确、可解释，能更好地捕捉专家意图和细粒度细节。
> 在实践中，Scale AI 等机构发现，Rubrics as Rewards在健康与科研问答等领域能获得显著提升使用Rubric作为奖励可让较小规模的Judger也更贴合人类偏好。
> 此外，Anthropic 的Constitutional AI实践也表明，仅通过一系列明确的规则或准则（类似rubric原则），在几乎无需大量人工标注的情况下也能训练出“无害”的对话模型。综上，Rubric为不可验证任务引入了结构化、多维且可解释的评价信号，帮助模型在复杂开放领域实现有效对齐。

* 下面给出一个“Curing Miracle Steps in LLM Mathematical Reasoning with Rubric Rewards”这篇论文中的一个具体的prompt便于大家理解：

```python
你是一个数学解题评审者。你将收到一个数学题目和一个模型给出的回答，该回答包括完整的推理步骤。请根据以下 Rubric 对该回答进行评分（0–1 分），同时指出推理中是否有逻辑漏洞或“跳步”（Miracle Steps）。

Rubric 标准：
1. 正确性（Correctness of final answer）：答案是否正确。
2. 步骤连贯性（Step-by-step coherence）：每一步推理是否基于前一步且逻辑清晰。
3. 论证完整性（Completeness of reasoning）：是否覆盖从题目到结论所需的关键中间步骤，不省略重要逻辑。
4. 严谨性（Rigor）：是否避免了从直觉／暗示跳过检验／未标明假设等行为。
5. 可读性与格式（Readability and format）：步骤是否清晰可读、格式清晰。

请对每个标准给出分数（例如 0.0, 0.25, 0.5, 0.75, 1.0），再加权得出总分，并简要说明扣分原因（例如在哪一步跳步了、哪些是假设没说明等）。

题目：
<数学题目>

模型回答：
<模型推理过程与答案>
```

## 主流方案拆解

* **RaR：** Rubric 作为奖励，将结构化的Checklist式Rubric直接用作可解释的奖励信号，用于Policy的 on-policy 训练。其核心是为每个prompt生成一组Rubric项，并用强大的 LLM 作为 Judger 分别对每个项目做二分类评分，最终按权重聚合得分。

![RL又整花活，Rubric for Non-Verifiable RL 是个啥-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783644693_img-fded34e7e1b7375678a8.png)

* **RLAIF：** 在无人工标注情况下，使用现成的大语言模型自动生成偏好数据并训练奖励模型。具体流程先由初始模型生成候选答案，再让另一个模型或同一个模型根据固定准则对答案打分，形成偏好标签，接着用这些标签训练奖励模型并进行RL微调。这种方法将人工反馈替换为自动规则或模型评估，显著降低了对人工标注的依赖。

![RL又整花活，Rubric for Non-Verifiable RL 是个啥-image-4.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782784019688_img-9f67b58210aa6720d25c.png)

* **Rubric Anchors：** 构建了迄今最大的Rubric库（10000+条），并提出“Rubric驱动RL”框架。其Open-source的Qwen-30B-A3B模型在仅5K样本的微调条件下，通过引入人工/LLM生成的Rubric作为奖励，实现了多项开领域任务（尤其是人文方向）的性能提升。同时，利用Rubric作为风格锚点，有效减轻了大模型“公式化”语气，让生成回答更具人类表达特征。这表明Rubric不仅能优化模型对任务的理解，也可用于调整生成风格。

![RL又整花活，Rubric for Non-Verifiable RL 是个啥-image-3.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782783945475_img-1d074c966918c470b151.png)

* **OnlineRubrics：** 动态Rubric生成。这一方法在线采样模型输出与参考输出的对比，通过LLM自动“反演”出新的评价标准，并将这些新准则加入Rubric中进行训练。具体地，在RL训练循环中，对比当前策略输出和参考答案，LLM会提炼出新的Rubric条目，补充到原有标准里。

![RL又整花活，Rubric for Non-Verifiable RL 是个啥-image-1.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715915581_img-2ae4674d981b929cbe9f.png)

## Rubric设计要点

> **Rubric构造要点：** 设计Rubric时应尽量使每条评估标准独立、明确且可自动判定。例如，可以将“答题正确性”、“论据充足性”、“表达清晰度”等作为独立条目，并为其分配合理权重。条目数量要适中，过多会导致训练稀疏，过少又难以覆盖回答质量的各个方面。Rubric文本应简洁易懂，可由领域专家提供，也可借助强大的LLM（结合参考答案或先验知识）生成并筛选。此外，还应注意避免多个条目指标重复或互相矛盾，并在训练前进行小规模验证（消歧义、调整权重）。例如，OpenRubrics项目提倡将硬性规则（hard rules）和原则（principles）区分出来，使用对比生成的Rubric策略提高鲁棒性。**评估机制：** 在训练过程中，模型会根据Rubric输出得分并优化策略，因此应定期监控Rubric得分和其他外部指标（如人工评价、一致性测试等）。常见做法是保持一个验证集，通过应用Rubric或直接人工打分来评估模型回答质量是否随训练稳定提升。若模型出现“过度优化”（reward hacking）现象，可以引入额外Rubric条目或惩罚机制。例如，\[44]中的方法通过动态添加Rubric来补全评估盲点，从而减少模型利用旧Rubric“侥幸得分”的行为。**收敛性：** Rubric导向的RL通常结合PPO/GRPO等算法，可以监测训练曲线和KL散度等指标确保训练稳定。合理的KL惩罚系数和小步长能避免策略崩溃。在收敛后，优质策略应该在Rubric得分和人类评估指标上都达到稳定的较高水平。

```python
policy = initialize_model()
judge = LLM_Judge(rubric)
for epoch in range(N):
    samples = policy.sample(prompts)
    rewards = [judge.score(s) for s in samples]
    policy = PPO_update(policy, samples, rewards, kl_coeff)
```

上述流程中，`judge.score()`可针对每个Rubric条目分别评分并加权求和，或让LLM综合评分。具体实现时，可利用HuggingFace TRL、OpenAI Gym 等RL框架，将Rubric评判器作为自定义奖励函数插入训练管道。

## 工程实现

> * **Rubric 结合现有框架：** 在工程实现上，可将Rubric表达为JSON/YAML格式（列出条目和权重），并使用API自动化打分。已有开源项目（如OpenRubricRL）提供了Rubric到LLM提示的转换接口，方便在训练中调用。HuggingFace TRL、RLlib等RL库可配合Rubric奖励一起使用。通常流程是：先对LLM做监督微调，然后使用Rubric奖励做RL微调（Policy训练），最后验证策略性能。
> * **调优与迭代：** 在训练过程中应关注生成样本的多样性并防止极端偏置。实践中常采用 **best-of-N** 采样策略增强探索能力，同时使用Rubric自带的多维度评价减少模型“死板”地优化单个维度。比如，在HealthBench上对Qwen模型进行Rubric RL时，使用了少量示例和最优值取样（best-of-N），模型在Hard集上的表现超过了GPT-5。此外，可定期通过人工或更大模型评估，检查Rubric训练是否带来意料之外的副作用（如过度关注格式而忽略内容）。

## 小结

> Rubric-guided强化学习为处理开放领域任务提供了新的思路：它以可解释、可扩展的多维评价标准填补了传统RLHF与可验证RL之间的空白。近年来，大量研究表明，Rubric可以稳定地提升模型表现并控制生成风格。未来，随着Rubric生成和评分技术的发展，可以预见：一方面，自动化Rubric生成（如OpenRubrics的对比生成技术）和在线Rubric更新将使系统能自适应地发现新的评价维度；另一方面，多语种Rubric评价模型（如mR3）和更鲁棒的评分机制（如R3框架）将进一步提高评价的一致性和可迁移性。此外，将Rubric方法与其他对齐手段（如人类偏好学习、规则推理）结合，会形成更加完整的对齐策略。
