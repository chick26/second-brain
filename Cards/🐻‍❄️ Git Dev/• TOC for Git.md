---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Cards/Cards MOC|Cards MOC]] | Git TOC

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,
string(map(file.etags, (t) => split(t, "/")[length(split(t, "/")) - 1])) as TAG,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from "Cards/🐻‍❄️ Git Dev"
where !contains(tags, "Atlas/TOC")
```
