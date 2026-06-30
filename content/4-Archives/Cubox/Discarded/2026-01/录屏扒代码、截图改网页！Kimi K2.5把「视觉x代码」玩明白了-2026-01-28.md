---
id: "7415988977947118436"
cubox_url: https://cubox.pro/web/card/7415988977947118436
url: https://mp.weixin.qq.com/s?__biz=MzIzNjc1NzUzMw==&mid=2247864589&idx=1&sn=362e27f27e4034509892d1575ad54cd1&chksm=e933ee249a7b260f27c1b77deb37525fa4a3d8a5f6cc311b729b69fe4478cfa39da5176e5079&mpshare=1&scene=1&srcid=0128BaCKfHbvjNIvFZi5TNbF&sharer_shareinfo=74d2d44af20169f12e1d7d7f0c9d593f&sharer_shareinfo_first=74d2d44af20169f12e1d7d7f0c9d593f
tags: []

---
# 录屏扒代码、截图改网页！Kimi K2.5把「视觉x代码」玩明白了

不用再抠提示词

##### 闻乐 发自 凹非寺
量子位 \| 公众号 QbitAI

说真的，AI圈现在恨不得睁眼闭眼就变天，产品一个接一个，难怪网友都开始"求求你们别更新了"......

###### **△** 图源：抖音hyarriver

这不，今天一睁眼就又看到个新东西。

能直接从录屏里扒特效代码并复现的模型你见过没？？反正我是开眼了。

随手从相册里挖出下面这个视频上传，输入"实现这个交互特效"几个字：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvkE7vHbsuzd59fKAs3NT9SdhxSP7tEfwpyneQfawZqJiaV1YON8bYXNg%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D1)

模型一通操作之后，我得到了如下成品：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvsOvesGTXoDyGecic46icazRXpiccOpSmASmD2icXnf6EyyzxxFmtC3G2FA%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D2)

只能说，春节档的电影还没开始预热，中国的开源力量就已经势如破竹了。

这是Moonshot AI新推出的最强Agentic模型**Kimi K2.5** ，发布后就在某推上热度起飞。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvGUxOrsYbE5PfxXeZdR50s1xNIkm16OeV18VFHicvB3LicbJdrhLtzaEA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D3)

掌门人**杨植麟还** 亲自上阵，为这个新模型录制了中英两版介绍视频。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvdpHRIYvUQ9ltcoiaHA7u0e8AQpDVUgytFW1YKQsP4bibiaKXIcxZ0OibAQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D4)

从视频内容看，Kimi K2.5的升级点不少：

*
  实现视觉与文本、思考与即时、对话与Agent功能的一体化整合，主打一个**All in one** ；
*
  具备**设计审美** ，可生成带高级动效的网页；
*
  支持**visual edit可视化编辑** ，截图圈选即可修改界面，上传动效录屏可自动拆解逻辑并生成专业代码；
*
  推出编程工具**Kimi Code** ，可在终端运行，无缝集成VSCode、Cursor等IDE，支持图片/视频输入，自动迁移用户现有技能与MCP。


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvGsDqGq2Qt5pwSaI51uRLWqIf9pJLSyrqPYXwwchPeQQ43q2dNjBy0w%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D5)

本来只是看完介绍想浅试一下，结果没想到还真有点意思。

那咱就接着细说、接着测！

## 视觉能力是大招

动手实测之前，先亮一亮Kimi K2.5的基准测试成绩单。

K2.5在人类最后的考试HLE、BrowseComp和DeepSearchQA等一众高难度测试集上，拿下了**SOTA** 的好成绩；

编程方面，在SWE-bench Verified上得分高达77，**以开源的姿态缩小了和顶级闭源模型的差距** ；

视觉理解多项测试也刷出新高。值得一提的是，在多项评测中，K2.5的表现甚至优于GPT-5.2-xhigh。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvibuU88gFhkdUzblSkLtekL676dibHa5bAVpw8zEcXiaxibu4DhseJLolog%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D6)

Kimi K2.5这次更新了4种使用模式，适应不同场景，不管你有啥需求，都能找到适合自己的打开方式。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvia4dABwyfOFGicuWe9tThURFVvoNtpdsMsL5PM6nkAiaguXb3K8wWw6ibQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D7)

