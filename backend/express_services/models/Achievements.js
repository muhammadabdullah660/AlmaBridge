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
      allowNull: true,
    },
    Link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achievementPicture: {
      type: DataTypes.STRING,
      //allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Achievements;
