const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfiles', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    },
    secondaryEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    portfolio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linktree: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},{
    timestamps: true,
});




module.exports = UserProfile;
