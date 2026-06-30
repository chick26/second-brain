---
id: "7430362006445623208"
cubox_url: https://cubox.pro/web/card/7430362006445623208
url: https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484938&idx=1&sn=7835f763b04f1d7f459c1ef17f08ce11&chksm=9751f0334c6d0828178c5cae32e9744b66b6764557f63b1e9cfd7f3a64af528c7c1479e06871&mpshare=1&scene=1&srcid=0309be3tnO4OX84lZQzQiNfK&sharer_shareinfo=17728e194987d37fd09b7464ec437dd0&sharer_shareinfo_first=17728e194987d37fd09b7464ec437dd0
tags: []

---
# Agent Reach，可能是Claude Code/OpenClaw最好的联网工具

搜索这一块，还有高手。

大家好，我是鲁工。

使用Claude Code/OpenClaw时，联网查询一直是个刚需。对于常规的网站，通过Claude Code自带的WebFetch或者OpenClaw的BraveSearch工具，基本都能搞定。

但对于各大平台，比如X、微信公众号、小红书、Youtube、抖音等，常规的搜索基本无效。本周一的时候，我写了一篇用apify做Claude Code数据抓取的文章，好用是好用，但api太贵，一个月要25刀，很多人20刀的ChatGPT plus都不一定愿意出，一个数据采集就要这么贵，多少有点让人难以接受。

直到前几天我刷到了Agent Reach这个项目。

项目地址：

https://github.com/Panniantong/Agent-Reach

两周不到，GitHub上已经有7000多Star了。我装上试了一下，确实解决了我的痛点。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FMHVsz9lwuhXtNcQLTzn8DpqAUfia4FCVQ66k3y1gNOZ4ESQmg9dibc0iacQXenV6Oh6sghJ3BG8TRkaJ1PiagG7dzvWAMyXERdXH7yHM8J6lgVM%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D0)

## Agent Reach是什么？

## 一句话概括：它是一个脚手架，帮你把AI Agent联网所需的工具选型和配置全部做完。注意，它是一个脚手架，跟框架完全两回事。这个区分很重要。

装完之后，你的Agent直接调用上游工具（xreach、yt-dlp、mcporter、gh CLI这些），不经过Agent Reach的任何包装层。简单来说就是，Agent Reach帮你选好了工具、装好了依赖、配好了环境，然后它就退到一边去了。实际干活的是那些上游工具本身。

它不造轮子，只帮你把现有最好的轮子装到你的车上。

安装方式也很简单，把下面这句话复制给你的AI Agent就行：
> 帮我安装 Agent Reach：
>
> https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/install.md
>
Agent会自己去读文档、装依赖、配环境，几分钟搞定。装完之后跑一下 agent-reach doctor，就能看到每个渠道的状态，哪个通、哪个不通、怎么修，一目了然。

给Claude Code安装：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FMHVsz9lwuhWiao2lzcPLzh7lRxmWicFS8wYq4YCLQ8WCPG5cncvXuGNhsBM65pykk2ib6Ku4RvN8nhZNjShhIiaaweiaStQbFP0WN3PSib9WF9F0E%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D1)

给OpenClaw安装：

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FMHVsz9lwuhUic4MF2jzQiaLiaoJia6jPb0iaxgpOmFArfp5mJfWl9ibvjR0ibMdX8ndQTjJgSZicvZAhjYpQroSib4sgzhqg51sHvpAicgXic1Xy7FyMZ8%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D2)

## 13个平台，一次搞定

Agent Reach目前支持13个平台。按使用频率分成三类来说。

**第一类是装好即用，零配置的。**

网页阅读用的是Jina Reader（GitHub 9800+ Star），免费不需要API Key，Agent直接 curl https://r.jina.ai/URL 就能把任意网页转成干净的Markdown。YouTube和B站的视频字幕提取用的是yt-dlp（GitHub 148000+ Star），这个工具支持1800多个站点，基本上你能想到的视频平台它都能搞定。RSS订阅用feedparser，Python生态的标准选择。全网搜索接的是Exa，通过MCP接入，免费不需要Key，语义搜索的质量相当不错。

这几个平台装完Agent Reach就直接能用，不需要额外配置任何东西。

**第二类需要简单配置的。**

GitHub用的是官方gh CLI，告诉Agent帮你登录一下就行，之后搜仓库、看Issue、读代码都没问题。

Twitter用的是xreach CLI，通过Cookie认证，完全免费。配置方式也简单，用Chrome插件Cookie-Editor导出你的Twitter Cookie，发给Agent就行。这里有个提醒，建议用小号，Cookie相当于完整的登录权限，万一泄露影响范围有限。

Reddit搜索通过Exa免费搞定，但要读帖子和评论的话可能需要配个代理（服务器环境），本地电脑一般没这个问题。

**最麻烦的一类是需要Docker或MCP配置的。**

小红书用的是xiaohongshu-mcp（GitHub 9000+ Star），需要Docker部署。抖音用的是douyin-mcp-server，MCP服务，不需要登录就能解析视频信息。LinkedIn和Boss直聘也都有对应的MCP方案。微信公众号的搜索和阅读用的是Camoufox隐身浏览器配合搜狗搜索，可以直接抓取公众号文章的全文Markdown。

日常用得最多的还是前两类：网页阅读、YouTube字幕、全网搜索、GitHub、Twitter，这五个渠道基本覆盖了我80%以上的调研需求。小红书和抖音因为需要Docker，配置门槛稍高一点，但如果你有这方面的需求，配一次之后就很省心了。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FMHVsz9lwuhUCKZlnLEf4XRKTJvH1xHm7RkRWDuYpECicvAbsdHh9DppmjJ9laDRhBJcXA7pTnGS4PJmicticmx2BAVLdEHHBB2F3yEQjVHK2z4%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D3)

