const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Log = sequelize.define(
  "Log",
  {
    action: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null if the action is not related to a user
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "success", // can be 'success', 'failure', etc.
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

module.exports = Log;
