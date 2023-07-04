---
title: Concurrent queue
creation date: 2023-06-28 09:19 
status: todo
tags: 
- Development/ComputerBasic/DataStructure/Queue
- Sources/Courses/Algorithms
---

在多线程情况下，会有多个线程同时操作 [[Queue|队列]]，这个时候就会存在线程安全问题。线程安全的队列叫作**并发队列**。最简单直接的实现方式是直接在 `enqueue ()`、`dequeue ()` 方法上加锁，但是锁粒度大并发度会比较低，同一时刻仅允许一个存或者取操作。实际上，基于数组的循环队列，利用 CAS 原子操作，可以实现非常高效的并发队列。这也是循环队列比链式队列应用更加广泛的原因。