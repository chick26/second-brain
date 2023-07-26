---
title: Palindromic string
creation date: 2023-06-15 17:22 
status: ondo
tags: 
- Development/ComputerBasic/DataStructure/List
- Sources/Courses/Algorithms
---

## 问题

如果字符串是通过 [[Sources/Courses/✍️ Algorithms/List| 单链表]] 来存储的，那该如何来判断是一个回文串呢？

## 思路
- 使用快慢两个指针找到链表中点，慢指针每次前进一步，快指针每次前进两步。这样当快指针指向末尾时，慢指针指向了中点。
- 在慢指针前进的过程中，同时修改其 next 指针指向上一个元素 prev，使得链表前半部分反序。
- 最后比较中点两侧的链表是否相等。

## 实现

```python
class ListNode(object):
    def __init__(self, val, next=None):
        self.val = val
        self.next = next
class StringLinkedList:
    def __init__(self, val: str):
        self.head = ListNode(None, None)
        p = self.head
        for ch in val:
            p.next = ListNode(ch)
            p = p.next
        self.head = self.head.next
    def is_palindrome(self) -> bool:
        p = self.head
        if not p.next:
            return True
        prev = None
        slow = p
        fast = p
        while fast and fast.next:
            # 快指针每次前进两步
            fast = fast.next.next
            # 慢指针每次前进一步，同时修改其 next指针指向上一个元素
            next_node = slow.next
            slow.next = prev
            prev = slow
            slow = next_node
        # 当快节点指向尾部时循环结束，此时慢节点指向中位点
        # 如果快节点仍然有值，说明字符串长度为奇数，慢节点指向中位点下一个节点
        mid = slow
        if fast:
            slow = slow.next
        # print(self.to_string(prev), self.to_string(slow), self.to_string(fast))
        tmp = mid
        while slow:
            if slow.val != prev.val:
                return False
            slow = slow.next
            #还原倒序的链表
            next_node = prev.next
            prev.next = tmp
            tmp = prev
            prev = next_node
        return True
    @staticmethod
    def to_string(head: ListNode):
        vals = []
        p = head
        while p:
            vals.append(str(p.val))
            p = p.next
        return ''.join(vals)
    def __str__(self):
        return self.to_string(self.head)
```

时间复杂度：`O(n)` 
空间复杂度：`O(1)`
