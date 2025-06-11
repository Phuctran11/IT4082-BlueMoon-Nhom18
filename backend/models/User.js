'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/passwordUtils');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: models.UserRole, // Sử dụng model trung gian
        foreignKey: 'userId',
        otherKey: 'roleId',
      });
      this.hasMany(models.Household, {
        foreignKey: 'ownerId',
        as: 'OwnedHouseholds'
      });
    }
  }
  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, field: 'full_name', allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
    }
  });
  return User;
};