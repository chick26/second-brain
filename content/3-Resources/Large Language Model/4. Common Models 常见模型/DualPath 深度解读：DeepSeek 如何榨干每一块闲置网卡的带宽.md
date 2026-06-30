---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽"
source: feishu-export
imported: 2026-05-24
---

> **论文**：**DualPath: Breaking the Storage Bandwidth Bottleneck in Agentic LLM Inference**
> **链接：https://arxiv.org/abs/2602.21548**
> **Prefill 节点的存储网卡跑满了，Decode 节点的存储网卡闲着，DualPath 开辟`存储 → Decode → RDMA → Prefill`的第二条路，将全集群存储带宽池化，离线推理加速 1.87×，在线服务吞吐提升 1.96×**

# KV-Cache 和 PD 分离回顾

## KV-Cache 的重要性

> **可以回顾：[[1.3 Attention 注意力]]**

LLM（Casual） 在生成文本时，每生成一个新 token，都需要回顾之前所有 token 的信息，这个回顾过程发生在 Transformer 的 **注意力层** 中，每个 token 会被投影成 **Query、Key、Value 三个向量**

> * **Q** 是"我想查什么"
> * **K** 是"我能提供什么线索"
> * **V** 是"我的实际内容是什么"
> 生成第 N 个 token 时，需要用第 N 个 token 的 Q 去和前面所有 token 的 K 做匹配，计算注意力分数，再用分数对所有 V 做加权求和。如果不做缓存，**每生成一个新 token，前面所有 token 的 K 和 V 都要重新算一遍，浪费很大**。所以实际上会把每个 token 的 K 和 V **缓存起来**，这就是 **KV-Cache**

KV-Cache 的大小与 **上下文长度** 成正比。对话越长、上下文越多，KV-Cache 越大。在 Agent 场景下，上下文动辄几万甚至几十万 tokens，KV-Cache 可能达到几十 GB，已经超出了 GPU 显存能装下的范围，所以必须存在外部存储

## PD 分离的思路

> **可以参考[[5.5 推理框架]]，** LLM 推理分为两个阶段：

| 阶段 | 做什么 | 特点 |
| ---------------- | ------------------------------------ | ------------------------------- |
| **Prefill（预填充）** | 一次性处理整段 prompt，计算所有 token 的 KV-Cache | **计算密集**：大量矩阵乘法，GPU 算力跑满 |
| **Decode（解码）** | 逐个生成新 token，每次只算一个 token | **访存密集**：大量读取 KV-Cache，GPU 算力空闲 |

* 两个阶段对硬件的需求不同，如果放在同一块 GPU 上，它们会互相干扰：**Prefill 的大计算量会抢占 Decode 的内存带宽，Decode 的频繁小读取会打断 Prefill 的连续计算**
* **Prefill-Decode 分离** 的思路是：用专门的 GPU 跑 Prefill（ **Prefill Engine, PE**），用另一组 GPU 跑 Decode（ **Decode Engine, DE**），各司其职，互不干扰
* Prefill 完成后，PE 需要把计算好的 KV-Cache 通过高速网络（RDMA）传给 DE，DE 再开始逐 token 生成。生成完毕后，DE 把新的 KV-Cache 写回外部存储，留给下一轮使用

## 计算网络与存储网络

* 现代 AI 数据中心（比如 NVIDIA DGX SuperPOD），每台服务器通常有 **8 块 GPU**，每块 GPU 配一张 **计算网卡（CNIC, Compute NIC）**，用于 GPU 之间的高速通信（比如 **并行计算中的 AllReduce、AllToAll 等操作**）。此外，每台服务器还有 **1 张存储网卡（SNIC, Storage NIC）**，用于访问分布式存储系统
* **计算网络和存储网络是物理隔离的，** 走不同的交换机、不同的线缆。这种隔离是必须的，GPU 间的通信对延迟极其敏感（差 1 毫秒就可能让整个并行计算 pipeline 卡住），必须保证不被存储流量干扰
* DualPath 要解决的一个核心问题就是：**怎么在不破坏这种隔离的前提下，借用计算网络来传输 KV-Cache**

