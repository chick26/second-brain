---
title: "Domain Name"
date: 2022-01-24 14:41
status: done
tags:
- Network/Internet
- Network/Internet/DomainName
---
up:: [[• TOC for Frontend](../%E2%80%A2%20TOC%20for%20Frontend.md)

>域名（Domain names）是互联网基础架构的关键部分。它们为互联网上任何可用的网页服务器提供了方便人类理解的地址。
----

# 概述

任何连上互联网的电脑都可以通过一个公共 IP 地址访问到，对于IPv4地址来说，这个地址有32位（它们通常写成四个范围在 0~255 以内，由点分隔的数字组成，比如 173.194.121.32），而对于IPv6来说，这个地址有128位，通常写成八组由冒号分隔的四个十六进制数(e.g., `2027:0da8:8b73:0000:0000:8a2e:0370:1337`). 计算机可以很容易地处理这些IP地址, 但是对一个人来说很难找出谁在操控这些服务器以及这些网站提供什么服务。IP 地址很难记忆而且可能会随着时间的推移发生改变 。为了解决这些问题，我们使用方便记忆的地址，称作域名。

# 域名的结构

![](../../../Extras/Media/Images/202202101543606.png)

## TLD （Top-Level Domain，顶级域名）

顶级域名可以告诉用户域名所提供的服务类型。最通用的顶级域名（.com, .org, .net）不需要web服务器满足严格的标准，但一些顶级域名则执行更严格的政策。比如：

- 地区的顶级域名，如`.us`，`.fr`，或`.sh`，可以要求必须提供给定语言的服务器或者托管在指定国家。这些TLD通常表明对应的网页服务从属于何种语言或哪个地区。
- 包含`.gov`的顶级域名只能被政府部门使用。
- `.edu` 只能为教育或研究机构使用。

顶级域名既可以包含拉丁字母，也可以包含特殊字符。顶级域名最长可以达到 63 个字符，不过为了使用方便，大多数顶级域名都是两到三个字符。

顶级域名的完整列表是[ICANN](https://www.icann.org/resources/pages/tlds-2012-02-25-en)维护的。

## 标签 (或者说是组件)

标签都是紧随着TLD的。标签由1到63个大小写不敏感的字符组成，这些字符包含字母A-z，数字0-9，甚至 “-” 这个符号（当然，“-” 不应该出现在标签开头或者标签的结尾）。举几个例子，`a`，`97`，或者 `hello-strange-person-16-how-are-you`  都是合法的标签。

## Secondary Level Domain (二级域名)

刚好位于TLD前面的标签也被称为二级域名 (SLD)。一个域名可以有多个标签（或者说是组件），没有强制规定必须要3个标签来构成域名。例如，www.inf.ed.ac.uk 是一个正确的域名。当拥有了“上级”部分(例如 [mozilla.org](https://mozilla.org/))，你还可以创建另外的域名 (有时被称为 "子域名") (例如 [developer.mozilla.org](https://developer.mozilla.org/)).

# 购买域名

## 谁拥有域名？

你不能真正地 “购买一个域名”，你只能花钱获得一个域名在一年或多年内的使用权。不过你可以延长你的使用权，同时你的续期将优先于其他人的使用申请。但你从来都没有拥有过域名。

被称为域名注册商的公司通过域名登记来记录连接你和你的域名的技术与管理信息。

**提示 :** 对于一些域名，它可能不归属于某个域名注册商来负责记录。比如说，每个在.fire下的域名由Amazon管理。

## 找个可用的域名

想要知道一个给定的域名是否可用:
-   去域名注册商的网站。它们大多会提供"whois"服务，告诉你一个域名是否可用。
-   另外，如果你使用系统的内置shell，可以在里面输入whois命令，下面显示的是mozilla.org网站的结果：
```shell
$ whois mozilla.org
Domain Name:MOZILLA.ORG
Domain ID: D1409563-LROR
Creation Date: 1998-01-24T05:00:00Z
Updated Date: 2013-12-08T01:16:57Z
Registry Expiry Date: 2015-01-23T05:00:00Z
Sponsoring Registrar:MarkMonitor Inc. (R37-LROR)
Sponsoring Registrar IANA ID: 292
WHOIS Server:
Referral URL:
Domain Status: clientDeleteProhibited
Domain Status: clientTransferProhibited
Domain Status: clientUpdateProhibited
Registrant ID:mmr-33684
Registrant Name:DNS Admin
Registrant Organization:Mozilla Foundation
Registrant Street: 650 Castro St Ste 300
Registrant City:Mountain View
Registrant State/Province:CA
Registrant Postal Code:94041
Registrant Country:US
Registrant Phone:+1.6509030800
```

正如你所见，我不能注册`mozilla.org`，因为Mozilla基金会已经注册它了。另外，如果你想看看我能不能注册`afunkydomainname.org`：

```shell
$ whois afunkydomainname.org
NOT FOUND
```