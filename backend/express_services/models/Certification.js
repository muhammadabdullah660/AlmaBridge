const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCertificate = sequelize.define(
  "UserCertificates",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userProfileId: {
      type: DataTypes.UUID,
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