# Agentic 推理为什么这么吃存储带宽？

## Agent ≠ 聊天，推理负载完全不同

传统的人和模型对话通常只有几轮，上下文在几 K tokens 以内。但在 **Agent 场景**（Coding 助手、自主任务 Agent）下，模型不再只是回答问题，而是***<u>自主行动：调用工具、执行代码、读取文件、分析结果，然后继续下一步</u>***

> 打个比方：
> * 传统对话是 **你问我答的面试，几轮就结束了**
> * **Agent 推理像是让模型当一天的程序员，** 需要不停地写代码、跑测试、看报错、改代码、再跑，每一步的输出都要拼接到上下文里，上下文像滚雪球一样越滚越大

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-d9072ff63a5503e50b1bdc5d6196830410f70b1d843a498375af1376b30f132e.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715122739_img-8f594ae3cf6b05f5b81b.jpg)

***Agent 轨迹示例（论文 Figure 2）。每一轮 Agent 接收环境反馈（工具输出），拼接到已有上下文后继续生成下一个动作，一个完整的 Agent 任务可能持续上百轮***

## 98.7% 的 KV-Cache 命中率意味着什么？

论文从 DeepSeek 生产环境的 coding 任务中采集了真实 trace：

| 指标 | 数值 |
| ---------------- | -------------------------------------- |
| 平均交互轮数 | **157 轮，一个 Agent 任务平均要和环境交互 157 次** |
| 平均上下文长度 | **32.7K tokens，积累到后期，上下文有 3 万多 token** |
| 平均每轮新增 | **429 tokens，每一轮只新增很少的内容（工具输出等）** |
| **KV-Cache 命中率** | **98.7%，32K 上下文中，98.7% 是之前已经算过的** |

> * **98.7% 的命中率** 说明：一个 32K token 的上下文，每一轮只新增 429 个 token。这 429 个 token 需要做 Prefill 计算（算新的 KV-Cache），而剩下 32271 个 token 的 KV-Cache 已经算过了，存在外部存储里，**只需要读出来就行**
> * **几乎所有的时间都花在从存储里读旧数据上，而不是在 GPU 上算新数据**。系统从 compute-bound（计算瓶颈）变成了 **I/O-bound（存储瓶颈）**

论文用一个指标量化了这个问题，**Cache-Compute Ratio**（GB/PFLOP），即每做 1 PFLOP 计算需要读多少 GB 的 KV-Cache：

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-image.png](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715182399_img-d57135c54aef69363805.png)

***各模型的 Cache-Compute Ratio。数字越大表示越 I/O-bound。即便是 DeepSeek 使用了 MLA的模型，在 Agent 场景下仍然严重受限于存储带宽。传统 GQA/MHA 模型则更加 I/O-bound***

| 模型 | GB/PFLOP (16K-64K 上下文) | 说明 |
| -------------------- | ---------------------- | --------------------------------------------------------------------------- |
| Qwen2.5-32B (FP16) | 117-267 | 传统 GQA 注意力，KV-Cache 大 |
| GPT-OSS-120B | 47-95 | |
| Qwen3-235B-A22B | 39-60 | MoE 模型 |
| DeepSeek-V3.2 660B | 13-36 | MLA 注意力，关键变化包含 DSA（DeepSeek Sparse Attention），它降低了计算需求，因此单位计算对应的 KV 读取压力会更高 |
| **DeepSeek-V3 660B** | **4.8-5.8** | **MLA 最优** |

## PD 分离架构下的带宽失衡

在 PD 分离架构下，一个 Agent 请求的处理流程是这样的：

