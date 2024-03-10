'use strict';

const { QueryInterface } = require('sequelize');
const { userRepository } = require('../../repositories');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (db) {
    if (!(db instanceof QueryInterface)) return;
    await userRepository.create({
      email: 'phanson999999@gmail.com', 
      password: 'qwer1234',
      username: 'phanson69'
    }) 
  },

  async down (db) {
    if (!(db instanceof QueryInterface)) return;
    await db.bulkDelete('users', { email: 'phanson999999@gmail.com' });
  }
};
