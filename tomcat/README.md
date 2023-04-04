# Deploy Bookme on Tomcat using Docker

## Build container using Dockerfile

Because you cannot include files outside Docker's build context you have to collect all files in this directory.

- `.\collect_files.cmd` in Windows
- `.\collect_files.sh`  in Linux

and then

`docker build -t tomcat-bookme .`

`docker run --name tomcat-bookme -p 8080:8080 -d tomcat-bookme`

launch `http://localhost:8080/wrapp`

## Build container manually

Download tomcat docker image

```
docker pull tomcat:9.0.73-jdk8-corretto
```

Create and run container from tomcat image

```
docker run --name tomcat-bookme -p 8080:8080 -d tomcat:9.0.73-jdk8-corretto
```

To access to container shell

```
docker exec -it tomcat-bookme /bin/bash
```

Copy HyperSQL database

```
docker cp ../hsqldb/bookme.properties tomcat-bookme:/root
docker cp ../hsqldb/bookme.script     tomcat-bookme:/root
```

Copy common libraries

```
docker cp hsqldb-jdk8.jar tomcat-bookme:/usr/local/tomcat/lib
docker cp jta-1.1.jar     tomcat-bookme:/usr/local/tomcat/lib
```

Copy connection pool configuration of `bookme` webapp

```
docker cp bookme.xml tomcat-bookme:/usr/local/tomcat/conf/Catalina/localhost
```

Copy wrapp configuration files

```
docker exec tomcat-bookme /bin/mkdir /root/cfg
docker cp ../cfg/wrapp_config.json tomcat-bookme:/root/cfg
docker cp ../cfg/wrapp_menus.json  tomcat-bookme:/root/cfg
docker cp ../cfg/wrapp_pages.json  tomcat-bookme:/root/cfg
```

Deploy web apps

```
docker cp ../../wrapp/target/wrapp.war tomcat-bookme:/usr/local/tomcat/webapps
docker cp ../target/bookme.war         tomcat-bookme:/usr/local/tomcat/webapps
```

Stop container

```
docker stop tomcat-bookme
```

Start container

```
docker start tomcat-bookme
```

To pull image to Docker Hub (https://hub.docker.com/)

```
docker commit tomcat-bookme giosil/tomcat-bookme:1.0.0

docker push giosil/tomcat-bookme:1.0.0

docker tag giosil/tomcat-bookme:1.0.0 giosil/tomcat-bookme:latest

docker push giosil/tomcat-bookme:latest
```