> * 问题出在第 1 步：**只有 PE 在读存储，DE 的存储网卡（SNIC）完全闲置**。在传统设计中，只有 PE 需要加载 KV-Cache 来做 Prefill。DE 只负责 Decode，它的 KV-Cache 是从 PE 通过 RDMA 传过来的，根本不需要碰存储
> * 类比一下：**快递分拣中心只有入口处的一条传送带在工作，而出口处的传送带闲着不用**。DualPath 的想法很直接——既然出口的传送带也能搬东西，那就让它帮忙把货搬进来再转交给入口侧

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-60f0ceb071ac1128d3ab93dcd626fb3ea0d9d53210309ece8b77783466570696.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714988396_img-14743dca281fd992cb22.jpg)

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-affedcfdfa8a87c81c0c2f1b70c6a70906417435f3e7d9d235ea060135a269a5.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715069182_img-5c3632acf640ad0ed428.jpg)

*（论文 Figure 1）：左，传统架构的瓶颈，PE 的存储网卡被打满（红色），DE 的存储网卡完全闲置（灰色）。右，DualPath 的方案，让 DE 也帮忙从存储读取 KV-Cache，再通过计算网络转发给 PE*

## 硬件趋势：三重挤压让问题越来越严重

硬件的发展趋势还在让这个问题加速恶化：

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-8e17b9baf47801a7a593d1f9931fcae2229762c29c692c0172e79d9b7f158b7c.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715051343_img-e2825f18da05b52c5651.jpg)

***（论文 Figure 3）：左，从 Ampere 到 Blackwell，GPU 算力（FLOPS）增长远快于网络带宽（NIC BW）和显存容量（HBM），GPU 算力翻了 14 倍多，但网络带宽只翻了 2 倍，I/O-Compute Ratio 下降了 14.4×。右，不同 batch size 下的吞吐量，受限于 HBM 容量***

> **三重挤压**：
> 1. **算力增长 >> 带宽增长**：GPU FLOPS 从 A100 到 B200 翻了 14 倍多，但 NIC 带宽只从 200Gbps 涨到 400Gbps，GPU 越来越强，但喂数据的管道没跟上
> 2. **HBM 容量不足**：显存容量增长缓慢，限制了 batch size，导致 GPU 利用率更低
> 3) **SNIC 利用不均**：PE 侧的存储网卡被打满，DE 侧完全空转，整个集群一半的存储带宽浪费了

# 核心思想：DualPath 开辟第二条路

## 传统路径 vs DualPath

* 传统方案只有 **一条路，** KV-Cache 从存储到 PE：
* DualPath 新增 **第二条路，** KV-Cache 从存储先到 DE，再通过计算网络转发给 PE：

这条旁路的好处在于：

* **DE 的 SNIC 本来就闲着**，现在被利用起来读取 KV-Cache
* **计算网络（CNIC）的带宽远大于存储网络**（8 × 400Gbps vs 1 × 400Gbps），而且在 KV-Cache 加载期间大部分时间是空闲的（推理通信是突发性的，间歇期有大量空闲带宽）
* 效果：**全集群的存储网卡带宽被池化**，从只有 PE 节点的 SNIC变成所有节点 SNIC 的总和

## PE Read Path

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-6ed1eaeb8feaa336572aa1ccf19af6be4208654927d010aa779a931cdac15833.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715028117_img-a22f3d8661a1bb05468b.jpg)

***（论文 Figure 4a）：PE Read Path 的数据流***

PE Read Path的步骤：

1. **存储 → PE DRAM** `[1→2]`：KV-Cache 从分布式存储（3FS）通过 SNIC 读到 PE 节点的主机内存（DRAM），存入 **PE Buffer**
2. **PE DRAM → PE HBM（逐层）** `[3→4]`：不是一次性全部搬到 GPU 显存，而是 **每次只搬一层** 的 KV-Cache 到 HBM，搬完立刻开始该层的 Prefill 计算。这一步与计算是重叠的，GPU 在算第 L 层的同时，CNIC 在搬第 L+1 层的数据
3) **PE HBM → DE DRAM** `[5→6→7]`：Prefill 计算完成后，完整的 KV-Cache（包括旧的 hit tokens 和新算出来的 miss tokens）通过 RDMA 传到 DE 节点的 DRAM，存入 **DE Buffer**
4) **DE DRAM → DE HBM** `[8→9]`：DE 将 KV-Cache 从 DRAM 加载到 HBM，开始自回归 Decode

