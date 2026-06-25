---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "On-Poilcy Distillation"
source: feishu-export
imported: 2026-05-24
---

## 1. 为什么一开始没有 OPD？

**传统蒸馏默认是 i.i.d. 分类问题**

知识蒸馏最早不是为序列决策设计的。Hinton 的经典 KD 设定更接近分类：teacher 给 soft label，student 用温度软化后的概率分布去拟合 teacher。这里的基本假设是：输入样本 $x$ 来自一个固定数据集，student 只需要学习 $p_T(y|x)$。

经典 KD 目标可以写成：

$$\mathcal{L}_{KD} =
\tau^2 \cdot
KL
\left(
p_T^\tau(\cdot|x)
\|
p_\theta^\tau(\cdot|x)
\right)$$

其中,$$p_T^\tau(y|x) =
\frac{\exp(z_T(y|x)/\tau)}
{\sum_{y'}\exp(z_T(y'|x)/\tau)}$$

$\tau$ 是 temperature。温度越高，teacher 分布越平，student 能看到更多暗知识：不只是正确类别是什么，还能看到错误类别之间的相对关系。

这个阶段的蒸馏有一个隐含前提：

> student 的预测不会改变下一个训练样本。

图像分类里，模型把猫识别成狗，不会导致下一张图片变成狗。

但序列生成不是这样。语言模型第 $t$ 步生成错 token，第 $t+1$ 步的输入 prefix 就已经变了。

这就是传统 KD 到序列模型时的第一个裂缝。

## 2. 序列模型的问题：teacher forcing 为什么会产生 exposure bias？

在 autoregressive 模型里：$$p_\theta(y|x) =
\prod_{t=1}^{T}
p_\theta(y_t|x,y_{<t})$$

训练 SFT 时，我们通常使用 teacher forcing：$$\mathcal{L}_{SFT} =
-\sum_{t=1}^{T}
\log p_\theta(y_t^\star|x,y_{<t}^\star)$$

注意这里的 prefix 是 gold prefix：$y_{<t}^\star$

但推理时 prefix 是模型自己生成的：$\hat{y}_{<t} \sim p_\theta$

训练时条件分布是：$p_\theta(y_t|x,y_{<t}^\star)$

推理时条件分布是：$p_\theta(y_t|x,\hat{y}_{<t})$

这两个状态分布不一样。只要前面某一步出错，后面模型就进入训练时没有见过的区域。

所以，早期大家其实已经意识到这个问题，只是当时不一定叫 OPD。它有几个名字：

1. imitation learning 里叫 learner-induced state distribution；
2. seq2seq 里叫 exposure bias；
3) RL 里叫 on-policy / off-policy mismatch；
4) LLM 蒸馏里叫 train-inference mismatch。

OPD 不是凭空冒出来的，它是这些问题在 LLM 蒸馏语境下的重新统一。

## 3. 早期 OPD 思想的来源：DAgger 不是蒸馏论文，但它是 OPD 的地基

如果只看 LLM paper，会误以为 OPD 是 2023 年后才出现的新东西。其实更早的根在 imitation learning，尤其是 DAgger。

行为克隆，也就是 Behavior Cloning，可以写成：$$\min_\theta
\mathbb{E}_{s\sim d_{\pi_E}}
\left[
\ell(\pi_\theta(s), \pi_E(s))
\right]$$

其中：

* $\pi_E$：expert policy；
* $\pi_\theta$：learner policy；
* $d_{\pi_E}$：expert 诱导出的状态分布。

问题在于部署时 learner 遇到的是：$s \sim d_{\pi_\theta}$,而不是：$s \sim d_{\pi_E}$。这就是状态分布错位。DAgger 的做法很直接：

1. 先用 expert 数据训练 learner；
2. 让 learner 自己跑，访问自己的状态分布；
3) 在 learner 到达的状态上询问 expert 应该怎么做；
4) 把这些新状态加入训练集；
5. 迭代。

形式上可以写成：

$$\mathcal{D}_{i} =
\mathcal{D}_{i-1}
\cup
\{(s, \pi_E(s)) : s \sim d_{\pi_{\theta_i}}\}$$

