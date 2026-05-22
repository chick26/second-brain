---
title: Airflow Develop
creation date: 2023-08-29 15:50 
status: done
tags: 
- field/dev
- topic/linux
- topic/python
- topic/devops
---
up:: [[3-Resources/· MOC for Resources|· MOC for Resources]]]

## 基本开发规则

### 导入 airflow 相关库

```python
# 必选: 导入 airflow 的 DAG 工作流
from airflow import DAG
# 必选:导入具体的TaskOperator类型
from airflow.operators.bash import BashOperator
# 可选:导入定时工具的包
from airflow. utils. dates import days_ago
```

### 定义 DAG 及配置

```python
# 当前工作流的基础配置
default_args = {
    'owner': 'airflow',                 # 当前工作流的所有者
    'email': ['airflow@example.com'],   # 当前工作流的邮件接受者邮箱
    'email_on_failure': True,           # 工作流失败是否发送邮件告警
    'email_on_retry': True,             # 工作流重试是否发送邮件告警
    'retries': 2,                       # 重试次数
    'retry_delay': timedelta(minutes=1),# 重试间隔时间
}

# 定义当前工作流的DAG对象
dagName = DAG(
    'airflow_name',                      # 当前工作流的名称,唯一id
    default_args=default_args,           # 使用的参数配置
    description='first airflow task DAG',# 当前工作流的描述
    schedule_interval=timedelta(days=1), # 当前工作流的调度周期：定时调度【可选】
    start_date=days_ago(1),              # 工作流开始调度的时间
    tags=['itcast_bash'],                # 当前工作流属于哪个组
)
```

### 定义 Tasks

