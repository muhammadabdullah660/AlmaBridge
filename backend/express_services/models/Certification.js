const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require("./UserProfile");

const UserCertificate = sequelize.define('UserCertificate', {
    userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserProfile',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    certificationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuer: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: true,
});

// Association with UserProfile Model
UserCertificate.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

module.exports = UserCertificate;
