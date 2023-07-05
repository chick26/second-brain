---
title: dumi 组件库搭建
creation date: 2022-02-28 19:05 
status: done
tags:
- Development/Frontend/JavaScript/uiLibrary
- Development/Frontend/Deploy/Dumi
---
up:: [[• TOC for Frontend](../%E2%80%A2%20TOC%20for%20Frontend.md)

# 配置相关

## father 打包

> esm 和 cjs 支持 rollup 和 babel 两种打包方式，rollup 和 babel 两者的区别在于：

###  esm 和 cjs

- rollup：会根据 entry，把项目依赖打包在一起只输出一个 js 文件，js 文件输出在 dist 目录 。此时 packages.json 中，

```json
{
	"main": "./dist/index.js",
	"module": "./dist/index.esm.js"
}
```

- babel：会把 src 目录直接转化成 lib 目录（cjs）或 es 目录（esm），所有 js 文件的目录结构不变。此时 packages.json 中，

```json
{
	"main": "./lib/index.js",
	"module": "./es/index.js"
}
```

### umd

umd 输出在 dist 目录，常用配置为：  

```typescript
umd: {
	name: 'meditation', // 在script中引入后，可通过[name].[method]进行方法引用
	file: 'meditation', // 打包后生成的文件名，位置在./dist/[file].js，一般与name保持一致
	minFile: true, // 是否生成对应的./dist/[file].min.js
},
```

### 定义方式

输出格式（esm/cjs/umd）的定义有两种方式：

- 配置文件：在 `.fatherrc.ts` 中配置 esm/cjs/umd，esm/cjs 可选 babel 和 rollup 两种模式。
- 命令参数：father-build 后接参数，如 `father-build --esm --cjs --umd`，注意此时`--esm` 和`--cjs` 均为 rollup 模式。

father 构建时会对配置文件和命令参数中输出格式的定义进行合并，命令参数的优先级比配置文件高。例如，当配置文件中 esm 和 cjs 使用 babel，而构建命令为`father-build --esm --cjs`时，最终 esm 和 cjs 的模式为 rollup。

### 注意事项

- 通常只要配置`esm: "babel"`即可，如果要考虑 ssr，再配上`cjs: "babel"`。
- package.json 里配上 `sideEffects: false | string[]`，会让 webpack 的 [tree-shaking](https://webpack.js.org/guides/tree-shaking/) 更高效。
- cjs 和 esm 格式打包方式选 rollup 时有个约定，dependencies 和 peerDependencies 里的内容会被 external。
- esm.mjs 和 umd 格式，只有 peerDependencies 会被 external。
- 打包方式 babel 时无需考虑 external，因为是文件到文件的编译，不处理文件合并。
- babel 模式下一些文件不会被编译到 es 和 lib 下，包含：
	- `__test__` 目录
	- `fixtures` 目录
	- `demos` 目录
	- `mdx` 文件
	- `md` 文件
- 测试文件，比如 
	- `test.js`
	- `spec.js`
	- `e2e.js`
	- 后缀还支持 `jsx`、`ts` 和 `tsx`
	  
- 在 webpack + web + ESM/CJS 的应用场景中，入口文件优先级为 browser > module > main；在 node + CJS 的应用场景中，只有 main 字段有效。



## dumi 打包

- 站点模式  `site | doc`

# 问题记录

##  1.引用自身组件报错

### 问题描述
- 文件目录结构
```md
📦src
┣ 📂components
┃ ┣ 📂Foo
┃ ┗ 📂UniButton
┃ ┃ ┣ 📜index.md
┃ ┃ ┣ 📜index.tsx
┃ ┃ ┣ 📜uniButton.less
┃ ┃ ┗ 📜uniButton.tsx
┣ 📂demos
┃ ┣ 📂demo-block
┃ ┃ ┣ 📜index.less
┃ ┃ ┗ 📜index.tsx
┃ ┣ 📂demo-description
┃ ┗ 📜index.ts
┣ 📂global
┃ ┣ 📜global.less
┃ ┣ 📜index.ts
┃ ┗ 📜theme.less
┣ 📂utils
┗ 📜index.ts
```
- 引用组件库组件作为 DEMO 展示时, dumi 自动识别当前组件文件目录 `src/index.ts`, 而内部组件(不作为输出组件声明部分, `src/demos/index.ts`) 需要添加别名

### 解决方案 
`.umirc.ts` 添加别名配置
```ts
import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
	alias: {
		demos: path.join(__dirname, 'src/demos/index.ts'),
	},
});
```

## 2.组件发布私有库

^2c1320

### 登录私有库
```shell
#未注册且私服允许注册的
npm adduser --registry=http://xxx.xxx.x.xx:4873

#输入npm账号用户名、密码和邮箱，如下：
Username: better1025
Password: 
Email: (this IS public) xxx@xx.com
Logged in as better1025 on http://xxx.xxx.x.xx:4873/.

#之前已经注册过了，就使用下面的登录命令
npm login --registry=http://xxx.xxx.x.xx:4873
```

### 发布npm包到私有仓库
```shell
#cd 项目目录
npm publish --registry=http://xxx.xxx.x.xx:4873
```

## 3.解决使用私有库配置

- .npmrc
```
registry=https://nexus.dev/repository/npm-proxy/  
@mycompany:registry=https://myserver.dev/repository/npm-releases/
```

- .yarnrc
```
registry "https://nexus.dev/repository/npm-proxy/"  
"@mycompany:registry" "https://myserver.dev/repository/npm-releases/"
```

## 4.解决 father rollup 模式对 cjs 引用问题

### 问题描述
项目依赖 `classnames`，希望把这个三方包打到产物中，是这样配置的
```ts
// .fatherrc.ts
export default {
  cjs: 'rollup',
  externalsExclude: ['classnames'],
};

```

打包时出现错误提示
```shell
✖  error     Error: 'default' is not exported by node_modules/classnames/index.js, imported by src/index.js
```

### 解决方案
```ts
// .fatherc.ts
// father 锁定了 rollup 版本，需要根据对应版本选择适合的 commonjs 插件 15.1.0
import commonjs from '@rollup/plugin-commonjs';
export default {
	esm: 'rollup',
	entry: 'src/index',
	lessInRollupMode: {
		javascriptEnabled: true,
	},
	autoprefixer: {
		overrideBrowserslist: ['ie>9', 'Safari >= 6'],
	},
	externalsExclude: ['classnames'],
	extraRollupPlugins: [commonjs()],
};
```

## 5. 解决组件库二次封装

^a7bc3d
### 问题描述
项目基于 `Antd Mobile` 进行二次封装，引用过程中出现引用识别错误，导致不能使用

### 解决方案
将 `antd mobile` 降级为额外引用，使用项目时自行拉取相关库
```json
"peerDependencies": {
	"antd-mobile": "^5.5.0",
	"react": ">=16.12.0",
	"react-dom": ">=16.12.0"
}
```


# 参考文章

* [leonwgc/react-uni-comps: 桌面和移动端react组件库, desktop & mobile react components](https://github.com/leonwgc/react-uni-comps)
* [教你使用Dumi和father-build快速搭建React组件库 - 掘金](https://juejin.cn/post/6904795653243994125)
* [使用dumi生成react组件库文档并发布到github pages - 记忆的森林 - 博客园](https://www.cnblogs.com/leonwang/p/15646295.html)
* [ant-design/pro-components: 🏆 Use Ant Design like a Pro!](https://github.com/ant-design/pro-components)