然后重新训练：

$$\pi_{\theta_{i+1}} =
\arg\min_{\pi}
\sum_{(s,a)\in \mathcal{D}_i}
\ell(\pi(s),a)$$

这已经非常接近 OPD 的精神了：

> learner 先暴露自己的错误状态，expert 再在这些状态上给监督。

DAgger 的重点不是蒸馏，而是把 imitation learning / structured prediction 归约到 no-regret online learning，并强调要在 learner 自己诱导出的状态分布下获得好策略。

这也是为什么我认为 OPD 的底层思想不是 KD，而是 **interactive imitation learning**。

## 4. 早期 Policy Distillation：有“蒸馏”，但多数不是今天意义上的 OPD

2015 年 DeepMind 的 Policy Distillation 把 RL teacher 的策略压缩到 student 里，场景是 Atari。它可以把单任务 DQN teacher 蒸馏到小模型，也可以把多个 task-specific teacher 合并到一个 multi-task student。

典型 policy distillation 目标可以写成：$$\mathcal{L}_{PD} =
KL
\left(
\pi_T(\cdot|s)
\|
\pi_\theta(\cdot|s)
\right)$$

或者对 Q-value 做 softmax 后蒸馏：$$\pi_T(a|s) =
\frac{\exp(Q_T(s,a)/\tau)}
{\sum_{a'}\exp(Q_T(s,a')/\tau)}$$

然后 student 学 teacher policy。

这类工作有蒸馏，也有 policy，但它和今天 LLM OPD 还不是一回事。关键差异在于：早期 policy distillation 的状态 $s$ 往往来自 replay buffer、teacher policy 或环境采样，不一定是 student 当前 policy 实时诱导出的分布。

也就是说，它更像：$$s \sim d_{\pi_T}
\quad \text{or} \quad
s \sim \mathcal{B}$$

而 OPD 更强调：$s \sim d_{\pi_\theta}$

所以要区分两个概念：

| 概念 | 是否蒸馏 | 是否 on-policy |
| ------------------- | ------ | ------------ |
| KD | 是 | 通常否 |
| Policy Distillation | 是 | 不一定 |
| DAgger | 不一定叫蒸馏 | 是 |
| LLM OPD | 是 | 是 |

早期真正提供 OPD 思想的是 DAgger 这类 on-policy imitation learning；早期真正提供“蒸馏 policy”技术的是 policy distillation；LLM OPD 是这两条线的汇合。

## 5. SeqKD：NLP 蒸馏曾经走过一条更 off-policy 的路

在 NMT 时代，Sequence-Level Knowledge Distillation 很重要。核心做法是：teacher 先生成完整翻译，再用 teacher 生成的 sequence 训练 student。

SeqKD 的目标不是拟合每个 token 的 teacher distribution，而是把 teacher 的输出当作伪标签：

$$\mathcal{D}_T =
\{(x, \hat{y}_T)\}$$

$$\mathcal{L}_{SeqKD} =
-\log p_\theta(\hat{y}_T|x)$$

这个方法很实用，因为 teacher 生成的答案通常更规整、低熵，student 学起来比学人工数据更容易。

但它的问题也很明显：

> student 训练时仍然只看 teacher 轨迹，而不是 student 自己的轨迹。

也就是说：

$y_{<t} \sim \pi_T$

而不是：

$y_{<t} \sim \pi_\theta$

这就给后来的 GKD / OPD 留下了空间。

## 6. LLM 时代为什么 OPD 突然重要？

LLM 时代有三个变化，让 OPD 的价值变大了。

第一，输出长度变长。

NMT 时代可能几十个 token，reasoning 模型动辄几千 token。序列越长，早期错误越容易造成后续状态偏移。

第二，teacher 和 student 能力差距更大。

大模型 teacher 能生成很复杂的 CoT，但小模型 student 未必能稳定走在相同 reasoning manifold 上。off-policy 模仿 teacher 漂亮答案，容易学成“表面格式”，但推理时一旦走偏，就回不来。

第三，RL 成本太高。

RL 当然是 on-policy，但 reward sparse、方差大、训练系统复杂。OPD 提供了一个折中：它使用 student rollout，但 teacher 给 dense supervision。

