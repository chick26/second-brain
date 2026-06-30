---
id: "7419635090671535887"
cubox_url: https://cubox.pro/web/card/7419635090671535887
url: https://www.xiaohongshu.com/discovery/item/69708ca2000000000b009d01?app_platform=ios&app_version=9.19.3&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CB3lIickPKg7NP8cg-vHlUTh-BEpEDXdwGQOK3DzfhbzU=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1770430418&share_id=392c73976cd4480083df11d4221ddcaf
tags: []

---
# IterResearch和ReAct模式详细对比（附案例

@DailyLLM 的笔记
35人分享

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Fb7fd0b599b9b5520b986bd7c06ca670e%2F1040g00831rjjbrpo22005pfga113cqga6ck817g%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2F60396d5c27cbf596e8f2ecd8eb4cc949%2F1040g00831rjjbrpo220g5pfga113cqga93atpqg%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2F4e6f9c8b780627a5778f3252f21b9fff%2F1040g00831rjjbrpo22105pfga113cqgamo13ue0%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2F6c408bb6ddbb66ef18701a84b34cd648%2F1040g00831rjjbrpo221g5pfga113cqgappc17k8%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2F2f9fd7528057a22b44cbb272a7fa886c%2F1040g00831rjjbrpo22205pfga113cqga271gbe8%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Ff95b6af40371534a7ab9641c415be7a7%2F1040g00831rjjbrpo222g5pfga113cqga315ljko%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Fb07cffb986223a690921f57c7c752f0f%2F1040g00831rjjbrpo22305pfga113cqgaf10f62g%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Fdc0f1184b77fa5bc5a75ec74532febde%2F1040g00831rjjbrpo223g5pfga113cqga65b109g%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Fd4a6aabf1d8b61883a6d886e2f80fb83%2F1040g00831rjjbrpo22405pfga113cqgaddhv8do%21nd_dft_wlteh_webp_3&valid=false)

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602071013%2Ff9e65e6061afc246eab130ce66d3b344%2F1040g00831rjjbrpo224g5pfga113cqgajlr2gk0%21nd_dft_wlteh_webp_3&valid=false)

最近在研究阿里通义的Tongyi DeepResearch，发现提出了新概念【IterResearch】，今天我们讲讲IterResearch是什么，以及和原生 ReAct 模式对比有哪些优点。  

#大模型\[话题\]# #人工智能发展\[话题\]# #互联网大厂\[话题\]# #多模态人工智能\[话题\]# #人工智能就业\[话题\]# #RAG\[话题\]# #算法\[话题\]#


[Read in Cubox](https://cubox.pro/web/card/7419635090671535887)  
[Read Original](https://www.xiaohongshu.com/discovery/item/69708ca2000000000b009d01?app_platform=ios&app_version=9.19.3&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CB3lIickPKg7NP8cg-vHlUTh-BEpEDXdwGQOK3DzfhbzU=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1770430418&share_id=392c73976cd4480083df11d4221ddcaf)  

---

