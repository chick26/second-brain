---
title: List
creation date: 2023-06-15 14:30 
status: done
tags:
- Development/ComputerBasic/DataStructure/List
- Sources/Courses/Algorithms
---
up:: [[Sources/Courses/✍️ Algorithms/• TOC for Algorithm Course|• TOC for Algorithm Course]]

## 1 基本结构

![[Extras/Excalidraw/算法之美/list-construct.excalidraw|600]]

### 1.1 单链表

- 上图中有两个特殊的结点，分别是第一个结点（**头结点**）和最后一个结点（**尾结点**）。
- 头结点用来记录链表的基地址，用它可以遍历得到整条链表。
- 尾结点指向一个**空地址 NULL**，表示这是链表上最后一个结点。

### 1.2 循环链表

- 和单链表相比，**循环链表**的优点是从链尾到链头比较方便。
- 当要处理的数据具有环型结构特点时，采用循环链表实现代码会简洁很多。

### 1.3 双向链表

- 双向链表需要额外的两个空间来存储后继结点和前驱结点的地址，存储同样的数据，双向链表要比单链表占用更多的内存空间。优点是双向链表可以支持 `O(1)` 时间复杂度的情况下找到前驱结点。
- Java 语言的 LinkedHashMap  就用到了双向链表这种数据结构。

## 2 基本操作

### 2.1 删除操作

#### 2.1.1 删除指定 Value 的结点

从头结点开始遍历对比，直到找到值等于给定值的结点，然后再删除。单纯的删除操作时间复杂度是 `O(1)`，但遍历查找对应的时间复杂度为 `O(n)`。链表操作的总时间复杂度为 `O(n)`。

#### 2.1.2 删除给定指针指向的结点

删除某个结点 q 需要知道其前驱结点，而单链表并不支持直接获取前驱结点，所以，单链表还是要从头结点开始遍历链表，直到 `p->next=q`，说明 p 是 q 的前驱结点。双向链表中的结点已经保存了前驱结点的指针，不需要像单链表那样遍历。所以，单链表删除操作需要 `O(n)` 的时间复杂度，而双向链表需要 `O(1)` 的时间复杂度。

### 2.2 插入操作

- 如果希望在链表的某个指定结点前面插入一个结点，双向链表需要O(1) 时间复杂度；
- 单向链表需要 O(n) 的时间复杂度，因为单链表都需要从头结点开始遍历，直到找到前驱节点。

### 2.3 查询操作

链表的随机访问第 k 个元素，必须根据指针一个结点一个结点地依次遍历，直到找到相应的结点。链表随机访问需要 `O(n)` 的时间复杂度。对于一个有序链表，双向链表的按值查询的效率会比单链表高一些。记录上次查找的位置 p，每次查询时，根据要查找的值与 p 的大小关系，决定是往前还是往后查找，双向链表平均只需要查找一半的数据。

## 3 性能比较

### 3.1 时间复杂度

| 时间复杂度 | 数组 | 链表 |
| ---------- | ---- | ---- |
| 插入删除   | O(n) | O(1) |
| 随机访问   | O(1) | O(n) |

### 3.2 存储和访问效率

|          | 数组                                                                      | 链表                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 访问     | 使用连续的内存空间，可以借助 CPU 的缓存机制，预读数组中的数据，访问效率高 | 非连续存储，无法有效预读，插入、删除操作，会导致频繁的内存申请和释放，容易造成内存碎片，对于 Java 语言，就有可能会导致频繁的 GC（Garbage Collection，垃圾回收） |
| 扩容     | 大小固定，扩容需要重新申请内存并拷贝数据，耗时长                          | 没有大小的限制，天然地支持动态扩容                                                                                                                              |


## 4 工程应用

- [[Sources/Courses/✍️ Algorithms/LRU Using List|LRU 高速缓存]]
- [[Sources/Courses/✍️ Algorithms/Palindromic string|回文字符串]]
- [[Sources/Courses/✍️ Algorithms/Josephus Problem Using List|约瑟夫环]]

## 5 链表的代码技巧

### 5.1 技巧一：理解指针或引用的含义

