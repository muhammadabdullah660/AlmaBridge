const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VerificationCode = sequelize.define(
  "VerificationCodes",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

module.exports = VerificationCode;