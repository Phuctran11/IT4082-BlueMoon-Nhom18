'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      this.hasMany(models.Resident, { foreignKey: 'householdId' });
      this.hasMany(models.Invoice, { foreignKey: 'householdId' });
    }
  }
  Household.init({
    apartmentCode: { type: DataTypes.STRING, field: 'apartment_code', allowNull: false, unique: true },
    ownerId: { type: DataTypes.INTEGER, field: 'owner_id' },
    area: { type: DataTypes.NUMERIC(10, 2) },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'occupied' },
  }, {
    sequelize,
    modelName: 'Household',
    tableName: 'households',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Household;
};