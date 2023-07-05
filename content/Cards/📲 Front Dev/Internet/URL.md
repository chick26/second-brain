---
title: "URL"
date: 2022-01-24 14:41
status: done
tags:
- Network/Internet
- Network/Internet/URL
---
up:: [[• TOC for Frontend](../%E2%80%A2%20TOC%20for%20Frontend.md)

>**URL 代表着是统一资源定位符（**_Uniform Resource Locator_**）**。URL 无非就是一个给定的独特资源在 Web 上的地址。理论上说，每个有效的 URL 都指向一个唯一的资源。这个资源可以是一个 HTML 页面，一个 CSS 文档，一幅图像，等等。而在实际中，也有一些例外，最常见的情况就是一个 URL 指向了不存在的或是被移动过的资源。由于通过 URL 呈现的资源和 URL 本身由 Web 服务器处理，因此 web 服务器的拥有者需要认真地维护资源以及与它关联的URL。

# 基础：剖析URL

以此为例：
> `http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument`

## Protocol

`http` 是协议。它表明了浏览器必须使用何种协议。它通常都是HTTP协议或是HTTP协议的安全版，即HTTPS。Web需要它们二者之一，但浏览器也知道如何处理其他协议，比如`mailto:（打开邮件客户端）或者` `ftp:（处理文件传输）`

## [[Domain Name](Domain%20Name.md)

`www.example.com` 是域名。 它表明正在请求哪个Web服务器。或者，可以直接使用[IP address](https://developer.mozilla.org/zh-CN/docs/Glossary/IP_Address), 但是因为它不太方便，所以它不经常在网络上使用。

## Port

`:80` 是端口。 它表示用于访问Web服务器上的资源的技术“门”。如果Web服务器使用HTTP协议的标准端口（HTTP为80，HTTPS为443）来授予其资源的访问权限，则通常会被忽略。否则是强制性的。

## Path to the file 

`/path/to/myfile.html` 是网络服务器上资源的路径。在Web的早期阶段，像这样的路径表示Web服务器上的物理文件位置。如今，它主要是由没有任何物理现实的Web服务器处理的抽象。

## Parameters

`?key1=value1&key2=value2` 是提供给网络服务器的额外参数。 这些参数是用 `&` 符号分隔的键/值对列表。在返回资源之前，Web服务器可以使用这些参数来执行额外的操作。每个Web服务器都有自己关于参数的规则，唯一可靠的方式来知道特定Web服务器是否处理参数是通过询问Web服务器所有者。

## Anchor

`#SomewhereInTheDocument` 是资源本身的另一部分的锚点. 锚点表示资源中的一种“书签”，给浏览器显示位于该“加书签”位置的内容的方向。例如，在HTML文档上，浏览器将滚动到定义锚点的位置;在视频或音频文档上，浏览器将尝试转到锚代表的时间。值得注意的是，＃后面的部分（也称为片段标识符）从来没有发送到请求的服务器。

# 如何使用URL

可以直接在浏览器的地址栏里输入任何URL，来获得后台的资源。但是这仅仅是冰山一角。

 [[../HTML/HTML.md]]语言对URLs有大量的使用:

-   为在其他文档中新建链接，用 `<a>` ;
-   为将文档与它的相关资源关联，用各种标签如 `<link>` 或 `<script>` ;
-   为显示多媒体如图片 (用 `<img>`), 视频 (用 `<video>` ), 声音和音乐 (用 `<audio>` ), 等等;
-   为显示其他HTML文档，用 `<iframe>` .

# 绝对URL和相对URL

我们上面看到的是一个绝对的URL，但也有一个叫做相对URL的东西。我们来看看这个区别意味着什么呢？

URL的必需部分在很大程度上取决于使用URL的上下文。在浏览器的地址栏中，网址没有任何上下文，因此您必须提供一个完整的（或绝对的）URL，就像我们上面看到的一样。您不需要包括协议（浏览器默认使用HTTP）或端口（仅当目标Web服务器使用某些异常端口时才需要），但URL的所有其他部分都是必需的。

当文档中使用URL时，例如HTML页面中的内容有所不同。因为浏览器已经有文档自己的URL，它可以使用这些信息来填写该文档中可用的任何URL的缺失部分。我们可以通过仅查看URL的路径部分来区分绝对URL和相对URL。**如果URL的路径部分以“/”字符开头，则浏览器将从服务器的顶部根目录获取该资源，而不引用当前文档给出的上下文**。

我们来看一些例子来使这个更清楚。

## 绝对URL示例

- 完整网址（与之前使用的网址相同）

> `https://developer.mozilla.org/en-US/docs/Learn`

- 隐去协议

> `//developer.mozilla.org/en-US/docs/Learn`

在这种情况下，浏览器将使用与用于加载该URL的文档相同的协议来调用该URL。

- 隐去域名

> `/en-US/docs/Learn`

这是HTML文档中绝对URL最常见的用例。浏览器将使用与用于加载托管该URL的文档相同的协议和相同的域名。**注意**：不可能省略该域名而不省略协议。

## 相对URL示例

- 为了更好地了解以下示例，我们假设从位于以下URL的文档中调用URL： 

> `https://developer.mozilla.org/en-US/docs/Learn`

- 子资源

> `Skills/Infrastructure/Understanding_URLs`

因为该URL不以/开头，浏览器将尝试在包含当前资源的子目录中查找文档。所以在这个例子中，我们真的想要达到这个URL`https://developer.mozilla.org/en-US/docs/Learn/Skills/Infrastructure/Understanding_URLs`

- 回到目录树中

> `../CSS/display`

在这种情况下，我们使用从UNIX文件系统世界继承的../写入约定来告诉我们要从一个目录上升的浏览器。在这里，我们要达到以下URL：`https://developer.mozilla.org/en-US/docs/Learn/../CSS/display`，可以将其简化为：`https://developer.mozilla.org/en-US/docs/CSS/display`

# 语义 URLs

尽管URL具有非常的技术性，但URL表示一个可读性的网站入口点。它们可以被记住，并且任何人都可以将它们输入浏览器的地址栏。人是Web的核心，因此建立所谓的 _[semantic URLs](http://en.wikipedia.org/wiki/Semantic_URL)_ 被认为是最佳实践。语义URL使用具有固有含义的单词，任何人都可以理解，无论他们的技术水平如何。

语言语义当然与电脑无关。您可能经常看到看起来像随机字符混搭的网址。但创建人类可读的URL有很多优点：

-   操作它们更容易
-   它根据用户在哪里，他们在做什么，他们正在阅读或在网络上进行互动来澄清用户的情况。
-   一些搜索引擎可以使用这些语义来改进相关页面的分类。