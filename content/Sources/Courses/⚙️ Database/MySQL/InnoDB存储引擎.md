---
title: InnoDB存储引擎
creation date: 2022-07-10 20:30 
status: done
tags:
- Sources/Courses/MySQL
- Development/Backend/Database/MySQL/InnoDB
- Development/Backend/Database/MySQL
---
up:: [[Sources/Courses/⚙️ Database/MySQL/• TOC for MySQL Course|• TOC for MySQL Course]]

# InnoDB 存储引擎

>有助于 Oracle、达梦、MongoDB

## 存储结构

>数据库都是通过逻辑存储结构管理物理存储结构

### 物理存储结构：硬盘上的文件

#### 数据文件

`.ibd` 文件和 `ibdata` 文件 这两种文件都是存放 Innodb 数据的文件，之所以有两种文件来存放 Innodb 的数据（包括索引），是因为 Innodb 的数据存储方式能够通过配置来决定是使用共享表空间存放存储数据，还是独享表空间存放存储数据。

参数 `datadir`
```bash
mysql> show variables like '%datadir%';
+---------------+------------------------+
| Variable_name | Value                  |
+---------------+------------------------+
| datadir       | /usr/local/mysql/data/ |
+---------------+------------------------+
mysql> show variables like '%per_table%';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_file_per_table | ON    |
+-----------------------+-------+
```

#### 重做日志文件

`redo log`, 记录的是客户端的操作（事务）, 由InnoDB引擎生成, 每个 redo log 默认的大小是 1G
`redo log`（重做日志）是`InnoDB`存储引擎独有的，它让`MySQL`拥有了崩溃恢复能力。比如 `MySQL` 实例挂了或宕机了，重启时，`InnoDB`存储引擎会使用`redo log`恢复数据，保证数据的持久性与完整性

```bash
mysql> show variables like '%log_file_size%';
+----------------------+------------+
| Variable_name        | Value      |
+----------------------+------------+
| innodb_log_file_size | 1073741824 |
+----------------------+------------+
1 row in set (0.01 sec)

mysql> show variables like '%log_group%';
+-----------------------------------------+-------+
| Variable_name                           | Value |
+-----------------------------------------+-------+
| binlog_group_commit_sync_delay          | 0     |
| binlog_group_commit_sync_no_delay_count | 0     |
| innodb_log_group_home_dir               | ./    |
+-----------------------------------------+-------+
3 rows in set (0.00 sec)

mysql> show variables like '%log_files_in_group%';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| innodb_log_files_in_group | 2     |
+---------------------------+-------+
```

>[!HINT] redo log 与 binlog 的区别
>1. redo log 是在 InnoDB 存储引擎层产生，而 binlog 是 MySQL 数据库的上层应用产生的，并且二进制日志不仅仅针对 INNODB 存储引擎，MySQL 数据库中的任何存储引擎对于数据库的更改都会产生二进制日志。 
>2. 两种日志记录的内容形式不同。binlog 是逻辑日志，其记录是对应的 SQL 语句。 而 innodb 存储引擎层面的重做日志是物理日志。
>3. 两种日志与记录写入磁盘的时间点不同，二进制日志只在事务提交完成后进行一次写入。而 innodb 存储引擎的重做日志在事务进行中不断地被写入，并且日志不是随事务提交的顺序进行写入的。 
>4. binlog 不是循环使用，在写满或者重启之后，会生成新的 binlog 文件，redo log 是循环使用。
>5. binlog 可以作为恢复数据使用，主从复制搭建，redo log 作为异常宕机或者介质故障后的数据恢复使用。

#### 撤销日志文件

undo log, 也叫回滚日志, 记录的是历史数据

#### 参数文件

在 MySQL 实例启动时，数据库会先去读一个配置参数文件，用来寻找数据库的各种文件所在位置以及指定某些初始化参数。在默认情况下，MySQL 实例会按照一定的顺序在指 定的位置进行读取，通过下面的语句可以查看读取参数文件的顺序。

```mysql
mysql --help | grep my.cnf
```

my.cnf, 两种类型
- 静态参数（需要重启）
- 动态参数（不需要重启）

#### 错误日志文件

类似Oracle中告警日志

#### binlog二进制日志文件

binlog 文件记录了对 MySQL 数据库执行更改的所有操作，但是不包括 `SELECT` 和 `SHOW` 这类操作，因为这类操作对数据本身并没有修改。若操作本身并没有导致数据库发生变化，那么该操作也会写入二进制日志。二进制日志的主要作用：

- 可以完成主从复制。在主服务器上把所有修改数据的操作记录到 binlog 中，通过网络发送给从服务器，从而达到主从同步。 
- 进行恢复操作。数据可以通过 binlog 日志，使用 mysqlbinlog 命令，实现基于时间点和位置的恢复操作。

`binlog` 记录的模式: 

- statement
每一条会修改数据的 SQL 语句会记录到 binlog 中。优点是并不需要记录每一条 SQL 语句和每一行的数据变化，减少了 binlog 日志量， 节约 I/O，提高性能。缺点是在某些情况下会导致主从复制中的数据不一致。

