const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCertificate = sequelize.define(
  "UserCertificates",
  {
    userProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "UserProfiles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    certificationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issuer: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserCertificate;