这就是 LLM OPD 的位置：

```plain
SFT：稳定，但 off-policy
Off-policy KD：便宜，但分布错位
RL：on-policy，但稀疏、高方差、贵
OPD：on-policy + dense teacher signal
```

它不是 RL 的替代品，而是 SFT/KD 和 RL 之间的一层。

## 7. 形式化：OPD 到底优化什么？

设 prompt 为 $x$，student 为 $\pi_\theta$，teacher 为 $\pi_T$。序列为：$y=(y_1,\dots,y_T)$

autoregressive policy：$$\pi_\theta(y|x) =
\prod_{t=1}^{T}
\pi_\theta(y_t|x,y_{<t})$$

令状态：$s_t = (x,y_{<t})$

### 7.1 Off-policy KD

off-policy KD 的状态来自固定数据或 teacher：$y \sim q(y|x)$

其中 $q$ 可以是：$q = \mathcal{D}, \quad q=\pi_T, \quad q=\text{cached teacher outputs}$

目标：$$\mathcal{L}_{off} =
\mathbb{E}_{x\sim \mathcal{D}, y\sim q}
\left[
\sum_t
D
\left(
\pi_T(\cdot|s_t)
\|
\pi_\theta(\cdot|s_t)
\right)
\right]$$

问题是：训练状态分布是 $d_q$，部署状态分布是 $d_{\pi_\theta}$。

### 7.2 On-policy Distillation

OPD 把轨迹来源换成 student：$y \sim \pi_\theta(\cdot|x)$

目标：$$\mathcal{L}_{OPD} =
\mathbb{E}_{x\sim \mathcal{D}, y\sim \pi_\theta}
\left[
\sum_t
D
\left(
\pi_T(\cdot|s_t)
\|
\pi_\theta(\cdot|s_t)
\right)
\right]$$

更一般地：$$\mathcal{L}_{OPD}^{f} =
\mathbb{E}_{x\sim \mathcal{D}, y\sim \pi_\theta}
\left[
\sum_t
D_f
\left(
\pi_T(\cdot|s_t)
\|
\pi_\theta(\cdot|s_t)
\right)
\right]$$

这里 $D_f$ 可以是 forward KL、reverse KL、JS、Hellinger、total variation、$\alpha$-divergence 等。关键点是：

> OPD 的本质不是选了哪个 $D_f$，而是外层期望来自 $\pi_\theta$。

这也解释了为什么 OPD 比普通 KD 难：因为采样分布本身依赖 $\theta$。

## 8. OPD 的梯度为什么麻烦？

如果 loss 是：$$\mathcal{L}(\theta) =
\mathbb{E}_{y\sim \pi_\theta} [
\ell_\theta(y)
]$$

那么梯度是：$$\nabla_\theta \mathcal{L} =
\nabla_\theta
\sum_y
\pi_\theta(y)\ell_\theta(y)$$

展开：$$\nabla_\theta \mathcal{L} =
\sum_y
\nabla_\theta \pi_\theta(y)\ell_\theta(y) +
\sum_y
\pi_\theta(y)\nabla_\theta \ell_\theta(y)$$

利用：$$\nabla_\theta \pi_\theta(y) =
\pi_\theta(y)\nabla_\theta \log \pi_\theta(y)$$

得到：$$\nabla_\theta \mathcal{L} =
\mathbb{E}_{y\sim \pi_\theta}
\left[
\ell_\theta(y)
\nabla_\theta \log \pi_\theta(y) +
\nabla_\theta \ell_\theta(y)
\right]$$

这里第一项就是 score-function / REINFORCE 风格项。它通常高方差。

这就是 OPD 的根本困难：on-policy 带来了分布对齐，但也让优化不再像普通 supervised learning 那样简单。

很多后续工作，本质上都是在处理这件事：

* 怎么降低 on-policy 梯度方差；
* 怎么避免 teacher serving 成本爆炸；
* 怎么用 surrogate loss 近似原始 OPD；
* 怎么在 stale rollout / replay buffer 上仍然稳定训练；
* 怎么选择合适的 divergence。

