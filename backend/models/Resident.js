'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resident extends Model {
    static associate(models) {
      this.belongsTo(models.Household, { foreignKey: 'householdId' });
    }
  }
  Resident.init({
    householdId: { type: DataTypes.INTEGER, field: 'household_id', allowNull: false },
    fullName: { type: DataTypes.STRING, field: 'full_name', allowNull: false },
    dateOfBirth: { type: DataTypes.DATE, field: 'date_of_birth' },
    //... thêm các trường khác nếu cần
  }, {
    sequelize,
    modelName: 'Resident',
    tableName: 'residents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Resident;
};