---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Atlas/MOCs/Courses MOC|Courses MOC]] | Frontend Interview TOC

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from "Sources/Courses/🗿 Frontend Interview"
where !contains(tags, "Atlas/TOC")
```
