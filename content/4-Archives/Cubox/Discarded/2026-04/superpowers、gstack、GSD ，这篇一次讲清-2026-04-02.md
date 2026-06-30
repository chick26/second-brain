---
id: "7439133094189203605"
cubox_url: https://cubox.pro/web/card/7439133094189203605
url: https://www.xiaohongshu.com/discovery/item/69ccd5b6000000002102dd5b?app_platform=ios&app_version=9.24&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBOVFzOkzU4JfQYZhPHnDeHVCxe_IAjFXTS9qJBxGLuMI=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1775079104&share_id=182c26a2850443c7a677b5ecd29ecb27
tags: []

---
# superpowers、gstack、GSD ，这篇一次讲清

@心晴九天 的笔记
95人分享

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F0797860dcef2d3670d1116f54113544a%2Fnotes_pre_post%2F1040g3k031udn7m4kii005ocbu5vk1s7mftovlsg%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F4775b4c95e13a99cdc5acb03dd8f07ba%2Fnotes_pre_post%2F1040g3k031udn7m4kii0g5ocbu5vk1s7mi8avthg%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F23700366119959f75f234d92ce81f637%2Fnotes_pre_post%2F1040g3k031udn7m4kii105ocbu5vk1s7mq8c8q4o%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2Faa9f3436ac17b0dcb2b263f5e786a489%2Fnotes_pre_post%2F1040g3k031udn7m4kii1g5ocbu5vk1s7me0529ro%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F852d8e6fdf984cf493ac935fba2a3f42%2Fnotes_pre_post%2F1040g3k031udn7m4kii205ocbu5vk1s7mjtqr3to%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F4a6eb1f591cea73b25f4b966de9ff636%2Fnotes_pre_post%2F1040g3k031udn7m4kii2g5ocbu5vk1s7mj87ud4o%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2F142ac163043b247b99926abe548a9ff2%2Fnotes_pre_post%2F1040g3k031udn7m4kii305ocbu5vk1s7m4ock15g%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202604020531%2Fb92f49cf0ae398bb48233dd0cb47cb8f%2Fnotes_pre_post%2F1040g3k031udn7m4kii3g5ocbu5vk1s7mjq8bl9o%21nd_dft_wlteh_webp_3&valid=false)

最近很多人都在聊 superpowers、gstack，并都开始补 GSD 了。  
对大部分人来说，难的不是安装，而是装完以后怎么选、怎么搭、怎么不打架。  
我自己实际用下来，三者并不是简单的替代关系。  
Superpowers 更像执行层框架。它把需求澄清、设计确认、实现计划、TDD、验收串成一条完整 workflow，适合已经大致知道要做什么、想把代码写得更稳的人。官方也明确把它定义成基于 composable skills 的完整软件开发流程。  
gstack 更像角色化管理层。它不是单纯让 AI 写代码，而是把 CEO、设计、架构、review、QA、发布这些角色一起拉进来，更像在管一支虚拟工程团队。官方 README 现在写的是 23 个专门工具和 8 个 power tools。  
GSD 则更偏底层方法论。它最重要的不是"多几个角色"，而是通过 context engineering 和 spec-driven development 解决上下文腐化，让 AI 在长链路开发里不那么容易越做越散。它现在也已经支持 Claude Code、Gemini、Codex、Cursor、Windsurf 等多个运行时。  
所以我的最终做法不是"三套全装全开"。  
而是按层拆：  
想清楚做什么：用 gstack  
把上下文和 spec 管稳：用 GSD  
真正把代码做出来：用 Superpowers  
一句话总结：  
gstack 负责想，GSD 负责稳，Superpowers 负责做。  
如果你是产品经理、独立开发、或者经常一边想需求一边做 demo，这套分层会比"谁火装谁"稳定得多  
#ai\[话题\]# #vibecoding\[话题\]# #skills\[话题\]# #superpower\[话题\]# #gstack\[话题\]# #AI\[话题\]# #claude\[话题\]# #claudecode\[话题\]# #互联网产品经理\[话题\]# #AI产品经理\[话题\]#


[Read in Cubox](https://cubox.pro/web/card/7439133094189203605)  
[Read Original](https://www.xiaohongshu.com/discovery/item/69ccd5b6000000002102dd5b?app_platform=ios&app_version=9.24&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBOVFzOkzU4JfQYZhPHnDeHVCxe_IAjFXTS9qJBxGLuMI=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1775079104&share_id=182c26a2850443c7a677b5ecd29ecb27)  

---

