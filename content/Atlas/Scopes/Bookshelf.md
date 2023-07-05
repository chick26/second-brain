---
cssclass: scopePage
obsidianUIMode: preview
tags: 
- Atlas/Scope
---

# 🌏[[Sources MOC](../../Sources/Sources%20MOC.md) | Bookshelf 📚 

| [[Books I've Read MOC]] | [[Books Purgatory List]]

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE, 
dates as DATE
from #Sources/Books
where !contains(file.name, "Template") 
```