const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Household = require('./Household');

const Resident = sequelize.define('Resident', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  householdId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Household,
      key: 'id',
    }
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
    allowNull: false,
  },
  cccd: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true,
    validate: {
      len: [12, 12],
      isNumeric: true,
    }
  },
  relationToHead: {
    type: DataTypes.ENUM('Chủ hộ', 'vợ', 'chồng', 'con', 'khác'),
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  tableName: 'residents',
  timestamps: true,
});

Resident.belongsTo(Household, { foreignKey: 'householdId' });

module.exports = Resident;
