const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Household = sequelize.define('Household', {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  householdCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-zA-Z0-9]+$/i, // chữ + số, không ký tự đặc biệt
    },
  },
  headOfHousehold: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: /^[a-zA-Z0-9\sÀ-ỹ]+$/i,
      len: [1, 100],
    },
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  memberCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
      isInt: true,
    },
  },
  apartmentType: {
    type: DataTypes.ENUM('Studio', '1 phòng ngủ', '2 phòng ngủ', '3 phòng ngủ', 'Penhouse'),
    allowNull: false,
  },
}, {
  tableName: 'households',
  timestamps: true,
});

module.exports = Household;
