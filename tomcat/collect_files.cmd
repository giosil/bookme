del bookme.properties
del bookme.script

del wrapp_config.json
del wrapp_menus.json
del wrapp_pages.json

del wrapp.war
del bookme.war

copy ..\hsqldb\bookme.properties .
copy ..\hsqldb\bookme.script .

copy ..\cfg\wrapp_config.json .
copy ..\cfg\wrapp_menus.json .
copy ..\cfg\wrapp_pages.json .

copy ..\target\bookme.war .
copy ..\..\wrapp\target\wrapp.war .
