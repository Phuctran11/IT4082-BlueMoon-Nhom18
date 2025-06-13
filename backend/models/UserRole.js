'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {}
  UserRole.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'user_id',
    },
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'role_id',
    },
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    timestamps: false,
  });
  return UserRole;
};