## 9. 正 KL、反 KL 和 f-divergence：不要只记 mode-covering / mode-seeking

很多笔记讲正反 KL，只会写两句话：

* Forward KL：mode-covering；
* Reverse KL：mode-seeking。

这太粗。对 OPD 来说，正反 KL 的差异至少要从四个角度看：

1. 惩罚区域不同；
2. 采样估计方式不同；
3) 对 student 容量的要求不同；
4) 对生成任务的风险不同。

下面详细拆。

### 9.1 Forward KL：让 student 覆盖 teacher 的概率质量

设 teacher 分布为 $P=\pi_T$，student 分布为 $Q=\pi_\theta$。

Forward KL 是：

$$KL(P\|Q) =
\sum_y
P(y)
\log
\frac{P(y)}{Q(y)}$$

放到蒸馏里就是：

$KL(\pi_T\|\pi_\theta)$

它的梯度直觉是：teacher 认为有概率的地方，student 也必须给概率。

如果某个 token：

$P(y)>0,\quad Q(y)\to 0$

那么：

$$P(y)\log\frac{P(y)}{Q(y)}
\to \infty$$

所以 Forward KL 强烈惩罚 student 漏掉 teacher 的支持集。

这就是 mode-covering 的来源。

#### Forward KL 的优点

它适合 teacher 分布本身具有多模态、多答案、强不确定性的场景。比如开放问答、创作、对话、翻译，多种表达都合理。这时你不希望 student 只学一个 sharp mode，而是希望它覆盖 teacher 的合理输出空间。

Forward KL 也更接近传统 KD / soft-label CE：$$KL(P\|Q) =
\mathbb{E}_{y\sim P} [
\log P(y)-\log Q(y)
]$$

其中 $\log P(y)$ 对 student 是常数，所以优化等价于：$$-\mathbb{E}_{y\sim P} [
\log Q(y)
]$$

也就是 teacher soft label cross entropy。

#### Forward KL 的问题

第一，它可能让小模型浪费容量。teacher 的长尾分布很丰富，小模型容量不够时，强行覆盖长尾会导致头部 mode 学不尖。

第二，它容易让 student 在 teacher 低概率区域也给过多概率。MiniLLM 的核心动机就是认为 forward KLD 会导致 student overestimate teacher 的低概率区域，所以改用 reverse KLD。

第三，在 reasoning 任务里，很多 token 不是“多种都可以”，而是中间步骤错了就会推歪。此时过度 mode-covering 可能不如 mode-seeking。

一句话：

> Forward KL 更适合“多样性和覆盖性重要”的任务；不适合小模型容量紧张、需要 sharp reasoning path 的任务。

### 9.2 Reverse KL：让 student 避免 teacher 低概率区域

Reverse KL 是：$$KL(Q\|P) =
\sum_y
Q(y)
\log
\frac{Q(y)}{P(y)}$$

放到蒸馏里：$KL(\pi_\theta\|\pi_T)$

它的惩罚逻辑反过来：student 给概率的地方，teacher 必须也认可。

如果：$Q(y)>0,\quad P(y)\to 0$

那么：$$Q(y)\log\frac{Q(y)}{P(y)}
\to \infty$$

所以 Reverse KL 会强烈惩罚 student 把概率放到 teacher 认为不可能的区域。

这就是 mode-seeking 的来源。

#### Reverse KL 的优点

它适合小模型蒸馏。因为小模型容量有限，与其让它覆盖 teacher 的所有长尾，不如让它集中学 teacher 最确定、最高质量的模式。

它也适合 reasoning/code/math。因为这些任务很多时候不是“多样表达越多越好”，而是“走一条可靠路径更重要”。

#### Reverse KL 的问题

第一，它容易 mode collapse。teacher 可能认为多个答案都合理，但 student 只学一个。

第二，它容易过度自信。尤其在开放生成任务中，student 会变得更窄，输出风格更单一。

第三，on-policy reverse KL 的优化更难。因为：

$$KL(\pi_\theta\|\pi_T) =
\mathbb{E}_{y\sim \pi_\theta}
\left[
\log \pi_\theta(y) -
\log \pi_T(y)
\right]$$

