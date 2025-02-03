const UserProfile = require("../models/UserProfile");
const UserEducation = require("../models/Education");
const UserExperience = require("../models/Experience");
const logAction = require("../utils/logService");
const UserSkill = require("../models/Skills");
const UserCertificate = require("../models/Certification");
const User = require("../models/User");
const { uploadFile, deleteFile, checkFileName } = require('../utils/cloudflareService');


const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingProfile = await UserProfile.findOne({ where: { userId } });

    if (!existingProfile) {
      await logAction(
        "Profile Not Found",
        userId,
        "User profile not found while creating or updating profile",
        "failure"
      );
      return res.status(404).json({ message: "User profile not found" });
    }
    let filePath = null;
    
    if (req.file) {
      const existingFileName = existingProfile?.profileImage;
      try {
        if (!existingFileName) {
          filePath = await uploadFile(req.file, userId, "profileImages");
        }
        else if (checkFileName(req.file.originalname, existingFileName)) {
          filePath = existingFileName;
        }
        else {
          await deleteFile(existingFileName);
          filePath = await uploadFile(req.file, userId);
        }
      } catch (error) {
        console.error("Error handling file upload:", error.message);
        throw new Error("File processing failed. Please try again.");
      }
    }

    const updatedProfileData = {
      profileImage: filePath,
      address: req.body.address || existingProfile.address,
      linkedin: req.body.linkedin || existingProfile.linkedin,
      bio: req.body.bio || existingProfile.bio,
      gender: req.body.gender || existingProfile.gender,
      portfolio: req.body.portfolio || existingProfile.portfolio,
      linktree: req.body.linktree || existingProfile.linktree,
      secondaryEmail: req.body.secondaryEmail || existingProfile.secondaryEmail,
    };

    await existingProfile.update(updatedProfileData);

    if (req.body.firstName || req.body.lastName || req.body.primaryEmail) {
      const user = await User.findByPk(userId);

      const updatedUserData = {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        email: req.body.primaryEmail || user.email,
      };

      await user.update(updatedUserData);
    }

    if (
      req.body.education &&
      Array.isArray(req.body.educations) &&
      req.body.educations.length > 0
    ) {
      await bulkInsert(UserEducation, req.body.educations, existingProfile.id);
    }
    if (
      req.body.experiences &&
      Array.isArray(req.body.experiences) &&
      req.body.experiences.length > 0
    ) {
      await bulkInsert(
        UserExperience,
        req.body.experiences,
        existingProfile.id
      );
    }
    if (
      req.body.skills &&
      Array.isArray(req.body.skills) &&
      req.body.skills.length > 0
    ) {
      await bulkInsert(UserSkill, req.body.skills, existingProfile.id);
    }

    if (
      req.body.certificates &&
      Array.isArray(req.body.certificates) &&
      req.body.certificates.length > 0
    ) {
      await bulkInsert(
        UserCertificate,
        req.body.certificates,
        existingProfile.id
      );
    }

    // Success response
    await logAction(
      "Profile Updated",
      userId,
      "User profile and related data updated successfully",
      "success"
    );
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Error response
    await logAction(
      "Profile Update Failed",
      req.body.userId,
      `Error occurred: ${error.message}`,
      "failure"
    );

    return res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

const bulkInsert = async (Model, records, userProfileId) => {
  if (Array.isArray(records) && records.length > 0) {
    await Model.destroy({ where: { userProfileId } });
    await Model.bulkCreate(
      records.map((record) => ({
        ...record,
        userProfileId,
      }))
    );
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["firstName", "lastName", "email"],
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: [
            "profileImage",
            "address",
            "linkedin",
            "bio",
            "gender",
            "secondaryEmail",
            "portfolio",
            "linktree",
          ],
          include: [
            {
              model: UserEducation,
              as: "educations",
              attributes: [
                "school",
                "degree",
                "fieldOfStudy",
                "graduationYear",
              ],
            },
            {
              model: UserExperience,
              as: "experiences",
              attributes: [
                "role",
                "company",
                "startDate",
                "endDate",
                "description",
              ],
            },
            {
              model: UserSkill,
              as: "skills",
              attributes: ["skill", "rating"],
            },
            {
              model: UserCertificate,
              as: "certificates",
              attributes: ["certificationName", "issuer", "issueDate"],
            },
          ],
        },
      ],
    });

    if (!user) {
      await logAction(
        "Profile Not Found",
        userId,
        "User profile not found",
        "failure"
      );
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({
      message: "User Profile Retrieved Successfully",
      data: user,
    });
  } catch (error) {
    await logAction(
      "Failed to Retrieve User Profile",
      req.body.userId,
      error.message,
      "failure"
    );
    res.status(500).json({
      message: "Failed to retrieve user profile",
      error: error.message,
    });
  }
};

const getAllUserProfiles = async (req, res) => {
  const { userId } = req.body;
  try {
    const users = await User.findAll({
      attributes: ["firstName", "lastName", "email"],
      include: [
        {
          model: UserProfile,
          as: "profile",
          attributes: [
            "profileImage",
            "address",
            "linkedin",
            "bio",
            "gender",
            "secondaryEmail",
            "portfolio",
            "linktree",
          ],
          include: [
            {
              model: UserEducation,
              as: "educations",
              attributes: [
                "school",
                "degree",
                "fieldOfStudy",
                "graduationYear",
              ],
            },
            {
              model: UserExperience,
              as: "experiences",
              attributes: [
                "role",
                "company",
                "startDate",
                "endDate",
                "description",
              ],
            },
            {
              model: UserSkill,
              as: "skills",
              attributes: ["skill", "rating"],
            },
            {
              model: UserCertificate,
              as: "certificates",
              attributes: ["certificationName", "issuer", "issueDate"],
            },
          ],
        },
      ],
    });

    if (users.length === 0) {
      await logAction(
        "No Profiles Found",
        userId,
        "No user profiles found",
        "failure"
      );
      return res.status(404).json({ message: "No User Profiles Found" });
    }

    return res.status(200).json({
      message: "All User Profiles Retrieved Successfully",
      data: users,
    });
  } catch (error) {
    await logAction(
      "Failed to Retrieve User Profiles",
      userId,
      error.message,
      "failure"
    );
    res.status(500).json({
      message: "Failed to retrieve user profiles",
      error: error.message,
    });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUserProfiles };
