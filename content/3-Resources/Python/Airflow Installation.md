---
title: Airflow Installation
creation date: 2023-08-29 16:00 
status: done
tags: 
- field/dev
- topic/linux
- topic/python
- topic/devops
---
up:: [[3-Resources/· MOC for Resources|· MOC for Resources]]

## Using Production Docker Images

More details: [Docker Image for Apache Airflow]( https://airflow.apache.org/docs/docker-stack/index.html " (in docker-stack vdevel)")

> [!Tip]+
> The default amount of memory available for Docker on macOS is often not enough to get Airflow up and running. If enough memory is not allocated, it might lead to the webserver continuously restarting. You should allocate at least 4 GB memory for the Docker Engine (ideally 8 GB).
> ```shell
> docker run --rm "debian: bullseye-slim" bash -c 'numfmt --to iec $(echo $(($ (getconf _PHYS_PAGES) * $(getconf PAGE_SIZE))))'
> ```

### Fetching `docker-compose.yaml` 

```shell
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.7.0/docker-compose.yaml'
```

### Construction of Service

*   `airflow-scheduler` - The [scheduler](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/scheduler.html) monitors all tasks and DAGs, then triggers the task instances once their dependencies are complete.
*   `airflow-webserver` - The webserver is available at `http://localhost:8080`.
*   `airflow-worker` - The worker that executes the tasks given by the scheduer.
*   `airflow-triggerer` - The triggerer runs an event loop for deferrable tasks.
*   `airflow-init` - The initialization service.
*   `postgres` - The database.
*   `redis` - [The redis](https://redis.io/) - broker that forwards messages from scheduler to worker.

### Where contains static file

*   `./dags` - you can put your DAG files here.
*   `./logs` - contains logs from task execution and scheduler.
*   `./config` - you can add custom log parser or add `airflow_local_settings.py` to configure cluster policy.
*   `./plugins` - you can put your [custom plugins](https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/plugins.html) here.

## Initializing Environment

### Setting the right Airflow user

On **Linux**, the quick-start needs to know your host user id and needs to have group id set to `0`. Otherwise the files created in `dags`, `logs` and `plugins` will be created with `root` user ownership. You have to make sure to configure them for the docker-compose:

```shell
mkdir -p ./dags ./logs ./plugins ./config
echo -e "AIRFLOW_UID=$(id -u)" > .env
```
### Initialize the database

On **all operating systems**, you need to run database migrations and create the first user account. To do this, run.

```shell
docker compose up airflow-init
```

After initialization is complete, see a message like this:

```shell
airflow-init_1       | Upgrades done
airflow-init_1       | Admin user airflow created
airflow-init_1       | 2.7.0
start_airflow-init_1 exited with code 0
```

The account created has the login `airflow` and the password `airflow`.

## Cleaning -up the environment

这是一个 “快速启动“ 的环境，并不是为生产环境设计的，从任何问题中恢复的最佳方法是清理并从头开始重启

*   Run `docker compose down --volumes --remove-orphans` command in the directory you downloaded the `docker-compose. yaml` file
*   Remove the entire directory where you downloaded the `docker-compose. yaml` file `rm -rf '<DIRECTORY>'`
*   Run through this guide from the very beginning, starting by re-downloading the `docker-compose. yaml` file

## Running Airflow

Now you can start all services:

```shell
docker compose up
```
## Accessing the environment

当前有三种访问方式

*   by running [CLI commands](https://airflow.apache.org/docs/apache-airflow/stable/howto/usage-cli.html).
*   via a browser using [the web interface](https://airflow.apache.org/docs/apache-airflow/stable/ui.html).
*   using [the REST API](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html).

### Running the CLI commands

You can also run [CLI commands](https://airflow.apache.org/docs/apache-airflow/stable/howto/usage-cli.html), but you have to do it in one of the defined `airflow-*` services. For example, to run `airflow info`, run the following command:

```shell
docker compose run airflow-worker airflow info
```

If you have Linux or Mac OS, you can make your work easier and download a optional wrapper scripts that will allow you to run commands with a simpler command.

```shell
curl -LfO ' https://airflow.apache.org/docs/apache-airflow/2.7.0/airflow.sh '
chmod +x airflow. sh
```

You can also use `bash` as parameter to enter interactive bash shell in the container or `python` to enter python container.

### Accessing the web interface

Once the cluster has started up, you can log in to the web interface and begin experimenting with DAGs.

The webserver is available at: ` http://localhost:8080`. The default account has the login `airflow` and the password `airflow`.

### Sending requests to the REST API

[Basic username password authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) is currently supported for the REST API, which means you can use common tools to send requests to the API.

The webserver is available at: ` http://localhost:8080`. The default account has the login `airflow` and the password `airflow`.

Example, sending a request to retrieve a pool list:

```shell
ENDPOINT_URL=" http://localhost:8080/"
curl -X GET  \
    --user "airflow: airflow" \
    "${ENDPOINT_URL}/api/v 1/pools"
```

## Cleaning up

To stop and delete containers, delete volumes with database data and download images, run:

```shell
docker compose down --volumes --rmi all
```

## Using custom images

When you want to run Airflow locally, you might want to use an extended image, containing some additional dependencies - for example you might add new python packages, or upgrade airflow providers to a later version. This can be done very easily by specifying `build: .` in your `docker-compose.yaml` and placing a custom Dockerfile alongside your `docker-compose. yaml`. Then you can use `docker compose build` command to build your image (you need to do it only once). You can also add the `--build` flag to your `docker compose` commands to rebuild the images on-the-fly when you run other `docker compose` commands.

Examples of how you can extend the image with custom providers, python packages, apt packages and more can be found in [Building the image]( https://airflow.apache.org/docs/docker-stack/build.html " (in docker-stack vdevel)").

## Special case

### adding dependencies via `requirements.txt` file

Usual case for custom images, is when you want to add a set of requirements to it - usually stored in `requirements. txt` file. For development, you might be tempted to add it dynamically when you are starting the original airflow image, but this has a number of side effects (for example your containers will start much slower - each additional dependency will further delay your containers start up time). Also it is completely unnecessary, because docker compose has the development workflow built-in. You can - following the previous chapter, automatically build and use your custom image when you iterate with docker compose locally. Specifically when you want to add your own requirement file, you should do those steps:

- Comment out the `image: ...` line and remove comment from the `build: .` line in the `docker-compose. yaml` file. The relevant part of the docker-compose file of yours should look similar to (use correct image tag):

```shell
#image : ${AIRFLOW_IMAGE_NAME:-apache/airflow: 2.6.1} build: . 
```

- Create `Dockerfile` in the same folder your `docker-compose.yaml` file is with content similar to

```shell
FROM apache/airflow: 2.6.1 ADD requirements.txt . RUN pip install apache-airflow==${AIRFLOW_VERSION} -r requirements.txt
```

It is the best practice to install apache-airflow in the same version as the one that comes from the original image. This way you can be sure that `pip` will not try to downgrade or upgrade apache airflow while installing other requirements, which might happen in case you try to add a dependency that conflicts with the version of apache-airflow that you are using.

- Place `requirements.txt` file in the same directory.

Run `docker compose build` to build the image, or add `--build` flag to `docker compose up` or `docker compose run` commands to build the image automatically as needed.

## Environment variables

Do not confuse the variable names here with the build arguments set when image is built. The `AIRFLOW_UID` build arg defaults to `50000` when the image is built, so it is “baked” into the image. On the other hand, the environment variables below can be set when the container is running, using - for example - result of `id -u` command, which allows to use the dynamic host runtime user id which is unknown at the time of building the image.

| **Variable**       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                        | **Default**           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| AIRFLOW_IMAGE_NAME | Airflow Image to use.                                                                                                                                                                                                                                                                                                                                                                                                                                  | apache/airflow: 2.7.0 |
| AIRFLOW_UID        | UID of the user to run Airflow containers as. Override if you want to use use non-default Airflow UID (for example when you map folders from host, it should be set to result of `id -u` call. When it is changed, a user with the UID is created with `default` name inside the container and home of the use is set to `/airflow/home/` in order to share Python libraries installed there. This is in order to achieve the OpenShift compatibility. | 50000                 |

## Note

Before Airflow 2.2, the Docker Compose also had `AIRFLOW_GID` parameter, but it did not provide any additional functionality - only added confusion - so it has been removed.

Those additional variables are useful in case you are trying out/testing Airflow installation via Docker Compose. They are not intended to be used in production, but they make the environment faster to bootstrap for first time users with the most common customizations.

| **Variable**                 | **Description**                                                                                                                                                                                                                                      | **Default** |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| AIRFLOW_WWW_USER_USERNAME   | Username for the administrator UI account. If this value is specified, admin UI user gets created automatically. This is only useful when you want to run Airflow for a test-drive and want to start a container with embedded development database. | airflow     |
| AIRFLOW_WWW_USER_PASSWORD   | Password for the administrator UI account. Only used when `_AIRFLOW_WWW_USER_USERNAME` set.                                                                                                                                                          | airflow     |
| PIP_ADDITIONAL_REQUIREMENTS | If not empty, airflow containers will attempt to install requirements specified in the variable. example: `lxml==4.6.3 charset-normalizer==1.4.1`. Available in Airflow image 2.1.1 and above.                                                       |             |

