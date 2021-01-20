# Bookme module

Web module for booking appointments.

## Build and deploy web application 

- Create if not exists `${user.home}/cfg` directory
- Copy json files from `cfg` to `${user.home}/cfg`
- Build `wrapp.war` from `https://github.com/giosil/wrapp.git`
- Deploy `wrapp.war` in your application server
- `git clone https://github.com/giosil/bookme.git` 
- `mvn clean install` - this will produce `bookme.war` in `target` directory
- Create database (see `oracle`, `mysql`, `h2` directories)
- Create datasource `jdbc/db_bookme` in your application server
- Deploy `bookme.war` in your application server
- Launch `http://localhost:8080/wrapp` 
- Enter (whatever) credentials on the login page (no check done in dev configuration)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
