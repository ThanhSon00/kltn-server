'use strict';

const { QueryInterface, DataTypes, Sequelize } = require('sequelize');
const { tokenTypes } = require('../../config/tokens');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (db) {
    if (!(db instanceof QueryInterface)) return;
    await db.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
        required: true,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]
      },
      blacklisted: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      expires: {
        type: DataTypes.DATE,
        required: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    })
  },

  async down (db) {
    if(!(db instanceof QueryInterface)) return;
    await db.dropTable('tokens');
  }
};
