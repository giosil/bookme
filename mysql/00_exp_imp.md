# Import / Export procedures

## First check MySQL service

On Linux:

- `service mysql status`
- `service mysql start`

On Windows:

- `sc query MySQL56`
- `sc start MySQL56`

## Export

- `mysqldump -u user -p[password] [database] > file`
- `mysqldump --user=user --password[=password] [database] > file`

Example (add --routines to export functions and procedures):

`mysqldump --routines --user=root --password bookme > C:\prj\dew\bookme\mysql\bookme_dump.sql`

## Import (after create database: 01_setup.sql)

- `mysql --user=user --password[=password] [database] < file`

Example:

`mysql -u root -p bookme < C:\prj\dew\bookme\mysql\bookme_dump.sql`

## Connect to mysql

`mysql --user=root --password[=password] [database]`

### Some commands:

- `show databases;`
- `select database() from dual;`
- `use bookme`
- `show tables;`
- `show full tables in bookme where table_type like 'VIEW';`
- `show triggers;`
- `show function status where db='bookme';`
- `show procedure status where db='bookme';`
- `source C:/prj/dew/bookme/mysql/04_data.sql;`