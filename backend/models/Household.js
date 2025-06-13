'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
      this.hasMany(models.Resident, { foreignKey: 'householdId' });
      this.hasMany(models.Invoice, { foreignKey: 'householdId' });
    }
  }
  Household.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apartmentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'apartment_code',
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'owner_id',
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
  }, {
    sequelize,
    modelName: 'Household',
    tableName: 'households',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Household;
};
