#!/bin/bash

rm -f bookme.properties
rm -f bookme.script

rm -f wrapp_config.json
rm -f wrapp_menus.json
rm -f wrapp_pages.json

rm -f wrapp.war
rm -f bookme.war

cp ../hsqldb/bookme.properties .
cp ../hsqldb/bookme.script .

cp ../cfg/wrapp_config.json .
cp ../cfg/wrapp_menus.json .
cp ../cfg/wrapp_pages.json .

cp ../target/bookme.war .
cp ../../wrapp/target/wrapp.war .
