const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Achievements = sequelize.define('Achievements', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
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
    type: DataTypes.ENUM("student", "alumni", "other"),
    allowNull: true,
  },
  achievementsDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  Link: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  achievementPicture: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ["userId"],
    },
  ],
});


module.exports = Achievements;
