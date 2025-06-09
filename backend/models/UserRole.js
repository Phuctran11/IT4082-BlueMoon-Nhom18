const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');

const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'user_roles',
  timestamps: false,
});

// Thiết lập quan hệ nhiều-nhiều
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', otherKey: 'roleId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', otherKey: 'userId' });

module.exports = UserRole;
