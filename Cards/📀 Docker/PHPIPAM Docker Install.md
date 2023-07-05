---
title: PHPIPAM Docker Install
creation date: 2023-05-19 11:00 
status: todo
tags: 
- Development/Docker
- Development/Docker/Docker-compose
---
up:: [[Cards/📀 Docker/• TOC for Docker|• TOC for Docker]]

## Install Docker Engine and Docker-compose

- To install the latest version, run

```shell
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

- Install docker-compose

```shell
sudo yum install docker-compose
```

## Use iptables instead of firewalld

- Stop and disabled firewalld

```shell
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

- Install iptables

```shell
sudo yum install iptables-services
```

- Start and enable iptables

```shell
sudo systemctl start iptables
sudo systemctl enable iptables
```

- Check iptables status

```shell
sudo systemctl status iptables
```

## Update firewall configuration

- Add iptables rule:  allow all incoming and outgoing traffic through these ports

```shell
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
```

- Add the `-s` option followed by the IP address to allow traffic from a specific IP

```shell
sudo iptables -A INPUT -p tcp -s YOUR_IP_ADDRESS --dport 3306 -j ACCEPT
sudo iptables -A INPUT -p tcp -s YOUR_IP_ADDRESS --dport 8080 -j ACCEPT
```

-  Save iptables rules

```shell
sudo service iptables save
```

- Check all iptables rules 

```shell
sudo iptables -L
```

## Use docker-compose

- To install all moudle, use docker-compose, create `docker-compose.yml ` under random path

```yml
# WARNING: Replace the example passwords with secure secrets.
# WARNING: 'my_secret_phpipam_pass' and 'my_secret_mysql_root_pass' 

version: '3'

services:
  phpipam-web:
    privileged: true      # 这里添加一条，给它一个特级权限，下面相同
    image: phpipam/phpipam-www:latest 
    ports:                # 添加一条映射到本地端口
      - "8888:80"  
    environment:
      - TZ=Asia/Shanghai
      - IPAM_DATABASE_HOST=phpipam-mariadb
      - IPAM_DATABASE_PASS=my_secret_phpipam_pass # update password
      - IPAM_DATABASE_WEBHOST=%
    restart: unless-stopped
    volumes:
      - phpipam-logo:/phpipam/css/images/logo
    depends_on:
      - phpipam-mariadb

  phpipam-cron:
    privileged: true 
    image: phpipam/phpipam-cron:latest
    environment:
      - TZ=Asia/Hong_Kong   # TimeZone
      - IPAM_DATABASE_HOST=phpipam-mariadb
      - IPAM_DATABASE_PASS=my_secret_phpipam_pass # update password
      - SCAN_INTERVAL=1h
    restart: unless-stopped
    depends_on:
      - phpipam-mariadb

  phpipam-mariadb:
    privileged: true
    image: mariadb:latest
    ports:
      - "3306:3306"                # 映射端口到3306
    environment:
      - MYSQL_ROOT_PASSWORD=my_secret_mysql_root_pass # update password
    restart: unless-stopped
    command:                             # 拉取的mysql镜像支持中文
      - mysqld
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    volumes:
      - phpipam-db-data:/var/lib/mysql

volumes:
  phpipam-db-data:
  phpipam-logo:
```

- Add read and write permission and run `docker-compose.yml` under its path

```shell
chmod 777 docker-compose.yml
docker-compose -p phpIPAM up -d
```