const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const UserEducation = require('./Education');
const UserExperience = require('./Experience');
const UserCertificate = require('./Certification');
const UserSkill = require('./Skills');


const UserProfile = sequelize.define('UserProfile', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
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

// Association with User Model
UserProfile.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// Assoication with Education Model
UserProfile.hasMany(UserEducation, { 
    foreignKey: 'userProfileId',
    as: "educations",
    onDelete: 'CASCADE' 
});

// Association with Experience Model
UserProfile.hasMany(UserExperience, {
    foreignKey: 'userProfileId',
    as: "experiences",
    onDelete: 'CASCADE',
});

// Association with Skill Model
UserProfile.hasMany(UserSkill, {
    foreignKey: 'userProfileId',
    as: "skills",
    onDelete: 'CASCADE',
});

// Association with Certification Model
UserProfile.hasMany(UserCertificate, {
    foreignKey: 'userProfileId',
    as: "certificates",
    onDelete: 'CASCADE',
});


module.exports = UserProfile;
