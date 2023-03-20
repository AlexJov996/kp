'use strict';
let dotEnvOptions = {};
dotEnvOptions.path = '../.env';
require('dotenv').config(dotEnvOptions); // instantiate environment variables

let CONFIG = {
  db_host : 'database-1.c1m0xktnx5ai.eu-central-1.rds.amazonaws.com',
  db_dialect : 'mysql',
  db_port : 3306,
  sequelizeLogEnabled : false,
  db_name : 'kupujemprodajem',
  db_user : 'root',
  db_password : 'Sasmarince1996'

};

module.exports = CONFIG;

