---
title: MySQL数据库基础
creation date: 2022-07-10 15:37 
status: done
tags:
- Sources/Courses/MySQL
- Development/Backend/Database/MySQL
---
up:: [[Sources/Courses/⚙️ Database/MySQL/• TOC for MySQL Course|• TOC for MySQL Course](%E2%80%A2%20TOC%20for%20MySQL%20Course.md)

## 虚拟机使用说明

```shell
[root@mysql8 ~]# tree tools/
tools/
├── backup  备份和恢复工具
│   ├── binlog2sql.zip
│   ├── mydumper-0.9.5-2.el7.x86_64.rpm
│   └── percona-xtrabackup-80-8.0.27-19.1.el7.x86_64.rpm
├── ha   High Availablity高可用性
│   ├── mha4mysql-manager-0.58-0.el7.centos.noarch.rpm
│   ├── mha4mysql-node-0.58-0.el7.centos.noarch.rpm
│   └── Percona-XtraDB-Cluster_8.0.26-16.1_Linux.x86_64.glibc2.17.tar.gz
├── middleware 中间件
│   └── Mycat-server-1.6.7.5-release-20200410174409-linux.tar.gz
├── monitor 监控
│   ├── lepus_v3.8.zip
│   ├── MONyog_Ultimate_5.7.2.0.rar
│   ├── percona-release-latest.noarch.rpm
│   ├── xampp-linux-x64-5.5.38-2-installer.run
│   └── zabbix-release-5.0-1.el7.noarch.rpm
├── scott.sql
└── tuning  调优
    ├── mysql-utilities-1.6.5.tar.gz
    ├── percona-release-0.1-3.noarch.rpm
    ├── percona-toolkit-3.0.13-re85ce15-el7-x86_64-bundle.tar
    ├── script.rpm.sh
    └── SQLAdvisor.zip
```

# MySQL数据库基础

## MySQL简介和分支（NoSQL数据库）

### 关系型数据库

#### 属性
- 关系模型: 二维表（行、列）
- 遵循范式
- 适合OLTP环境(Online Transaction Processing: insert、update、delete)
- 有时候会创建冗余表，提高性能
- 行式存储

#### 特点 
- 优点: 避免数据的冗余
- 缺点: 影响性能

### NoSQL数据库：not only SQL

>一般都不遵循范式，造成数据的冗余，提高性能

- Redis：基于内存
- MongoDB：基于文档（BSON），从4.x开始支持事务（只适用于复制集环境，就是主从复制
- HBase：列式存储，适合select，适合OLAP（online analytic processing），属于Hadoop生态圈

### MySQL分支

- 主流：Oracle官方
- MariaDB
- Percona Server for MySQL

## 安装和配置MySQL数据库

### MySQL的配置文件搜索过程: my.cnf

```bash
[root@mysql8 ~]# mysqld --verbose --help | grep my.cnf
/etc/my.cnf /etc/mysql/my.cnf /usr/local/mysql/etc/my.cnf ~/.my.cnf 
```

### my.cnf 配置参数

```bash
[mysqld]
server-id=1	#当前数据库实例的ID号，唯一标识一个数据库，在主从复制和主主复制必须唯一
port=3306 #端口号
basedir=/usr/local/mysql #安装目录
datadir=/usr/local/mysql/data  #数据库文件的目录
log-error=/usr/local/mysql/data/error.log  #错误日志文件，相当于Oracle告警日志alert日志
socket=/tmp/mysql.sock #套接字文件
pid-file=/usr/local/mysql/data/mysql.pid #保持了PID进程号
character-set-server=utf8  #服务器端的字符集
lower_case_table_names=1   #设置大小写是否敏感
# 取值
# 0 区分大小写 
# 1 存储时使用小写，比较的时候不区分
# 2 存储时使用给定的大小写，比较的时候使用小写
innodb_log_file_size=1G  #重做日志文件，类似Oracle的redo日志，记录客户端的事务操作
default-storage-engine=INNODB
default_authentication_plugin=mysql_native_password
[client]
port=3306
default-character-set=utf8
```


## 客户端的连接方式

> 系统表mysql.user

### 本地连接

### 远程连接

- 创建用户“user001”, 密码是“Welcome_1”

```bash
mysql> create user 'user001'@'%' identified by 'Welcome_1';
```

- 为用户“user001”授权

```bash
mysql> grant all on mysql.* to 'user001'@'%'; 
mysql> flush privileges;
```

- 使用 root 用户查看系统的“user”表

```bash
mysql> use mysql; 
mysql> select host,user from user;

+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | root             |
| %         | user001          |
| %         | user002          |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
```

- 使用 root 用户查看系统的“db”表

```bash
mysql> select host,user,db from db where user='user001';
+------+---------+-------+
| host | user    | db    |
+------+---------+-------+
| %    | user001 | mysql |
+------+---------+-------+
```

### 安全连接

>MySQL 默认的数据通道是不加密的，在一些安全性要求特别高的场景下，需要配置 MySQL 端口为 SSL，使得数据通道加密处理，避免敏感信息泄漏和被篡改。当启用 MySQL SSL 之后，由于每个数据包都需要加密和解密，将对 MySQL 数据库的性能造成严重的影响。

使用ssl，单独配置用户

```sql
create user 'user002'@'%' identified by 'Welcome_1';
grant all on *.* to 'user002'@'%';
alter user 'user002'@'%' require ssl;
```

```bash
mysql> select user,host,ssl_type,ssl_cipher from mysql.user;

mysql --ssl-ca=/usr/local/mysql/data/ca.pem \
--ssl-cert=/usr/local/mysql/data/client-cert.pem \
--ssl-key=/usr/local/mysql/data/client-key.pem \
-uuser002 -p
```

## MySQL数据库的体系架构（服务器端）

### Server层
> 7个主要组件

#### Connectors

MySQL对外提供的交互接口,如 java，.net，php 等语言可以通过 该组件来操作 SQL 语句

- Connection Pool: 连接池
- Management Service &Tools: 管理服务组件和工具组件
- SQL Interface: SQL命令行工具
- SQL Parser: 查询分析器
- SQL Optimizer 优化器组件，根据数据库的统计信息（反应的是数据的分布情况）
	- 基于CBO： cost based optimizer
	- 基于RBO（很少用到）：rule based optimizer
- Query Cache
		
### 存储引擎

#### InnoDB
- 非常类似Oracle、达梦、MongoDB

#### MyISAM
- 不支持事务，不具备ACID
- 采用的表锁
```sql
create table table1(tid int,tname varchar(10),money int) engine=myisam;
```

#### Memory
- 非常类似Redis---RDB、AOF
```sql
create table table2(tid int,tname varchar(10),money int) engine=memory;
```


## 多实例环境（数据库、数据库实例）

>在一个宿主机上启动多个MySQL数据库实例
>应用场景（优点）：充分（节约）硬件资源
>Oracle中：RAC One Node


### 数据库和数据库实例

数据库是用来存储数据的，数据库实例是用来操作数据的。从操作系统的角度，数据库实例表现为一个进程，对应多个线程。在非集群数据库架构中，数据库与数据库实例存 在一一对应关系，在数据库集群中，可能存在多个数据库实例操作一个数据库情况，即多对一关系。

#### 数据库

物理概念，硬盘上的文件（数据文件、参数文件、日志文件。。。。。）

#### 数据库实例

逻辑概念（内存结构+进程结构）

### 使用 mysqld_multi 工具

```bash
mysqld --initialize --user=mysql \
	--datadir=/opt/multi/data/3307 --basedir=/usr/local/mysql

2022-07-10T14:07:10.617285Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: VMm9s1e-(MbY

[mysqld_multi]
mysqld=/usr/local/mysql/bin/mysqld_safe
mysqladmin=/usr/local/mysql/bin/mysqladmin

[mysqld3307]
datadir=/opt/multi/data/3307
socket=/opt/multi/data/3307/mysql_3307.sock
basedir=/usr/local/mysql
port=3307
pid-file=/opt/multi/data/3307/mysql_3307.pid
character-set-server=utf8
log-error=/opt/multi/data/3307/mysql_3307.log

[mysqld3308]
datadir=/opt/multi/data/3308
socket=/opt/multi/data/3308/mysql_3308.sock
basedir=/usr/local/mysql
port=3308
pid-file=/opt/multi/data/3308/mysql_3308.pid
character-set-server=utf8
log-error=/opt/multi/data/3308/mysql_3308.log

[mysqld3309]
datadir=/opt/multi/data/3309
socket=/opt/multi/data/3309/mysql_3309.sock
basedir=/usr/local/mysql
port=3309
pid-file=/opt/multi/data/3309/mysql_3309.pid
character-set-server=utf8
log-error=/opt/multi/data/3309/mysql_3309.log			
```