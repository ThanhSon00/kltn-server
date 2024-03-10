const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/config');

class User extends Model {
  static async isEmailTaken(email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  }

  isPasswordMatch(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  }

  toJSON() {
    const user = this;
    delete user.password;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
  }
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/non-avatar.jpg',
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelize.connection,
    modelName: 'user',
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed('password')) {
          const password = user.get('password');
          const hashPassword = await bcrypt.hash(password, 8);
          user.setDataValue('password', hashPassword);
        }
      },
    },
  }
);

module.exports = User;
