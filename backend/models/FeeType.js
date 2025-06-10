const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeeType = sequelize.define('FeeType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'fee_types',
  // Sequelize sẽ tự động quản lý createdAt và updatedAt nếu bạn không định nghĩa trong SQL
  // Nếu bạn đã định nghĩa, có thể cần thêm timestamps: false và tự quản lý
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FeeType;