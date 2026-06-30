---
id: "7427329147334034938"
cubox_url: https://cubox.pro/web/card/7427329147334034938
url: https://www.xiaohongshu.com/discovery/item/69a178e9000000000d00830c?app_platform=ios&app_version=9.19.5&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBoFCKwE8SwGH5m5FRTVa0ntblXK-4kGSznTU6QhF93GU=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1772264830&share_id=9ef6fec8ad3344dc87ea784cc03b570e
tags: []

---
# qwen3.5 122B部署简评

上次说到部署27/35B，这回说下122B的简评。 首先感谢下千问团队，在大家都为了打榜而死命卷超大参数量的模型的现在

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=http%3A%2F%2Fsns-webpic-qc.xhscdn.com%2F202602281547%2Ffb30933df61e240897230239d9d0bac5%2F1040g2sg31t3b85dalkf05nohjn6g8ge7837d140%21nd_dft_wlteh_webp_3&valid=false)

上次说到部署27/35B，这回说下122B的简评。  
首先感谢下千问团队，在大家都为了打榜而死命卷超大参数量的模型的现在，仍然推出30上下的模型，这次还推出了100多B小公司挤挤也能上的模型。  
那么就开始正文。  
1 由于我司8卡里有两张卡占着其他业务，即便挤一挤有7张卡，但16个注意力头没法被6 7整除，因此没法设定为tp 6 7，作为变通，可以使用2tp 3pp，这样就能支持到65536 token有63.7并发，13.1k有8.9并发，26k 4.4并发；  
2 3.5原生支持mtp，可以的话建议开了，开了后能翻两倍多吞吐，每秒有150-170t的输出；  
3 nightly版的vllm对mtp支持不够好，正经上线后很快就遇到bug导致进程结束，建议可以先尝试开了，看下实际场景会不会遇到崩溃；  
4 启用pp后，mtp没法使用，不知道后续有没有可能支持；  
5 2 tp 3pp时，每个请求大概能有60token，目前在三四并发下没看到单请求token下降的情况，但这组合会有个神奇的情况，vllm启动后的头几个请求几乎没法响应一直在等待，gpu负载也上不去，过了两三分钟后就回到正常情况；  
6 使用pp时能明显发现头token的响应时间延长，得再确认下填充还是解码阶段慢了，总的来说，能有2-4-8 tp的话，即便是pcie通道也是纯tp性能好；  
7 122B的代码生成能力很让人惊奇，glm4.7经常冒出来的工具调用失败，这模型很少失手，在简单的改写或者创建小方法的情况下，很稳定，在解析存储过程时表现也相当良好；  
8 聊天方面，我觉得和gemini 2.5的调调类似，会捧用户，但用词算是挺中肯了，没gemini现在的降维打击、切中要害，也没gpt5.2那种遇事不决先吊一通用户；  
9 聊天风格方面比起qwen 3 2507版本，明显沉稳多了，偏gpt这种打工人的感觉，如果喜欢上版本那种小红书文案入脑，动不动颜文字的风格，换到3.5可能会失望；  
10 cot比27/35B的靠谱许多，35的出现cot死循环的概率不算低，122的通常算节制，15-20秒能完成思考，但输出爆炸的情况也常见；  
11 知识广度明显强过之前的更小参数量的模型，这算意料之中，能不能和之前的235掰掰手腕还不好说；  
12 VLLM_USE_V1=0已经失效，目前版本下没法用它切回V0核心，官方文档到现在还没更新；  
13 Triton核心的调优脚本已经11个月没更新了，现在即便是启动时出现Performance might be sub-optimal的警告也没好办法处理；  
14 \[doge\]想痛骂资本家的话，它能陪你一块骂，如果骂百度美团它能更起劲，但是说到阿里就骂不得了。  
总结下就是，资源允许的话，3.5这122B的版本相当推荐一试。


[Read in Cubox](https://cubox.pro/web/card/7427329147334034938)  
[Read Original](https://www.xiaohongshu.com/discovery/item/69a178e9000000000d00830c?app_platform=ios&app_version=9.19.5&share_from_user_hidden=true&xsec_source=app_share&type=normal&xsec_token=CBoFCKwE8SwGH5m5FRTVa0ntblXK-4kGSznTU6QhF93GU=&author_share=1&xhsshare=WeixinSession&shareRedId=N0k0OEc1RUs2NzUyOTgwNjY6OThJN0tB&apptime=1772264830&share_id=9ef6fec8ad3344dc87ea784cc03b570e)  

---

