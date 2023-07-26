---
title: Docker Container Problem List
creation date: 2023-03-01 13:02 
status: done
tags: 
- Development/Docker
- Development/Docker/list
---
up:: [[Cards/📀 Docker/• TOC for Docker|• TOC for Docker]]
## 

### Sync timezone between system and container

- Enter container as root user

```shell
docker exec -it --user root <container name> bash
```

- Rename container timezone file avioding two-file issue

```shell
 mv /etc/localtime /etc/localtime.bak
```

- Copy system timezone file to container

```shell
cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime
```

- Restart container

```shell
docker container restart [OPTIONS] CONTAINER [CONTAINER...]
```