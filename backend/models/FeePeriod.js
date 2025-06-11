'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeePeriod extends Model {
    static associate(models) {
      this.hasMany(models.Invoice, { foreignKey: 'feePeriodId' });
    }
  }
  FeePeriod.init({
    name: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, field: 'start_date' },
    endDate: { type: DataTypes.DATE, field: 'end_date' },
  }, {
    sequelize,
    modelName: 'FeePeriod',
    tableName: 'fee_periods',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return FeePeriod;
};