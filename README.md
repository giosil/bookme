# Bookme module

Web module for booking appointments.

## Run 

- Create if not exists `${user.home}/cfg` folder
- Copy json files from `bookme/cfg` to `${user.home}/cfg`
- Deploy `wrapp.war` (https://github.com/giosil/wrapp)
- `git clone https://github.com/giosil/bookme.git` 
- `mvn clean install` - this will produce `bookme.war` in `target` directory
- Create database (see `bookme/oracle`, `bookme/mysql`, `bookme/h2`)
- Create proper datasources in application server
- Deploy `bookme.war`
- Launch `http://localhost:8080/wrapp` 
- Enter credentials on the login page. In the development configuration the system does not check.

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
