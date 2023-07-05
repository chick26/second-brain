---
title: Learning Note OverView
creation date: 2022-03-01 21:51 
cssclass: homePage
tags:
banner: "![[宁静.JPG]]"
banner_x: 0.5
banner_y: 0.85
banner_lock: true
obsidianUIMode: preview
---
<div class="title" style="color:#fff">HOME</div>

# 📈 STATS

>[!INFO]+ Update Your Database
> 🧠  **TOTAL**: `$=dv.pages().length` 
> 📥  **[INBOX](Atlas/Scopes/Cooling%20pad.md)**: `$=dv. pages ('"• Encounters"'). length` 
> ✒️  **[LEARN NOTE](Cards/Cards%20MOC.md)**: `$=dv.pages('"Cards" and -#Atlas').length`
> 📝  **[Read Note](Books%20I've%20Read%20MOC)**: `$=dv. pages ('"Scources/Books"'). length`
> 📇  **[DAILY](Calendar/Journal%20MOC.md)**: `$=dv.pages('#Logs/Journal').length`


# 🗺 [ATLAS](Atlas/Atlases%20MOC.md)

>[!INFO]- Start With Your Cooling Pad for today

- Sense Making
	-  📬 [Cooling pad](Atlas/Scopes/Cooling%20pad.md)
	-  💾 [Making Cards](Cards/Cards%20MOC.m)
	-  📤 [Outbox](Atlas/Scopes/Outbox.md)
	-  📆 [Daily Note](Calendar/Journal%20MOC.md)

-  [Things](Sources/Sources%20MOC.md)
	-  📚 [Library](Atlas/Scopes/Bookshelf.md)
	-  🧑‍🏫 [Talks](Sources/Talks/%E2%80%A2%20TOC%20for%20Talks.md)
	-  😶‍🌫️ [Concepts](Atlas/MOCs/Concepts%20MOC.md)
	-  🔬 [Courses](Atlas/MOCs/Courses%20MOC.md)

- Action
	- ✅ [Tasks](Calendar/Tasks.md)

- Personal
	- [[Health MOC]] 
	- [[Finance MOC]]
	- [[Life Map]]

---

# 📑 WAITING LIST

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,
string(map(file.etags, (t) => split(t, "/")[length(split(t, "/")) - 1])) as TAG,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from "Sources"
where status = "todo"
sort file.mtime asc
```

---
# 📝 DOING LIST

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,
string(map(file.etags, (t) => split(t, "/")[length(split(t, "/")) - 1])) as TAG,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from "Sources"
where status = "ondo"
sort file.mtime asc
```

---
# 📨 REVIEW LIST

```dataview
table WITHOUT ID
("[[" + file.name + "]]") as TITLE,
string(map(file.etags, (t) => split(t, "/")[length(split(t, "/")) - 1])) as TAG,
dateformat(file.mtime, "yyyy-MM-dd") as MODIFIED,
dateformat(file.ctime, "yyyy-MM-dd") as CREATED
from ("Cards" or "Sources") and !#Atlas
where status = "done" or status = "review"
limit 10
```

