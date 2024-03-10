const config = require('../src/config/config');

const dbConnection = {};
const { username, password, database, host } = config.sequelize;

dbConnection[config.env] = { username, password, database, host, dialect: 'mysql' };

module.exports = dbConnection;
