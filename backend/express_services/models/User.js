const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserProfile = require('./UserProfile');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'alumni', 'admin', 'uniAdmin'),
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});


User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});



module.exports = User;
