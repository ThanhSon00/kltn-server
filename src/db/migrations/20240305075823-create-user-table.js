const { QueryInterface, Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up (db) {
    if (!(db instanceof QueryInterface)) return;
    await db.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/non-avatar.jpg',
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
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
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },

  async down (db) {
    if (!(db instanceof QueryInterface)) return;
    await db.dropTable('users');
  }
};
