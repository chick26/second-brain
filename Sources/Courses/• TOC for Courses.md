---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Sources/Sources MOC|Sources]] | [[Atlas/MOCs/Courses MOC|Courses]] | TOC

```dataviewjs
for (let group of 
		 dv.pages('#Sources/Courses')
			 .groupBy(p => p.file.etags.map(tag => tag.split('/')[2])[0]))
			 { 
	dv.header(2, group.key); 
	dv.table(
		["FILE", "MODIFIED", "TAGS"], 
		group.rows.map(k => [
			k.file.link, 
			k.file.ctime, 
			k.file.etags.map(tag => tag.split('/')[tag.split('/').length-1]).join(',')
		])
	) 
}
```