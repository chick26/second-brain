---
title: Media Log
creation date: 2022-03-01 21:51 
cssclass: homePage
obsidianUIMode: preview
banner: "![[shelf.jpg]]"
tags:
- Atlas/Scope
---
<div class="title" style="color:#fff">Media</div>

# < [[Calendar/Journal MOC|🌏]] | [[Atlas/Scopes/Calendar/New Discoveries Hub|💡]] | [[Atlas/Scopes/Calendar/Ship Hub|🛳️]] >

Media Log contains mini-reviews on the books/articles I read and the videos I watch.

# 🎧 Listening Log
```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
ListeningLog as "Log"
from "Calendar/Journal"
where contains(ListeningLog, "")
```

# 📖 Reading Log
```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
ReadingLog as "Log"
from "Calendar/Journal"
where contains(ReadingLog, "")
```

# 📸 Photographing Log
```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
PhotographingLog as "Log"
from "Calendar/Journal"
where contains(PhotographingLog, "")
```

# 🎬 Video Log
```dataview
TABLE WITHOUT ID 
("[[" + file.name + "]]") AS Entries,
VideoLog as "Log"
from "Calendar/Journal"
where contains(VideoLog, "")
```