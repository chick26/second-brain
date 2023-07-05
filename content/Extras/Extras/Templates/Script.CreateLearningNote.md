<%*

const input = await tp.system.prompt("输入标题：")
const template = tp.file.find_tfile('Learning-Note')
const titleName = input
tp.file.create_new(template, titleName , false)

-%>