---
title: Redis 基础
creation date: 2022-08-02 15:26 
status: done
tags: 
- Sources/Courses/Redis
- Development/Backend/Database/Redis
---

## 简介

`Redis` 是一个高性能的 `key-value` 数据库
- Redis 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。 
- Redis 不仅仅支持简单的 `Key-Value` 类型的数据，同时还提供 list, set, zset, hash等数据结构的存储。 
- Redis 支持数据的备份，即 `Master-Slave` 模式的数据备份

## 优势

Redis 是基于内存的数据库，不论读写操作都是在内存上完成的，完全吊打磁盘数据 库的速度。Redis 之所以可以使用单线程来处理，其中的一个原因是，内存操作对资源损耗较小，保证了处理的高效性。

### 纯内存操作

一般都是简单的存取操作，线程占用的时间很少，时间的花费主要集中在 IO 上，所以 读取速度快。 

### 采用单线程模型

Redis 采用了单线程模型从而保证了每个操作的原子性，也减少了线程的上下文切换 和竞争。 

### 使用 IO 多路复用模型

非阻塞 I/O，使用了单线程来轮询描述符，将数据库的开, 关, 读, 写都转换成了事 件，Redis 采用自己实现的事件分离器，效率比较高。 

### 高效数据结构

- 整个 Redis 就是一个全局哈希表，它的时间复杂度是 `O(1)`
- 全程使用哈希结构，读取速度快并且对数据存储进行了优化，如压缩表，对短数据进行压缩存储，再如使用有序的数据结构加快读取的速度

## 数据结构

### SDS 字符串

- 获取字符串的长度的事件复杂度为 `O(1)` 
- API 安全，即通过 API 操作 sds 不会造成缓冲区溢出
- 每次修改字符串不一定需要进行内存分配，提高性能
- 可以保存文本和二进制数据。

```java
struct sdshdr {
	// 记录 buf 数组中已经使用字节的数量 
	// 等于 SDS 所保存字符串的长度 
	unsigned int len; 
	// 记录 buf 数组中还未使用字节的数量 
	unsigned int free; 
	// 字节数组，数据域，保存字符数据 
	char buf[];
};
```

### skiplist 跳跃表

跳跃表是一种有序数据结构，它通过在每个节点中维持多个指向其他节点的指针，从而达到快速访问节点的目的。Redis 使用跳跃表作为有序集合键的底层实现之一。

```java
typedef struct zskiplistNode { 
	// 层 
	struct zskiplistLevel { 
		// 前进指针 
		struct zskiplistNode *forward; 
		// 跨度 
		unsigned int span; 
	} level[]; 
	// 后退指针 
	struct zskiplistNode *backward; 
	// 分值 
	double score; 
	// 成员对象 
	robj *obj; 
	} zskiplistNode;

typedef struct zskiplist { 
	// 表头节点和表尾节点 
	structz skiplistNode *header, *tail; 
	// 表中节点的数量 
	unsigned long length; 
	// 表中层数最大的节点的层数 
	int level; 
} zskiplist;
```

### ziplist 压缩列表

由一系列特殊编码的连续内存块组成的顺序型(sequential)数据结枃。一个压缩列表可以包含任意多个节点(entry),每个节点可以保存一个字节数组或者一个整数值。

### intset 整数集合

可以保存类型为 `int16_t`, `int32_t`, `int64_t` 的整数值，并且保证集合中不会出现重复元素。

### Hash 字典

### quicklist 快表

### Stream

### RedisObject
