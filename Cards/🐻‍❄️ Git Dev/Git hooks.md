---
title: Git hooks
creation date: 2022-03-01 09:26 
status: done
tags:
- Development/Git/hooks
---
up:: [[• TOC for Git](%E2%80%A2%20TOC%20for%20Git.md)

## 常见 Git Hooks

git hooks 大体上分为两类:

### 客户端 Hook

*   `pre-commit` hook, 在运行 `git commit` 命令时且在 commit 完成前被触发
*   `commit-msg` hook, 在编辑完 commit-msg 时被触发，并且接受一个参数，这个参数是存放当前 commit-msg 的临时文件的路径
*   `pre-push` hook, 在运行 `git push` 命令时且在 push 命令完成前被触发

### 服务端 Hook

*   `pre-receive` 在服务端接受到推送时且在推送过程完成前被触发
*   `post-receive` 在服务端接收到推送且推送完成后被触发

> [!Warning]- git hooks 配置
> - git hooks 详细信息见 [git 官方文档]( https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgithooks " https://git-scm.com/docs/githooks" )
> - 在本地 git 仓库中的 `.git/hooks` 文件夹中也可以看到常用的 git hooks 示例

默认的 git hooks 都是 shell 脚本，只需要将 git hooks 的示例文件的 . sample 扩展名去掉，那么示例文件即可生效。一般来说，在前端工程中应用 git hooks 都是运行 javaScript 脚本，就像这样

```shell
#!/bin/sh
node your/path/to/script/xxx.js
```

或者是这样

```shell
#!/usr/bin/env node
// your javascript code ...
```

### 原生的 Git Hooks 的缺陷

原生的 git hooks 有一个比较大的问题是 `.git` 文件夹下的内容不会被 Git 追踪。这就表示，无法保证让一个仓库中所有的成员都使用同样的 git hooks，除非仓库的所有成员都手动同步同一份 git hooks.


## Husky 的使用

1. 安装 husky

```shell
npm install husky --save-dev
```

2. husky 初始化

```shell
npx husky install
```

3. 设置 `package. json` 的 `prepare script` 来保证 husky 可以正常运行

```shell
npm set-script prepare "husky install"
```

4.  添加 git hooks

```shell
npx husky add .husky/${hook_name} ${command}
```

### husky install

1. husky install 会在项目根目录下创建 `. husky` 以及 `. husky/_` 文件夹（文件夹路径也可以自定义），然后在 `. husky/_` 文件夹下创建 `husky. sh` 脚本文件。这个文件的作用就是保证通过 husky 创建的脚本能够正常运行，它的实际应用的地方后面会讲到。更多关于这个脚本的讨论可以看这里 [github issue]( https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky%2Fissues%2F929 " https://github.com/typicode/husky/issues/929" )。
2. husky install 会运行 `git config core.hooksPath ${path/to/hooks_dir}`，这个命令用来指定 git hooks 的路径，此时观察项目下 `.git/config` 文件， [core] 下面会多出一条配置： `hooksPath = xxx`。当 git hooks 被某些命令触发时，Git 会运行 `core.hooksPath` 指定的文件夹下的 git hook。

>[!Note] husky 配置 
>更多关于 husky 的配置、命令相关文档，看[这里]( https://link.juejin.cn?target=https%3A%2F%2Ftypicode.github.io%2Fhusky%2F%23%2F "https://typicode. github. io/husky/ #/ ")

 `core.hooksPath` 是 Git v2.9 推出的新特性，而 Husky 也是在 v6 版本开始使用 `core.hooksPath` 这个特性。在这之前的版本，Husky 会直接覆盖 `.git/hooks` 文件夹下所有的 hook，来使通过 Husky 配置的 hooks 生效。另外，在配置了 `core.hooksPath` 后 Git 会忽略 `.git/hooks` 文件夹下的 git hooks

### husky add

当运行如下命令

```shell
npx husky add .husky/pre-commit npx eslint
```

. husky 目录下会新增一个 `pre-commit` 文件，文件内容为

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx eslint
```

此时已经成功添加了一个 `pre-commit` git hook，这个脚本会在运行 git commit 命令时执行。在脚本的第二行，引用了上面所说的 `.husky.sh` 文件，也就是说通过 husky 创建的 git hook 在被触发时，都会执行这个脚本。

梳理一下，husky 是如何解决原生的 git hooks 的问题的

* 首先前面已经提到了原生 git hooks 主要的问题是 git 无法跟踪 . git/hooks 下的文件，但是这个问题已经被 git core. hooksPath 解决了
* 那么新的问题就是，开发者仍然需要手动设置 git core. hooksPath。 husky 在 install 命令中帮助我们设置了 git core. hooksPath，然后在 package. json 的 scripts 中添加 `"prepare": "husky install"`，这样每次安装依赖的时候就会执行 `husky install`，因此就可以保证设置的 git hooks 可以被触发了。

## 常用的 git hooks 相关工具库

### lint-staged

在 pre-commit hook 中，一般来说都是对当前要 commit 的文件进行校验、格式化等，因此在脚本中我们需要知道当前在 Git 暂存区的文件有哪些，而 Git 本身也没有向 pre-commit 脚本传递相关参数，`lint-staged` 这个包为我们解决了这个问题。

#### lint-staged 的使用

1. 安装 lint-staged

```shell
npm install lint-staged --save-dev
```

2. 配置 lint-staged 一般情况下，建议 `lint-staged` 搭配着 `Husky` 一起使用，当然这不是必须的，只需要保证 `lint-staged` 会在 pre-commit hook 中被运行就可以了。在搭配 Husky 使用的情况下，可以运行下面的命令，在 pre-commit hook 中运行 `lint-staged`

```shell
npx husky add .husky/pre-commit "npx lint-staged"
```

关于 lint-staged 的配置，在形式上与常见的工具包的配置方式大同小异，可以通过在 package. json 中添加一个 `lint-staged` 项、也可以在根目录添加一个 `.lintstagedrc.json` 文件等，下面以在 package. json 中配置为例：

```json
{
    "lint-staged": {
        "glob pattern": "your-cmd"
    }
}
```

配置项中的 key 为 glob 模式匹配语句，值为要运行的命令（可以配置命令），例如想要为暂存区中 src 文件夹下所有的 . ts 和 . tsx 文件运行 eslint 检查以及 ts 类型检查，那么配置如下:

```json
{
    "lint-staged": {
        "src/**/*.{ts,tsx}": [
            "eslint",
            "tsc"  
        ]
    }
}
```

#### 暂存区文件

lint-staged 在内部运行了 `git diff --staged --diff-filter=ACMR --name-only -z` 命令，这个命令会返回暂存区的文件信息，类似如下所示的代码：

```typescript
const { execSync } = require('child_process');
const lines = execSync('git diff --staged --diff-filter=ACMR --name-only -z')
	.toString()

const stagedFiles = lines
    .replace(/\u0000$/, '')
    .split('\u0000')
```

### commitizen

在使用 Git 过程中，不可避免的需要填写 commit message，这其实是一件相当令人头疼的事情。如果没有良好的 commit message 规范，那么在查看历史 commit 的时候只会一脸懵 。而 `commitizen` 可以协助开发者填写 commit 信息

#### commitizen 的使用

1. 安装 commitizen

```shell
npm install commitizen -D
```

2. 初始化 commitizen

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact --pnpm
```

#### commitizen init

1.  安装 `cz-conventional-changelog` 适配器 npm 模块
2.  将其保存到 `package. json` 的 devDependencies 中
3.  `config. commitizen` 配置添加到 `package. json` 中如下所示：

```json
"config": {
    "commitizen": {
        "path": "./node_modules/cz-conventional-changelog"
    }
}
```

commitizen 本身只提供命令行交互框架以及一些 git 命令的执行，实际的规则则需要通过适配器来定义，commitizen 留有对应的适配器接口。而 `cz-conventional-changelog` 就是一个 commitizen 适配器。

这个适配器生成的 commit message 模板如下

```shell
<type>(<scope>): <subject>
<空行>
<body>
<空行>
<footer>
```

这也是最常见的提交约定，当然也可以安装其他适配器，或者自定义适配器来定制自己想要的 commit message 模板。当运行 `npx cz`， commitizen 在通过适配器模板以及用户的输入拿到最终的 commit message 后，会在内部运行 `git commit -m "XXX"` 命令，到此为止，就完成了一次 git commit 操作

>[!Note] commitizen 详细信息
>更多关于 commitizen 的详细等信息可以看 [github]( https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcommitizen%2Fcz-cli " https://github.com/commitizen/cz-cli" ) 和 [cz-git]( https://link.juejin.cn?target=https%3A%2F%2Fcz-git.qbenben.com%2Fzh%2Fguide%2Fgetting-started.html " https://cz-git.qbenben.com/zh/guide/getting-started.html" )

#### 自定义 commitizen 适配器

使用 [cz-customizable]( https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcz-customizable " https://www.npmjs.com/package/cz-customizable" ) 工具包可以自定义适配器。在没有这个工具包的情况下，如果想要自定义一个 commitizen 适配器，那么你还需要掌握 `inquirer` 的 API，commitizen 只会为适配器传递一个 inquirer 对象，适配器的规则需要通过这个 inquirer 对象来创建规则，这是在不太易用，而 `cz-customizable` 可以让我我们只专注于规则而不用去考虑 inquirer 的 API。

1. `commitizen` 配置

```json
"config": {
    "commitizen": {
        "path": "./node_modules/cz-customizable"
    }
}
```

2. `cz-customizable` 配置，在根目录新增一个 `.cz-config.js` 文件，配置示例如下

```javascript
module.exports = {
	types: [
		{ value: 'feat', name: 'feat: A new feature' },
		{ value: 'fix', name: 'fix: A bug fix' },
	],
	 scopes: [
		{ name: 'accounts' },
		{ name: 'admin' }
	],
	 allowTicketNumber: false,
	 messages: {
		 type: "Select the type of change that you're committing:",
		 scope: '\nDenote the SCOPE of this change (optional):',
		 customScope: 'Denote the SCOPE of this change:',
      },
	 subjectLimit: 100,
};
```

>[! NOTE]  `cz-customizable` 配置
>关于 `cz-customizable` 更详细的 [示例]( https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fleoforfree%2Fcz-customizable%2Fblob%2Fmaster%2Fcz-config-EXAMPLE.js " https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js" ) 和 [配置]( https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fleoforfree%2Fcz-customizable " https://github.com/leoforfree/cz-customizable" )

#### 使用 git cz 命令运行 commitizen

在全局 PATH 配置正确的情况下，也可以直接使用 `git cz` 命令去运行 commitizen。如果在项目中安装了 commitizen, 那么在项目下的 `node_modules/. bin` 目录下将会看到两个脚本: `cz` 和 `
这两个脚本的内容是一模一样的，官方的文档中会推荐在 package. json 的 scripts 中添加如下内容：

```shell
commit: "cz"
```

这样就可以使用 `npm run commit` 来运行 commitizen 了。但是如果想要使用 `git cz` 命令运行 commitizen，那么则要求 `git-cz` 文件所在的目录在全局的 PATH 下，运行以下命令来查看 PATH

```shell
echo $PATH
```

PATH 以冒号分隔，检查一下所有的 PATH 中是否有一条能匹配到你的 cz 脚本，一般来说都是有的，如果没有，那么你可以在你的 `~/.zshrc` 或者 `~/.bash_profile` 中加上一条：

```shell
PATH=$PATH:./node_modules/.bin
```

然后重新加载一下配置文件，运行 `source ~/.zshrc` 或者 `source ~/.bash_profile`，这样在你项目根目录下就可以直接使用 `git cz` 命令了。如果你是用 **npm** 全局安装的 commitizen，那么你大概率不需要担心 PATH 的问题，因为 npm 的依赖安装路径下的 bin 文件夹会被 node 或者 NVM 自动加入到 PATH 中。

回到刚刚所说的 node_modules/. bin 文件夹下的 `git-cz` 脚本，实际上它是 `git cz` 命令可以运行的关键。不知道你是否疑惑，为什么使用 Git 可以去运行一个 npm 库，实际上，这是 git 自定义命令。想要添加一个 git 自定义命令有如下几个要求：

1.  是一个可执行文件
2.  文件名必须是 `git-XXX`
3.  这个文件所在路径必须在你的 PATH 下

所以前文中，提到想要运行 `git cz` 命令，需要全局 PATH 配置正确。

### commitlint

commitlint 这个工具库，可以通过配置一些规则来校验 commit message 是否规范。那么我们已经有了 commitizen 为什么还需要 commitlint 呢？上文中说到，commitizen 的作用是协助开发者填写 commit message，虽然可以通过选择不同的适配器或者自定义适配器来制定对应的 commit 信息规范以及模板，但是缺少了对 commit message 的校验功能，开发者仍然可能在无意中使用原生的 `git commit` 命令来提交，而 commitlint 在 `commit-msg` 这个 git hook 中对 commit message 进行校验，正好解决了这个问题。

#### commitlint 的使用

1. 安装

```shell
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

2. 使用 husky 添加 commit-msg hook

```shell
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1
```

3. commitlint 配置在项目根目录增加一个 `commitlint.config.js` 文件, 文件内容如下：

```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'],
    // 自定义部分规则
    rules: {
        'scope-case': [0, 'always', 'camel-case'],
        'scope-empty': [2, 'never'],
        'scope-enum': [2, 'always', [...]],
    },
};
```

commitlint 与 commitizen 一样，分为两部分，一部分是执行的主程序，另一部分是规则或者说是适配器。 `@commitlint/cli` 是执行的主程序，`@commitlint/config-conventional` 则是规则。commitlint 和 commitizen 分别采用了策略模式和适配器模式，因此有非常高的可用性和良好的扩展性。

在 commitlint 的配置文件中，可以先引用一个 commitlint 规则包，然后在定义部分自己想要的规则，就像 eslint 的配置一样。

需要注意的是，在将 commitlint 添加到 commit-msg hooks 中时，执行 commitlint 的 shell 命令中 `--edit $1` 参数是必须的，这个参数的意思是：存储 commit message 的临时文件路径是 `$1`, 而 `$1` 则是 Git 传给 commit-msg hook 的参数，它的值是 commit message 的临时存储文件的路径，默认情况下是 `.git/COMMIT_EDITMSG`。如果不传这个参数，那么 commitlint 将无法得知当前的 commit message 是什么。

更多 commitlint 的相关详情看[这里]( https://link.juejin.cn?target=https%3A%2F%2Fcommitlint.js.org%2F%23%2F "https://commitlint. js. org/ #/ ")

#### commitlint 与 commitizen 的配置共用

前文中说到 commitlint 解决了 commitizen 没有对 commit message 做校验的问题，但是使用了 commitlint 后，新的问题出现了，如果 commitlint 的规则集与 commitizen 的适配器中的规则不一致，那么可能会导致使用 commitizen 生成的 commit message 被 commitlint 校验时不通过从而 git commit 失败。解决这个问题的办法有两种：

1.  将 commitizen 的适配器规则翻译为 commitlint 规则集，已有的对应工具包为 [commitlint-config-cz]( https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcommitlint-config-cz " https://www.npmjs.com/package/commitlint-config-cz" )，这个包需要你所使用的 commitizen 适配器为 `cz-customizable`，也就是自定义适配器。
2.  将 commitlint 规则集转化为 commitizen 的适配器，已有对应的工具包为 [@commitlint/cz-commitlint]( https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40commitlint%2Fcz-commitlint " https://www.npmjs.com/package/@commitlint/cz-commitlint" )

这里以第二种选用 `@commitlint/cz-commitlint` 为例：

1. 安装 @commitlint/cz-commitlint

```shell
npm install --save-dev @commitlint/cz-commitlint
```
 
2. 修改 packages. json 中 commitizen 的配置

```json
"config": {
	"commitizen": {
		"path": "./node_modules/@commitlint/cz-commitlint"
	}
}
```
