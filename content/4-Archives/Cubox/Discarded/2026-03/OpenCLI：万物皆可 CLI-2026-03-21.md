---
id: "7435060026537937354"
cubox_url: https://cubox.pro/web/card/7435060026537937354
url: https://mp.weixin.qq.com/s?__biz=MzA4NzgzMjA4MQ==&mid=2453481700&idx=1&sn=377e4c26de698584d065dff8e6a675bf&chksm=863b2966f439e73e28e48d995736e119cf158538171f275a158233b7f0ba6ab95171fa3dc1f6&mpshare=1&scene=1&srcid=03213GAvLhIj0yI2W4wzknUC&sharer_shareinfo=9ea64de267d8dd8ecfd402bca8273801&sharer_shareinfo_first=9ea64de267d8dd8ecfd402bca8273801
tags: []

---
# OpenCLI：万物皆可 CLI

CLI 正在成为 Agent 时代的标准交互协议

![](https://image.cubox.pro/cardImg/213xuppok88n42vmc9gyisa9l3li9j44mw0f2j58xo8x5h5gfc?imageMogr2/quality/90/ignore-error/1)

**AGI Hunt**

关注AGI 的沿途风景！

1738篇原创内容

<br />

公众号  

，

上一篇文章 [GUI 将死，CLI 才是一切](https://mp.weixin.qq.com/s?__biz=MzA4NzgzMjA4MQ==&mid=2453481584&idx=1&sn=f7085456641a49ae255ff0b848b1a85a&scene=21#wechat_redirect)中，我们说到 CLI 正在成为 Agent 时代的标准交互协议。现在，GitHub 上又冒出来一个项目，把这事往前又推了一步。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FZKqVLiaIpzFnR8EtDnHCxF38jKibdTYKicicoWDcvSD1HlQJKybvMWvO15ibhwZSPwRHEZJgicibTLgtXEnv3M5gEh779XSOPVVWyq1G6MiaibCxANjk%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D0)

这个项目叫 OpenCLI，做的事情则更野：不只是桌面软件，连网站、Electron 应用，它都能给你 CLI 化。

B 站、知乎、小红书、X、Reddit、YouTube......甚至 Cursor、Notion、Discord、微信、飞书这些桌面应用，全都能变成命令行工具。

而且，它复用的是你 Chrome 浏览器里已经登录的账号，不需要你额外配置任何密钥。

这事最高兴的，显然是，你的 AI。

## 两条路线


![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FZKqVLiaIpzFmD1mkxAbCuMwL1dAMCLoaqDVnjw3Nsw5p06tVwnxoniazqezHiaLRFfwESD6fdmZUfcMHmJ3Wv5wq6zdPrpKBWm8UNsVlblyWibY%2F640%3Ffrom%3Dappmsg%26watermark%3D1%23imgIndex%3D1) CLI-Anything vs OpenCLI 两条路线对比

从技术路线上来说，CLI-Anything 和这次的 OpenCLI，走的是两条不同的路线。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FZKqVLiaIpzFmhOBmxmay9IHMyfQzT0BDZkANVr4SshTGtJm5VMwQLgZkQqw8cy0wYAJPD90YLjF7PSib14icnhPVsJgnMvKcQ2cec0xZ4A8CB4%2F640%3Ffrom%3Dappmsg%26watermark%3D1%26tp%3Dwebp%26wxfrom%3D5%26wx_lazy%3D1%23imgIndex%3D1) CLI-Anything 项目

CLI-Anything 的思路是「从源码出发」。它扫描软件的源代码，把 GUI 操作映射到底层 API，然后用 Python Click 框架自动生成一套 CLI。GIMP、Blender、Audacity、LibreOffice 这些有开源代码的桌面软件，它都能包一层。

![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FZKqVLiaIpzFlOTPiaEw3Wic1SicSHNHlKVRR86uDp1Q4yiagEsJMicteRlkft5dT8xv1WFuKMKau7VvIOnB7YqYW83yyu86BGpGhUicKWBsMwM80l4%2F640%3Fwx_fmt%3Dpng%26from%3Dappmsg%26watermark%3D1%23imgIndex%3D3)

OpenCLI 的思路则完全不同，它是「从浏览器出发」。

它不需要源码，也不需要 API 文档，而是直接通过 Chrome 浏览器去操作目标网站或应用，把浏览器里你能做的事情，变成一条条命令。

打个比方的话，CLI-Anything 像是一位逆向工程师，拆开软件的外壳去理解内部结构。而 OpenCLI 更像是一位老练的用户，它不拆机器，但它知道每个按钮按下去会发生什么。

**两个项目合在一起，基本上覆盖了「一切软件」。**

有源码的桌面软件，可以交给 CLI-Anything 搞定。没源码的网站和 Electron 应用，则可以由 OpenCLI 搞定。

## 怎么做到


OpenCLI 在架构上，说来也是有那么点巧妙。
![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FZKqVLiaIpzFmoWfeZCBYxR8EAL5vIAa0kQZsiaD2icTBWEKySTQAgv7gG0BxvQmgiadf7u7KaB7Q4ibg1uN6psDpW1icRD9BkTscseC1rP7U9af70%2F640%3Fwx_fmt%3Djpeg%26watermark%3D1%23imgIndex%3D4) OpenCLI 工作链路架构

它在你的 Chrome 浏览器里装了一个轻量级的扩展（Browser Bridge），然后本地起一个小型守护进程（Daemon），通过 WebSocket 把 CLI 命令和浏览器连起来。

整个链路大概是这样：

    CLI 命令 → 本地 Daemon → WebSocket → Chrome 扩展 → 网页操作


你在终端敲 opencli bilibili hot，Daemon 就把这个指令通过 WebSocket 发给 Chrome 扩展，扩展在浏览器里执行相应操作，把结果拿回来，格式化输出到终端。

关键在于，这个过程复用的是你 Chrome 里已经登录的 session。你在 B 站登录了，OpenCLI 就能用你的账号去获取数据，不需要你单独去搞 Cookie 或者 API Key。

**你的密码和凭据，从头到尾都没有离开过浏览器。**

Daemon 也设计得挺克制，空闲 5 分钟自动退出，默认监听 localhost:19825，不会常驻后台吃资源。

## 三个 AI 命令


OpenCLI 里最值得关注的，是它为 AI Agent 专门设计的三个命令。

explore：给它一个网站 URL，它会自动去发现这个网站有哪些 API 可以调用。并非静态扫描，它会真的打开浏览器，点击、滚动、观察网络请求，把能用的 API 端点全部记录下来。

synthesize：拿到 explore 的结果后，自动生成对应的 CLI 适配器。你不用写一行代码，它替你把 API 包装成命令行工具。

cascade：自动探测目标网站的认证策略。它会从最简单的公开 API 开始试，试不通就升级到 Cookie 认证，再不行就拦截网络请求提取签名......一共五个级别，一级一级往上试。

    # 一条命令搞定：探索 + 生成适配器 + 注册opencli generate https://example.com --goal "hot"


换句话说，AI Agent 拿到一个它从没见过的网站，也能自己摸索出怎么用命令行操控它。

**这才是 OpenCLI 真正值得关注的地方：**

**它不只是给人用的 CLI 工具，它是给 Agent 用的「万能遥控器」。**

## 能干什么


目前 OpenCLI 已经内置了 80 多个命令，覆盖 30 多个站点和应用。

网站方面：B 站的热门、搜索、字幕提取，知乎的热榜、搜索，小红书的笔记下载，Twitter/X 的时间线、书签，Reddit 的热帖，YouTube 的视频信息，还有雪球的股票数据、BOSS 直聘的职位搜索......

桌面应用方面：Cursor IDE、ChatGPT 客户端、Notion、Discord、飞书、微信、网易云音乐，甚至超星学习通和微信读书，都有对应的适配器。

每个命令都支持多种输出格式，json、yaml、markdown、csv，Agent 拿到的是结构化数据，可以直接处理。

    opencli bilibili hot -f json | jq '.[]'opencli zhihu hot -f yamlopencli twitter bookmarks -f md


对 Agent 来说，这些命令就像是一个一个标准化的「插口」，插上就能用。

## Electron 的突破


OpenCLI 最近的一个大更新，是支持了所有 Electron 应用的 CLI 化。

要知道，这件事的意义，是真的不小。

你可能不知道，现在有多少桌面应用是基于 Electron 构建的？

飞书、VS Code、Slack、Discord、Notion、Figma 桌面版、微信开发者工具......几乎你能叫得出名字的现代桌面应用，有一大半跑的都是 Chromium 内核。

OpenCLI 利用 Chrome DevTools Protocol（CDP）直接和这些应用的内核通信。每个应用分配一个固定端口（比如 Cursor 用 9222，ChatGPT 用 9224，Notion 用 9230），然后通过 DOM 操作来读取和注入内容。

它处理 React 等框架的富文本编辑器时还有个巧妙的地方：没有直接设置 .value（那样框架内部状态不会更新），用的是 document.execCommand('insertText') 来模拟真实的文本输入，绕过了框架的状态管理。

**也就是说，Agent 可以直接在 Cursor 里写代码、在 Notion 里写文档、在 Discord 里发消息，全程命令行操作。**

## 万物皆可 CLI

[Karpathy 说](https://mp.weixin.qq.com/s?__biz=MzA4NzgzMjA4MQ==&mid=2453481182&idx=1&sn=61787514e168c0bb09c21ef441ff0f5e&scene=21#wechat_redirect)，让用户去网页上点按钮、填表单，「感觉挺粗鲁的」。Levie 说，如果你的功能没有 API，那它等于不存在。

CLI-Anything 说，我来给桌面软件加上 CLI。

OpenCLI 说，我来给网站和 Electron 应用也加上。

**它们在做同一件事：把人类花了 40 年给计算机穿上的那件 GUI 外衣，一件一件脱掉。**

而且这件事正在加速。CLI-Anything 在 GitHub 上已经 15000 颗星了，OpenCLI 也在短短几天内涨到了 2300 颗星。开发者社区对这个方向的热情，肉眼可见。

## 不只是工具


但如果只把 OpenCLI 看成一个效率工具，那想的似乎就有点少了。

它真正在做的事情，是在重新定义「软件的边界」。

以前，每个软件都是一座孤岛。

B 站是 B 站，知乎是知乎，微信是微信。你想在它们之间搬运数据，要么手动复制粘贴，要么等官方出 API（大概率等不到），要么用各种不太靠谱的爬虫。

现在，OpenCLI 把这些孤岛全部拉通了。
![](https://cubox.pro/c/filters:no_upscale()?imageUrl=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FZKqVLiaIpzFmAibCUoqB8M18f4aKict9zl7OeRDF83HpQ5wxegNicE2wiaTLpjRfMb9hiclCFREqZzIyZX192g4zIA7UUkicicXrqRd3HE9lFGID14E%2F640%3Ffrom%3Dappmsg%26watermark%3D1%23imgIndex%3D5) 万物皆可 CLI 覆盖版图

万物皆可 CLI，万物皆需 CLI。

你可以写一段脚本，先从 B 站抓热门视频的字幕，然后让 AI 总结，再发到飞书群里。或者从雪球拉股票数据，用 AI 分析，再写进 Notion 文档。

这种跨应用的编排能力，以前只有大公司的内部系统才有。

**而现在，一个人加一个 Agent，就够了。**

## 权限的问题


当然了，这也带来了前面 CLI-Anything 面临的老问题：**谁来决定 Agent 能干什么，不能干什么？**

OpenCLI 复用浏览器登录态，从而让 Agent 拥有的权限和你在浏览器里的权限一模一样。你能在 B 站发弹幕，Agent 也能。你能在某个网站上发消息，Agent 就也能。

这既是优点，也是风险。

优点是零配置，即开即用。风险是，如果 Agent 的判断出了问题，它发出去的消息、删掉的数据，可都是用你的账号操作的。

CLI-Anything 解决的是 Agent「能不能干」的问题，OpenCLI 则用不一样的办法，把这个能力的范围扩大了十倍。

## Agent 的母语


回到原来的问题。

为什么 CLI 正在成为 Agent 时代的标准接口？

因为 CLI 的特性，天然就是为 Agent 设计的：文本输入，结构化输出，可组合，可发现（--help），确定性强，没有歧义。

GUI 是人类的语言。CLI 是机器的语言。

过去 40 年，我们一直在做翻译，把机器语言翻译成人类能理解的图形界面。现在 Agent 来了，它不需要翻译，它直接说机器的语言就好。

CLI-Anything 给桌面软件装上了 CLI。OpenCLI 给网站和 Electron 应用装上了 CLI。

**整个软件世界，正在被重新「插上插头」。**

**而 Agent，终于可以自己动手了。**

*** ** * ** ***

相关链接：

*
  OpenCLI GitHub：https://github.com/jackwener/opencli

*
  CLI-Anything GitHub：https://github.com/HKUDS/CLI-Anything

*
  OpenCLI 中文介绍：https://www.80aj.com/2026/03/18/opencli-ai-control/



[Read in Cubox](https://cubox.pro/web/card/7435060026537937354)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzA4NzgzMjA4MQ==&mid=2453481700&idx=1&sn=377e4c26de698584d065dff8e6a675bf&chksm=863b2966f439e73e28e48d995736e119cf158538171f275a158233b7f0ba6ab95171fa3dc1f6&mpshare=1&scene=1&srcid=03213GAvLhIj0yI2W4wzknUC&sharer_shareinfo=9ea64de267d8dd8ecfd402bca8273801&sharer_shareinfo_first=9ea64de267d8dd8ecfd402bca8273801)  

---