外层采样来自 student，自然出现 policy gradient 项。

一句话：

> Reverse KL 更适合“要学尖、学准、学 teacher 高置信模式”的任务；但会牺牲覆盖性和多样性。

### 9.3 JS Divergence：更平衡，但梯度可能不够有力

JS divergence 可以写成：$$JS(P\|Q) =
\frac{1}{2}
KL(P\|M) +
\frac{1}{2}
KL(Q\|M)$$

其中：$M=\frac{1}{2}(P+Q)$

它是对称的，比 KL 更平滑，也有上界。直观上，它不像 Forward KL 那么强迫覆盖 teacher 全部分布，也不像 Reverse KL 那么强烈 mode-seeking。

在 OPD 里，JS 适合做温和对齐：

* teacher 和 student 差距不太大；
* 需要避免 KL 极端惩罚；
* 不希望 student 完全坍缩到 teacher 单一 mode；
* 不希望 teacher 长尾过度支配训练。

但 JS 的问题是：当两个分布差距很大时，梯度可能不如 KL 直接。对于 strong-to-weak distillation，teacher 和 student 早期差异很大，JS 可能过于温和。

所以 JS 更像稳定器，不一定是主力 loss。

### 9.4 $\alpha$-divergence：在覆盖和尖锐之间连续插值

$\alpha$-divergence 可以理解为一族在 Forward KL 和 Reverse KL 之间插值的散度。不同定义略有差异，但直觉一致：

* 某些 $\alpha$ 区间更偏 mass-covering；
* 某些 $\alpha$ 区间更偏 mode-seeking；
* 可以通过 $\alpha$ 控制 student 是更保守还是更尖锐。

这点对 OPD 很重要。因为 OPD 也经常要做 importance weighting：

$$\rho(y) =
\frac{\pi_\theta(y)}{\beta(y)}$$

其中 $\beta$ 可能是旧 student、replay buffer policy 或 inference engine 采样策略。长序列下：$$\rho(y) =
\prod_t
\frac{\pi_\theta(y_t|s_t)}
{\beta(y_t|s_t)}$$，方差会爆炸。

所以在 LLM OPD 里，$\alpha$-divergence 或 f-divergence 的选择，不只是“分布几何”的问题，也是“估计方差”的问题。

### 9.5 Skew KL：DistiLLM 为什么要这么做？

DistiLLM 的核心是 skew KL。它不是为了数学优雅，而是为了工程稳定。

它构造混合分布：$$M_\alpha =
\alpha P +
(1-\alpha)Q$$

然后做类似：$KL(P\|M_\alpha)$ 或相关 skew 形式。

为什么这样有用？因为原始 KL 在 $P$ 和 $Q$ 支持集差异大时可能惩罚过强，尤其是 on-policy student samples 早期质量差、teacher 和 student 分布差距大的时候。混合分布 $M_\alpha$ 起到缓冲作用：既保留 teacher 引导，又不让 loss 在极端概率比下炸掉。

所以 DistiLLM 的意义不是“又提出一个散度”，而是：

> MiniLLM 证明 reverse KL 对生成蒸馏更合适；DistiLLM 进一步说明，工业训练中需要更低方差、更稳定、更可缓存的 KL surrogate。

## 10. 怎么选 divergence？按任务和训练阶段选



| 散度 | 行为 | 优点 | 风险 | 更适合场景 |
| --- | --- | --- | --- | --- |
| Forward KL KL(T\|S) | mode-covering | 覆盖 teacher 多样性，稳定，接近传统 KD | 小模型浪费容量，容易学长尾噪声 | 翻译、开放问答、对话、多答案任务 |
| Reverse KL KL(S\|T) | mode-seeking | 学 teacher 高置信模式，输出更尖锐 | mode collapse，过度自信，方差大 | 数学、代码、强 reasoning、小模型蒸馏 |
| JS | 对称、平滑 | 稳定，不极端 | 分布差距大时梯度可能弱 | teacher/student 接近，做温和对齐 |
| $\alpha$-divergence | 可调覆盖/尖锐 | 可连续调节训练行为 | 超参敏感，IS 方差问题 | 需要阶段性调节的 OPD |
| Skew KL | 缓冲极端概率比 | 更稳定，工程友好 | 目标更启发式 | 大规模 autoregressive 蒸馏 |
| Hellinger / TV | 有界/鲁棒 | 对极端概率不敏感 | 梯度可能不够细 | 噪声 teacher、黑盒打分、稳健对齐 |



