'use strict';
let dotEnvOptions = {};
dotEnvOptions.path = './.env';
require('dotenv').config(dotEnvOptions); // instantiate environment variables

let CONFIG = {
  db_host : process.env.DB_HOST,
  db_dialect : process.env.DB_DIALOG,
  db_port : process.env.DB_PORT,
  sequelizeLogEnabled : false,
  db_name : process.env.DB_NAME,
  db_user : process.env.DB_USER,
  db_password : process.env.DB_PASSWORD

};
console.log(CONFIG)
module.exports = CONFIG;

