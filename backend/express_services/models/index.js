const User = require('./User');
const UserProfile = require('./UserProfile');
const UserEducation = require('./Education');
const UserExperience = require('./Experience');
const UserCertificate = require('./Certification');
const UserSkills = require('./Skills');
const Achievements = require('./Achievements');
const JobPosts = require('./JobPosting');

const sequelize = require('../config/database');



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


module.exports = {User, UserProfile, UserEducation, UserCertificate, UserSkills, UserExperience};

