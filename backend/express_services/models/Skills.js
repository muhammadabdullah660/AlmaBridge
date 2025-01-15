const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSkill = sequelize.define(
  "UserSkills",
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
    skill: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = UserSkill;
