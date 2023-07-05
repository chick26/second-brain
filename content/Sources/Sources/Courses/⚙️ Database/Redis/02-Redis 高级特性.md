---
title: Redis 高级特性
creation date: 2022-08-02 15:53 
status: done
tags: 
- Sources/Courses/Redis
- Development/Backend/Database/Redis
---

## 数据的持久化

### RDB

>默认，本质就是快照。每隔一段时间将内存中的数据写到文件上。

```shell
# save 3600 1   在1个小时内，如果有1个值发生了变化，就执行RDB
# save 300 100  在5分钟内，如果有100个值发生了变化，就执行RDB
# save 60 10000	在1分钟内，如果有1w个值发生了变化，就执行RDB
```

- 缺点：在两次RDB之间数据可能发生丢失。
- 优点：恢复的速度很快

### AOF

>append only file  日志，默认关闭

- 参数：`appendonly yes` 
- 写入AOF策略：
```shell
# appendfsync always   每个操作都写入AOF日志
# appendfsync everysec   默认，每隔一秒
# appendfsync no		写入AOF由操作系统决定
```

- 优点：可以尽可能的保证数据的安全
- 缺点：恢复速度较慢

## 消息机制

### 消息类型

- Queue 队列，就是点对点
- Topic 主题，就是广播

### 消息系统类型

- 同步：需要等待对方回答，eg：银行ATM机
- 异步：不需要等待对方回答，eg：微信
				   
### 常见的消息系统

Kafka、Redis、JMS（Java Message Service标准）支持Queue，也支持Topic

### Topic

- 发布消息：publish <频道>
- 订阅消息：subscribe、psubscribe

- 在Java的Maven工程的pom.xml文件中增加下面的依赖信息。

```java
<dependency>
	<groupId>redis.clients</groupId>
	<artifactId>jedis</artifactId>
	<version>4.2.2</version>
</dependency
<dependency>
	<groupId>commons-io</groupId>
	<artifactId>commons-io</artifactId>
	<version>2.8.0</version>
</dependency>
```

- 开发Java代码完成消息的订阅。

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

public class TestRedisMessage{
	public static void main(String[] args) {
		Jedis client = new Jedis("192.168.79.11", 6379);
		client.subscribe(new MyListner(), "channel1");
		//使用通配符订阅消息，但subscribe和psubscribe不能同时使用。
		//client.psubscribe(new MyListner(), "my*");
	}
}

class MyListner extends JedisPubSub{
	@Override
	public void onMessage(String channel, String message) {
		System.out.println("频道：" + channel+" 收到的消息是：" + message);
	}
	@Override
	public void onPMessage(String pattern, String channel, String message){
		System.out.println("模式："+ pattern + " 频道：" + channel+" 收到的消息是：" + message);
	}
}	
```


## 事务机制


| 操作       | Redis              | MySQL（Oracle）             |
| ---------- | ------------------ | --------------------------- |
| 事务的本质 | 批处理操作         | 将事务写入日志              |
| 开启事务   | 手动开启 `multi`   | 手动开启`start transaction` |
| 执行操作   | 指令               | DML                         |
| 提交事务   | exec               | 显式提交、隐式提交          |
| 回滚事务   | 显式回滚 `discard` | 显式回滚、隐式回滚          |


## 慢查询日志

慢查询日志就是系统在命令执行前后计算每条命令的执行时间，当超过预设阀值，就将这条命令的相关信息（慢查询 ID，发生时间戳，耗时，命令的详细信息）记录下来。

## 管道Pipeline

作用是减少网络的开销，来提高性能。Redis提供的一种优化方式。

## Lua

Redis 服务是单线程的服务，但在高并发的情况下需要执行一系列的 Redis 逻辑操作，而这些操作需要保证线程安全和原子性。要满足这样的要求就需要使用到 Lua 脚本编程语言。