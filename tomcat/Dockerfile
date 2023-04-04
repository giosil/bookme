# Parent image

FROM tomcat:9.0.73-jdk8-corretto

# Variables

ENV DEPLOY_DIR /usr/local/tomcat/webapps
ENV LIB_DIR    /usr/local/tomcat/lib
ENV AS_CFG_DIR /usr/local/tomcat/conf/Catalina/localhost
ENV HOME_DIR   /root
ENV CFG_DIR    /root/cfg

# Copy database

COPY ../hsqldb/bookme.properties $HOME_DIR
COPY ../hsqldb/bookme.script     $HOME_DIR

# Copy common libraries

COPY hsqldb-jdk8.jar $LIB_DIR
COPY jta-1.1.jar     $LIB_DIR

# Copy connection pool configuration

COPY bookme.xml      $AS_CFG_DIR

# Copy wrapp configuration files

RUN mkdir $CFG_DIR
COPY ../cfg/wrapp_config.json $CFG_DIR
COPY ../cfg/wrapp_menus.json  $CFG_DIR
COPY ../cfg/wrapp_pages.json  $CFG_DIR

# Deploy web apps

COPY ../../wrapp/target/wrapp.war $DEPLOY_DIR
COPY ../target/bookme.war         $DEPLOY_DIR
