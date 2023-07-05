---
title: New Discoveries Log
creation date: 2022-03-01 21:51 
cssclass: homePage
obsidianUIMode: preview
banner: "![[discovery.jpg]]"
tags:
- Atlas/Scope
---
<div class="title" style="color:#fff">New Discoveries</div>

# < [[Journal MOC|🌏](../../../Calendar/Journal%20MOC.md) |  [[Ship Hub|🛳️](Ship%20Hub.md) | [[Media Hub|📚](Media%20Hub.md) >

A log containing the interesting discoveries from the Daily Notes.

# List

```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
NewDiscovery as "Log"
from "Calendar"
where contains(NewDiscovery, "")
```