## DE Read Path

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-f7f9f3c3473c0765acf3fda48f5acf3657c46466f67f5b45e647736e501803c9.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715159894_img-6472141ead7c2f3974e2.jpg)

***（论文 Figure 4b）：DE Read Path 的数据流。KV-Cache 先读到 DE 节点，再通过计算网络转发给 PE***

DE Read Path（DualPath 新增的路径）的步骤：

1. **存储 → DE DRAM** `[1→2]`：KV-Cache 通过 **DE 节点的 SNIC** 读到 DE 的 DRAM，传统架构这条网卡是闲置的
2. **DE DRAM → PE HBM（逐层）** `[3→4→5]`：逐层通过 RDMA（经过 CNIC 计算网络）传到 PE 的 GPU 显存，同样与 Prefill 计算重叠
3) **PE 传回 miss tokens**：PE 只需要把新计算出来的 miss tokens 的 KV-Cache 传回 DE Buffer，与已有的 hit tokens 合并
4) **DE DRAM → DE HBM** `[6→7]`：Decode 阶段直接从 DE Buffer 加载到 HBM
> 与 PE Path 相比，DE Path 的一个重要优势是 **KV-Cache 不需要经过 PE 的 DRAM 中转**。在 PE Path 中，数据路径是 `存储 → PE DRAM → PE HBM → DE DRAM → DE HBM`，PE 的 DRAM 需要同时承担从存储接收和向 DE 发送两个方向的流量。而 DE Path 中，PE 的 DRAM 完全不参与 KV-Cache 搬运，**减少了 PE 侧的内存压力**

## Layerwise Prefill

* 传统 Prefill 要求 GPU 显存（HBM）**同时装下整个模型所有层的 KV-Cache，** 严重限制了 batch size
  > 举个例子：如果一个模型有 60 层，每层 KV-Cache 占 100MB，那整个 KV-Cache 就是 6GB。HBM 容量有限，能塞进去的请求数就很少，GPU 利用率就低
* **Layerwise Prefill** 的思路很简单，既然 Prefill 计算是逐层进行的（第 1 层 → 第 2 层 → … → 第 60 层），那 GPU 每次只需要持有 **当前层** 的 KV-Cache 就够了。算完第 1 层就释放，装入第 2 层继续算
* 效果：batch size 可以扩大约 $n_{layer}$ **倍**，GPU 利用率大幅提升，这是 DualPath 的基础能力之一，由 **LayerKV 和 PrefillOnly 两篇前置工作提出**

## P/D 比例的安全空间

> 一个自然的问题是,**开辟第二条路会不会在别的地方制造新的瓶颈？** 比如 DE 的 CNIC 会不会被打满？PE 的 DRAM 带宽会不会不够？

* 论文对此做了严格的数学分析。设 $P$、$D$ 为 PE/DE 节点数，$g$ 为每节点 GPU 数（通常 8），$s$ 为每节点 SNIC 数（通常 1），$B$ 为 SNIC 带宽，$M$ 为内存（DRAM）带宽
* 分别对 **PE 的 CNIC 带宽**、**DE 的 CNIC 带宽**、**DE 的 DRAM 带宽** 三个维度进行约束分析，最终得到 P/D 比例的安全区间：
  $\frac{s}{g-s} \leq \frac{P}{D} \leq \min\left\{\frac{g-2s}{s},\ \frac{g-s}{2s},\ \frac{M/Bs - 3}{2}\right\}$
* 代入典型配置 $(g=8, s=1, M \approx 500 \text{ GB/s}, Bs \approx 50 \text{ GB/s})$ 后，结果非常直观：

$\frac{1}{7} \leq \frac{P}{D} \leq \frac{7}{2}$

从 **1 台 PE 配 7 台 DE**（极端重 Decode）到 **3.5 台 PE 配 1 台 DE**（极端重 Prefill），这个范围内 DualPath 都 **不会引入任何新的瓶颈**。这几乎覆盖了所有实际生产部署场景

公式中三个上界分别对应的瓶颈含义：