> 如果任务是“答案空间很窄”，优先考虑 RKL / sampled-token log-prob gap / reward-like OPD。
> 如果任务是“表达空间很宽”，优先考虑 FKL / SKL / entropy-aware mixture。
> 如果 teacher 和 student 差距很大，别一上来 pure RKL，先用 off-policy 或 FKL warmup。
> 如果进入 agent/tool-use，先解决 step-level 状态可靠性，再谈散度。

## 11. GKD：现代 LLM OPD 的起点

GKD，也就是 Generalized Knowledge Distillation，基本把 LLM OPD 的问题定义清楚了。

它指出：当前 KD 方法在 autoregressive sequence model 上存在 output sequence distribution mismatch。student 训练时看到的是固定输出序列，推理时生成的是自己的序列。GKD 不再只依赖固定输出，而是在 student self-generated outputs 上利用 teacher feedback 训练 student，同时还支持不同 loss，并能和 RLHF 结合。

GKD 可以写成一个混合轨迹框架：$y \sim \lambda \pi_\theta + (1-\lambda)q$

其中：

* $\lambda=0$：纯 off-policy；
* $\lambda=1$：纯 on-policy；
* 中间值：混合 student rollout 和固定数据。

这个设计非常务实。因为纯 OPD 早期不稳定，student 太弱时 rollout 质量差；纯 off-policy 又有分布错位。混合策略可以作为 curriculum。

GKD 的意义不是提出某个最强 loss，而是提出一个大框架：

> student 应该从自己的错误里学习，而 teacher 的作用是在 student 的错误状态上提供修正信号。

这句话就是 OPD 的核心。

## 12. MiniLLM：为什么大模型蒸馏要重视 Reverse KL？

MiniLLM 更进一步，把问题聚焦到“LLM 生成蒸馏到底应该用什么 KL”。

标准 KD 多用 Forward KL：$KL(\pi_T\|\pi_\theta)$

MiniLLM 认为这不适合 generative LLM，因为它会让 student 高估 teacher 低概率区域。于是它改用 Reverse KL：

$KL(\pi_\theta\|\pi_T)$

这个工作的重要性在于它把三个东西连起来了：

```plain
generative KD
→ reverse KL
→ on-policy optimization
```

但 MiniLLM 的问题也很明显：RKL 的 on-policy 优化有高方差。理论上漂亮，工程上不一定最舒服。

可以这样理解 MiniLLM：

> 它把 OPD 从“应该让 student 自己生成”推进到“在 student 自己生成的分布上，应该用更适合生成任务的 reverse KL”。

## 13. DistiLLM：OPD 工程化的关键不是更强，而是更稳

DistiLLM 看到的问题是：student-generated outputs 能缓解 train-inference mismatch，但计算成本明显上升。它提出 skew KL 和 adaptive off-policy approach，让蒸馏更高效。

这背后有一个很重要的工程判断：

> 纯 on-policy 不一定是最优工程解。
> 只要能控制分布偏移，半 on-policy / adaptive off-policy 往往更划算。

这和 RL 系统里常见的经验一致：完全 fresh rollout 最干净，但最贵；replay buffer / stale rollout 有偏，但便宜。关键是偏差和方差的 trade-off。

所以 DistiLLM 的价值不是“打败 MiniLLM”，而是把 OPD 拉回现实：

1. loss 要低方差；
2. teacher 调用要可控；
3) student-generated data 要高效利用；
4) 不要迷信纯在线。

## 14. LLM 技术报告里的 OPD：它已经变成后训练流水线的一层

近一年高质量模型报告里，OPD 不再只是 paper idea，而是后训练 recipe 的一部分。

