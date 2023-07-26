---
cssclass: scopePage
obsidianUIMode: preview
tags: 
- Atlas/Scope
---

# 🌏[[Sources/Sources MOC|Sources MOC]] | Bookshelf 📚 

| [[Books I've Read MOC]] | [[Books Purgatory List]]

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE, 
dates as DATE
from #Sources/Books
where !contains(file.name, "Template") 
```