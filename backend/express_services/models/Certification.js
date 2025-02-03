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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issuer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["userProfileId"],
      },
    ],
  }
);

module.exports = UserCertificate;
