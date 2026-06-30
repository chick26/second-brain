---
id: "7436451577482708375"
cubox_url: https://cubox.pro/web/card/7436451577482708375
url: https://mp.weixin.qq.com/s?__biz=MzE5MTA3NzcxMQ==&mid=2247488238&idx=1&sn=76aaec3e7e688c31cd8f40b9d0080e70&chksm=971e48fef269e53bab655aea0aef75c61bdf9d013ec12e863b9910bebc0d8d2897a248d1b2ea&mpshare=1&scene=1&srcid=0325Uy235X2jLDgaz74771T4&sharer_shareinfo=53f0c60faaef88921fda7bbed62ed2ce&sharer_shareinfo_first=53f0c60faaef88921fda7bbed62ed2ce
tags: []

---
# MiniMax Office Skills：开源一套生产级办公文档引擎



M2.7 开启了模型的自我进化，是我们第一个模型深度参与迭代自己的模型。在专业办公领域，M2.7 对 Office 三件套 Excel/PPT/Word 的复杂编辑能力有了显著提升，能更好地完成多轮修改和高保真的编辑。

在实际场景的使用中，我们发现，使用Agent处理文档最难的不是写不出来，而是写出来不能用，比如公式存完变成了死数字，模板编辑一轮后格式全乱了，数据透视表保存之后悄悄丢了......文件能打开，但没办法作为最终交付产出。

为了解决这些问题**，我们搭建了一整套 Office Skills，让生成出来的文档真正经得住交付。**

今天，**我们把这套能力完整开源，包括四个 Office Skills 的代码、设计选型的思路、以及 Skills 自进化的机制，** **均采用 MIT 协议** **。**

如果你也在做 Agent 办公场景，或者正在头疼文档生成出来总是不能直接用，这篇文章会讲清楚两件事：

* 我们是怎样构建 Office Skills 的，为什么在不同文档格式上做了不同的技术选型

* 一套 Skill 怎样在自动评测里持续变稳、持续变强


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FUqLjwjsK1PdMaQdcXSr8zlRjCQDvLnjHSOicACvTIQVCK3yjvvF55bNo7q5Siao7HmRYFJMSCou6coduDaxkNLt5QL0YuLWrbmxiaxgRh95qOk%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D0)

这四个 Skill 都在生产环境里跑过了多轮自动化测试。用户给出一句话，比如"帮我写一份 Q3 策略报告"，Skill 就能完成从内容组织、排版控制到最终输出的整条流程，生成可直接交付的文档。接下来，我们分别讲讲每个格式的核心难点，以及为什么最后落在现在这套方案上。


**01**


**技术选型：
每个决策背后的取舍**


### ① MiniMax-docx：选择 NET OpenXML SDK，而非 python-docx

### 这是整个项目中讨论最久的一个选型。

python-docx 是社区里最常见的 Word 生成方案，轻量、易用。但当需求推进到复杂表格嵌套、多级目录、页眉页脚控制、修订追踪这些复杂场景时，有些功能它不支持，有些它支持但生成出来的文档结构容易出错。

.NET OpenXML SDK 是微软官方维护的底层库，对 ECMA-376（Word 文件格式的官方标准）的实现最完整。选它意味着更高的部署成本，需要额外部署 。NET 运行环境，但换来的是对 Word 文档结构更完整、更可靠的控制力。

**我们在 Word 这个场景里的判断是，文档质量比部署便利性更重要。** 基于这一选型，我们覆盖了三种典型场景：从零生成完整文档、在已有文档上编辑内容而不破坏原有格式、以及将设计模板套用到文档上并自动校验结构是否合规。围绕这些场景，我们沉淀了一批配套文档，包括 OpenXML 格式参考手册、中日韩排版指南、以及 10+ 可直接运行的示例代码，细节在 Github 仓库里。


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUqLjwjsK1PcvrwFYcDZoLrsIGXFda4XHpySibo55aOJr9KAB7efvR8v0P20ibopiaXfs0gQXOsfqekibm76728icuAXx1n7GnlSnVnpDhOkGgF54%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D1)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1PfibSyNJVk8iaiaxic5XIhEYQNfj8h177Ns15Fv1bPAkXZp37MpvJpf5OUTFIJpmSDYcNH2ib5ZeibgkET6sCR2qMN3bPicrBMibkmmGRw%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D2)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1PeeXkK7wpjPoXgMtJIO8tH6rhxCDT06Aq80pXic8pzTMIymLicf0sgHRdfCZxLAa2BbSBcMOyTib77q5r9iat76oe1NTCKicHvibDSj0%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D3)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1PfOmktBTe8FMxM80bV16l4cw1ypgfoMVrY3iamBY4RkASJK4PKiaW2WXQ6R6933stjL4XCkZNDVSluDb1GK46a6iaEo4h1bbd6kOs%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D4)


