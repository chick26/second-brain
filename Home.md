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
>  📥  **[[Cooling pad|INBOX]]**: `$=dv. pages ('"• Encounters"'). length` 
> ✒️  **[[Notebox 🗃|LEARN NOTE]]**: `$=dv.pages('"Cards" and -#Atlas').length`
> 📝  **[[Books I've Read MOC|READ NOTE]]**: `$=dv. pages ('"Scources/Books"'). length`
> 📇  **[[Journal MOC|DAILY]]**: `$=dv.pages('#Logs/Journal').length`


# 🗺 [[Atlases MOC|ATLAS]]

>[!INFO]- Start With Your Cooling Pad for today

- Sense Making
	-  📬 [[Cooling pad]]
	-  💾 [[Cards MOC|Making Cards]]
	-  📤 [[Outbox]]
	-  📆 [[Journal MOC|Daily Notes]]

-  [[Sources MOC|Things]]
	-  📚 [[Bookshelf|Library]]
	-  🧑‍🏫 [[• TOC for Talks|Talks]]
	-  😶‍🌫️ [[Concepts MOC|Concepts]]
	-  🔬 [[Courses MOC|Courses]]

- Action
	- ✅ [[Tasks]]

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