* **快速模式主打极速反馈，适合日常闲聊或简单查询；**
* **思考模式专攻难题，帮你一步步拆解复杂逻辑；**
* **Agent模式则擅长深度挖掘，比如搞研究、生成办公文档或网页；**
*
  最猛的是**Agent集群** 模式，针对那些需要多线程处理的超级任务，能调动一大波智能体分身并行执行。

开头的特效复现案例，就用的是Agent集群模式------Kimi给我分配了一个叫阿澈的开发员。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvJich0Lx2Qn6CQYm1243DvftXPHdNq0YRn6dIKoLiakSMwHkcAKWo9S3Q%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D8)

光说不练假把式，既然介绍里主打「视觉x代码」，那咱就测一测K2.5的代码能力。

第一个实测项目是**看图写代码** 。

把一张音乐播放器网页截图上传给K2.5作为参考；

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKv5kWKhMMtWic9gwN60W21pfKNNSeL7ybJk08g3NmfR1vMaLBA0H2M25Q%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D9)

然后输入提示词：
> 参考这个网页，生成对应代码

没过多久，一套完整的代码就新鲜出炉了。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvh1McRzICYTnKVlsibHbNnGM3RuR3bE0ia1ata8wrTxp5oWmFf8Fvs2zQ%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D10)

生成的网页不仅还原了原设计的功能，连按钮的hover动效、音乐播放进度条的滑动效果也都做出来了。

实际上大家也能看出来，我给的参考图清晰度不是很高，但模型也能精准识别；

网页上展示的音乐封面是模型自己生成的，除此之外可以看出最下方的按钮布局没完全还原，但这个效果在我看来已经算是一张还原度超过90%的优秀答卷。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvibchFvOHyo1sALkHicYDczjzAM7LpXDh9Jt0CRs9ypm2bicQx8Ga5rHkg%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D11)

当然了，大家应该也能看到上传的参考图片上显示的是红色感叹号，srds模型确实能识别图片进行分析，只能说所有模型可能都有些小bug，但能干实事儿就无伤大雅（doge）。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvNrU3s9H3ibfuURlW2eW0kh0malCHmYiaW22doZz60StWT6pfGQAlA4icw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D12)

除了能看图写代码，K2.5还能**截图改代码** 。

拿刚才生成的音乐播放器网页来说，我想让它调整一下播放器的布局，于是截了个图，圈出播放器的主体部分；

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvYQUe0AbyfIRvRnVMXe5u0Ey9hz9pwtGlmQZhXoEHbj1RMlEfoVBzFQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D13)

然后告诉K2.5:
> 把这部分放到左下角

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvibrX4wO6OUet4EqLgichQnvcpMese8uccWZ8P4ibYMiaibCBFKlvQRf8HiaA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D14)

模型秒懂我的意图，2分钟之内给出了修改后的代码，刷新网页一看，除了截图部分按要求调整了布局，其余地方都没变，主打一个精准（而且这次还没红色感叹号hhh）。

而且整个过程像在用绘图软件涂改一样直观，省去了大段文字描述的麻烦。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKviaYxUn9UEJAr2phUJP6IjlJvWIcoE1ibF9ZKOaVBZibyic0l3PBPtf1mOw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D15)

我又反复试了几轮，发现哪怕圈选区域模糊、不完整，它也能智能补全意图，避免了AI常见的误读问题。

比如我觉得播放器的配色有点单调，于是截了个图，只圈出了播放器左侧栏部分；

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvTg5CY4fhqsKu3XuRvlo9hgwmG8icrEzlbt7XWePEmf0GMv1QNFG0Tuw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D16)

告诉K2.5想要换成莫兰迪色系：
> 这部分配色有点单调，换成莫兰迪色系

模型再次秒懂意图，5分钟之内给出了修改后的代码，刷新网页一看，它自己选的颜色和原来的搭配起来还挺和谐，而且不止换了一种颜色，还给我来了个"伪渐变"。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvXmzUMmv7dF4kqlkTdNSDk5liaCgpJQBRSXnaGWHFfs7uuTe9n9AvkMQ%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D17)

就算你既没有找到喜欢的设计图，脑子里也暂时没什么想法，也完全不用担心，只要简简单单一句话，也能让K2.5自由发挥。

