---
id: "7434838136875648738"
cubox_url: https://cubox.pro/web/card/7434838136875648738
url: https://www.xiaohongshu.com/discovery/item/69bd7eeb000000001e00ffab?app_platform=ios&app_version=9.22.1&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBnBlycooDWY0hCacw7yVjdb44PB_7LX3-7XBCsQgQAZk=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1774055106&share_id=3d1c1e720ef74340aad4834ec630911f
tags: []

---
# 我的理解是，Transformer 底层始终是在做 token-by-token

我的理解是，Transformer 底层始终是在做 token-by-token generation。 但在 Open

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202603210905%2F6a3310a5abf9f6dcdf123d35a85df1dd%2Fnotes_pre_post%2F1040g3k031tun264rn20g5pskr9fjjs7nc9784ig%21nd_dft_wlteh_webp_3&valid=false)

我的理解是，Transformer 底层始终是在做 token-by-token generation。  

但在 OpenAI Responses API 里，模型可以返回像 function_call 这样的结构化 item。这让我困惑：tool call 到底是怎么从模型里生成出来的？  

我目前想到3种可能：  
1. 模型生成类似"调用 get_weather，参数是 {...}"的自然语言，再由服务层解析成 function_call。  
2. 模型生成的本身就是符合工具调用协议的json，服务层只是把它整理成function_call输出。  
3. 模型生成关于function_call的special token+ 类似"调用 get_weather，参数是 {...}"的自然语言或者json。  

所以function_call是"文本后处理"，还是"模型直接生成结构化调用表示"？  

#ai\[话题\]# #人工智能\[话题\]# #llm\[话题\]# #大模型\[话题\]# #工具调用\[话题\]# #functioncalling\[话题\]# #transformer\[话题\]#


[Read in Cubox](https://cubox.pro/web/card/7434838136875648738)  
[Read Original](https://www.xiaohongshu.com/discovery/item/69bd7eeb000000001e00ffab?app_platform=ios&app_version=9.22.1&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBnBlycooDWY0hCacw7yVjdb44PB_7LX3-7XBCsQgQAZk=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1774055106&share_id=3d1c1e720ef74340aad4834ec630911f)  

---

