---
title: Ship's Log
creation date: 2022-03-01 21:51 
cssclass: homePage
obsidianUIMode: preview
banner: "![[Ship.jpeg]]"
banner_y: 1
tags:
- Atlas/Scope
---
<div class="title" style="color: #fff ">Set Out</div>

# < [[Journal MOC|🌏](../../../Calendar/Journal%20MOC.md) | [[New Discoveries Hub |💡](New%20Discoveries%20Hub.md) | [[Media Hub|📚](Media%20Hub.md) > 

# ⛽️ Life Happenings

```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
LifeEvent as "Log"
from "Calendar"
where contains(LifeEvent, "")
```

# 🧰 Personal Projects

```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
PersonalProjects as "Log"
from "Calendar"
where contains(PersonalProjects, "")
```