* $\frac{g-2s}{s}$：DE 的 CNIC **读方向** 带宽（从 DRAM 读数据发给 PE）
* $\frac{g-s}{2s}$：DE 的 CNIC **写方向** 带宽（接收 PE 传回的 miss tokens + 写回存储）
* $\frac{M/Bs - 3}{2}$：DE 的 **DRAM 内存带宽**（半双工，读写共享）

# 工程难点一：凭什么 KV-Cache 搬运不影响推理？

> 方案说起来简单，把 DE 的存储网卡用起来，通过计算网络转发，但落地时第一个问题是：**怎么保证 KV-Cache 的搬运流量不干扰正常的推理通信？**
> 推理过程中，GPU 之间有大量 **延迟敏感** 的通信操作：
> * **Expert Parallel（EP）** 中的 AllToAll：不同 GPU 之间交换 MoE 专家的输入输出
> * **Tensor Parallel（TP）** 中的 ReduceScatter / AllGather：分布式矩阵乘法的中间结果汇聚
> 这些通信操作通常在 **亚毫秒级** 完成，是突发性的，如果 KV-Cache 搬运抢占了带宽，哪怕只慢了 1ms，都可能导致整个并行 pipeline 等待，严重拖慢推理速度

## GPUDirect Storage 的局限

直觉上，最短的路径是：

* **GPUDirect Storage**：KV-Cache 从存储直接读到 GPU HBM，绕过 CPU 内存
* **CUDA Copy Engine**：用 GPU 内部的 DMA 引擎把数据从 DRAM 拷贝到 HBM

这两种方案路径最短，但都有同一个问题：**PCIe 总线没有 QoS（服务质量）机制**

* 什么是 QoS？就是不同类型的流量可以设置不同优先级。网卡有 QoS（可以通过 Virtual Lane 区分优先级），但 PCIe 没有
* 一旦 KV-Cache 搬运和推理通信 **同时走 PCIe**，它们就会无差别地抢占带宽，谁先到谁用，没有优先级之分。推理通信又是亚毫秒级的突发，来得快、走得快，软件层面根本来不及在两次突发之间精确地插入 KV-Cache 传输，结果就是推理延迟严重恶化

## CNIC-Centric：所有数据都走计算网卡

DualPath 采用了一个看似绕路但大概是当前唯一实用的方法：

* 核心原则：**所有进出 GPU 的数据都必须经过 CNIC（计算网卡）**。即使是本机 DRAM → GPU HBM 的传输，也不走 PCIe 直连，而是走 CNIC 的 RDMA Write 绕一圈回来。
* 为什么要这么绕？因为 **CNIC 是网卡，原生支持 QoS，** 网卡的硬件队列天然可以区分不同优先级的流量，而 PCIe 做不到这一点。把所有流量都收归 CNIC 管辖后，就可以用网卡的 QoS 机制来保护推理通信了
* **一个附带好处**：RDMA Write 的 work request 提交只需 **\~1μs**（几次 mmio 寄存器写入，在用户态完成），而 `cudaMemcpyAsync` 每次提交需要 **5-7μs**（需要经过 CUDA 驱动栈）。在 Layerwise Prefill 场景下，KV-Cache 被切成了大量小块（每层每个 token block 一小块），提交次数极多——CNIC 方案的低提交延迟反而让它 **比直连方案更快**

## Virtual Lane：硬件级的车道隔离

在 InfiniBand 网络上，DualPath 利用 **Virtual Lane（VL，虚拟通道）** 机制实现流量隔离。你可以把它想象成 **高速公路上的专用车道**：

| 流量类型 | VL 优先级 | 带宽分配 | 类比 |
| ------------------------------ | ----------- | ------------- | --------- |
| 推理通信（AllToAll、ReduceScatter 等） | **高优先级 VL** | **\~99%** | 应急车道，优先通行 |
| KV-Cache 传输 | **低优先级 VL** | **\~1%**（防饿死） | 普通车道，见缝插针 |

