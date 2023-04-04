# Bookme module

Web module to manage appointments. Use *wrapp* frontend template.

## Dependencies

**multi-rpc 2.0.0**

- `git clone https://github.com/giosil/multi-rpc.git` 
- `mvn clean install` - this will publish `multi-rpc-2.0.0.jar` in Maven local repository

**wrapp**

- `git clone https://github.com/giosil/wrapp.git` 
- `mvn clean install` - this will produce `wrapp.war` in `target` directory

## Build and deploy web application with Wrapp

- Create if not exists `$HOME/cfg` directory
- Copy json files from `cfg` to `$HOME/cfg`
- Deploy `wrapp.war` in your application server
- `git clone https://github.com/giosil/bookme.git` 
- `mvn clean install` - this will produce `bookme.war` in `target` directory
- Create database (see `oracle`, `mysql`, `h2` directories)
- Create datasource `jdbc/db_bookme` in your application server
- Deploy `bookme.war` in your application server
- Launch `http://localhost:8080/wrapp` 
- Enter (whatever) credentials on the login page (no check done in dev configuration)

## Deploy web application on Tomcat using Docker

See [Tomcat](https://github.com/giosil/bookme/tree/master/tomcat) page.

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
