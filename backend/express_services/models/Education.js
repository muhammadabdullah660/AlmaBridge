const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserEducation = sequelize.define(
  "UserEducations",
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
    school: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    graduationYear: {
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

module.exports = UserEducation;
