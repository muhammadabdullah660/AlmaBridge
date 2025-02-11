const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobPosting = sequelize.define("JobPosting", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    jobName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobDescription:
    {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salaryRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    jobType: {
      type: DataTypes.ENUM("full-time", "part-time", "internship", "contract", "fellowship"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

module.exports = JobPosting;
