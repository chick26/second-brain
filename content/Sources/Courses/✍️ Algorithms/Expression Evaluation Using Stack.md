---
title: Expression evaluation Using Stack
creation date: 2023-06-21 16:37 
status: ondo
tags: 
- Development/ComputerBasic/DataStructure/Stack
- Sources/Courses/Algorithms
---

## 问题

使用 [[Stack|栈]] 实现表达式求解

## 思路

需要两个 [[Stack|栈]] 来实现：一个栈保存操作数，另一个栈保存运算符。

- 从左向右遍历表达式，遇到数字就压入操作数栈；
- 遇到运算符，就与运算符栈的栈顶元素进行比较。
	- 如果比运算符栈顶元素的优先级高，就将当前运算符压入栈；
	- 如果比运算符栈顶元素的优先级低或者相同，从运算符栈中取栈顶运算符，从操作数栈的栈顶取 2 个操作数，然后进行计算，再把计算完的结果压入操作数栈，继续比较。
