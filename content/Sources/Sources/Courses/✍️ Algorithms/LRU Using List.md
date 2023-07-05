---
title: LRU Using List
creation date: 2023-06-16 08:35 
status: done
tags: 
- Development/ComputerBasic/DataStructure/List
- Sources/Courses/Algorithms
---

缓存是一种提高数据读取性能的技术，在硬件设计、软件开发中都有着非常广泛的应用，比如常见的 CPU 缓存、数据库缓存、浏览器缓存等等。

>[!INFO]- 缓存淘汰策略
>
>- 先进先出策略  FIFO（First In，First Out）
>- 最少使用策略 LFU（Least Frequently Used）
>- 最近最少使用策略  LRU（Least Recently Used）

### LRU 缓存的实现

**思路**：维护一个[[List|有序单链表]]，越靠近链表尾部的结点是越早之前访问的。当有一个新的数据被访问时，从链表头开始顺序遍历链表：

- 如果此数据之前已经被缓存在链表中了，遍历得到这个数据对应的结点，并将其从原来的位置删除，然后再插入到链表的头部。
- 如果此数据没有在缓存链表中,，则将此结点插入到链表的头部；如果此时缓存超过容量，则链表尾结点删除。

---

```python
class ListNode(object):
    def __init__(self, val, n=None):
        self.val = val
        self.next = n

class LRUCache:
    """
    一个 LRU 缓存
    维护了一个有序单链表，越靠近链表尾部的结点是越早之前访问的。
    """
    def __init__(self, capacity: int = 10):
        self.cap = capacity
        # 哨兵节点, 本身不存储任何数据
        self.head = ListNode(None, None)
        self.length = 0
    def __len__(self):
        return self.length
    def get(self, val: object) -> bool:
	'''获取指定缓存数据
	参数：
		val:要获取的数据
	返回：
		存在于缓存中，返回True，否则返回 False。
	'''
        prev = None  # 用于记录尾节点的前一个节点
        p = self.head
        # 如果此数据之前已经被缓存在链表中了
        while p.next:
            if p.next.val == val:
                # 将目标节点从原来的位置删除
                dest = p.next  # dest临时保存目标节点
                p.next = dest.next
                # 将目标节点插入到头部
                self.insert_to_head(self.head, dest)
                return True
            prev = p
            p = p.next
        # 如果此数据没有缓存在链表中
        self.insert_to_head(self.head, ListNode(val))
        self.length += 1
        # 添加数据导致超过容量则要删除尾节点
        if self.length > self.cap:
            prev.next = None
        return False
    @staticmethod
    def insert_to_head(head, node):
        """将指定节点插入到头部"""
        node.next = head.next
        head.next = node
    def __str__(self):
        vals = []
        p = self.head.next
        while p:
            vals.append(str(p.val))
            p = p.next
        return '->'.join(vals)
```

不管缓存有没有满，访问都需要遍历一遍链表，时间复杂度为 `O(n)`。也可以用数组实现 LRU 缓存淘汰策略：

```python
class LRUCache:
    '''
    通过数组array实现的简易 LRU缓存
    维护一个list，越靠近尾部表示是越早之前访问的。
    '''
    def __init__(self, capacity: int = 10):
        self.cap = capacity
        self._data = []  # 存储数据
    def __len__(self):
        return len(self._data)
    def __str__(self):
        return str(self._data)
    def get(self, val: object) -> bool:
        """
        获取指定缓存数据
        参数：
            val:要获取的数据
        返回：
            存在于缓存中，返回True，否则返回 False。
        """
        for i in range(len(self._data)):
            if self._data[i] == val:
                self._data.insert(0, self._data.pop(i))
                return True
        # 如果此数据没有缓存在链表中
        self._data.insert(0, val)
        # 添加数据导致超过容量则要删除尾节点
        if len(self) > self.cap:
            self._data.pop(len(self)-1)
        return False
```
