const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,   
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});



module.exports = VerificationCode;


