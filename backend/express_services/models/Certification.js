const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCertificate = sequelize.define(
  "UserCertificates",
  {
    userProfileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "UserProfiles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    certificationName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issuer: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    issueDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserCertificate;