C 语言有“指针”的概念； Java、Python的“引用”相当于C 语言的“指针”。“指针”和“引用”都是存储所指对象的内存地址。**将某个变量赋值给指针，实际上就是将这个变量的地址赋值给指针，或者反过来说，指针中存储了这个变量的内存地址，指向了这个变量，通过指针就能找到这个变量。**p->next=q 表示 p 结点中的 next 指针存储了 q 结点的内存地址。p->next=p->next->next 表示 p 结点的 next 指针存储了 p 结点的下下一个结点的内存地址。

### 5.2 技巧二：警惕指针丢失和内存泄漏

单链表的插入操作：

![[Extras/Excalidraw/算法之美/Single list insert .excalidraw|600]]

如图所示，需要在结点 a 和相邻的结点 b 之间插入结点 x，假设当前指针 p 指向结点 a。若使用以下代码实现，就会发生指针丢失和内存泄露。

```c
p->next = x;  // 将 p 的 next 指针指向 x 结点；
x->next = p->next;  // 将 x 的结点的 next 指针指向 b 结点
```

`p->next`  指针在完成第一步操作之后，已经不再指向结点 b 了，而是指向结点 x。第 2 行代码相当于将 x 赋值给  `x->next`，自己指向自己。因此，整个链表也就断成了两半，从结点 b 往后的所有结点都无法访问到了。对于有些语言来说，比如 C 语言，内存管理是由程序员负责的，如果没有手动释放结点对应的内存空间，就会产生内存泄露。

所以，**插入结点时，一定要注意操作的顺序**，要先将结点 x 的 next 指针指向结点 b，再把结点 a 的 next 指针指向结点 x，这样才不会丢失指针，导致内存泄漏。所以，对于刚刚的插入代码，我们只需要把第 1 行和第 2 行代码的顺序颠倒一下就可以了。同理，**删除链表结点时，也一定要记得手动释放内存空间**，否则，也会出现内存泄漏的问题。当然，对于像 Java 这种虚拟机自动管理内存的编程语言来说，就不需要考虑这么多了。

### 5.3 技巧三：利用哨兵简化实现难度

- 插入一个节点

```c
new_node->next = p->next;
p->next = new_node;
```

- 在**第一个结点** 前的插入，其中 head 表示链表的头结点。

```c
if (head == null) {
  head = new_node;
}
```

- 删除结点 p 的后继结点

```c
p->next = p->next->next;
```

- 删除链表中的最后一个结点

```c
if (head->next == null) {
   head = null;
}
```

>[!INFO]+ 哨兵节点
>
>针对链表的插入、删除操作，需要对插入第一个结点和删除最后一个结点的情况进行特殊处理。head 表示头结点指针指向链表中的第一个结点，head=null 表示链表中没有结点了。哨兵是为了解决“边界问题”的，不直接参与业务逻辑。
>
>如果我们引入哨兵结点，在任何时候，不管链表是不是空，head 指针都会一直指向这个哨兵结点。我们也把这种有哨兵结点的链表叫**带头链表**。相反，没有哨兵结点的链表就叫作**不带头链表**。**带头链表：**哨兵结点是不存储数据的。因为哨兵结点一直存在，所以插入第一个结点和插入其他结点，删除最后一个结点和删除其他结点，都可以统一为相同的代码实现逻辑了。

### 5.4 技巧四：重点留意边界条件处理

软件开发中，代码在一些边界或者异常情况下，最容易产生 Bug。要实现没有 Bug 的链表代码，一定要检查边界条件是否考虑全面，以及代码在边界条件下是否能正确运行。常用检查链表代码是否正确的边界条件有：

- 如果链表为空时，代码是否能正常工作？
- 如果链表只包含一个结点时，代码是否能正常工作？
- 如果链表只包含两个结点时，代码是否能正常工作？
- 代码逻辑在处理头结点和尾结点的时候，是否能正常工作？

### 5.5 技巧五：多写多练，没有捷径

下面 5 个常见的链表操作。只要把这几个操作都能写熟练，不熟就多写几遍，之后再也不会害怕写链表代码。

- 单链表反转
- 链表中环的检测
- 两个有序的链表合并
- 删除链表倒数第 n 个结点
- 求链表的中间结点

**写链表代码是最考验逻辑思维能力的**。因为，链表代码到处都是指针的操作、边界条件的处理，稍有不慎就容易产生 Bug。链表代码写得好坏，可以看出一个人写代码是否够细心，考虑问题是否全面，思维是否缜密。