Qwen3、MiMo、GLM、Nemotron 等模型报告里的共同趋势是：OPD 不再只是“teacher 压 student”，而是在多阶段后训练里做能力搬运、能力融合、能力恢复。

它有三种典型用法：

1\. **strong-to-weak distillation**：大 teacher 下放 reasoning 能力；

2\. **multi-teacher fusion**：多个领域 teacher 汇聚到一个 student；

3\. **recovery OPD**：RL 或多阶段训练后，用 teacher/checkpoint pool 把退化能力拉回来。

这和早期 KD 的“压缩模型”已经不是一个层次了。

## 15. OPD 和 RL 的关系：它不是 RL 的替代，而是 dense reward imitation

很多人会问：既然 student rollout 是 on-policy，那 OPD 和 RL 有什么区别？

区别在监督信号。

RL 通常是：

$$\max_\theta
\mathbb{E}_{y\sim \pi_\theta} [
R(x,y)
] -
\beta KL(\pi_\theta\|\pi_{ref})$$

其中 $R(x,y)$ 是 outcome reward，通常稀疏。

OPD ：$$\min_\theta
\mathbb{E}_{y\sim \pi_\theta}
\left[
\sum_t
D(\pi_T(\cdot|s_t)\|\pi_\theta(\cdot|s_t))
\right]$$

teacher 提供 token-level 或 step-level dense signal。

如果把 teacher log-prob 看成 reward：

$$r_t =
\log \pi_T(y_t|s_t)$$

那么 OPD 可以被重写成一种 dense reward RL：

$$\max_\theta
\mathbb{E}_{y\sim \pi_\theta}
\left[
\sum_t
\log \pi_T(y_t|s_t)
\right] +
\text{regularization}$$

所以 OPD 和 RL 的边界不是绝对的。

更准确地说：

```plain
SFT：gold token supervision
KD：teacher distribution supervision
OPD：student-state teacher supervision
RL：student-state reward supervision
```

OPD 是 imitation-like RL，或者 RL-like distillation。它比 SFT 更 on-policy，比 RL 更 dense。

## 16. OPD 的主要问题：不是“有没有效果”，而是何时会坏

OPD 的好处很直观，但风险也很真实。

### 16.1 student 太弱时，on-policy 状态质量太差

如果 student rollout 全是低质量 prefix，teacher 在这些状态上给监督，未必能救回来。

这类似 DAgger 的早期问题：learner policy 太差时，访问到的状态可能太偏，expert label 虽然正确，但学习效率低。

所以 OPD 通常需要 cold start：

```plain
SFT / off-policy KD
→ mixed OPD
→ pure or stronger OPD
```

一上来 pure OPD，往往不稳定。

### 16.2 teacher 在错误状态上不一定可靠

这是 agent/tool-use 场景尤其严重的问题。

普通文本生成中，student prefix 错了，teacher 还能给出某种合理 continuation。

但工具调用不同。假设 student 错调了一个工具，环境返回了错误 observation，后续状态已经偏离真实任务轨迹。teacher 在这个错误 observation 上继续给 token-level 监督，可能是在错误世界里“认真纠错”，结果反而固化错误轨迹。

这就是为什么 agentic OPD 需要 step-level filtering / reweighting，而不是无脑 token KL。

### 16.3 teacher 和 student 思维模式不兼容

如果 teacher 是特别长 CoT、复杂搜索式思维，student 容量太小，硬蒸馏可能只学到格式，不学到能力。

这时需要：

* 缩短 teacher reasoning；
* 选择 teacher-aligned prompts；
* 做 curriculum；
* 用 intermediate teacher；
* 或者先训练 student 的基础 reasoning manifold。

### 16.4 divergence 选错会改变模型性格

Forward KL 可能让模型啰嗦、平均、覆盖长尾；Reverse KL 可能让模型锐利但窄；JS 可能太温和；skew KL 稳定但目标更启发式。

所以 OPD 不是“换成 on-policy 就完事”，而是一个完整系统：

```plain
rollout policy
teacher signal
divergence
importance weighting
filtering
curriculum
replay/cache
evaluation
```

## 17. 一个更合理的 OPD recipe

如果我是基座团队做 OPD，我不会直接上复杂论文方法，而会按下面路线搭。

