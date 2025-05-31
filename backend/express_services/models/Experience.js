const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserExperience = sequelize.define(
  "UserExperiences",
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
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
    indexes: [
      {
        unique: false,
        fields: ["userProfileId"],
      },
    ],
  }
);


module.exports = UserExperience;
