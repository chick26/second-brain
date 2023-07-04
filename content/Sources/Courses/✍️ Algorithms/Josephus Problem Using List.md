---
title: Josephus Problem Using List
creation date: 2023-06-16 08:42 
status: ondo
tags: 
- Development/ComputerBasic/DataStructure/List
- Sources/Courses/Algorithms
---

## 问题

有 n 个人围成一圈，顺序排号。从第一个人开始报数（从 1 到 m 报数），凡报到 m 的人退出圈子，直到船上仅剩 r 人为止, 问都有哪些编号的人下船了呢？

## 实现

- 假设 n=30，m=9，r=15
- [[Array|数组]] 实现

```python
# -*- coding: utf-8 -*-
__author__ = 'xiaoxiaoming'
n, m, r = 30, 9, 15
circle = list(range(1, n + 1))
# index+1代表当前报数的人在剩余报数人群中的编号
index = 0
result = []
while len(circle) > r:
    index += m-1
    if (index >= len(circle)):
        index -= len(circle)
    result.append(circle.pop(index))
print("报到%d的人的出列顺序：" % m, result)
```

- [[List|链表]] 实现

```python
class ListNode(object):
    def __init__(self, val, next_node=None):
        self.val = val
        self.next = next_node
n, m, r = 30, 9, 15
# 开始构建环
head = ListNode(1)
p = head
for i in range(2, n + 1):
    p.next = ListNode(i)
    p = p.next
p.next = head
# 构建完成,开始报数
result = []  # 用于保存出列顺序
p = head
count = 1  # 第一个人报的数为1
while n != r:
    prev: ListNode = p
    p = p.next
    count += 1
    # 凡报到m的人退出圈子
    if count == m:
        result.append(p.val)
        prev.next = prev.next.next
        count = 0
        n -= 1
print("报到%d的人的出列顺序：" % m, result)
```