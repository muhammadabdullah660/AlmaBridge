const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
    aboutMe: {
        type: DataTypes.TEXT,
    },
    linkedin: {
        type: DataTypes.STRING,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    gender: {
        type: DataTypes.STRING,
    },
    primaryEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    secondaryEmail: {
        type: DataTypes.STRING,
    },
    education: {
        type: DataTypes.JSONB, // For complex nested data
    },
    workExperience: {
        type: DataTypes.JSONB,
    },
    skills: {
        type: DataTypes.JSONB,
    },
    certifications: {
        type: DataTypes.JSONB,
    },
    portfolio: {
        type: DataTypes.STRING,
    },
    linktree: {
        type: DataTypes.STRING,
    },
    resume: {
        type: DataTypes.STRING,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = UserProfile;
