---
title: Browser forward and backward Using Stack
creation date: 2023-06-21 16:56 
status: done
tags: 
- Development/ComputerBasic/DataStructure/Stack
- Sources/Courses/Algorithms
---

## 问题

依次访问完一串页面 a-b-c 之后，点击浏览器的后退按钮，就可以查看之前浏览过的页面 b 和 a。后退到页面 a，点击前进按钮，就可以重新查看页面 b 和 c。但是，如果后退到页面 b 后，点击了新的页面 d，那就无法再通过前进、后退功能查看页面 c 了。

## 思路

使用两个 [[Stack.md|栈]] X 和 Y , **栈 X 中的栈顶数据表示当前访问的页面**
- 打开页面时将数据压入栈 X，并清空栈 Y。
- 当点击后退按钮时，取出栈 X 数据并放入栈 Y 中。
- 当点击前进按钮时，取出栈 Y 数据放入栈 X 中。
- 当栈 X 中仅剩 1 个数据时，那就说明没有页面可以继续后退浏览了。
- 当栈 Y 中没有数据，那就说明没有页面可以点击前进按钮浏览了。

即，
- 后退时将页面从 X 移动到 Y；
- 前进则将页面从 Y 移动到 X；
- 访问新页面时，则将新页面压入 X，并清空 Y。
三种操作都是取 X 的栈顶元素显示。

## 实现

```python
from collections import deque

class Browser():
    def __init__(self):
        self.x_stack = deque()
        self.y_stack = deque()
    
    def can_back(self):
        return len(self.x_stack) > 1
    
    def can_forward(self):
        return len(self.y_stack) > 0
    
    def open(self, url):
        print("Open new url %s" % url, end="\n")
        self.x_stack.appendleft(url)
        self.y_stack.clear()
    
    def back(self):
        if self.can_back():
            self.y_stack.appendleft(self.x_stack.popleft())
            print("back to %s" % self.x_stack[0], end="\n")
    
    def forward(self):
        if self.can_forward():
            self.x_stack.appendleft(self.y_stack.popleft())
            print("forward to %s" % self.x_stack[0], end="\n")
    
    def __str__(self):
        return "X:HEAD=>%s,Y:HEAD=>%s" % ("->".join(self.x_stack) or "None", "->".join(self.y_stack) or "None")

```

