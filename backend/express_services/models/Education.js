const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserEducation = sequelize.define('UserEducation', {
    userProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'UserProfiles',
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



module.exports = UserEducation;
