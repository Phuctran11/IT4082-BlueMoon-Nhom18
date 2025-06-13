'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resident extends Model {
    static associate(models) {
      this.belongsTo(models.Household, { foreignKey: 'householdId', as: 'household' });
    }
  }
  Resident.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    householdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  }, {
    sequelize,
    modelName: 'Resident',
    tableName: 'residents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Resident;
};
