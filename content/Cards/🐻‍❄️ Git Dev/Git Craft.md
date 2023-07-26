---
title: Git Craft
creation date: 2023-03-30 11:36:56
status: done
tag: 
- Development/Git/craft
---
up:: [[Cards/🐻‍❄️ Git Dev/• TOC for Git|• TOC for Git]]

**1、设置错误的远程库怎么办？**

```shell
git remote -v$ git remote set-url origin {{url}}
```

**2、Github Fork 的项目如何更新源项目更新？**

```shell
git remote add upstream {{url}}
git fetch upstream
git merge upstream/master
git pull upstream main
```

**3、提交信息写错了怎么办？**

```shell
git commit --amend --only
git commit --amend --only -m 'xxx'
```

**4、提交时用了错误的用户名或邮箱？（单次）**

```shell
git commit --amend --no-edit --author "yunqian <yunqian@alibaba-inc.com>"
```

或者

```shell
git config --global author.name yunqian
git config --global author.email yunqian@alibaba-inc.com
git commit --amend --reset-author --no-edit
```

**5、最后一次提交不想要了？**

如果已推送。

```shell
git reset HEAD^ --hard
git push --force-with-lease [remote] [branch]
```

如果还没推送。

```shell
git reset --soft HEAD@{1}
```

**6、提交内容需要修改怎么办？比如提交了敏感信息。**

修改或删除，

```shell
# 编辑后 add
git add sensitive_file
# 或删除
git rm sensitive_file
# 或只从 git 里删，但保留在本地，记得在 .gitignore 里加上他
git rm --cached sensitive_file
```

然后，

```shell
git commit --amend --no-edit
git push --force-with-lease origin [branch]
```

**7、在上一次提交的基础上增加改动？**

```shell
git commit --amend
```

**8、放弃本地未提交的修改？**

```shell
# 删除所有 staged 改动
git reset --hard HEAD
# 删除所有未 staged 改动
git clean -fd
# 加 -x 参数可删除所有 ignored 的文件
git clean -fdx
```

**9、不小心删除了分支怎么办？**

```shell
# 找到被删 branch 的 hash 值
git reflog
git checkout -b xxx
git reset --hard {{hash}}
```

**10、删除分支？**

```shell
# 删除远程分支
git push origin --delete foo
# 删除本地分支
git branch -d foo
# 删除没有被合并的分支要用 -D
git branch -D foo
# 批量删除分支
git branch | grep 'fix/' | xargs 
git branch -d
```

**11、在错误的分支上做了修改但未提交？**

```shell
git stash
git checkout correct_branch
git stash pop
```

**12、在错误的分支上做了修改同时已提交？（比如错误地提交到了主干）**

```shell
# 新建分支
git branch xxx
# 删除 master 分支的最后一次 commit
git reset HEAD~ --hard
# 删除的 commit 会切换到 xxx 分支上
git checkout xxx
```

**13、如何撤销一个之前的提交？**

```shell
# 找到要撤销的 commit hash
git log 或 git reflog
# 回滚
git revert {{hash}}
```

**14、如何撤销某一个文件的修改**

checkout 才是撤销文件的最佳选择？

```shell
# 找到要文件修改的前一个 commit hash
git log 或 git reflog
# 回滚文件
git checkout {{hash}} path/to/file
```

**15、git 被我搞乱了，想要重新来过？**

你可以这样，

```shell
$ cd ..$ rm -rf fucking-repo-dir$ git clone https://github.com/fucking-repo-dir.git$ cd fucking-repo-dir
```

也可以这样，

```shell
$ git fetch origin$ git checkout master$ git reset --hard origin/master$ git clean -d --force
```
