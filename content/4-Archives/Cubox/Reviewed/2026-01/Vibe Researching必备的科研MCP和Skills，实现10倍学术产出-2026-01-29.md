---
id: "7416519557809963103"
cubox_url: https://cubox.pro/web/card/7416519557809963103
url: https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484556&idx=1&sn=7393b7d12e2fec54f16e393d7d4a7a01&chksm=97e0ba56034469a6b9026bcc9071deeeed3ddc04fb48a18222a4f2007542cb785596baa6ed79&mpshare=1&scene=1&srcid=0129oGTXHSromU0ajVZk6cPM&sharer_shareinfo=25d86363bd85a8304eae93f971c85565&sharer_shareinfo_first=25d86363bd85a8304eae93f971c85565
tags: []

---
# Vibe Researching必备的科研MCP和Skills，实现10倍学术产出

把Claude Code打造成科研生产力。

大家好，我是鲁工。

Vibe Coding概念火了之后，顺带在很多领域兴起了Vibe的潮流。比如Vibe PPT、Vibe Video，以及我今天要聊的Vibe Researching。

之前我在[从Vibe Coding到Vibe Researching，Claude Code也可以是最强科研工具](https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484356&idx=1&sn=e83a04aeee2e69d9a5dcebecc77ada82&scene=21#wechat_redirect)一文中重点聊过Vibe Researching的概念，本质上是一种AI协作进行科研的新范式。

今天则是聚焦工具篇，给大家推荐基于Claude Code进行Vibe Researching，有哪些必备的MCP和Skills工具来帮我们提高科研产出效率。

先来看MCP。科研场景下的MCP主要是用于搜索、查询和访问各类文献数据，比如访问本地文献库和查询网络开源文献库。

Zotero-MCP：让Claude访问本地文献库

如果你用Zotero管理文献，这个MCP必装。作为Zotero的老用户，Zotero-MCP我在此前的综述写作工作流中也重点推荐过。

Zotero MCP能让Claude直接访问你的Zotero文献库，实现论文摘要、引用分析、语义搜索等功能。最实用的是它的AI语义搜索：不是简单的关键词匹配，而是基于嵌入向量的语义理解。

比如你可以这样问Claude：
> 帮我找出Zotero里所有关于Transformer在医学图像分割领域应用的论文。

Claude会自动搜索你的文献库，返回相关论文列表，还能帮你做摘要对比。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMdYrEPYQQrfGEP0sOf0mbZicHQqmltQPg8bfYSZvAXzA3omhFVg1K9H7Q%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D0)

安装方法也非常简单，具体参考Zotero-MCP项目地址：

https://github.com/54yyyu/zotero-mcp

我现在做文献综述前，一定是先把相关论文导入Zotero，分类打好标签，然后在Claude Code中使用Zotero-MCP访问本地文献并进行归纳整理。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMdZGEMRuxuKiawaS6ibjAd8gGjmq0HqtG0LHr9yaO246Rz6vbjOBxXJ3zw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D1)

Perplexity MCP：Deep Research工具

搞学术离不开技术调研。按照我的使用习惯，我其实更喜欢Gemini和ChatGPT的Deep Research功能，但奈何这两个都没有对外开放接口。但Perplexity可以。

Perplexity以AI搜索出名，Perplexity MCP能让Claude调用Perplexity的搜索能力，返回的信息已经是总结好的、带引用的。

它有三个模式：

* **sonar-pro：快速问答，适合简单查询**
* **sonar-deep-research：深度研究，适合综述调研**
* **sonar-reasoning-pro：复杂推理，适合分析类问题**

日常使用sonar-deep-research模式就好。比如写综述时需要了解某个领域的最新进展，直接让Claude用Perplexity调研，返回的内容结构清晰、引用完整，省去了大量手动搜索整理的时间。

安装方法：

    claude mcp add perplexity --env PERPLEXITY_API_KEY="your_key_here" -- npx -y @perplexity-ai/mcp-server


记得去Perplexity官网申请API Key。有免费额度，但日常使用的话还是得付费申请API。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMdsLFPtTAs0pScTOhtV22YpLhBOJTo6Sb06r6F1tEhVKA1wibO3GyIlgQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D2)

项目地址：

https://github.com/perplexityai/modelcontextprotocol

Paper Search MCP：多源论文搜索一网打尽

Zotero管理的是你已有的文献，但找新论文怎么办？

Paper Search MCP支持从多个学术数据库搜索和下载论文：

*
  arXiv（预印本）
*
  PubMed（生物医学）
*
  bioRxiv / medRxiv（生物/医学预印本）
*
  Semantic Scholar（综合学术搜索）
*
  Google Scholar（谷歌学术）

最方便的是它不仅能搜，还能直接下载PDF。

安装方法：

    uv add paper-search-mcp


