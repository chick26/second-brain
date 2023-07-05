---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/Scope 
---

# 🌏[[../../Home.md]] | Cooling pad 🧊

``` dataview
TABLE WITHOUT ID
 file.link as "Encounters",
 (date(today) - file.cday).day as "Days alive",
  dateformat(file.ctime, "yyyy-MM-dd") as "日期"

FROM "• Encounters" 
  and -"• Encounters/• Highlights" 
  and -"• Encounters/• Antilibrary"
  and -#x/readme

WHERE (date(today) - file.cday).day > 1
SORT file.cday desc
LIMIT 20
```