Omakase 日料菜单示例（可上下滑动）
> Query：为高端 Omakase 日料餐厅体验打造一份精致、高端的菜单，呈现奢华、优雅的质感，具备餐厅级专业水准，布局简洁、措辞考究。需包含以下板块：时令刺身、寿司、烤物、前菜、主厨招牌套餐、甜品及饮品。

### ② MiniMax-xlsx：直接操作 XML，而非依赖 openpyxl

Excel 的坑更隐蔽。很多时候不是 Agent 写不出来，而是"写完以后悄悄坏了"。

Openpyxl 是社区里最常见的 Excel 处理方案，但它有一个工程上很难接受的问题：文件读入再写回之后，一些高级内容会被静默丢弃。比如一个包含数据透视表、迷你图、VBA 宏的 Excel 文件，被 openpyxl 打开再保存，这些东西可能就没了，甚至没有报错和提示。对于"读取→编辑→回写"这个最常见的使用场景，这种损失不可接受。

**我们的方案是绕开所有 Python Excel 库，直接在** **XML** **层面操作。** .xlsx 文件本质上是一个压缩包，里面是一组 XML 文件。我们的做法是：解压 → 只修改目标单元格对应的 XML 节点 → 重新打包。这样每次编辑只动需要动的地方，样式、图表、宏都原封不动保留。

另一个关键点是公式。很多方案会把公式提前算好，存一个静态数字进去。我们要求每一个派生值都必须是真正的 Excel 公式，比如 SUM(B2:B9)，这样用户打开文件后还能正常编辑和联动。

**为此我们开发了 13 个独立的 Python 工具脚本，覆盖解压打包、列插入、行偏移、公式校验、动态重算、格式审计等环节，同时写了一份 34,000 字的金融格式化标准文档，对齐投行级别的数字格式和排版要求。**


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_gif%2FUqLjwjsK1PcukLzHEt8Q4OTNO5fSceEywjjzv8fXkb6AwBd2jqxD6MvbqPbUx7xfhquoNiadqKpNianVYwNM7ibibRFILSFnNiayKc3ict58ZtM4g%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D5)
> Query：帮我在表格的最右边加一列，填入对商品服务描述的中文翻译，注意表头的样式以及其余的样式不要发生变化。


### ③ MiniMax-pdf：封面和正文要拆成两套渲染引擎

PDF 的核心挑战不在于文字呈现本身，而在于需要做出一套可复用、可扩展的设计系统。我们为 15 种文档类型设计了独立的视觉语言，每一种都有对应的封面模式、字体和配色方案。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FUqLjwjsK1PfGVdsCYaibuXTgicgOBJialMku7wobancibKV3ImN7yftF9TPRcbaSeAVNnCOcNWeUf8jtmWkYdae7v3NVcvLRVeiaia1S0kicS4R2zo%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D6)

**在技术实现上，我们做了一个关键判断：封面和正文使用不同的渲染引擎。**

封面用 HTML + CSS 编写，通过 Playwright 渲染为 PDF。原因在于渐变、网格、混合模式、自定义字体这些设计能力，CSS 原生就支持，而多数 PDF 绘图 API 做这些非常吃力。正文交给 ReportLab 排版，它在段落流控制、分页策略、页眉页脚方面更稳定可控。最后通过 merge 脚本把两部分合并成一份完整的 PDF。

