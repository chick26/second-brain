---
title: "HTML-Validation"
date: 2022-01-24 14:41
status: done
tags:
- Development/Frontend/HTML
- Development/Frontend/HTML/FormValidation
---
up:: [[• TOC for Frontend]]

# 不同类型的表单数据校验

在 Web 中，你可能会遇见各种不同的表单校验：

## 客户端校验

发生在浏览器端，表单数据被提交到服务器之前，这种方式相较于服务器端校验来说，用户体验更好，它能实时的反馈用户的输入校验结果，这种类型的校验可以进一步细分成下面这些方式：
 -   **JavaScript** 校验，这是可以完全自定义的实现方式；
 -   HTML5 **内置校验**，这不需要 JavaScript ，而且性能更好，但是不能像JavaScript那样可自定义。

## 服务器端校验

发生在浏览器提交数据并被服务器端程序接收之后 —— 通常服务器端校验都是发生在将数据写入数据库之前，如果数据没通过校验，则会直接从服务器端返回错误消息，并且告诉浏览器端发生错误的具体位置和原因，服务器端校验不像客户端校验那样有好的用户体验，因为它直到整个表单都提交后才能返回错误信息。但是服务器端校验是你的应用对抗错误/恶意数据的最后防线，在这之后，数据将被持久化至数据库。当今[所有的服务端框架](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/First_steps/Web_frameworks)都提供了数据**校验**与**清洁**功能（让数据更安全）。

在真实的项目开发过程中，开发者一般都倾向于使用客户端校验与服务器端校验的组合校验方式以更好的保证数据的正确性与安全性。

# 使用内置表单数据校验

> HTML 可以通过内置的 表单元素的[校验属性 (en-US)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation "Currently only available in English (US)")，同时利用样式变化，不使用脚本进行校验

## 校验属性

在 HTML5中，声明约束有两种方式：
-   如 [`<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input) 元素的  [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) 特性选择最合适的语义化的值，比如，选择 `email` 类型将会自动创建一个约束用于检查输入的值是否是一个有效的 `e-mail` 地址。
-   设置验证相关的特性值，允许用一种简单的方式来描述基本的约束，而不必要使用 JavaScript。

###  Type, Input

 - `<input type="URL">` 

值必须是绝对的URL, 即，是下面的某一种:
-   a valid URI (as defined in [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt))
-   a valid IRI, without a query component (as defined in [RFC 3987](https://www.ietf.org/rfc/rfc3987.txt))
-   a valid IRI, with a query component without any unescaped non-ASCII character (as defined in [RFC 3987](https://www.ietf.org/rfc/rfc3987.txt))
-   a valid IRI, and the character set for the document is UTF-8 or UTF-16 (as defined in [RFC 3987](https://www.ietf.org/rfc/rfc3987.txt))

- `<input type="email">`

The value must follow the [ABNF](https://www.ietf.org/rfc/std/std68.txt) production: `1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )` where:
-   `atext` is defined in [RFC 5322](https://tools.ietf.org/html/rfc5322), i.e., a US-ASCII letter (A to Z and a-z), a digit (0 to 9) or one of the following! # $ % & ' * + - / = ? ` { } | ~ special character,
-   `ldh-str` is defined in [RFC 1034](http://www.apps.ietf.org/rfc/rfc1034.html#sec-3.5), i.e., US-ASCII letters, mixed with digits and - grouped in words separated by a dot (.).

> [!NOTE] 当前大部分组件仍自己实现
> - HTML5 标签虽然支持大部分的业务需求
> - 不同浏览器对于这些标签的特殊属性实现方式不一样，样式也不一样

### [验证相关的特性（Attribute）](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/Constraint_validation#%E9%AA%8C%E8%AF%81%E7%9B%B8%E5%85%B3%E7%9A%84%E7%89%B9%E6%80%A7%EF%BC%88attribute%EF%BC%89 "Permalink to 验证相关的特性（Attribute）")
- 以 `pattern` 为例，对于 `type`  为 text, search, url, tel, email, password 的，可以匹配对应的正则表达


> [!INFO] 注意
> 一些 [`<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input) 元素类型不需要[`pattern`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-pattern) 属性进行校验. 指定特定 `email` 类型 就会使用匹配电子邮件格式的正则表达式来校验(如果有 [`multiple`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-multiple) 属性请用逗号来分割多个邮箱). 进一步来说, 字段 `url` 类型则会自动校验输入的是否为一个合法的链接.

> [!INFO] 注意
> 该 `<textarea>` 元素不支持pattern 属性.

- 简单的例子

```html
<form>
  <label for="choose">Would you prefer a banana or a cherry?</label>
  <input id="choose" name="i_like" required pattern="banana|cherry">
  <button>Submit</button>
</form>
```

## 校验样式

当一个元素校验通过时：
-   该元素将可以通过 CSS 伪类 [`:valid`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:valid) 进行特殊的样式化；
-   如果用户尝试提交表单，如果没有其它的控制来阻止该操作（比如JavaScript即可阻止提交），那么该表单的数据会被提交。

如果一个元素未校验通过：
-   该元素将可以通过 CSS 伪类 [`:invalid`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:invalid) 进行特殊的样式化；
-   如果用户尝试提交表单，浏览器会展示出错误消息，并停止表单的提交。

# 使用 JavaScript校验表单

## 约束校验的 API

越来越多的浏览器支持限制校验API，并且这逐渐变得可靠。这些 API 由成组的方法和属性构成，可在特定的表单元素接口上调用：
-   [HTMLButtonElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)
-   [HTMLFieldSetElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFieldSetElement)
-   [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
-   [HTMLOutputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOutputElement)
-   [HTMLSelectElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement)
-   [HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)

## 常见用的原生表单校验库

-   独立的库（原生 Javascript 实现）
    -   [Validate.js](http://rickharrison.github.com/validate.js/)
-   jQuery 插件
    -   [Validation](http://bassistance.de/jquery-plugins/jquery-plugin-validation/)
    -   [Valid8](http://unwrongest.com/projects/valid8/)