* 交换机和网卡上配置了 **加权轮转仲裁（Weighted Round Robin）**：高优先级 VL 分到绝大部分的发送机会，低优先级 VL 只在高优先级 VL 空闲时才有机会发送。1% 的保底带宽确保低优先级流量不会被完全饿死
* 实际效果：推理通信是突发性的（burst），两次 burst 之间计算网络大部分时间空闲。KV-Cache 传输就在这些空闲间隙中见缝插针，把原本浪费掉的带宽利用起来，同时不影响推理延迟。

***

# 工程难点二：请求该走哪条路？自适应调度器

> 有了双路径，接下来的问题是：**每个请求应该走哪条路？** 走 PE 路径还是 DE 路径？分配给哪台 PE？配哪台 DE？

这不是一个简单的负载均衡问题，因为调度器需要 **同时平衡两个维度**：

1. **NIC 流量平衡**：不能让某一台机器的存储网卡过载
2. **GPU 负载平衡**：不能让某些 GPU 任务堆积，其他 GPU 空闲

## 全局视角：Inter-Engine 调度

调度分为 PE 调度、DE 调度和路径选择三个部分：

* **PE 调度** 采用 **三级优先** 策略。每个 PE 实时上报三个指标：待完成请求数 $seq_e$、总 token 数 $tok_e$、所在节点的磁盘读取队列长度 $read\_q_{n(e)}$

为什么要优先选磁盘队列短的？因为存储网卡带宽是稀缺资源，如果某台 PE 的磁盘队列即将排空，意味着它的 SNIC 马上就要空闲。此时赶紧塞一个请求进去，可以 **保持 SNIC 满载**，最大化利用存储带宽

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-53e5806699534cd6c5df38924046a2399f777a07a0c662bdc6807d1a68f94c0c.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714977793_img-0588d67e6c3ba24552b7.jpg)

***（论文 Figure 5）：Inter-Engine PE 调度示意。同一 PE group 内有 8 块 GPU，调度器根据 tok 数和磁盘队列长度选择最优的 GPU***

**DE 调度** 分两级：

1. **跨组调度**：将请求分配到总 token 数最小的 DE group，平衡组间负载
2. **组内调度**：设定高 token 阈值 $Z = 1.05 \times \text{avg}$（比组内平均 token 数高 5%），优先选低于阈值且 HBM 剩余充足的 DE。超过阈值的 DE 说明已经压力较大，尽量避免再往上堆

**路径选择** 很直接：比较 PE 和 DE 两侧的磁盘读取队列长度，**选更短的一侧读取**。哪边的存储网卡更空闲，就让哪边来读

## 引擎内部：Compute Quota 消除 GPU 气泡

**PE 内部还有一个调度问题：每次 forward 应该把哪些请求打包成一个 batch？**

* 在 Expert Parallel（EP，专家并行）模式下，多块 GPU 各自负责不同的请求做 attention 计算，但它们必须 **同步进入 FFN 层**。如果某块 GPU 分到的请求 attention 计算量特别大，其他 GPU 就必须 **空等，** 这就是 **GPU bubble（气泡）**

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-f45d78d1c9f195d8a49426d32cbbda1ea95688b4e07414cf598d984035baa9f9.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715144212_img-7702cc22152511255dd7.jpg)

***（论文 Figure 6）：左，Compute Quota 机制的示意。右，应用 Compute Quota 前后的 GPU 时间线。Before 中可以看到明显的灰色空白区域（GPU idle），After 中各 GPU 的 attention 计算时间趋于一致***

> 解决方案是 **Compute Quota（计算配额）**：
> 1. 对每个请求，根据它的 $(cached, miss)$ token 数预估 attention 层的执行时间（通过离线 profiling 拟合的性能模型）
> 2. 按 FIFO 顺序逐个往 batch 里加请求，累加预估时间
> 3) 一旦总时间触达 **quota 上限**（论文设为 300ms），停止添加
> 4) 如果最后一个请求会超限，不是直接跳过它，而是用 **二分搜索** 找到一个合适的 chunk size，对这个请求做 **chunked prefill**（只计算前 chunk\_size 个 token，剩下的留到下一个 batch）
> 这样，同一个 EP 组内的各块 GPU 的 attention 计算时间就被控制在差不多的范围内，**大幅减少了同步等待产生的 GPU 气泡**

