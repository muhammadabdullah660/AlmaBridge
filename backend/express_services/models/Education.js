const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require('./UserProfile');

const UserEducation = sequelize.define('UserEducation', {
    userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserProfile',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    school: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    degree: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fieldOfStudy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    graduationYear: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},{
    timestamps: true,
});

// Association with UserProfile Model
UserEducation.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

module.exports = UserEducation;
