---
cssclass: scopePage
obsidianUIMode: preview
tags:
- Atlas/MOC
---
# 🌏 [[Atlases MOC| Atlases]] | <% tp.file.title %>

```dataviewjs
for (let group of 
		 dv.pages('{}')
			 .groupBy(p => p.file.etags.map(tag => tag.split('/')[1])[0]))
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
