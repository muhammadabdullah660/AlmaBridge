const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const createUserProfile = async (req, res) => {
  try {
    const {
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      secondaryEmail,
      school,
      degree,
      fieldOfStudy,
      graduationYear,  
      company,
      role,
      startDate,
      endDate,
      description,
      skillName,
      rating,
      certificationName,
      issuer,
      date,      
      portfolio,
      linktree,
    } = req.body;

    // Create a new user instance
    const user = new UserProfile({
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      secondaryEmail,
      education: [{ 
        school,
        degree,
        fieldOfStudy,
        graduationYear,  }],
      workExperience: [{ 
        company,
        role,
        startDate,
        endDate,
        description,  }],
      skills: [{ 
        skillName,
        rating,  }],
      certifications: [{ 
          certificationName,
          issuer,
          date, }],
      portfolio,
      linktree,
    });
    if (req.file)
      {
        user.resume = req.file.path;
      }

    // Save the user to the database
    const savedUser = await user.save();

    res.status(201).json({
      message: 'User profile created successfully.',
      data: savedUser,
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({
      message: 'Failed to create user profile.',
      error: error.message,
    });
  }
};

  
   const getUserProfile = async (req, res) => {
    try {
      const { id } = req.params; 
      console.log(id);
  
      if (!id) {
        return res.status(400).json({
          message: 'id is required.',
        });
      }
  
      // Find the user by primaryEmail
      const user = await UserProfile.findOne({ id });
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }
  
      // Return the user data
      res.status(200).json({
        message: 'User profile retrieved successfully.',
        data: user,
      });
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      res.status(500).json({
        message: 'Failed to retrieve user profile.',
        error: error.message,
      });
    }
  };
  
  const updateUserProfile = async (req, res) => {
    try {
      const { id } = req.params; 
      console.log(req.file);
      const resume = req.file ? req.file.path : null; // Handle resume file upload
  
      const {
        address,
        aboutMe,
        linkedin,
        bio,
        gender,
        secondaryEmail,
        school,
        degree,
        fieldOfStudy,
        graduationYear,
        company,
        role,
        startDate,
        endDate,
        description,
        skillName,
        rating,
        certificationName,
        issuer,
        date,
        portfolio,
        linktree,
      } = req.body;
  
      // Construct the update data
      const updateData = {
        address,
        aboutMe,
        linkedin,
        bio,
        gender,
        secondaryEmail,
        portfolio,
        linktree,
        resume,
        education: school && degree && fieldOfStudy && graduationYear
          ? JSON.stringify([{ school, degree, fieldOfStudy, graduationYear }]) // Sequelize doesn't support nested objects directly
          : undefined,
        workExperience: company && role && startDate && endDate && description
          ? JSON.stringify([{ company, role, startDate, endDate, description }])
          : undefined,
        skills: skillName && rating
          ? JSON.stringify([{ skillName, rating }])
          : undefined,
        certifications: certificationName && issuer && date
          ? JSON.stringify([{ certificationName, issuer, date }])
          : undefined,
      };
  
      // Remove undefined keys from updateData
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });
  
      // Update the user profile
      const [updatedRows] = await UserProfile.update(updateData, {
        where: { id },
      });
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "User Profile not found or no changes made" });
      }
  
      const updatedUserProfile = await UserProfile.findOne({
        where: { id },
      });
  
      res.status(200).json({
        message: "User Profile updated successfully",
        updatedUserProfile,
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a route parameter

    const deletedRows = await UserProfile.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "User Profile not found" });
    }

    return res.status(200).json({ message: "User Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting UserProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUserProfile, getUserProfile,updateUserProfile,deleteUserProfile };