# 实验结果

实验在 DeepSeek 内部的 **InfiniBand 集群** 上进行，最大规模达 **1152 块 NVIDIA Hopper GPU**。每台服务器 8 块 GPU + 8 块 400Gbps CNIC + 1 块 400Gbps SNIC。存储后端是 3FS（DeepSeek 自研分布式文件系统）。

使用的 benchmark 是真实的 **Agent RL 训练 trace，** 不是合成数据，而是从生产环境的 coding Agent 任务中采集的真实轨迹。

## 离线推理

离线推理对应的是 RL 训练中的 **rollout 阶段**：大量 Agent 同时开始执行任务，系统需要尽快完成所有轨迹的生成。核心指标是 **JCT（Job Completion Time，任务完成时间）**

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-67a328996968262cb2bb357d18c9f04f65a3e7069a2cf3652a1f61a0385834f9.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715005469_img-7095acff972d9645037f.jpg)

***（论文 Figure 7）：不同 Agent 数和最大上下文长度下的离线推理性能***

关键发现：

* **DS 660B（2P4D 配置）**：DualPath 较 Basic 最高加速 **1.87×**，性能接近 Oracle（Oracle 假设 I/O 零开销，说明 DualPath 几乎消除了 I/O 瓶颈）
* **Agent 数量越多、上下文越长，收益越大**：因为更多 Agent 意味着更大的 I/O 压力，DualPath 的存储带宽池化效果就越明显
* **小模型（DS 27B）收益相对较小**：因为小模型用 1P1D 配置（1 台 PE + 1 台 DE），PE-DE 之间的跨节点传输固定开销占比较大。不过仍然有最高 1.78× 的加速

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-52c4d17b4502d2e9bec7a634aab2cce6c91292d7c132aff371e97f765c89cab8.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782714957552_img-9b0072626de1c398f13e.jpg)

***（论文 Figure 9）：左，不同 append 长度下的性能。右，不同生成长度下的性能（DS 660B, 64K, 1024 agents）***

* 一个有意思的发现：**Append 越短、Generation 越短，DualPath 的优势越明显**。append 短意味着新计算少、I/O 占比大；generation 短意味着 Decode 阶段用时少、Prefill（I/O 密集）占比大。系统越 I/O-bound，DualPath 的收益就越大

## 在线服务

在线服务场景下，Agent 请求按泊松过程到达，系统需要在满足 **SLO（Service Level Objective，服务质量目标）** 的前提下最大化吞吐量。SLO 定义为 TTFT ≤ 4s 且 TPOT ≤ 50ms

三个延迟指标：

* **TTFT（Time To First Token）**：从请求到达到生成第一个 token 的时间，主要取决于排队 + Prefill
* **TTST（Time To Second Token）**：从第一个 token 到第二个 token 的时间，反映 PD 传输开销
* **TPOT（Time Per Output Token）**：每个输出 token 的平均时间，反映 Decode 效率

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-c7d4772789c128712c42c290877ebe4f8ca9e1610aed809d92180b53b54f6350.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715107448_img-e7699b73854740b70154.jpg)

***（论文 Figure 10）：在线服务的 TTFT、TTST、TPOT 随 Agent 到达率（APS, Agent Per Second）的变化***

* **DS 660B**：DualPath 支持的最大 APS 是 Basic 的 **2.25×**（0.45 vs 0.20 Agent/s）
* **TTST 和 TPOT 与 Basic 基本相当**：说明双路径没有引入额外的 Decode 开销，KV-Cache 搬运的流量隔离是有效的
* **TTFT 显著降低**：得益于存储带宽池化，请求的排队时间大幅减少。论文的 TTFT breakdown 分析显示，Basic 方案中排队时间占 TTFT 的大部分，而 DualPath 把排队时间压缩到了很小的比例

## 消融实验

DualPath 由三个技术组件叠加而成，论文做了消融实验：

