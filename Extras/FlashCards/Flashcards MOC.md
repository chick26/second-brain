---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Atlases MOC|Atlases]] | Flashcards MOC

## Card Package

```dataview
TABLE
file.folder as PATH,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED
FROM "Extras/FlashCards"
```

## Card Classification

```dataview
TABLE
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED
FROM "Cards" and -"Cards/+ Index for Cards"
WHERE contains( tags, "Atlas/Index")
```