比如我随手输入：
> 帮我生成一个文艺风的书籍推荐网页

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKv3886GAkFCPlfNwPpthibqH6JK4vV5ibq6qfWATmcRNooEGyzQWJnA2jA%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D18)

没想到啊没想到，它居然整了个大活儿。

青绿色的背景搭配多种字体，一股文艺气息扑面而来；鼠标扫过书籍封面还能升起一句话简介；

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvgUqp6So75Hm7q85nk1QPe3XXia7yhpt9wCX6QZH8J70Y3icA0Hgqicib7g%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D19)

再往下拉，是读书社区和「每周一书」活动的介绍，卡片还带有翻转展开的动效；

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvLEoGlAvDS2YsIibiclxBic3P5LUQibWibOSsegxGjFEv7m9Dia0JwQh79hqw%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D20)

除此之外，Kimi还设计了阅读体验、读者聚会、作者介绍等模块，每一处展示都细节满满，完全超出了我的预期，毕竟我的输入只有一句话......

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKv47pu32V55icagb8AxdvH3vmzm5xrYicmOJsXfss1N9N4fEOwzt6hbqtw%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D21)

接下来，我又让K2.5 Thinking（下图左）和K2 Thinking（下图右）分别生成了一个Switch手柄：
> 设计一个Switch手柄，屏幕上显示pygame风格的推箱子游戏

放在一起对比，明显能看出K2.5 Thinking设计出来的游戏，不管是在画面比例上还是像素上都优于K2 Thinking；

甚至K2.5最终的代码行数为738，而K2一共有818行。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvnec4RlaPhoDWYBEsBGAfHOlRCSib0dIwaYhAEicsaV2icW7icA0zomejiag%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D22)

看到这儿，你是不是也发现了，K2.5设计出来的代码和我们平时见到的那些AI产物，其实不太一样------

不是一水儿的紫色调，也不是呆板的模块化布局；而是在视觉上变得更加美观、更多元化。

显然，团队的目标不止于功能实现，还想注入**设计审美** ，让AI输出的创意像人类一样有灵魂有个性。

过去AI编程往往停留在"能跑就好"，现在它能交付高质量的专业级产品，门槛低到只需一张图或一句话。

除了「视觉x代码」这块儿亮眼，**Kimi K2.5在Office办公领域也玩得转** 。
> （上传文件）把这个文件内容转换为PPT，风格为简约风格，主色调为灰白色

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvm5qlhjqc7daxKVic9UVmSY8x49ut3T5gbI8gytkFLibicDymel22SKMnA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D23)

再看输出的效果，颜色正确、风格正确、分析和展示的内容也非常全。

最重要的是可编辑，这样就**极大方便了普通用户** ，不懂提示词工程的人也能用好Kimi；即使AI有啥小差错，也不用一遍遍通过Prompt纠正，自己动手随时能改。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvCk6THz2jRnaMxgKEWQrYlsq6KMcvkRqDOibQzqiamdNfXaFjUaVCLtfA%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D24)

之前为了应对不同的工作，人需要学习不同的Office语言，比如什么公式、函数、数据格式......

现在有了Kimi K2.5，办公软件也开始听人话了。

## Agent Swarm是内功

如果说视觉能力是Kimi K2.5亮眼的招式，那**智能体集群Agent Swarm** 就是支撑K2.5突破效率的内功。

Agent Swarm的核心逻辑，就是让多个具备独立功能的智能体协同工作，各司其职又互相配合，本质上也是对分布式AI协作的具象化表达。

这个概念很有可能成为今年Agent领域的核心叙事。

AI圈的大红人，英伟达老黄都在2025年多次公开表示，AI Agents有望成为下一个机器人级别的万亿级产业，并且特别看好swarm/collective intelligence（集群/集体智能）的发展前景，足见这个赛道的潜力之大。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvE4UY353BgvsAA9MJkEXkkv24kSibDxS180k7yTG3OqTibglRiawNAVqSA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D25)

回顾Kimi的技术迭代路径，不难发现他们早就开始布局"Agents Scaling"。

半年前他们推出首个万亿参数开源模型Kimi K2，那时的焦点在参数Scaling上。

后来Kimi K2 Thinking上线，通过延长思考链条，让单Agent能独立搞定长达300步的操作序列，提升了长程任务处理。

