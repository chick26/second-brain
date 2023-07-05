<%*
const input = await tp.system.prompt("Your MOC Name：")
const tag = await tp.system.prompt("")
const template = tp.file.find_tfile('')
const titleName = input + '- ReadingNote'
tp.file.create_new(template, titleName , false)
-%>