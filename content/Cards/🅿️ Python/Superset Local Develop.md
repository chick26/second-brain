---
title: Superset Local Develop
creation date: 2023-05-30 17:05 
status: ondo
tags: 
- Development/Linux
- Development/Frontend/Python/Superset
---
up:: [[• TOC for Python]]

## Local Development

- Prepare for develop environment

```shell
# Pull code from github
git clone https://github.com/apache/superset.git

# Create and activate virtual environment for develop
conda create --name {env_name} python=3.9
conda activate {env_name}

# Install extra requirement for mysql server
sudo apt-get install libsasl2-dev libsasl2-2 libsasl2-modules-gssapi-mit
sudo apt-get install mysql-server
sudo apt-get install libmysqlclient-dev
```

- Flask server
```shell
# Install external dependencies
pip install -r requirements/testing.txt

# Install Superset in editable (development) mode
pip install -e .

# Initialize the database
# Note: For generating a SECRET_KEY if you haven't done already, you can use the command:
# echo "SECRET_KEY='$(openssl rand -base64 42)'" | tee -a superset_config.py
superset db upgrade

# Create an admin user in your metadata database (use `admin` as username to be able to load the examples)
superset fab create-admin

# Create default roles and permissions
superset init

# Load some data to play with.
# Note: you MUST have previously created an admin user with the username `admin` for this command to work.
superset load-examples

# Start the Flask dev web server from inside your virtualenv.
# Note that your page may not have CSS at this point.
FLASK_ENV=development superset run -p 8088 --with-threads --reload --debugger
```

- Front-end Server

```shell
cd superset-frontend
# using node 16
npm install
npm run dev-server
```