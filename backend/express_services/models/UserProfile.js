const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserProfile = sequelize.define(
  "UserProfiles",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "LGTV", "Hizru Boy", "Alma Paglu", "Nonchalant" ,"Other"),
      allowNull: true,
    },
    secondaryEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portfolio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linktree: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  }
);

module.exports = UserProfile;