然后在Claude Code的MCP配置添加如下配置代码：

    {  "mcpServers": {    "paper_search_server": {      "command": "uv",      "args": [        "run",        "--directory",        "/path/to/your/paper-search-mcp",        "-m",        "paper_search_mcp.server"      ],      "env": {        "SEMANTIC_SCHOLAR_API_KEY": "" // Optional: For enhanced Semantic Scholar features      }    }  }}


使用示例：
> 在arXiv上搜索最近一个月关于medical image segmentation的论文，下载前5篇

Claude Code会调用Paper Search MCP自动搜索、筛选、下载，省去了你在多个开源论文平台之间来回切换的麻烦。当然如果你想只安装arxiv或者pubmed的MCP，也是有对应的开源方案可以选择的。

对于做医学AI研究的同学，PubMed和bioRxiv的支持非常实用。很多最新的研究成果都是先发预印本，等正式发表可能要半年甚至更久。

项目地址：

https://github.com/openags/paper-search-mcp

以上是三个文献搜索和获取的MCP。下面我再推荐三个用于实际科研工作的Skills。

claude-scientific-skills：139个即用型科研技能

claude-scientific-skills是一个科研技能包，包含139个即用型技能，主要是用于医学和生信领域的具体科研分析方法。这个我之前也重点介绍过。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMd5mR16vCFPzdViaiabMJOLnOGYyWuc8E7w4IUvicfKSW2QgL0o2CEbSxAw%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D3)

**claude-scientific-skills具体包括** ：

* 生物信息学：序列分析、单细胞RNA-seq、变异注释

* **化学信息学** ：分子性质预测、虚拟筛选、ADMET分析

* **蛋白质组学** ：LC-MS/MS数据处理、肽段鉴定

* **临床研究** ：临床试验设计、药物基因组学

更厉害的是，它集成了约11GB的生物医学数据库，包括Ensembl、NCBI Gene、UniProt、PDB、AlphaFold、ClinVar、PubMed等。

安装方法：

    cd ~/.claude/skillsgit clone https://github.com/K-Dense-AI/claude-scientific-skills.git


```

```

克隆到Claude的skills目录后，Claude会自动识别和加载这些技能。

对于生信方向的同学，序列分析和单细胞RNA-seq相关的技能非常实用，能省去很多重复性的代码工作。

项目地址：

https://github.com/K-Dense-AI/claude-scientific-skills

claude-scientific-writer：科研写作助手

如果说claude-scientific-skills侧重于研究过程，claude-scientific-writer则专注于写作输出。claude-scientific-skills和claude-scientific-skills一样，都是来自于KDense科研团队的开源。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMd8MEibtMj0jrYWvurfYsicqGhxjjwpibwLZVjprGNWLjoku2JQWNliaokdQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D4)

它提供了20个科研写作相关的技能：

* **文献综述：生成结构化的综述框架和内容**
* **假设生成：基于文献提出可检验的研究假设**
* **同行评审模拟：模拟审稿人视角审视你的论文**
* **基金申请：帮助撰写基金申请书各部分**
* **论文各部分撰写：Introduction、Methods、Results、Discussion**

安装方法：

    /plugin marketplace add https://github.com/K-Dense-AI/claude-scientific-writer/plugin install claude-scientific-writer


我觉得最实用的是**同行评审模拟** 功能。写完论文初稿后，让Claude扮演审稿人来挑毛病，提前发现问题。虽然不能完全替代真正的同行评审，但能帮你在投稿前把明显的硬伤修掉。

另一个常用的是**基金申请** 技能。写基金本子是很多科研人员的痛点，这个技能能帮你生成研究背景、技术路线、创新点等部分的初稿，然后你再根据实际情况修改完善。

项目地址：

https://github.com/K-Dense-AI/claude-scientific-writer

AI编程实验室出品：Research Skills

最后一个Skill是我自己根据个人科研实践设计和开源的，也就是之前在[我用Claude Code写了一篇45页的文献综述，质量可以发一区SCI](https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484397&idx=1&sn=1e950964a0c8b6e42eeaf172e4ed25b9&scene=21#wechat_redirect)中提到的Research Skills。

我在之前融合闭源和开源文献撰写医学研究综述的基础上，新增了根据论文PDF生成PPT的skill、撰写博士申请的Research Proposal的skill。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2F29gExhZKtdoqickad8q4W0oVTicxkhgsMdbELicB4zJ8DLCkC6VKj0xrn4M0IKIvpiaLSvoaPWn0pmepDcGmpPDdaA%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D5)

项目地址：

https://github.com/luwill/research-skills

写在最后

工具只是工具，无论是Vibe Coding还是Vibe Researching，核心还是人。AI能帮你处理繁重的执行工作，但提出好问题、把控研究方向、做出创新性判断，这些仍然需要人类研究者的智慧。

不过话说回来，能把重复性劳动省下来，把精力放在真正需要思考的地方，这本身就是效率的巨大提升。

我是鲁工，九年AI算法老兵，AI全栈开发者，深耕AI编程赛道。欢迎关注，感兴趣的朋友也可以加我微信（louwill_）交个朋友。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2F4lN1XOZshfekhSPOVhKyHjek97r6uIakcYsqZxEMvKBCYqOO6wGleHTNuz4sff6Xns2LDGah9Jb6c39iaOhvfpQ%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%26wxfrom%3D5%26wx_lazy%3D1%26tp%3Dwxpic%23imgIndex%3D4)

\>/ 作者：鲁工


[Read in Cubox](https://cubox.pro/web/card/7416519557809963103)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484556&idx=1&sn=7393b7d12e2fec54f16e393d7d4a7a01&chksm=97e0ba56034469a6b9026bcc9071deeeed3ddc04fb48a18222a4f2007542cb785596baa6ed79&mpshare=1&scene=1&srcid=0129oGTXHSromU0ajVZk6cPM&sharer_shareinfo=25d86363bd85a8304eae93f971c85565&sharer_shareinfo_first=25d86363bd85a8304eae93f971c85565)  

---

