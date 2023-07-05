---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Flashcards MOC](../Flashcards%20MOC.md) | Untitled

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,
string(map(file.etags, (t) => split(t, "/")[length(split(t, "/")) - 1])) as TAG,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from "Extras/FlashCards/Communicate int tech"
where !contains(tags, "Atlas/TOC")
```
