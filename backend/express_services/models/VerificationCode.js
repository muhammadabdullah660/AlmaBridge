const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationCode = sequelize.define('VerificationCode', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'User',
        //     key: 'id',
        // },   
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