但这远远不够，单智能体的能力终究有上限。Kimi团队也意识到要啃下真正场景里的复杂难题，不能只靠单打独斗，必须要让智能体学会协作。

于是，在Kimi K2.5上，他们实现了关键跃进。

**从单一Agent转向Agent集群** ，能即时调度上百个分身并发协作。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvR1xxD0VJnKr3fcAesibHmMOms2iagjY1Faz09oibFkIRiavmPicicXDMTjpA%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D26)

这些Agent就像是K2.5的分身，每一个都有自己的专长，有的擅长数据分析，有的精通文案撰写，有的专攻市场调研。

当遇到一个复杂任务时，K2.5不再让一个Agent包揽所有工作，而是会根据任务需求，现场给这些分身分配角色、拆解子任务，整个过程没有任何预设的规则，全靠K2.5自主决策。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvMiawGztIlW45gpMozGuOtu5IgfXCXebLvzqLTeoicR3AfrUd7PYjEFcQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D27)

举个简单的例子。

比如要做100家公司的市场调研，K2.5会立刻组建一个调研团队，让不同的Agent分别负责不同行业的公司；

有的收集财务数据，有的分析市场份额，有的整理竞品动态，原本需要几星期才能完成的工作，现在十几分钟就能给出一份详尽的报告。

整个过程从串行到并行切换自如，效率提升非常明显。

据团队内部评测，搭载Kimi K2.5的Kimi Code在软件工程能力上，比前代模型大幅进步。

相较于单智能体执行模式，智能体集群能将实现目标性能所需的最少关键步骤缩减3至4.5倍，且目标要求越高，步骤的节省幅度就越大；

同时借助并行化处理，其实际运行耗时（壁钟时间）最多可缩短4.5倍。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKvsDNicdvMMyqS3ZE1fItP2SdePgYUlxlNsTr1NfIyLXgF1jQQCib2oTaw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D28)

## 让AI"干活"，让人"定义"

实际上这么看下来，Kimi K2.5通过视觉能力和Agent集群，极大地抹平了普通用户与专业交付成果之间的技术鸿沟。

毕竟，连提示词都不用反复修改润色，只要拿图或视频给K2.5看，它就能交给你一个基本满意的答卷。

办公方面的升级，也在侧面说明Kimi现在已经是被微软认定的生产力工具；要知道，微软之前在「Agent+Office」这方面合作的核心可是OpenAI的GPT系列。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FYicUhk5aAGtDrN7yiac8HJ85XYQl1iaqgKv9wicZia71rLD6vvy8S49qArpnnrYibv9q4KicwE1zSo8eiaHQbhSgia9Z5IA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D29)

大家总爱说AI迟早要替代人，但在K2.5这里，我们看到的是AI正在赋予每个人"指挥千军万马"的超能力。

就像Kimi团队说的那样，要让用户专注于定义问题和做决策，剩下的重活儿、累活儿、杂活儿，统统交给这群"Kimi分身"就好。

总的来说，Kimi K2.5这次升级简化了人类的工作流程，或许，在Agent时代写简历都不用长篇大论了，一句**"精通Kimi"** 就够了（doge）。


**一键三连** **「点赞」「转发」「小心心」**

**欢迎在评论区留下你的想法！**


--- **完** ---


**🌟 点亮星标 🌟**

**科技前沿进展每日见**


![](https://image.cubox.pro/cardImg/14z8gf5kbumqt19jevpu5db2zudnou01s2jjqjv5of2bi3c0k8?imageMogr2/quality/90/ignore-error/1)

**量子位**

追踪人工智能新趋势，关注科技行业新突破

3649篇原创内容

<br />

公众号  

，


[Read in Cubox](https://cubox.pro/web/card/7415988977947118436)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzIzNjc1NzUzMw==&mid=2247864589&idx=1&sn=362e27f27e4034509892d1575ad54cd1&chksm=e933ee249a7b260f27c1b77deb37525fa4a3d8a5f6cc311b729b69fe4478cfa39da5176e5079&mpshare=1&scene=1&srcid=0128BaCKfHbvjNIvFZi5TNbF&sharer_shareinfo=74d2d44af20169f12e1d7d7f0c9d593f&sharer_shareinfo_first=74d2d44af20169f12e1d7d7f0c9d593f)  

---

