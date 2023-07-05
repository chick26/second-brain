---
cards-deck: Fronten Hand Writing
---
# Fronten Hand Writing

## [[Sources/Courses/🗿 Frontend Interview/问答汇总/Q0001-图片懒加载|图片懒加载]] #flashcard

- 位置计算 + 滚动事件 (Scroll) + DataSet API
```
const isInView = (
	offsetTop < scrollTop + innerHeight &&
	offsetTop + el.clientHeight > scrollTop &&
	offsetLeft < scrollLeft + innerWidth &&
	offsetLeft + el.clientWidth > scrollLeft
)
```
- getBoundingClientRect API + Scroll with Throttle + DataSet API
- IntersectionObserver API + DataSet API
- `<img loading="lazy"/>`
^1661136131783

## 浏览器中如何实现剪切板复制内容的功能 #flashcard 
### 第三方库 [clipboard-copy](https://github.com/feross/clipboard-copy/blob/master/index.js) 
### [Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API) 
### Selection API + execCommand
^1661937920198

