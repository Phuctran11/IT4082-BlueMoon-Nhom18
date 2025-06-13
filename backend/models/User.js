const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const { hashPassword } = require('../utils/passwordUtils');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password' 
  },
  fullName: {
    type: DataTypes.STRING,
    field: 'full_name',
    allowNull: false,
  },
  // Thêm các trường khác từ file SQL của bạn...
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await hashPassword(user.password);
      }
    },
  },
});

module.exports = User;