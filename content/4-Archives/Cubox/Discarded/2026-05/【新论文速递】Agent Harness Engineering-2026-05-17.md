---
id: "7455464999901727016"
cubox_url: https://cubox.pro/web/card/7455464999901727016
url: https://www.xiaohongshu.com/discovery/item/6a062b810000000010001c00?app_platform=ios&app_version=9.31&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBsF8CkhbtiiwlgOPJCajUUL7PiYXNr-wanu9aQLFWMzo=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1778972934&share_id=e41494174ba641e5a01bac0e6abf142d&code=8QSiulHfVdu
tags: []

---
# 【新论文速递】Agent Harness Engineering

@momo大王 的笔记
103人分享

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202605170709%2F8cfcdc7144cd267a6672fe46b0ea677c%2Foss-sg%2Fnotes_pre_post%2F1040g3mo3205n0ebmne005pprh0v7dm0e0btg9r0%21nd_dft_wgth_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202605170709%2F04746a773d7db3fea6597639c4caa47b%2Foss-sg%2Fnotes_pre_post%2F1040g3mo3205qo7gtne005pprh0v7dm0e1gt9nc8%21nd_dft_wgth_webp_3&valid=false)

👥 来自 CMU / Yale / Amazon 等 9 个机构  
LLM agent 真正的瓶颈,可能不在模型 🔥  
最近一篇由 CMU、Yale、Amazon 等 9 个机构联合发布的 agent 系统 survey 提出了一个相当直接的观点:决定一个 LLM agent 能否在生产环境可靠运行的,往往不是模型本身,而是包在模型外面那层基础设施。他们将这层基础设施定义为 agent harness。  
📊 几个让人印象深刻的数据。同一个模型,完全不动权重,只改 harness:  
coding benchmark 上 10× 提升  
Terminal-Bench 2.0 上 +13.7 个点  
表现超过所有人工调过的 baseline  
💡 论文核心贡献:  
1️⃣ 提出 ETCLOVG 七层 taxonomy,涵盖 Execution / Tool / Context / Lifecycle / Observability / Verification / Governance  
2️⃣ 系统梳理 170+ 个开源 agent 项目,看清各层生态密度  
3️⃣ 总结了 prompt → context → harness engineering 的三阶段演化  
4️⃣ 指出当前最薄弱的层(governance、observability)及未来研究方向  
🎯 适合谁看:  
做 coding agent、browser agent、long-running research agent,或者任何想把 agent 跑进生产的从业者。  
📄 论文 + project page + Awesome list 链接在评论区自取～  
#AI论文\[话题\]# #LLM\[话题\]# #AIAgent\[话题\]# #大模型\[话题\]# #agent\[话题\]# #机器学习\[话题\]# #论文分享\[话题\]# #人工智能\[话题\]# #驾驭工程\[话题\]# #Harness工程\[话题\]#


[Read in Cubox](https://cubox.pro/web/card/7455464999901727016)  
[Read Original](https://www.xiaohongshu.com/discovery/item/6a062b810000000010001c00?app_platform=ios&app_version=9.31&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBsF8CkhbtiiwlgOPJCajUUL7PiYXNr-wanu9aQLFWMzo=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1778972934&share_id=e41494174ba641e5a01bac0e6abf142d&code=8QSiulHfVdu)  

---

