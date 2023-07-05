---
title: Queue
creation date: 2023-06-21 17:12 
status: done
tags: 
- Development/ComputerBasic/DataStructure/Queue
- Sources/Courses/Algorithms
---
up:: [[Sources/Courses/✍️ Algorithms/• TOC for Algorithm Course|• TOC for Algorithm Course]]

## 1 基本结构

> [!Example]- 操作受限，先进先出
> 循环队列、阻塞队列、并发队列等具有某些额外特性的队列，它们在很多偏底层系统、框架、中间件的开发中，起着关键性的作用。比如高性能队列 Disruptor、Linux 环形缓存，都用到了循环并发队列； Java concurrent 并发包利用 ArrayBlockingQueue 来实现公平锁等。

## 2 队列的实现

用数组实现的队列叫作**顺序队列**，用链表实现的队列叫作**链式队列**。

### 2.1 顺序队列

#### 2.1.1 Java 数组实现

```java
// 用数组实现的队列  
public class ArrayQueue {  
  // 数组：items，数组大小：n  
  private String[] items;  
  private int n = 0;  
  // head 表示队头下标，tail 表示队尾下标  
  private int head = 0;  
  private int tail = 0;  
  // 申请一个大小为 capacity 的数组  
  public ArrayQueue(int capacity) {  
    items = new String[capacity];  
    n = capacity;  
  }  
  // 入队  
  public boolean enqueue(String item) {  
    // 如果 tail == n 表示队列已经满了  
    if (tail == n) return false;  
    items[tail] = item;  
    ++tail;  
    return true;  
  }  
  // 出队  
  public String dequeue() {  
    // 如果 head == tail 表示队列为空  
    if (head == tail) return null;  
    // 为了让其他语言的同学看的更加明确，把 -- 操作放到单独一行来写了  
    String ret = items[head];  
    ++head;  
    return ret;  
  }  
}
```

#### 2.1.2 Python 数组实现

```python
from typing import Optional

class ArrayQueue:  
    """用数组实现的队列"""  
    def __init__(self, capacity: int):  
        self.items: list = [None] * capacity  
        self._capacity = capacity  
        self.head = 0  # 队头下标  
        self.tail = 0  # 队尾下标  

	def enqueue(self, item: str) -> bool:  
        """入队"""  
        if self.tail == self._capacity:  
            return False  
        self.items[self.tail] = item  
        self.tail += 1  
        return True  

	def dequeue(self) -> Optional[str]:  
        """出队"""  
        if self.head == self.tail:  
            return None  
        item = self.items[self.head]  
        self.head += 1  
        return item  
    
    def __str__(self) -> str:  
        return str(self.items[self.head:self.tail])
```

队列需要两个指针：一个是 head 指针，指向队头；一个是 tail 指针，指向队尾。
- 当 a、b、c、d 依次入队之后，队列中的 head 指针指向下标为 0 的位置，tail 指针指向下标为 4 的位置。 
- 调用两次出队操作之后，队列中 head 指针指向下标为 2 的位置，tail 指针仍然指向下标为 4 的位置。 
- 随着不停地进行入队、出队操作，head 和 tail 都会持续往后移动。当 tail 移动到最右边，即使数组中还有空闲空间，也无法继续往队列中添加数据了。这时需要触发一次数据的搬移操作

![[Extras/Excalidraw/算法之美/Basic queue.excalidraw|300]]

#### 2.1.3 Java 数据搬移

```java
// 入队操作，将 item 放入队尾  
  public boolean enqueue(String item) {  
    // tail == n 表示队列末尾没有空间了  
    if (tail == n) {  
      // tail ==n && head==0，表示整个队列都占满了  
      if (head == 0) return false;  
      // 数据搬移  
      for (int i = head; i < tail; ++i) {  
        items[i-head] = items[i];  
      }  
      // 搬移完之后重新更新 head 和 tail  
      tail -= head;  
      head = 0;  
    }  
    items[tail] = item;  
    ++tail;  
    return true;  
  }
```

#### 2.1.4 Python 数据搬移

```python
def enqueue(self, item: str) -> bool:  
    """入队"""  
    # 表示队列末尾没有空间了  
    if self.tail == self.capacity:  
        if self.head == 0: return False  
        # 数据搬移  
        for i in range(self.head, self.tail):  
            self.items[i - self.head] = self.items[i]  
        # 搬移完之后重新更新 head 和 tail  
        self.tail -= self.head  
        self.head = 0  
    self.items[self.tail] = item  
    self.tail += 1  
    return True
```

上面的代码中，当队列的 tail 指针移动到数组的最右边后，如果有新的数据入队，就将 head 到 tail 之间的数据，整体搬移到数组中 0 到 tail-head 的位置。 这种实现思路中，出队入队操作的时间复杂度是 **O(1)**

### 2.2 链式队列

- head 和 tail 两个指针，分别指向链表的第一个和最后一个结点
- 入队时，tail->next= new_node, tail = tail->next
- 出队时，head = head->next 

#### 2.2.1 Java 链表实现 