*   [BashOperator](http://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/bash/index.html#airflow.operators.bash.BashOperator) - executes a bash command, 执行 Linux 命令

```python
from airflow.operators.bash import BashOperator
# 定义一个Task的对象
t1 = BashOperator(
    task_id='first_bashoperator_task',
    bash_command='echo "hello airflow"',
    dag=dagName
)
```

*   [PythonOperator](http://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/python/index.html#airflow.operators.python.PythonOperator) - calls an arbitrary Python function, 执行 Python 代码

```python
from airflow.operators.python import PythonOperator

# 定义需要执行的代码逻辑
def sayHello():
    print("this is a programe")

#定义一个Task对象
t2 = PythonOperator(
    task_id='first_pyoperator_task',
    python_callable=sayHello,
    dag=dagName
)
```

*   [EmailOperator](http://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/email/index.html#airflow.operators.email.EmailOperator) - sends an email, 发送邮件的
*   [MySqlOperator](http://airflow.apache.org/docs/apache-airflow-providers-mysql/stable/_api/airflow/providers/mysql/operators/mysql/index.html#airflow.providers.mysql.operators.mysql.MySqlOperator)
*   [PostgresOperator](http://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/_api/airflow/providers/postgres/operators/postgres/index.html#airflow.providers.postgres.operators.postgres.PostgresOperator)
*   [MsSqlOperator](http://airflow.apache.org/docs/apache-airflow-providers-microsoft-mssql/stable/_api/airflow/providers/microsoft/mssql/operators/mssql/index.html#airflow.providers.microsoft.mssql.operators.mssql.MsSqlOperator)
*   [OracleOperator](http://airflow.apache.org/docs/apache-airflow-providers-oracle/stable/_api/airflow/providers/oracle/operators/oracle/index.html#airflow.providers.oracle.operators.oracle.OracleOperator)
*   [JdbcOperator](http://airflow.apache.org/docs/apache-airflow-providers-jdbc/stable/_api/airflow/providers/jdbc/operators/jdbc/index.html#airflow.providers.jdbc.operators.jdbc.JdbcOperator)
*   [DockerOperator](http://airflow.apache.org/docs/apache-airflow-providers-docker/stable/_api/airflow/providers/docker/operators/docker/index.html#airflow.providers.docker.operators.docker.DockerOperator)
*   [HiveOperator](http://airflow.apache.org/docs/apache-airflow-providers-apache-hive/stable/_api/airflow/providers/apache/hive/operators/hive/index.html#airflow.providers.apache.hive.operators.hive.HiveOperator)
*   [PrestoToMySqlOperator](http://airflow.apache.org/docs/apache-airflow-providers-mysql/stable/_api/airflow/providers/mysql/transfers/presto_to_mysql/index.html#airflow.providers.mysql.transfers.presto_to_mysql.PrestoToMySqlOperator)

### 指定依赖关系

*   Task1、Task2、Task3 并行运行，结束以后运行 Task4
*   Task4、Task5、Task6 并行运行，结束以后运行 Task7

```python
task1 >> task4
task2 >> task4
task3 >> task4
task4 >> task7
task5 >> task7
task6 >> task7
```

### 任务调度实例

```python
# import package
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago
import json

# define args
default_args = {
    'owner': 'airflow',
}

# define the dag
with DAG(
    'python_etl_dag',
    default_args=default_args,
    description='DATA ETL DAG',
    schedule_interval=None,
    start_date=days_ago(2),
    tags=['itcast'],
) as dag:
    # function1
    def extract(**kwargs):
        ti = kwargs['ti']
        data_string = '{"1001": 301.27, "1002": 433.21, "1003": 502.22, "1004": 606.65, "1005": 777.03}'
        ti.xcom_push('order_data', data_string)
        
    # function2
    def transform(**kwargs):
        ti = kwargs['ti']
        extract_data_string = ti.xcom_pull(task_ids='extract', key='order_data')
        order_data = json.loads(extract_data_string)
        total_order_value = 0
        for value in order_data.values():
            total_order_value += value
        total_value = {"total_order_value": total_order_value}
        total_value_json_string = json.dumps(total_value)
        ti.xcom_push('total_order_value', total_value_json_string)
        
    # function3
    def load(**kwargs):
        ti = kwargs['ti']
        total_value_string = ti.xcom_pull(task_ids='transform', key='total_order_value')
        total_order_value = json.loads(total_value_string)
        print(total_order_value)
        
    # task1
    extract_task = PythonOperator(
        task_id='extract',
        python_callable=extract,
    )
    extract_task.doc_md = """\
#### Extract task
A simple Extract task to get data ready for the rest of the data pipeline.
In this case, getting data is simulated by reading from a hardcoded JSON string.
This data is then put into xcom, so that it can be processed by the next task.
"""
	# task2
    transform_task = PythonOperator(
        task_id='transform',
        python_callable=transform,
    )
    transform_task.doc_md = """\
#### Transform task
A simple Transform task which takes in the collection of order data from xcom
and computes the total order value.
This computed value is then put into xcom, so that it can be processed by the next task.
"""
	# task3
    load_task = PythonOperator(
        task_id='load',
        python_callable=load,
    )
    load_task.doc_md = """\
#### Load task
A simple Load task which takes in the result of the Transform task, by reading it
from xcom and instead of saving it to end user review, just prints it out.
"""

# run
extract_task >> transform_task >> load_task
```

## 常用调度方法

### Oracle

```python
query_oracle_task = OracleOperator(
    task_id = 'oracle_operator_task',
    sql = 'select * from ciss4.ciss_base_areas',
    oracle_conn_id = 'oracle-airflow-connection',
    autocommit = True,
    dag=dag
)
```

### MySQL

*   指定 SQL 语句

```python
query_table_mysql_task = MySqlOperator(
    task_id='query_table_mysql', 
    mysql_conn_id='mysql_airflow_connection', 
    sql=r"""select * from test.test_airflow_mysql_task;""",
    dag=dag
)
```

*   指定 SQL 文件

```python
query_table_mysql_task = MySqlOperator(
    task_id='query_table_mysql_second', 
    mysql_conn_id='mysql-airflow-connection', 
    sql='test_airflow_mysql_task.sql',
    dag=dag
)
```

*  指定变量

```python
insert_sql = r"""
INSERT INTO `test`.`test_airflow_mysql_task`(`task_name`) VALUES ( 'test airflow mysql task3');
INSERT INTO `test`.`test_airflow_mysql_task`(`task_name`) VALUES ( 'test airflow mysql task4');
INSERT INTO `test`.`test_airflow_mysql_task`(`task_name`) VALUES ( 'test airflow mysql task5');
"""

insert_table_mysql_task = MySqlOperator(
    task_id='mysql_operator_insert_task', 
    mysql_conn_id='mysql-airflow-connection', 
    sql=insert_sql,
    dag=dag
)
```

### BigData

*   Sqoop

```python
run_sqoop_task = BashOperator(
    task_id='sqoop_task',
    bash_command='sqoop --options-file xxxx.sqoop',
    dag=dag,
)
```

*   Hive

```python
run_hive_task = BashOperator(
    task_id='hive_task',
    bash_command='hive -f xxxx.sql',
    dag=dag,
)
```

*   Spark

```python
run_spark_task = BashOperator(
    task_id='spark_task',
    bash_command='spark-sql -f xxxx.sql',
    dag=dag,
)
```

*   Flink

```python
run_flink_task = BashOperator(
    task_id='flink_task',
    bash_command='flink run /opt/flink-1.12.2/examples/batch/WordCount.jar',
    dag=dag,
)
```

## NOTE

> [DbApiHook](https://airflow.apache.org/docs/apache-airflow/1.10.14/_api/airflow/hooks/dbapi_hook/index.html) >> [MySqlHook](https://airflow.apache.org/docs/apache-airflow-providers-mysql/1.0.2/_api/airflow/providers/mysql/hooks/mysql/index.html) >> MySqlOperator

- DbApiHook 实现了基本的数据库操作方法，常用的有
	- `get_pandas_df()`
	- `insert_rows()`

