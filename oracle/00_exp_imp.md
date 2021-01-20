# Import / Export procedures

## First check Oracle service

On Windows:

- `sc query OracleOraDb11g_home1TNSListener`
- `sc query OracleServiceORCL`
- `sc start OracleOraDb11g_home1TNSListener`
- `sc start OracleServiceORCL`

## Export

`exp BOOKME/PASS123 FIlE=BOOKME.dmp OWNER=BOOKME STATISTICS=NONE`

## Import

`imp system/password@ORCL file=BOOKME.dmp log=imp_BOOKME.log fromuser=BOOKME touser=BOOKME`

## Connect to Oracle Instance

`sqlplus / AS SYSDBA`

### Some commands:

- `select * from all_users;`
- `connect BOOKME;`
- `use bookme`
- `select table_name from all_tables;`
- `desc ACTIVITIES;`
- `@/path/script.sql` or `start /path/script.sql`
