--
-- Drop tables
--

DROP TABLE IF EXISTS `prz_log_operazioni`;
DROP TABLE IF EXISTS `prz_log_sms`;
DROP TABLE IF EXISTS `prz_comunicazioni_coda`;
DROP TABLE IF EXISTS `prz_comunicazioni`;
DROP TABLE IF EXISTS `prz_prenotazioni`;
DROP TABLE IF EXISTS `prz_calendario_chiusure`;
DROP TABLE IF EXISTS `prz_calendario_variaz`;
DROP TABLE IF EXISTS `prz_calendario`;
DROP TABLE IF EXISTS `prz_agende_modelli`;
DROP TABLE IF EXISTS `prz_agende`;
DROP TABLE IF EXISTS `prz_prestazioni_attrez`;
DROP TABLE IF EXISTS `prz_prestazioni`;
DROP TABLE IF EXISTS `prz_prestazioni_tipi`;
DROP TABLE IF EXISTS `prz_prestazioni_gruppi`;
DROP TABLE IF EXISTS `prz_attrezzature_ris`;
DROP TABLE IF EXISTS `prz_collaboratori_pre`;
DROP TABLE IF EXISTS `prz_collaboratori`;
DROP TABLE IF EXISTS `prz_clienti`;
DROP TABLE IF EXISTS `prz_attrezzature`;
DROP TABLE IF EXISTS `prz_strutture`;
DROP TABLE IF EXISTS `prz_utenti_desk`;

DROP TABLE IF EXISTS `tab_sequences`;

-- mysql --user=root --password[=password] bookme
-- source C:/prj/dew/bookme/mysql/02_drop.sql;
--