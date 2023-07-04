---
title: Stack
creation date: 2023-06-20 9:05 
status: done
tags:
- Development/ComputerBasic/DataStructure/Stack
- Sources/Courses/Algorithms
---
up:: [[• TOC for Algorithm Course]]

## 1 基本结构

>[!Example]-  操作受限, **后进先出, 先进后出**
>
>从功能上来说，数组或链表可以替代栈，但特定的数据结构是对特定场景的抽象，数组或链表暴露了太多的操作接口，操作上的确灵活自由，但使用时就比较不可控，自然也就更容易出错。
>
>**当某个数据集合只涉及在一端插入和删除数据，并且满足后进先出、先进后出的特性，就应该首选“栈”这种数据结构**。

## 2 代码实现

栈主要包含两个操作，入栈和出栈，也就是在栈顶插入一个数据和从栈顶删除一个数据。栈既可以用数组来实现，也可以用链表来实现。用数组实现的栈，我们叫作**顺序栈**，用链表实现的栈，我们叫作**链式栈**。

### 2.1 java 数组实现

```java
// 基于数组实现的顺序栈
public class ArrayStack {
  private String[] items;  // 数组
  private int count;       // 栈中元素个数
  private int n;           // 栈的大小
  // 初始化数组，申请一个大小为 n 的数组空间
  public ArrayStack(int n) {
    this.items = new String[n];
    this.n = n;
    this.count = 0;
  }
  // 入栈操作
  public boolean push(String item) {
    // 数组空间不够了，直接返回 false，入栈失败。
    if (count == n) return false;
    // 将 item 放到下标为 count 的位置，并且 count 加一
    items[count] = item;
    ++count;
    return true;
  }
  // 出栈操作
  public String pop() {
    // 栈为空，则直接返回 null
    if (count == 0) return null;
    // 返回下标为 count-1 的数组元素，并且栈中元素个数 count 减一
    String tmp = items[count-1];
    --count;
    return tmp;
  }
}
```

### 2.2 python 数组实现

```python
class ArrayStack():
    """基于数组实现的顺序栈"""
    def __init__(self, n: int):
        self.items = [None] * n  # 数组
        self.count = 0  # 栈中元素的个数
        self.n = n  # 栈的大小
    def push(self, item) -> bool:
        # 数组空间不够了，直接返回 false，入栈失败。
        if self.count == self.n:
            return False
        # 将item放到下标为count的位置，并且count加1
        self.items[self.count] = item
        self.count += 1
        return True
    def pop(self):
        # 栈为空，则直接返回 None
        if self.count == 0:
            return None
        # 返回下标为count-1的数组元素，并且栈中元素个数count减1
        tmp = self.items[self.count - 1]
        self.count -= 1
        return tmp
    def __str__(self):
        return str(self.items[:self.count])
```

### 2.3 python 的栈实现

```python
class ListNode:
    def __init__(self, data: int, next=None):
        self._data = data
        self._next = next
class LinkedStack:
    """基于单链表实现的栈
    """
    def __init__(self):
        self._top: ListNode = None
    def push(self, value):
        # 添加元素
        new_top = ListNode(value)
        new_top._next = self._top
        self._top = new_top
        return True
    def pop(self):
        # 删除并返回栈顶元素
        value = self._top._data
        self._top = self._top._next
        return value
    def __str__(self) -> str:
        vals = []
        p: ListNode = self._top
        while p:
            vals.append(str(p._data))
            p = p._next
        return '->'.join(vals)
```

不管是顺序栈还是链式栈，存储数据只需要一个大小为 n 的存储空间。在入栈和出栈过程中，只需要一两个临时变量存储空间，所以**空间复杂度是 O(1)**。
**空间复杂度是指除了原本的数据存储空间外，算法运行还需要额外的存储空间。**不管是顺序栈还是链式栈，入栈、出栈只涉及栈顶个别数据的操作，所以**时间复杂度都是 O(1)**。

## 3 工程应用

- [[Expression Evaluation Using Stack|表达式求值]]
- [[Bracket Matching Using Stack|栈实现括号匹配]]
- [[Browser forward and backward Using Stack|浏览器的前进和后退功能]]

## 4 两个问题

>[!Question]- 函数调用除了用“栈”来保存临时变量以外还可以用其他数据结构吗？
> 
> - 实际上不一定非要用栈来保存临时变量，只不过如果这个函数调用符合后进先出的特性，用栈这种数据结构来实现，是最顺理成章的选择。
> - 从调用函数进入被调用函数，对于数据来说，变化的是作用域。只要能保证每进入一个新的函数，都是一个新的作用域就可以。
> - 要实现这个，用栈就非常方便。在进入被调用函数的时候，分配一段栈空间给这个函数的变量，在函数结束的时候，将栈顶复位，正好回到调用函数的作用域内。  

>[!Question]- JVM 内存管理中有个“堆栈”的概念。栈内存用来存储局部变量和方法调用，堆内存用来存储 Java 中的对象。JVM 里面的“栈”跟数据结构的栈有什么区别呢？
>
>内存中的堆栈是真实存在的物理区，数据结构中的堆栈是抽象的数据存储结构。 JVM 的内存空间在逻辑上分为：代码区、静态数据区、动态数据区
> - 代码区存储方法体的二进制代码。控制代码区执行代码的切换：
> 	- 高级调度（作业调度）
> 	- 中级调度（内存调度）
> 	- 低级调度（进程调度）
> - 静态数据区
> 	- 存储全局变量、静态变量、常量，常量包括 final 修饰的常量和 String 常量
> 	- 系统自动分配和回收。
> - 动态数据区
> 	- 栈区：存储运行方法的形参、局部变量、返回值。由系统自动分配和回收。
> 	- 堆区：new一个对象的引用或地址存储在栈区，指向该对象存储在堆区中的真实数据。
