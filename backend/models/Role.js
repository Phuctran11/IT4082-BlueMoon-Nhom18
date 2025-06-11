'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'roleId',
        otherKey: 'userId',
      });
    }
  }
  Role.init({
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Role;
};