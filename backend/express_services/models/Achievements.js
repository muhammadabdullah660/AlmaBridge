const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievements = sequelize.define('Achievements', {
    achievementName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    achieverName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    achieverCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    achievementsDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    achieverPicture:{
        type: DataTypes.STRING,
      //allowNull: false,
    }
  }, {
    timestamps: true,
  });

module.exports = Achievements;
