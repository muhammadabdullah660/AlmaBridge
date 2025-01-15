const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserEducation = sequelize.define(
  "UserEducation",
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
    school: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: true,
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
  }
);

module.exports = UserEducation;
