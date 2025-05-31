const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatMessage = sequelize.define(
  "ChatMessages",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    messageContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    chatType: {
      type: DataTypes.ENUM("one-on-one", "group"),
      allowNull: false,
      defaultValue: "one-on-one",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["senderId"],
      },
      {
        unique: false,
        fields: ["receiverId"],
      },
      {
        unique: false,
        fields: ["senderId", "receiverId"],
      },
    ],
  }
);

module.exports = ChatMessage;