---
title: Git commit message
creation date: 2022-07-18 17:09:53
status: todo
tags: 
- Development/Git
- Development/Git/commit
---
up:: [[• TOC for Git](%E2%80%A2%20TOC%20for%20Git.md)

> A typical git commit message will look like  

```git
<type>(<scope>): <subject>
```

## "type" must be one of the following mentioned below!

*   `build`: Build related changes (eg: npm related/ adding external dependencies)
*   `chore`: A code change that external user won't see (eg: change to .gitignore file or .prettierrc file)
*   `feat`: A new feature
*   `fix`: A bug fix
*   `docs`: Documentation related changes
*   `refactor`: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name)
*   `perf`: A code that improves performance
*   `style`: A code that is related to styling
*   `test`: Adding new test or making changes to existing test

## "scope" is optional

*   Scope must be noun and it represents the section of the section of the codebase
*   [Refer this link for example related to scope](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)

## "subject"

*   use imperative, present tense (eg: use "add" instead of "added" or "adds")
*   don't use dot(.) at end
*   don't capitalize first letter

[Refer this link for more practical examples of commit messages](https://github.com/eslint/eslint/commits/master)

# References:

*   [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)
*   [https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
*   [https://github.com/fteem/git-semantic-commits](https://github.com/fteem/git-semantic-commits)