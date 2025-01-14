const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require("./UserProfile");

const UserSkill = sequelize.define('UserSkills', {
    userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserProfile',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    skill: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Association with UserProfile Model
UserSkill.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

module.exports = UserSkill;