```java
public class QueueBasedOnLinkedList {  
  // 队列的队首和队尾  
  private Node head = null;  
  private Node tail = null;  
  // 入队  
  public void enqueue(String value) {  
    if (tail == null) {  
      Node newNode = new Node(value, null);  
      head = newNode;  
      tail = newNode;  
    } else {  
      tail.next = new Node(value, null);  
      tail = tail.next;  
    }  
  }  
  // 出队  
  public String dequeue() {  
    if (head == null) return null;  
    String value = head.data;  
    head = head.next;  
    if (head == null) {  
      tail = null;  
    }  
    return value;  
  }  
  public void printAll() {  
    Node p = head;  
    while (p != null) {  
      System.out.print(p.data + " ");  
      p = p.next;  
    }  
    System.out.println();  
  }  
  private static class Node {  
    private String data;  
    private Node next;  
    public Node(String data, Node next) {  
      this.data = data;  
      this.next = next;  
    }  
    public String getData() {  
      return data;  
    }  
  }  
}
```

#### 2.2.2 Python 链表实现

```python
from typing import Optional  
class ListNode:  
    def __init__(self, data: str, next=None):  
        self.data = data  
        self._next = next  
class LinkedQueue:  
    def __init__(self):  
        self._head: Optional[ListNode] = None  
        self._tail: Optional[ListNode] = None  
    def enqueue(self, value: str):  
        # 入队  
        new_node = ListNode(value)  
        if self._tail:  
            self._tail._next = new_node  
        else:  
            self._head = new_node  
        self._tail = new_node  
    def dequeue(self) -> Optional[str]:  
        """出队"""  
        if self._head:  
            value = self._head.data  
            self._head = self._head._next  
            if not self._head:  
                self._tail = None  
            return value  
    def __str__(self) -> str:  
        values = []  
        p: ListNode = self._head  
        while p:  
            values.append(p.data)  
            p = p._next  
        return "->".join(values)
```

### 2.3 循环数组队列

上面用数组来实现队列的时候，在 tail == n 时，会有数据搬移操作，采用循环数组则不需要数据搬移操作。

- 原本数组是有头有尾的是一条直线，把它首尾相连扳成一个环
- **图一**队列的大小为 8，当前 head=4，tail=7。当有一个新的元素 a 入队时，放入下标为 7 的位置， tail 并不更新为 8，而是到下标为 0 的位置
- 当再有一个元素 b 入队时，将 b 放入下标为 0 的位置，然后 tail 加 1 更新为 1。在 a，b 依次入队之后，见**图二**
- **队列为空**的判断条件是 `head == tail`
- **队列满**的判断条件是 `(tail+1)%n=head`，为了避免和队空的判断条件混淆，则必须牺牲一个数组的存储空间

![[Extras/Excalidraw/算法之美/Cyclic array queue.excalidraw|800]]

#### 2.3.1 Java 循环数组实现

```java
public class CircularQueue {  
  // 数组：items，数组大小：n  
  private String[] items;  
  private int n = 0;  
  // head 表示队头下标，tail 表示队尾下标  
  private int head = 0;  
  private int tail = 0;  
  // 申请一个大小为 capacity 的数组  
  public CircularQueue(int capacity) {  
    items = new String[capacity];  
    n = capacity;  
  }  
  // 入队  
  public boolean enqueue(String item) {  
    // 队列满了  
    if ((tail + 1) % n == head) return false;  
    items[tail] = item;  
    tail = (tail + 1) % n;  
    return true;  
  }  
  // 出队  
  public String dequeue() {  
    // 如果 head == tail 表示队列为空  
    if (head == tail) return null;  
    String ret = items[head];  
    head = (head + 1) % n;  
    return ret;  
  }  
}

```

#### 2.3.2 Python 循环数组实现

```python
from typing import Optional  
class CircularQueue:  
    def __init__(self, capacity):  
        self.capacity = capacity + 1  
        self.items = [None] * self.capacity  
        self.head = 0  # head表示队头下标  
        self.tail = 0  # tail表示队尾下标  
    def enqueue(self, item: str) -> bool:  
        """入队"""  
        if (self.tail + 1) % self.capacity == self.head:  
            return False  
        self.items[self.tail] = item  
        self.tail = (self.tail + 1) % self.capacity  
        return True  
    def dequeue(self) -> Optional[str]:  
        # 如果head == tail 表示队列为空  
        if self.head == self.tail: return None  
        item = self.items[self.head]  
        self.head = (self.head + 1) % self.capacity  
        return item  
    def __str__(self) -> str:  
        if self.tail >= self.head:  
            return str(self.items[self.head: self.tail])  
        else:  
            return str(self.items[self.head:] + self.items[:self.tail])

```

## 3 工程应用

- [[Sources/Courses/✍️ Algorithms/Blocking queue|阻塞队列]]
- [[Sources/Courses/✍️ Algorithms/Concurrent queue|并发队列]]
- [[Sources/Courses/✍️ Algorithms/Finite resource pool|有限资源池]]

## 4 思考题

> [!Question]- 有哪些场景中会用到队列的排队请求呢？
> 
> 各种消息队列，例如 Active MQ ,Rabbit MQ ,Rocket MQ ,Zero MQ 以及分布式消息队列 Kafka 等。

> [!Question]- 如何实现无锁并发队列？
> 
> 使用 CAS 原子操作 + 循环数组的方式可以实现。 对于 java 语言，jdk 提供了 `java.util.concurrent.atomic` 包实现 CAS 原子操作 对于 python 语言可以使用协程，这样就不会存在并发访问问题。