- row
不记录每条 SQL 语句的上下文信息，仅需记录哪条数据被修改了，修改成什么样了，而且不会出现某些特定情况下的存储过程、存储函数或者触发器的调用问题。 缺点是会产生大量的日志， 尤其是 alter table 的时候会让日志暴涨。

- mixed
以上两种模式的混合使用， 一般的复制使用 STATEMENT 模式保存 binlog， 对于 STATEMENT 模式无法复制的操作使用 ROW 模式保存 binlog，MySQL 会根据执行的 SQL 语句选择日志保存方式。

#### 慢查询日志

记录超过参数 `long_query_time` 时间的所有 SQL 语句，诊断SQL的性能

#### 全量日志general log

记录 MySQL 数据库所有操作的 SQL 语句，包含 `select` 和 `show`。默认情况下，禁用常规查询日志。

### 逻辑存储结构

#### 表空间, tablespace

表空间可以看做是 InnoDB 存储引擎逻辑结构的最高层，所有的数据都是存放在表空间 中。默认情况下 InnoDB 存储引擎有一个共享表空间 ibdata1，用于存放撤销（Undo）信息、 系统事务信息、二次写缓冲（double write buffer）数据等。

如果启用了参数“innodb_file_per_table”，则每张表内的数据可以单独放到一 个表空间内。该参数也是默认启用的。

```shell
mysql> show variables like 'innodb_file_per_table';
+-----------------------+-------+ 
| Variable_name         | Value | 
+-----------------------+-------+ 
| innodb_file_per_table | ON    | 
+-----------------------+-------+
```

#### 段, segment

表空间是由各个段组成的，常见的段有数据段、索引段、回滚段等。 InnoDB 存储引擎表是索引组织的（Index Organized）.因此数据即索引，索引即数据。

与 Oracle 不同的是，InnoDB 存储引擎对于段的管理是由引擎本身完成，这和 Oracle 的自动段空间管理（ASSM）类似，没有手动段空间管理（MSSM）的方式，这从一定程度上 简化了 DBA 的管理。

#### 区, extent

区是由连续的页组成，是物理上连续分配的一段空间，每个区的大小固定是 1MB。对于大的数据段，InnoDB 存储引擎最多每次可以申请 4 个区，以此来保证数据的顺序性能。

#### 页(数据块), Page(block) 

InnoDB 的最小物理存储分配单位是 Page，页的默认大小是 16Kb，可以通过下面的方式查看。
```bash
show variables like 'innodb_page_size'; #Oracle的参数：block_size
+------------------+-------+ 
| Variable_name    | Value | 
+------------------+-------+ 
| innodb_page_size | 16384 | 
+------------------+-------+
```

#### 行, Row

InnoDB 存储引擎是面向行的（row-oriented），也就是说数据的存放按行进行存放。 每个页存放的行记录也是有硬性定义的，最多允许存放 16KB/2-200 行的记录，即 7992 行记录。


## 内存结构

> System Global Area 系统的全局区，一个实例只有一个
> Process Global Area 进程的全局区，对应的是客户端的连接

![[Extras/Excalidraw/数据库/SGA & PGA.excalidraw|SGA & PGA.excalidraw]]

### Buffer 缓冲区

#### SGA

| 缓冲区                  | 作用                                           |
| ----------------------- | ---------------------------------------------- |
| innodb_buffer_pool_size | 缓存 Innodb 表的数据、索引、以及数据字典等信息 |
| innodb_log_buffer_size  | 事务在内存中的缓冲，即 red log buffer 的大小   |
| query_cache             | 高速查询缓存，在生产环境中建议关闭             |

#### PGA

| 缓冲区                  | 作用                                                    |
| ----------------------- | ------------------------------------------------------- |
| innodb_sort_buffer_size | 主要用于 SQL 语句在内存中的临时排序                     |
| join_buffer_size        | 表连接使用，用于 BKA 优化索引。从 MySQL5.6 之后开始支持 |
| read_buffer_size        | 表顺序扫描的缓存，只能应用于 MyISAM 表存储引擎          |
| read_rnd_buffer_size    | MySQL 随机读取缓存区大小,用于减少磁盘的随机访问         | 

### 内存的刷新机制

#### 完全检查点 Sharp Checkpoint

将内存中所有脏页全部写到磁盘就是完全检查点，比如数据库实例关闭时。

#### 模糊检查点 Fuzzy Checkpoint

将部分脏页刷新到磁盘就是模糊检查点，数据库实例运行过程产生的检查点基本上就是这种类型的检查点。MySQL 的模糊检查点相当于 Oracle 中的增量检查点。

## 进程结构 (线程结构)

### 主线程

主循环（最主要，分为：每隔1秒、每隔10秒）、后台循环、刷新循环、暂定循环

### IO线程

read thread, write thread, redo log thread, change buffer thread

### 其他线程

page clean thread, purge thread, error monitor thread, lock monitor thread