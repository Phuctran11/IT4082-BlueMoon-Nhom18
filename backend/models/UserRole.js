'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {}
  UserRole.init({
    userId: { type: DataTypes.INTEGER, field: 'user_id', primaryKey: true },
    roleId: { type: DataTypes.INTEGER, field: 'role_id', primaryKey: true },
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserRole;
};