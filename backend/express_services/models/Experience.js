const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require("./UserProfile");

const UserExperience = sequelize.define('UserExperience', {
    userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserProfile',
            key: 'id',
        },
        onDelete: 'CASCADE',
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
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Association with UserProfile Model
UserExperience.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

module.exports = UserExperience;