## 比如，用Claude Code获取微信公众号文章：

## ![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FMHVsz9lwuhVyiafO8uF6C6MdZU9icUUgowavfFTZfeMibyqlic6vHWxONicTC2rqIdqSIgjzKYGoibnlMQfsoDfgXHst7Al0EzqdLsMfo3d7ia3OO4%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D4)

## 总结X推文：

## ![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FMHVsz9lwuhWiaMhibnMd8NXqbn0ouxQ63rlKJyqAh1zEjib4hRXnVMU4OIROZRp4kWA9957QXvUyqV5Go7dOkIFEGcNyxciaOnhHgVsJ8DpRBWQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D5)

## 使用OpenClaw获取X推文：

## ![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FMHVsz9lwuhXHnbaaKleq6sKebiaibqmXQGShfgqQxNMAL5vicXWJZJUahJ5Wn0EwQgN146puHD7jX3PkAE42wg0mchIbxMRFbRWA1IFOyicYQjQ%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%23imgIndex%3D6)

## 可插拔架构

Agent Reach有一个很值得一提的设计：每个渠道都是可插拔的。

项目的channels目录下，每个平台对应一个独立的Python文件。web.py用的是Jina Reader，你不满意可以换成Firecrawl或者Crawl4AI。twitter.py用的是xreach，你也可以换成官方API或者其他方案。youtube.py用的是yt-dlp，想换YouTube API或者Whisper也行。

这个架构意味着两件事。你不需要被某个工具绑定，哪天某个上游工具挂了或者你找到了更好的替代品，改一个文件就行。另外，你也可以自己加新的渠道，每个渠道就是一个独立文件，写一个 check()方法告诉doctor这个渠道能不能用就行了。

从工程角度看，这种松耦合的设计确实比把所有东西揉在一起的方案更健壮。

## Agent-Reach对比其他联网方案

CC用户最熟悉的联网方式是内置的WebSearch加WebFetch。这个组合能覆盖基本的搜索和网页阅读需求，但也仅限于此。你想搜Twitter、看YouTube视频、刷小红书，它就无能为力了。

进阶一点的方案是配各种MCP。Brave Search免费2000次/月，Tavily免费1000次/月，Exa语义搜索质量好，Firecrawl能搜索加抓取一步到位。但问题是，每个MCP只解决一个平台的问题，你想覆盖多个平台就得挨个配，config文件越来越长。Apify很好用，但就是贵。

Agent Reach的思路是把这些事情一次性打包解决。一条命令装完，13个平台全部就绪。而且它集成了Exa搜索（通过mcporter的MCP接入），所以全网搜索这块也覆盖到了。

简单来说，如果你只需要搜个网页、查个文档，CC内置的WebSearch就够了。但如果你像我一样，经常需要跨平台收集信息，Agent Reach能省掉很多折腾的时间。

## 几个需要注意的地方

安全方面，Agent Reach做得还算到位。Cookie和Token只存在本地的 ~/.agent-reach/config.yaml，文件权限600，不上传不外传。支持安全模式安装（--safe 参数），不会自动装系统包，只告诉你需要什么。还支持 --dry-run 预览所有操作。

但是Cookie配置的平台（Twitter、小红书这些）确实有封号风险。平台可能检测到非正常浏览器的API调用行为，导致账号被限制。所以最好用小号来搞。

另外这个项目毕竟才发布两周，作者自己也说了是纯Vibe Coding出来的，可能会有一些不完美的地方。我用下来偶尔会碰到一些小问题，但核心功能基本稳定。有bug可以直接去GitHub提Issue，作者回复速度还挺快的。

兼容性方面，Claude Code、OpenClaw、Cursor、Windsurf这些主流AI编程工具都支持，只要能跑命令行的Agent都能用。OpenClaw的Skills生态已经有5400多个插件了，Agent Reach就是其中一个相当实用的Skill。

对我来说，Agent Reach最大的价值是把联网工具的选型和配置这个活儿给省了。以前每次换环境都得重新折腾一遍，现在一条命令搞定，确实方便很多。如果你的AI Agent也有联网调研的需求，必须强推。

感谢您阅读我的文章。我是鲁工，九年AI算法老兵，AI全栈开发者，深耕AI编程赛道。感兴趣的朋友也可以加我微信（louwill_）交个朋友。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2F4lN1XOZshfekhSPOVhKyHjek97r6uIakcYsqZxEMvKBCYqOO6wGleHTNuz4sff6Xns2LDGah9Jb6c39iaOhvfpQ%2F640%3Fwx_fmt%3Djpeg%26from%3Dappmsg%26wxfrom%3D5%26wx_lazy%3D1%26tp%3Dwxpic%23imgIndex%3D4)

\>/ 作者：鲁工


[Read in Cubox](https://cubox.pro/web/card/7430362006445623208)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzE5ODY5MDU4Mw==&mid=2247484938&idx=1&sn=7835f763b04f1d7f459c1ef17f08ce11&chksm=9751f0334c6d0828178c5cae32e9744b66b6764557f63b1e9cfd7f3a64af528c7c1479e06871&mpshare=1&scene=1&srcid=0309be3tnO4OX84lZQzQiNfK&sharer_shareinfo=17728e194987d37fd09b7464ec437dd0&sharer_shareinfo_first=17728e194987d37fd09b7464ec437dd0)  

---