拆成两套引擎，系统更复杂，但封面可以大胆做设计，正文仍然保持工程上的稳定性。


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1PdN1zvFPdWOE3IYGbzvutPiaB8NppzSoVXkcVjVREdh8L29BE7Thp8aHzyt6FRw9PE29CYWjhEicDlt9FZJURoJrapg5Oyhj3Bbw%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D7)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUqLjwjsK1PcSDfLp7kdQJ7ztsr7AhViaI8qIkUcv8gBTmVpA57mLm3mqgKBqWJXb4oHicO6CAzgkbYINzCrGvWKuU4GVJ5iaztwFBqwoGHqdjI%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D8)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1PfcALib4JZvnGdRicZwOIMCewdosibXe9ibt4pn1ibNZB5gkViabg857kKiaGPo4tTVHxZ4ticCZUpHZoOh5BDg2gFIAUwTnwjm9epHiaAQ%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D9)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FUqLjwjsK1Pec3HicXoj7dMqAyhZZ8ATjWaElazUiblLyVmFFLYb1ibcU3lHCODuF5Yia5YtsW0ibP6z6picxgyn4XVV3rX2RtTpibiaZhSsaotncl98%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D10)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUqLjwjsK1PfvpQaR54ghoOyqRia5d83GothJfNg0mCtrkb6nEzhTb4qaTrF4apKw7N5K8ZCIVS7EI3CgLIaNNSf8zibCickR1zthZElemJ7veU%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D11)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUqLjwjsK1Pcxe6oReHbuyUFy1RgZnUvSPxncMYN5j7cTkEAgZ6A9LIt9iavUhyYEPW9ZdlkZ5ByAzlVV6XmAKeo7ib27smicLCO2Mq1wnlg78A%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D12)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUqLjwjsK1Pd8aqOiaMLjCB8QXuIMmAIbN1ribSuazicibw04aRJ8P6QJq35XB0EuxvicVPddicv1xmSjgLFg841YkDyUTsPLNMR6AONxTxMkAhLTo%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%23imgIndex%3D13)

艺术展览 Ephemeral Forms（可上下滑动）

④ PPTX-generator：难点是视觉风格一致性

PPT 生成的难点不在于往 slide 上放内容，而在于视觉风格的统一，字体大小、间距、配色、圆角弧度，任何一个地方不一致，整份演示文稿看起来都会很粗糙。

**我们的做法是先定义一套约束体系，再去做生成。**

页面类型上，我们定义了 5 种标准类型：封面、目录、章节分割、内容、总结。每种类型都有明确的布局规范和元素位置，不是随意摆放。

风格上，我们设计了 4 套配方：Sharp、Soft、Rounded、Pill。每套配方定义了圆角半径、阴影参数、边框粗细、间距比例等一整套数值。切换配方，就能整体改变一份 PPT 的视觉调性，而不用逐页调整。

技术实现基于 PptxGenJS，它是 JavaScript 生态里功能最完整的 PPT 生成库之一。对于已有模板的编辑场景，我们采用和 xlsx 相同的思路：解压 。pptx，直接修改 XML，再重新打包，尽量不破坏原有的格式和结构。


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_gif%2FUqLjwjsK1Pe1hPgG1Yic2E2BDtZydEStqKZmTezhv0jvPmiaKHIkhDax5L0xqiccsxzicxOXwKjib7kH0WRErT2yibGYzYZiaR0fm0mLx8ibKlS0JvM%2F640%3Fwx_fmt%3Dgif%26from%3Dappmsg%23imgIndex%3D14)
> Query：帮我生成一个介绍 Dota 2 职业选手 AME 的 PPT。


**02**


**自循环进化：
Skill 如何自己变好**


构建一个 skill 并不难。真正的挑战在于，你怎么知道它下一轮是不是更好了，以及它有没有在修一个问题的同时，又把别的场景弄坏。

在我们看来，办公文档这类任务最困难的地方，不是"第一次做出来"，而是你永远会遇到下一份更难的文档、更刁钻的模板、更多轮真实用户修改。一个 skill 如果不能在失败里持续学习，它很快就会停留在 demo 阶段。

所以我们没有把质量迭代完全交给人工 review，而是搭了一套固定的三阶段循环：**Execute → Evaluate → Fix。**

