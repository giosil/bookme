# Parent image

FROM tomcat:9.0.73-jdk8-corretto

# Variables

ENV DEPLOY_DIR /usr/local/tomcat/webapps
ENV LIB_DIR    /usr/local/tomcat/lib
ENV AS_CFG_DIR /usr/local/tomcat/conf/Catalina/localhost
ENV HOME_DIR   /root
ENV CFG_DIR    /root/cfg

# Copy database

COPY bookme.properties $HOME_DIR
COPY bookme.script     $HOME_DIR

# Copy common libraries

COPY hsqldb-jdk8.jar $LIB_DIR
COPY jta-1.1.jar     $LIB_DIR

# Copy connection pool configuration

RUN mkdir -p $AS_CFG_DIR
COPY bookme.xml $AS_CFG_DIR

# Copy wrapp configuration files

RUN mkdir -p $CFG_DIR
COPY wrapp_config.json $CFG_DIR
COPY wrapp_menus.json  $CFG_DIR
COPY wrapp_pages.json  $CFG_DIR

# Deploy web apps

COPY wrapp.war  $DEPLOY_DIR
COPY bookme.war $DEPLOY_DIR
