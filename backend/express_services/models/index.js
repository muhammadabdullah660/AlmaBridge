const User = require('./User');
const UserProfile = require('./UserProfile');
const UserEducation = require('./Education');
const UserExperience = require('./Experience');
const UserCertificate = require('./Certification');
const UserSkills = require('./Skills');
const Achievements = require('./Achievements');
const JobPosts = require('./JobPosting');
const ChatMessage = require('./ChatMessage');
const Event = require('./Event');
const sequelize = require('../config/database');
const VerificationCode = require('./VerificationCode');



UserCertificate.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
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
UserProfile.hasMany(UserSkills, {
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

// Association of User with User Profile
User.hasOne(UserProfile, {
    foreignKey: "userId",
    as: "profile",
    onDelete: "CASCADE",
});


// Association of User with VC
User.hasMany(VerificationCode, {
    foreignKey: "userId",
    as: "VerificationCode",
});

VerificationCode.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
})


// Association with UserProfile Model
UserSkills.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});


UserExperience.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

// Association with UserProfile Model
UserEducation.belongsTo(UserProfile, {
    foreignKey: 'userProfileId',
    as: "profile",
});

// Relation of Achievements with User Model
Achievements.belongsTo(User, {
    foreignKey: 'userId',
    as: "user",
});

User.hasMany(Achievements, {
    foreignKey: 'userId',
    as: "achievements",
    onDelete: 'CASCADE',
});

// Relation of JobPosting with User Model
User.hasMany(JobPosts, {
    foreignKey: "userId",
    as: "JobPosts",
    onDelete: "CASCADE",
});

JobPosts.belongsTo(User, {
    foreignKey: 'userId',
    as: "user",
});

// Associations for ChatMessage
ChatMessage.belongsTo(User, {
    foreignKey: 'senderId',
    as: "sender",
});

ChatMessage.belongsTo(User, {
    foreignKey: 'receiverId',
    as: "receiver",
});

User.hasMany(ChatMessage, {
    foreignKey: 'senderId',
    as: "sentMessages",
    onDelete: 'CASCADE',
});

User.hasMany(ChatMessage, {
    foreignKey: 'receiverId',
    as: "receivedMessages",
    onDelete: 'CASCADE',
});

User.hasMany(Event, {
    foreignKey: 'createdBy',
    onDelete: "CASCADE"
});

Event.belongsTo(User, {
    foreignKey: "createdBy",
})


module.exports = {User, UserProfile, UserEducation, UserCertificate, UserSkills, UserExperience, ChatMessage, VerificationCode, Event};

