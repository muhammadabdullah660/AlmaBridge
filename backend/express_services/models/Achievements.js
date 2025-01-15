const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Achievements = sequelize.define('Achievements', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically increment IDs
  },
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
  Link: {
    type: DataTypes.STRING,
    //allowNull: false,
  },
  achievementPicture: {
    type: DataTypes.STRING,
    //allowNull: false,
  }
}, {
  timestamps: true,
});


module.exports = Achievements;