### 阶段一：off-policy cold start

先用 teacher-generated high-quality data 做 SFT/KD：

$y \sim \pi_T$

目标可以是 CE 或 Forward KL。目的不是最优，而是让 student 具备基本格式和任务能力。

### 阶段二：mixed OPD

使用混合轨迹：

$y \sim (1-\lambda)\pi_T + \lambda\pi_\theta$

从小 $\lambda$ 开始，逐渐增加 student rollout 比例。

这一步最关键。它避免 student 太弱时纯 on-policy 崩掉。

### 阶段三：divergence adaptive

不要固定一个 KL。

可以按 teacher entropy 选：

$$H_T(s_t) =
-\sum_y
\pi_T(y|s_t)\log \pi_T(y|s_t)$$

如果 teacher 低熵：

$H_T(s_t) < \epsilon$

说明 teacher 很确定，适合 Reverse KL 或 sampled-token log-prob gap。

如果 teacher 高熵：

$H_T(s_t) > \epsilon$

说明多种 token 都合理，适合 Forward KL / JS / softer target。

也就是：

$$D_t =
\alpha_t KL(\pi_T\|\pi_\theta) +
(1-\alpha_t)KL(\pi_\theta\|\pi_T)$$

其中：

$\alpha_t = g(H_T(s_t))$

这比固定 FKL/RKL 更符合实际。

### 阶段四：引入 verifier / reward

对 math/code/reasoning，可以加入 outcome reward：

$R(x,y)$

最终目标变成：

$$\mathcal{L} =
\mathcal{L}_{OPD} -
\eta
\mathbb{E}_{y\sim\pi_\theta}[R(x,y)]$$

这时 OPD 提供 dense shaping，verifier 提供 sparse correctness。

### 阶段五：recovery OPD

RL 后模型容易某些能力回退，比如：

* instruction following 变差；
* 长度膨胀；
* 通用问答退化；
* 风格变偏；
* safety 边界波动。

这时可以用 checkpoint teacher / domain teacher 做 recovery OPD：

$$\pi_T =
\pi_{\text{best checkpoint/domain}}$$

Nemotron-Cascade 2 这类 multi-domain OPD 就是这个方向：在 Cascade RL 中用不同领域的 intermediate teachers 恢复 benchmark regressions。

## 18. 最后总结：OPD 这条线的核心脉络

可以用一条线串起来：

```plain
Hinton KD：
固定数据上的 soft label 压缩
    ↓
SeqKD：
teacher 生成完整序列，student 模仿 teacher output
    ↓
DAgger / imitation learning：
learner 应该在自己诱导出的状态分布上学习
    ↓
GKD：
LLM student 从 self-generated mistakes 中学习
    ↓
MiniLLM：
用 Reverse KL 解决生成蒸馏中 forward KL 的长尾过覆盖问题
    ↓
DistiLLM：
用 skew KL / adaptive off-policy 降低 OPD 成本和方差
    ↓
工业 recipe：
Qwen / MiMo / Nemotron 等把 OPD 用作能力搬运、融合、恢复层
    ↓
Agentic OPD：
进入 tool-use 后，必须处理 step-level 状态失真和 teacher signal 可靠性
```

最终判断：

> OPD 的本质不是一种新 loss，而是一种后训练分布控制方法。
> 它把 student 从“模仿 teacher 的轨迹”推进到“在自己的轨迹上被 teacher 修正”。
> 真正难的不是写出 KL，而是选择什么时候 on-policy、在哪些 token 上强监督、用哪种 divergence、如何控制方差、以及 teacher signal 在错误状态上是否可信。

对基座模型团队来说，OPD 最有价值的位置不是替代 SFT，也不是替代 RL，而是成为中间层：

```plain
SFT / Off-policy KD
→ OPD dense correction
→ RL / verifier exploration
→ OPD recovery / multi-teacher fusion
```

也就是说，未来真正强的 recipe 很可能不是“纯 OPD”，而是：

```plain
off-policy cold start
+ adaptive OPD
+ verifier RL
+ recovery OPD
```

这才是 OPD 在大模型时代重新变重要的原因。
