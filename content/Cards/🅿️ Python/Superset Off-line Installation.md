---
title: Superset Off-line Installation
creation date: 2023-02-01 09:44 
status: ondo
tags: 
- Development/Frontend/Python
- Development/Linux
- Development/Frontend/Python/Superset
---
up:: [[Cards/🅿️ Python/• TOC for Python|• TOC for Python]]

## Version Checking

- CentOS Version

```shell
cat /etc/redhat-release
# CentOS Linux release 7.9.2009 (Core)
```

- Linux version

```shell
cat /proc/version
# Linux version 3.10.0-1160.71.1.el7.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) ) #1 SMP Tue Jun 28 15:37:28 UTC 2022
```

## SFTP Configuration

> centos7 开启 sftp 服务环境：centos7 注意：服务器 OpenSSH-Server 版本最低 4.8，用 ssh –V 来查看 openssh 的版本，如果低于 4.8，需要自行升级安装。

- Openssh version check (>=4.8)

```shell
shh -V
```

- Create sftp group and user

```shell
# create group
groupadd groupname
# create user
# -g              # Add to group
# -s              # 指定用户登入后所使用的shell
# /sbin/nologin   # 用户不允许登录
# -M              # 不要自动建立用户的登入目录
sudo useradd -g groupname -s /sbin/nologin -M username
```

- Set up password

```shell
passwd username
# Changing password for user username.
New password:
```

- Create directory

```
mkdir /opt/sftp
cd /opt/sftp
mkdir username
```

>[!Note]
>- 由 ChrootDirectory 指定的目录开始一直往上到系统根目录为止的目录拥有者都只能是 root  
>- 由 ChrootDirectory 指定的目录开始一直往上到系统根目录为止都**不可以具有群组写入权限**

- 设置 sftp 组根目录权限
	- 所有者设置为 root，所有组设置为 groupname
	- 所有者 root 有写入权限，而所有组 groupname 无写入权限

```
chown root:groupname /opt/sftp/username
chmod 755 /opt/sftp/username
```

- 设置具体的用户上传目录权限：
	- 所有者设置为 username，所有组设置为 groupname
	- 所有者 username 有写入权限，而所有组 groupname 无写入权限

```
chown username:groupname /opt/sftp/username/upload
chmod 755 /opt/sftp/username/upload
```

- 配置 sshd_config

```shell
vim /etc/ssh/sshd_config

# Subsystem sftp /usr/libexec/openssh/sftp-server
Subsystem sftp internal-sftp  # Start sftp
Match Group groupname         # Group Limited
ChrootDirectory /opt/sftp/%u  # Root Directory
ForceCommand internal-sftp  
AllowTcpForwarding no  
X11Forwarding no  
```

- 检测配置

```shell
sshd -t
```

- 重启 sshd 服务

```shell
service sshd restart
```

- 测试连接

```shell
# log output
vim /etc/ssh/sshd_config
LogLevel DEBUG

# test connect
sftp -P 22 username@127.0.0.1
```


## Manually Install Pkg

- Download package from [Packages for Linux and Unix - pkgs.org](https://pkgs.org/)
- Send it to the host through Sftp
- Install the pkg manually

```shell
sudo yum install package
```

## Install Docker Engine

- To install the latest version, run

```shell
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

- Or install by .rpm [Index of linux/centos/](https://download.docker.com/linux/centos/)

```shell
sudo yum install .rpm
```

- Start Docker

```shell
sudo systemctl start docker
```

- Verify that Docker Engine installation is successful by running the `hello-world` image

```shell
sudo docker run hello-world
```

## Install Superset Docker

- Pull Image

```shell
docker pull apache/superset
```

- Start Image

```shell
docker run -d -p 8080:8088 --name superset apache/superset
```

- Create User

```shell
docker exec -it superset superset fab create-admin
```

- Update local database

```shell
docker exec -it superset superset db upgrade
```

- Load data example

```shell
docker exec -it superset superset load_examples
```

- Init superset

```shell
docker exec -it superset superset init
```

## Modify the configuration

### Modify the static file

- Modify the running container by getting inside it

```shell
docker exec -it <container id> /bin/bash (entry point)
```

- Delete loading. gif

```shell
cd /app/superset/static/assets/images/rm -rf loading.gif
```

- Exit the container and replace your image as loading. gif and then place it below the path `/app/superset/static/assets/images/`

```shell
docker cp <src-path> <container>:<dest-path>container to local file system
docker cp <container>:<src-path> <local-dest-path>
```

- Edit web title, enter container and edit `config.py`

```python
APP_NAME = "Custom Name"
FAVICONS = [{"href": "/static/assets/images/custom_img_favicon.png"}]
APP_ICON = "/static/assets/images/custom_logo. jpg"
```

### Modify the language

- Install vim in docker container

```shell
docker exec -it --user root <container name/id> /bin/bash
apt install vim
```

- Edit `config. py` 

```shell
vim /app/superset/config.py

# config.py
# Comment this instruction
Languaue: {}
# Modify this instruction
BABEL_DEFAULT_LOCALE = 'zh'
```

- Restart container

```shell
docker restart superset
```

### Add Oracle database connection

- Getting inside the superset container
- Install cx_oracle to support  the connection between python program and oracle database

```shell
pip3 install cx_oracle
```

- Install linux oracle client

```shell
# create installed file
mkdir -p /usr/share/oracle/network/admin
cd /usr/share/oracle

# install necessary packages
apt-get update -y
apt-get install -y --no-install-recommends git ca-certificates wget build-essential unzip curl libaio1 libaio-dev
rm -rf /var/lib/apt/lists/*
apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false

# install oracle client
wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip
unzip instantclient-basiclite-linuxx64.zip
rm -f instantclient-basiclite-linuxx64.zip
cd  /usr/share/oracle/instantclient*
rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci

# add declaration
echo  /usr/share/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf
ldconfig
```

- Restart container
- Connect to oracle database

```shell
cx_oracle+oracle://{username}:{password}@{ip}:{port}/{db_service_name}
```

