const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Household = sequelize.define('household', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  apartmentCode: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  area: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'occupied',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  tableName: 'households',
  timestamps: true,
  underscored: true,
});

Household.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = Household;
