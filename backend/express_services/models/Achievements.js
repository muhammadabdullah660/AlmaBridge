const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Achievements = sequelize.define(
  "Achievements",
  {
    achievementName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achieverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achieverCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achievementsDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    session: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    achievementPicture: {
      type: DataTypes.STRING,
      //allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Achievements;
