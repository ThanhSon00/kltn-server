const { User } = require('../models/mysqldb')

const getById = (id) => {
    return User.findByPk(id);
}

const getList = (filter) => {
    return User.findAll({ where: filter});
}

const create = (userBody) => {
    return User.create(userBody);
}

module.exports = {
    getById,
    getList,
    create,
}