![DualPath 深度解读：DeepSeek 如何榨干每一块闲置网卡的带宽-c2a8efc24d4505136f0bb404f4d6d3ce1e2e6844584d40119fce18fd56bbdd94.jpg](https://2479e837.cloudflare-imgbed-2q4.pages.dev/file/1782715082108_img-ec2c43e9bf3318847882.jpg)

***（论文 Figure 12）：左，在线服务的 TTFT 细分（Sch.=调度, A.=分配, R.=读取, PF.=Prefill）。右，离线推理的消融实验（DS 660B, 64K）***

| 组件 | 平均 JCT 降低 | 做了什么 |
| ---------------------- | ---------- | ----------------------------------- |
| + Layerwise Prefill | **17.21%** | GPU 每次只装一层 KV-Cache，batch size 大幅增加 |
| + Dual-Path Loading | **38.19%** | 开辟 DE → PE 的第二条读取路径，池化存储带宽 |
| + Scheduling Algorithm | **45.62%** | 智能调度，平衡 NIC 和 GPU 负载 |

* **双路径加载贡献最大**（从 17.21% 跳到 38.19%，单独贡献了约 21 个百分点）。调度算法在此基础上再挤出 7.4%，在 1000+ GPU 的集群上，这意味着几百个 GPU-hour 的节省

## 大规模可扩展性：1152 GPU

最后，论文展示了 DualPath 在大规模集群上的扩展性：

| 配置 | JCT (离线) | TTFT (在线) | TPOT (在线) |
| ---------------------- | ---------- | ---------- | ---------- |
| 2P4D, 2K agents | 3,167s | - | - |
| **48P96D, 48K agents** | **3,201s** | - | - |
| 2P4D, 0.4 APS | - | 1.739s | 0.039s |
| **44P88D, 8.8 APS** | - | **1.847s** | **0.036s** |

从 48 GPU 扩展到 1152 GPU（24 倍）：

* **离线推理**：Agent 数从 2K 增加到 48K（也是 24 倍），JCT 几乎不变（3167s → 3201s，仅增 1.1%）——近线性扩展
* **在线服务**：APS 从 0.4 提升到 8.8（**22× 吞吐量**），TTFT 和 TPOT 保持稳定
* 调度器 CPU 占用 < 10 核，在大规模下也不是瓶颈

# 总结与思考

DualPath 的核心洞察用一句话就能说清：**Decode 节点的存储网卡是闲置的，把它用起来**。

但把这个想法落地到 1152 GPU 的生产集群上，要解决三个工程问题，也是论文的三个核心贡献：

1. **双路径数据流编排**：两条路径、逐层流式传输、计算与通信重叠——数据流的时序必须严丝合缝，否则不是带宽浪费就是延迟爆炸
2. **CNIC-Centric 流量隔离**：PCIe 没有 QoS，所以让所有流量都走 CNIC，借用网卡的 Virtual Lane 做硬件级隔离
3) **自适应调度**：实时感知磁盘队列长度、GPU token 负载、HBM 剩余容量，在 NIC 流量和 GPU 负载两个维度上同时做平衡

思路和 DualPipe（训练侧流水线并行）、EPLB（MoE 专家负载均衡）、DeepEP（高效专家并行通信库）一样：在给定硬件约束下，通过软件层面重新编排数据流来提升系统效率

**值得注意的局限**：

* **小模型收益有限**：在 1P1D 配置下，PE-DE 之间的跨节点传输固定开销占比大，掩盖了存储带宽池化的收益
* **单请求未做 split**：当前实现中，一个请求的 KV-Cache 要么全走 PE 路径、要么全走 DE 路径。论文提到可以把一个请求拆成两半从两条路径同时读取，留作 future work
* **依赖物理网络隔离**：需要计算网络和存储网络分离的数据中心架构。这在大规模 AI 集群（如 DGX SuperPOD）中是标配，但在普通服务器上可能不具备条件

随着 Agent 应用日益普及，从代码助手到自主研究 Agent 到 RL 训练中的 rollout，上下文越来越长、交互轮数越来越多、KV-Cache 的 I/O 压力只会继续增大。DualPath 给出了一个不加硬件、纯靠软件编排的方案，值得关注
