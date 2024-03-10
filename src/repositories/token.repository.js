const { Token } = require('../models/mysqldb');

const create = (tokenBody) => {
  return Token.create(tokenBody);
};

const getList = (filter) => {
  return Token.findAll({ where: filter });
};

module.exports = {
  create,
  getList,
};
