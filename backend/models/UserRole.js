const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Role = require('./Role');

const UserRole = sequelize.define('user_role', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'user_id',
  },
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Role,
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'role_id',
  },
}, {
  tableName: 'user_roles',
  timestamps: false,
  underscored: true,
});

// Thiết lập quan hệ nhiều-nhiều
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', otherKey: 'role_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', otherKey: 'user_id', as: 'users' });

module.exports = UserRole;
