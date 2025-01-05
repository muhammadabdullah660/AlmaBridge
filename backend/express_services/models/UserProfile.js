const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'User',
        //     key: 'id',
        // },
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
},{
    timestamps: true,
});

module.exports = UserProfile;
