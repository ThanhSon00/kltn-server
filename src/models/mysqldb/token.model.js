const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/config');
const { tokenTypes } = require('../../config/tokens');

class Token extends Model {
  toJSON() {
    return {
      token: this.token,
      userId: this.userId,
      type: this.type,
      expires: this.expires,
      blacklisted: this.blacklisted,
    };
  }
}

Token.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize.connection,
    modelName: 'token',
  }
);

module.exports = Token;
