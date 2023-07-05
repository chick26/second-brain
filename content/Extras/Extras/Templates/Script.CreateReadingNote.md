<%*

const input = await tp.system.prompt("输入书名：")
const template = tp.file.find_tfile('Book-Note')
const titleName = input + '- ReadingNote'
tp.file.create_new(template, titleName , false)

-%>