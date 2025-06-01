const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  eventLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'cancelled'),
    defaultValue: 'pending',
  },
  targetAudience: {
    type: DataTypes.ENUM('students', 'alumni', 'both'),
    allowNull: false,
  },
}, {
  tableName: 'events',
  timestamps: true,
  indexes: [
      {
        unique: true,
        fields: ["id"],
      },
    ],
});

module.exports = Event;