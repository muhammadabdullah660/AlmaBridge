const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserExperience = sequelize.define(
  "UserExperience",
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
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Association with UserProfile Model

module.exports = UserExperience;
