// models/Household.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'owner_id', as: 'Owner' });
      this.hasMany(models.Resident, { foreignKey: 'household_id' });
      this.hasMany(models.Invoice, { foreignKey: 'household_id' });
    }
  }
  Household.init({
    apartmentCode: { type: DataTypes.STRING, field: 'apartment_code', allowNull: false, unique: true },
    ownerId: { type: DataTypes.INTEGER, field: 'owner_id' },
    area: { type: DataTypes.NUMERIC(10, 2) },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'occupied' },
    // --- BỔ SUNG CÁC TRƯỜNG MỚI ---
    address: { type: DataTypes.STRING }, // Địa chỉ, ví dụ: "Tầng 3, Block A"
    apartmentType: { type: DataTypes.STRING, field: 'apartment_type' } // Loại căn hộ, ví dụ: "2 phòng ngủ"
  }, {
    sequelize,
    modelName: 'Household',
    tableName: 'households',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Household;
};