它的工作方式是：**先执行一组真实用例-\>再根据规则检查输出是否达标-\>把失败样例沉淀成可修复的问题，进入下一轮迭代** 。**这套机制能够让 Skills 的迭代围绕失败样例持续收敛** ，每一轮跑下来，我们都能更清楚地知道问题出在结构、公式、样式，还是模板约束上；修复之后，也能立刻验证，是真的变好了，还是只是换了一种方式出错。

这里对"达标"的定义不只是文件能打开。我们真正关心的是：结构是不是完整，公式还是不是公式，版式在读写之后有没有悄悄变形，模板约束有没有被破坏。一个 xlsx 文件即使成功保存，如果数据透视表丢了、公式被写成了静态数字，在真实交付里都算失败。一个 docx 文档目录能显示却无法正确更新，同样算失败。

这也是为什么前面每个格式我们都选了更复杂的方案------**只有底层链路足够可控，评测才可能对齐到真正有意义的质量指标，而不是停留在"程序没报错"这一层** 。

以下视频完整展示了这套系统的运行机制：

视频加载失败，请刷新页面再试

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAMAAADhynmdAAAAQlBMVEUAAACcnJycnJycnJyoqKicnJycnJycnJycnJycnJyfn5%2BcnJydnZ2enp6kpKSdnZ2cnJyenp6cnJycnJycnJybm5t8KrXMAAAAFXRSTlMAyeb3CNp3tJRvHIEtJhBgqztWRJ%2Bp5TqGAAABCklEQVQ4y5WTi27DIAxFAUMhgTzX8%2F%2B%2FurB2pdKI0x0pSoRuruyLbf7gF3PBaDE6X44LyY0D1SJQsfd9PpMM%2FCJx60v8SmV1HMSi1lKyA1n0jnwWSO08l04uJbxpBmTrpDtbGB6fmxC6Tc4BHv9aZDJdJsHW9w43Jez9x8T5M4l31WZsJn2bsYY%2BnUum2lQkGIVANPZ4FCLWOJImSTgjZE2SkU9crmu57mj9JBc93Qzj9R1d3HSG5bN5MRsnUzcGKK8Ns02z%2BDa7rYQE4bUE2PG1C6kVnkCyf0pwX8%2FjwbyxCLhcHpKTFkvkwK3pRmXtRrVFoTGYLvN%2Bt0EUl0qrRaF1pFBz0anp%2FptvNB4SY1XDAVMAAAAASUVORK5CYII%3D) 刷新


**03**


**开源信息**


我们把代码、设计文档和评测框架一起开源，希望这套东西能切实帮到正在做同类工作的团队，减少重复投入，也少在格式细节里反复踩坑。

如果你也在做 AI 文档生成、Agent 工具调用，或者正在把"能跑"往"能交付"推进，欢迎来看看这个仓库。跑通了某个 case，修了某个边角问题，或者有最真实的文档场景，也欢迎直接提 PR、提 issue。

GitHub: github.com/MiniMax-AI/skills

协议：MIT

本次介绍的四个 Skill 已在MiniMax Agent 与 MaxClaw 中上线，可以直接体验：agent.minimaxi.com

Skill开源代码搭配 M2.7 效果最佳，可通过 Token Plan 调用，欢迎大家订阅体验：platform.minimaxi.com/subscribe/token-plan


Intelligence with Everyone.

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2Fq4wL2iaHZfGmXHU4a02nELvm6q34N35cLPb4vTM6VBa1vlnlXe3cPmdAyKd5OvianerQsPib4ExFL2XUqJbHFLSzg%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D15)


[Read in Cubox](https://cubox.pro/web/card/7436451577482708375)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzE5MTA3NzcxMQ==&mid=2247488238&idx=1&sn=76aaec3e7e688c31cd8f40b9d0080e70&chksm=971e48fef269e53bab655aea0aef75c61bdf9d013ec12e863b9910bebc0d8d2897a248d1b2ea&mpshare=1&scene=1&srcid=0325Uy235X2jLDgaz74771T4&sharer_shareinfo=53f0c60faaef88921fda7bbed62ed2ce&sharer_shareinfo_first=53f0c60faaef88921fda7bbed62ed2ce)  

---

