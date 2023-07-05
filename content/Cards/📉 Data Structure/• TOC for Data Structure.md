---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/TOC
---

# 🌏 [[Cards MOC](../Cards%20MOC.md) | Data Structure TOC

```dataviewjs
for (let group of 
		 dv.pages('#Development/Backend/Database and -#Atlas/TOC')
			 .groupBy(p => p.file.etags.map(tag => tag.split('/')[2])[0] || 'Global'))
			 { 
	dv.header(2, group.key); 
	dv.table(
		["FILE", "CREATED", "MODIFIED", "TAGS"], 
		group.rows.map(k => [
			k.file.link, 
			k.file.ctime, 
			k.file.mtime,
			k.file.etags.map(tag => tag.split('/')[tag.split('/').length-1]).join(',')
		])
	) 
}
```