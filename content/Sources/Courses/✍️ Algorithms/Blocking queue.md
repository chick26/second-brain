---
title: Blocking queue
creation date: 2023-06-28 09:16 
status: todo
tags: 
- Development/ComputerBasic/DataStructure/Queue
- Sources/Courses/Algorithms
---

## 问题

**阻塞队列**其实就是在 [[Queue.md|队列]] 基础上增加了阻塞操作。简单来说，就是
- 在队列为空的时候，从队头取数据会被阻塞。因为此时还没有数据可取，直到队列中有了数据才能返回；
- 如果队列已经满了，那么插入数据的操作就会被阻塞，直到队列中有空闲位置后再插入数据，然后再返回。

使用阻塞队列，就可以轻松实现一个 **生产者 - 消费者模型** 这种基于阻塞队列实现的“生产者 - 消费者模型”，可以有效地协调生产和消费的速度。当“生产者”生产数据的速度过快，“消费者”来不及消费时，存储数据的队列很快就会满了。这个时候，生产者就阻塞等待，直到“消费者”消费了数据，“生产者”才会被唤醒继续“生产”。还可以通过协调“生产者”和“消费者”的个数，来提高数据的处理效率。可以多配置几个“消费者”，来应对一个“生产者”

![[Blocking queue.excalidraw|800](../../../Extras/Excalidraw/%E7%AE%97%E6%B3%95%E4%B9%8B%E7%BE%8E/Blocking%20queue.excalidraw.md)

## 实现

Python 基于阻塞队列实现的**生产者 - 消费者模型**：

```python
import queue  
import random  
import threading  
import time  
class Producer(threading.Thread):  
    nameList = ["apple", "peach", "pineapple", "orange", "banana", "blueberry"]  
    flag = 1  
    def __init__(self, q, name):  
        threading.Thread.__init__(self)  
        self.name = name  
        self.q = q  
    def run(self):  
        name_list = Producer.nameList  
        while Producer.flag:  
            queueLock.acquire()  
            if not self.q.full():  
                data = name_list[random.randrange(0, len(name_list))]  
                self.q.put(data)  
                print("%s 生产数据: %s" % (threading.currentThread().name, data))  
                queueLock.release()  
            else:  
                queueLock.release()  
            time.sleep(random.random() * 3)  
class Consumer(threading.Thread):  
    flag = 1  
    def __init__(self, q, name):  
        threading.Thread.__init__(self)  
        self.name = name  
        self.q = q  
    def run(self):  
        while Consumer.flag:  
            queueLock.acquire()  
            if not self.q.is_empty():  
                data = self.q.get()  
                print("%s 消费数据: %s" % (threading.currentThread().name, data))  
                queueLock.release()  
            else:  
                queueLock.release()  
            time.sleep(random.random() * 4)  
workQueue = queue.Queue(5)  
queueLock = threading.Lock()

# 创建新线程

Producer(workQueue, "Producer1").start()  
Producer(workQueue, "Producer2").start()  
Consumer(workQueue, "Consumer1").start()  
Consumer(workQueue, "Consumer2").start()  
Consumer(workQueue, "Consumer3").start()  
while 1:  
    time.sleep(1)  
    print(workQueue.queue)
```
