const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobPosting = sequelize.define(
  "JobPosting",
  {
    jobName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salaryRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Change location to an array of strings
      allowNull: true,
    },
    postedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jobType: {
      type: DataTypes.ENUM("Hybrid", "Onsite", "Remote"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = JobPosting;
