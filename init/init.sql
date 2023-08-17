-- mysql-init/init.sql
DROP USER 'myuser'@'%';
CREATE DATABASE IF NOT EXISTS file_info;
CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON file_info.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
