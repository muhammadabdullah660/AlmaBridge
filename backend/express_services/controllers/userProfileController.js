const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const createUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      firstName,
      lastName,
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      primaryEmail,
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

    // Check if the user profile already exists and this need to be done,
    // in case of student because we already making it's profile when he/she register their account.
    const existingProfile = await UserProfile.findOne({ where: { userId } });

    if (existingProfile) {
      await existingProfile.update({
        address,
        aboutMe,
        linkedin,
        bio,
        gender,
        education: [
          {
            school,
            degree,
            fieldOfStudy,
            graduationYear,
          },
        ],
        workExperience: [
          {
            company,
            role,
            startDate,
            endDate,
            description,
          },
        ],
        skills: [
          {
            skillName,
            rating,
          },
        ],
        certifications: [
          {
            certificationName,
            issuer,
            date,
          },
        ],
        portfolio,
        linktree,
        ...(req.file && { resume: req.file.path }),
      });

      return res.status(200).json({
        message: 'User profile updated successfully, excluding primaryEmail and secondaryEmail.',
        data: existingProfile,
      });
    }

    // Create a new profile if it doesn't exist
    const newUserProfile = await UserProfile.create({
      userId,
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      primaryEmail,
      secondaryEmail,
      education: [
        {
          school,
          degree,
          fieldOfStudy,
          graduationYear,
        },
      ],
      workExperience: [
        {
          company,
          role,
          startDate,
          endDate,
          description,
        },
      ],
      skills: [
        {
          skillName,
          rating,
        },
      ],
      certifications: [
        {
          certificationName,
          issuer,
          date,
        },
      ],
      portfolio,
      linktree,
      resume: req.file ? req.file.path : null,
    });

    return res.status(201).json({
      message: 'User profile created successfully.',
      data: newUserProfile,
    });
  } catch (error) {
    console.error('Error creating or updating user profile:', error);
    return res.status(500).json({
      message: 'Failed to create or update user profile.',
      error: error.message,
    });
  }
};

  
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from request parameters

    // Validate the input
    if (!id) {
      return res.status(400).json({
        message: 'User profile ID is required.',
      });
    }

    // Retrieve the user profile
    const userProfile = await UserProfile.findOne({ where: { id } });

    // Check if the user profile exists
    if (!userProfile) {
      return res.status(404).json({
        message: 'User profile not found.',
      });
    }

    // Retrieve the associated user
    const user = await User.findByPk(userProfile.userId);

    // Ensure the user exists (data consistency check)
    if (!user) {
      return res.status(404).json({
        message: 'Associated user not found.',
      });
    }

    // Prepare the response object
    const responseData = {
      ...userProfile.toJSON(), // Convert Sequelize instance to plain object
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Send a successful response
    return res.status(200).json({
      message: 'User profile retrieved successfully.',
      data: responseData,
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error retrieving user profile:', error);

    // Send a generic error response
    return res.status(500).json({
      message: 'An error occurred while retrieving the user profile.',
      error: error.message,
    });
  }
};

  
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // Extract user profile ID from request parameters
    const resume = req.file ? req.file.path : null; // Handle resume file upload

    // Extract fields from the request body
    const {
      firstName,
      lastName,
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      primaryEmail,
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

    // Construct the update data object
    const updateData = {
      address,
      aboutMe,
      linkedin,
      bio,
      gender,
      primaryEmail,
      secondaryEmail,
      portfolio,
      linktree,
      resume,
      education: school && degree && fieldOfStudy && graduationYear
        ? JSON.stringify([{ school, degree, fieldOfStudy, graduationYear }])
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

    // Remove any undefined values from the update data object
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    // Update the user profile
    const [updatedRows] = await UserProfile.update(updateData, { where: { id } });

    // Check if any rows were updated
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User profile not found or no changes made' });
    }

    // Fetch the updated user profile
    const updatedUserProfile = await UserProfile.findOne({ where: { id } });
    
    // Fetch the associated user
    const user = await User.findByPk(updatedUserProfile.userId);
    
    // Update user's firstName and lastName if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Save the updated user data
    await user.save();

    // Respond with the updated user profile
    res.status(200).json({
      message: 'User profile updated successfully.',
      updatedUserProfile,
    });

  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({
      message: 'An error occurred while updating the user profile.',
      error: err.message,
    });
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
