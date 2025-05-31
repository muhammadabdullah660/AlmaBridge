const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobPosting = sequelize.define("JobPosting", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
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
      validate: {
        is: /^\d+-\d+$/,
      },
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
