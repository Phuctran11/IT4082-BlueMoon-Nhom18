const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Household = require('./Household');

const Resident = sequelize.define('resident', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  householdId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Household,
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'household_id',
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'full_name',
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
  },
  idCardNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'id_card_number',
  },
  relationshipWithOwner: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'relationship_with_owner',
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
  tableName: 'residents',
  timestamps: true,
  underscored: true,
});

Resident.belongsTo(Household, { foreignKey: 'householdId', as: 'household' });

module.exports = Resident;
