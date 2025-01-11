const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobPosting = sequelize.define('JobPosting', {
    jobName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salaryRange: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Change location to an array of strings
      allowNull: false,
    },
    postedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobType: {
      type: DataTypes.ENUM('Hybrid', 'Onsite', 'Remote'),
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

module.exports = JobPosting;
