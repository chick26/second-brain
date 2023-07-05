---
title: "AppleScript"
date: 2022-01-24 14:41
status: done
tags:
- Development/AppleScript
---
up:: [[Cards/📲 Front Dev/• TOC for Frontend|• TOC for Frontend]]
# 键位代码
[代码说明](https://eastmanreference.com/complete-list-of-applescript-key-codes)

## Telegram Checkin

```AppleScript
tell _application_ "Telegram" to activate
delay 0.5
tell _application_ "System Events"
	tell _process_ "Telegram"
		tell _window_ "Telegram"
			key code 53
			keystroke "RenzheCloud Bot"
			delay 0.5
			key code 36
			delay 1
			key code 44
			key code 8
			delay 0.5
			key code 36
		end tell
	end tell
end tell
delay 3

tell _application_ "Telegram" to quit
```
