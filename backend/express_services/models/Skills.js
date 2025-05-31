const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSkill = sequelize.define(
  "UserSkills",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userProfileId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "UserProfiles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    skillName: {
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
    indexes: [
      {
        unique: false,
        fields: ["userProfileId"],
      },
    ],
  }
);

module.exports = UserSkill;
