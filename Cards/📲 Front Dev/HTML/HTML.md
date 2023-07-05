---
title: "HTML"
date: 2022-01-24 14:41
status: done
tags:
- Development/Frontend/HTML
---
up:: [[• TOC for Frontend](../%E2%80%A2%20TOC%20for%20Frontend.md)

# Head

> **注意:**  [[HTML-HEAD.md|HEAD列表]]中 找到HTML文档`<head>`标签内所有可配置的属性。

# Meta 标签

## Doctype（文档类型） 

以下Doctype标签声明文档为HTML5类型，需要写在HTML文件的顶部。

```html
<!-- 声明文档为 HTML5 类型 -->
<!doctype html>
```

> * 📖 [设置文档字符编码格式 - HTML5 W3C](https://www.w3.org/TR/html5/syntax.html#determining-the-character-encoding)

* 下列两个 meta 标签需要首先声明在head中：Charset 和 Viewport。*

## Charset（字符） 

正确声明`Charset` meta (UTF-8)。

```html
<!-- 设置文档的字符编码 -->
<meta charset="utf-8">
```

## Viewport（视口）

正确声明`viewport` meta。

```html
<!-- 响应式网页设计viewpoint声明 -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## Title（标题）

所有页面都必须使用`title`标签(SEO:Google会计算标题中使用的字符的像素宽度，范围在472和482像素之间，所以平均字符数限制大约在55个字符左右)。

```html
<!-- 文档标题 -->
<title>网站标题不超过55个字符</title>
```

> * 📖  [Title 标签 - HTML - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
> * 🛠  [SERP 代码段生成器](https://www.sistrix.com/serp-snippet-generator/)

## Description（描述）

提供`description`标签， 它是唯一的，且内容不能超过150个字符。

```html
<!-- Meta Description -->
<meta name="description" content="Description of the page less than 150 characters">
```

> * 📖[Meta Description 属性 - HTML - MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML#Adding_an_author_and_description)

## Favicons（图标）

每个`favicon`都被创建并正确显示，如果你只有一个`favicon.ico`，把它放在你网站的根目录下。 通常来说你不需要做任何操作他就能正常显示。 然而, 使用一下示例中的方法是比较好的做法。不过现在我们推荐使用**PNG**格式，相比`.ico`格式有较好的优势(推荐尺寸: 32x32px)。

```html
<!-- 标准favicon -->
<link rel="icon" type="image/x-icon" href="https://example.com/favicon.ico">
<!-- 推荐favicon格式 -->
<link rel="icon" type="image/png" href="https://example.com/favicon.png">
```

> * 🛠  [Favicon 生成器](https://www.favicon-generator.org/)
> * 🛠  [RealFaviconGenerator](https://realfavicongenerator.net/)
> * 📖  [Favicon Cheat Sheet](https://github.com/audreyr/favicon-cheat-sheet)
> * 📖  [Favicons, Touch Icons, Tile Icons, etc. Which Do You Need? - CSS 技巧](https://css-tricks.com/favicon-quiz/)
> * 📖  [PNG favicons - caniuse](https://caniuse.com/#feat=link-icon-png)

## Apple Web App Meta

苹果设备目前使用的 Meta 标签

```html
<!-- (创建至少200x200像素尺寸的Apple图标文件以支持你可能需要的用到的所有尺寸) -->
<link rel="apple-touch-icon" href="/custom-icon.png">
<!-- 设置Web应用程序是否以全屏模式运行。 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- 设置状态栏样式（有关其可用值，请参见下面的“苹果设备支持的Meta标记列表”） -->
<!-- 除非您具有先前的Meta标签，否则本Meta标签无效 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">
```

> * 📖 [在苹果设备中配置Web应用程序](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
> * 📖 [苹果设备支持的Meta标记列表](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)

## Windows Tiles 

Windows 操作系统磁贴

```html
<!-- Microsoft Tiles -->
<meta name="msapplication-config" content="browserconfig.xml" />
```

browserconfig.xml文件的最小所需xml标记如下所示:

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
	<msapplication>
		<tile>
			<square70x70logo src="small.png"/>
			<square150x150logo src="medium.png"/>
			<wide310x150logo src="wide.png"/>
			<square310x310logo src="large.png"/>
		</tile>
	</msapplication>
</browserconfig>
```

> 📖 [浏览器配置模式参考](https://msdn.microsoft.com/en-us/library/dn320426(v=vs.85).aspx)

## Canonical

使用`rel="canonical"`以避免重复的内容。

```html
<!-- 帮助防止重复内容出现 -->
<link rel="canonical" href="http://example.com/2017/09/a-new-article-to-red.html">
```

> - 📖 [使用规范的URLs - Search Console Help - Google Support](https://support.google.com/webmasters/answer/139066?hl=en)
> - 📖 [rel = canonical的5个常见错误 - Google Webmaster Blog](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)

# HTML 标签

## Language tag（语言标签） 

指定你网站的语言标签并与当前页面语言相关联。

```html
<html lang="zh_cn">
```

Direction tag（方向标签）

`direction`属性规定元素内容的文本方向。(可以在另一个HTML标签上使用)

```html
<html dir="rtl">
```

> * 📖 [dir 属性 - HTML - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)

## Alternate language（备用语言）

指定网站的语言标签并与当前页面的语言相关联。

```html
<link rel="alternate" href="https://es.example.com/" hreflang="es">
```

## x-default 

表明此类网页未定位到特定的语言或区域设置。

```html
<link rel="alternate" href="https://example.com/" hreflang="x-default" />
```

> * 📖 [x-default - Google](https://webmasters.googleblog.com/2013/04/x-default-hreflang-for-international-pages.html)

## Conditional comments（条件注释）

如有需要，可针对IE添加条件注释。

> 📖 [关于条件注释(Internet Explorer) - MSDN - Microsoft](https://msdn.microsoft.com/en-us/library/ms537512(v=vs.85).aspx)

## RSS feed（RSS 订阅）

如果你的项目是一个博客或者有大量的文章，可以添加一个RSS链接。

## CSS Critical（最小 CSS 合集）

`CSS critical`收集并呈现当前页面可见部分的核心CSS。在主要的CSS调用渲染之前以单行(最小化)在`<style></style>`中嵌入。

> * 🛠 [由Addy Osmani于GitHub撰写的Critical](https://github.com/addyosmani/critical)

## CSS order（加载顺序）

所有CSS文件都需要在JavaScript文件加载之前加载完成(除了有时JS文件异步加载到页面之外的情况)。

# Social meta 标签

强烈推荐***Facebook OG*** and ***Twitter Cards***。如果你针对某些特定的存在并希望确保显示，也可以考虑其他社交媒体的meta。

## Facebook Open Graph

所有Facebook Open Graph（OG）都经过测试并且没有任何错误。图片至少需要600 x 315像素，建议使用1200 x 630像素。

> **注意:** 使用 `og:image:width` 和 `og:image:height` 将会爬取制定尺寸的图像，以便图像能够快速呈现，无需进行异步下载和处理。

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/page.html">
<meta property="og:title" content="Content Title">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:description" content="Description Here">
<meta property="og:site_name" content="Site Name">
<meta property="og:locale" content="en_US">

<!-- Next tags are optional but recommended -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

> * 📖 [A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters/)
> * 🛠 使用[Facebook OG testing](https://developers.facebook.com/tools/debug/)测试你的页面。
> * 📖 [Best Practices - Sharing](https://developers.facebook.com/docs/sharing/best-practices/)

## Twitter 卡片

```html
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@site_account">
<meta name="twitter:creator" content="@individual_account">
<meta name="twitter:url" content="https://example.com/page.html">
<meta name="twitter:title" content="Content Title">
<meta name="twitter:description" content="Content description less than 200 characters">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

> * 📖 [推特卡片使用入门 — Twitter Developers](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started)
> * 🛠 使用[Twitter card validator](https://cards-dev.twitter.com/validator)测试你的页面。

# HTML

## 最佳实践

### HTML5 Semantic Elements（HTML5语义化元素）

正确地使用HTML5语义化标签(header, section, footer, main...).
> 📖 [HTML 参考](http://htmlreference.io/)

### Error pages（错误页面）

404页面和5xx错误页面的存在。记得在5xx错误页面中集成CSS样式文件(在当前服务器上无外部调用)。

### Noopener 

如果你使用外部链接`target="_blank"`, 你的链接必须有个`rel="noopener"`属性，防止制表符的隐藏。如果你需要兼容旧版本的火狐浏览器，请使用`rel="noopener noreferrer"`。

> 📖 [关于 rel=noopener](https://mathiasbynens.github.io/rel-noopener/)

### Clean up comments（清除注释）

在将页面发布到生产环境之前，应该删除不必要的代码。

## HTML 测试

### W3C compliant（兼容）

所有页面需要使用W3C验证器进行测试，以检测HTML代码中的可能存在的问题。

> * 🛠 [W3C validator](https://validator.w3.org/)

### HTML Lint

使用工具来帮助我们分析HTML代码中可能存在的问题。

> * 🛠 [肮脏的标记列表](https://www.10bestdesign.com/dirtymarkup/)
> * 🛠 [webhint](https://webhint.io/)

### Desktop Browsers 

所有页面都在桌面浏览器上通过测试(Safari, Firefox, Chrome, Internet Explorer, EDGE...)。

### Mobile Browsers

所有页面都在移动端浏览器上通过测试(Native browser, Chrome, Safari...).

### Link checker（链接检查器）

页面中链接没有失效，请确认你没有404错误。

> * 🛠 [W3C Link Checker](https://validator.w3.org/checklink)

### Adblockers test（广告拦截器测试）

你的的网站会在启用广告拦截器的情况下正确显示页面内容(你可以提供一条消息，引导人们停用其广告拦截器)。

> [Pixel Perfect - Chrome 扩展](https://chrome.google.com/webstore/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi?hl=en)
