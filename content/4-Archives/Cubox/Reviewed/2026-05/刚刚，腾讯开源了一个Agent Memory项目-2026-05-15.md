---
id: "7454973108483524093"
cubox_url: https://cubox.pro/web/card/7454973108483524093
url: https://www.xiaohongshu.com/discovery/item/6a058276000000003503b5b8?app_platform=ios&app_version=9.31&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBljMSrDTqGlfxoeMSs38QMbrj6TH9vz1sJmeXZcDmGUo=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1778855654&share_id=6ad637d810104741be21fb7741306e66&code=AmWhLzbaSX3
tags: []

---
# 刚刚，腾讯开源了一个Agent Memory项目

@Max For AI 的笔记
269人分享

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202605152234%2Fcb0781c15efce93b038877516f99c2a9%2Fnotes_pre_post%2F1040g3k83204s4jn4l4905p46e12n563kgu60ip8%21nd_dft_wgth_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202605152234%2F7d7cf370a4e2a2495d7b927204261881%2Fnotes_pre_post%2F1040g3k83204s4jn4l49g5p46e12n563kq6dvo78%21nd_dft_wgth_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202605152234%2F4396b6ef7abd966ac16611a9471b4474%2Fnotes_pre_post%2F1040g3k83204s4jn4l4a05p46e12n563ki1t0q28%21nd_dft_wgth_webp_3&valid=false)

腾讯开源了TencentDB Agent Memory  

它在处理一个更底层的问题  
长程Agent到底怎么管理自己的记忆？  

现在很多Agent Memory项目  
本质还是把历史对话切片丢进向量库  
再靠相似度召回  

这个思路能跑Demo  
但一旦任务变长  
就很容易出问题  

因为工具调用日志越来越长  
而且搜索结果也会越来越多  

最后上下文窗口里塞满了过程垃圾  
模型表面上还在工作  
实际上已经在信息泥潭里翻滚  

腾讯这个项目的核心设计是：  
符号化短期记忆+分层式长期记忆  

1️⃣短期记忆  
解决的是单次长任务里的上下文爆炸  
它会把厚重的工具日志卸载到外部文件  
中间层保留步骤摘要（比如jsonl  
最高层只给Agent留一张轻量任务图  

Agent平时只看任务结构  
不需要把原始文件全塞进上下文  
一旦需要核对细节  
再钻回原始文件  

这个很关键  
因为它不是简单摘要  
简单摘要最大的问题是  
省了Token也丢了证据  
这里的设计更像压缩索引  
高层保留结构  
底层保留证据  
中间靠ID打通  

2️⃣长期记忆  
解决的是跨会话的用户理解。  
它把记忆分成L0到L3：  
L0 Conversation原始对话  
L1 Atom结构化事实  
L2 Scenario场景块  
L3 Persona用户画像  

也就是说  
它不会把所有历史平铺成一堆向量碎片  
而是做成一座语义金字塔  
平时用L3理解用户的长期偏好和工作方式。  
需要具体事实时  
再回到L1甚至L0原始对话  
这比「召回几条最相似历史」更像真正可用的记忆系统。  

官方的Benchmark如下  
WideSearch成功率从33%到50%  
Token消耗从221.31M降到85.64M  
SWE-bench成功率从58.4%到64.2%  
Token消耗从3474.1M降到2375.4M  
AA-LCR成功率从44.0%到47.5%  
Token消耗从112.0M降到77.3M  
PersonaMem准确率从48%到76%  

它更可能像一套分层文件系统：  
上层是画像和任务图  
中层是场景、步骤和索引  
底层是原始证据  
平时压缩，必要时展开  
平时抽象，出问题时追证  

建议测测@科技薯  
#大模型\[话题\]# #人工智能\[话题\]# #互联网\[话题\]# #AI\[话题\]# #ai\[话题\]# #科技\[话题\]# #计算机\[话题\]# #互联网大厂\[话题\]# #机器学习\[话题\]# #腾讯\[话题\]#


[Read in Cubox](https://cubox.pro/web/card/7454973108483524093)  
[Read Original](https://www.xiaohongshu.com/discovery/item/6a058276000000003503b5b8?app_platform=ios&app_version=9.31&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBljMSrDTqGlfxoeMSs38QMbrj6TH9vz1sJmeXZcDmGUo=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1778855654&share_id=6ad637d810104741be21fb7741306e66&code=AmWhLzbaSX3)  

---

