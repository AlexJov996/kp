'use strict';

const fs                    = require('fs');
const path                  = require('path');
const Sequelize             = require('sequelize');

const basename              = path.basename(__filename);
const env                   = process.env.NODE_ENV || 'development';
const db                    = {};

const CONFIG                = require('../config');

let reconnectOptions = {
    max_retries: 999,
    onRetry: function(count) {
        console.warn("connection lost, trying to reconnect ("+count+")");
    }
};
const sequelizeParams = {
    host: CONFIG.db_host,
    dialect: CONFIG.db_dialect,
    port: CONFIG.db_port,
    reconnect: reconnectOptions || true,
    pool: {
        max: 100,
        min: 10,
        acquire: 30000,
        idle: 10000
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci', // this work
    },
};
sequelizeParams['logging'] = CONFIG.sequelizeLogEnabled ? console.log : false;

let sequelize;
if (process.env.APP === 'test') {
    sequelizeParams['dialect'] = 'sqlite';
    sequelizeParams['logging'] = false;
    sequelizeParams['storage'] = '/tmp/portals.sqlite';
    delete (sequelizeParams['host']);
    delete (sequelizeParams['port']);

    sequelize = new Sequelize({
        dialect: 'sqlite',
        logging: false,
    });

    sequelize.sync();
} else {
    sequelizeParams['logging'] = CONFIG.sequelizeLogEnabled ? console.log : false;
    // production / devel - real database
    sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, sequelizeParams);
}
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        console.log(__dirname, file)
        const model = require(`${__dirname}/${file}`)(sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
    //ADD HISTORY FOR MODELS
    switch (modelName) {
        case 'Campaign':
            db[`Version${modelName}`] = new Version(db[modelName]);
            break;
        case 'Domain':
            db[`Version${modelName}`] = new Version(db[modelName]);
            db[`Version${modelName}`].sync();
            break;
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log(`MYSQL connected to ${sequelizeParams.host}:${sequelizeParams.port}`);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;