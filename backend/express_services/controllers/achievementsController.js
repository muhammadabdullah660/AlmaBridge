const Achievement = require("../models/Achievements");
const logAction = require('../utils/logService');
const { validationResult } = require('express-validator');
const { handleValidationErrors } = require('../utils/errorHandler');
const { uploadFile, deleteFile, checkFileName } = require('../utils/cloudflareService');


// helper function to handle file uploads
const handleFileUpload = async (file, userId, existingFileName, folder) => {
  if (!file) return existingFileName;

  try{
    if(!existingFileName) {
      return await uploadFile(file, userId, folder);
    } else if (checkFileName(file.originalname, existingFileName)) {
      return existingFileName;
    } else {
      await deleteFile(existingFileName);
      return await uploadFile(file, userId, folder);
    }
  } catch(error) {
    console.error("Error handling file upload: ", error);
    throw new Error("File processing failed. Please try again.");
  }

}



// Controllers
const createAchievement = async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
        "Achievement Creation Failed",
        null,
        `Validation errors: ${JSON.stringify(errors.array())}`,
        "failure"
    );
    console.log(errors);
    return res.status(status).json(response);
  }  

  const { userId, achievementName, achieverName, achieverCategory, achievementDescription, session, department, link } = req.body;
  try {

    const filePath = await handleFileUpload(req.file, userId, null, "achievementImages");

    const newAchievement = await Achievement.create({
      userId,
      achievementName,
      achieverName,
      achieverCategory,
      achievementDescription,
      session,
      department,
      Link: link,
      achievementPicture: filePath,
    });

    await logAction("Achievement Created", userId, `Achievement created successfully for user: ${userId}`);
    res.status(201).json(newAchievement);
  } catch (error) {
    await logAction("Achievement Creation Fail", userId, `Failed to create achievement for user: ${userId}. Error: ${error.message}`, "failure");
    res.status(500).json({ message: "Error creating achievement", error: error.message });
  }
};



const getAllAchievements = async (req, res) => {
  const { userId } = req.body;
  try {
    const achievements = await Achievement.findAll();
    await logAction("Achievement Retrieval", userId, `All achievements retrieved successfully by user: ${userId}`);
    res.status(200).json(achievements);
  } catch (error) {
    await logAction("Achievement Retrieval Fails", userId, `Failed to retrieve achievements for user: ${userId}. Error: ${error.message}`, "failure");
    res.status(500).json({ message: "Error fetching achievements", error: error.message });
  }
};

const getSpecificAchievements = async (req, res) => {
  const { userId } = req.body;
  try {
    const achievements = await Achievement.findAll({
      where: {
        userId: userId,
      },
    });
    await logAction("Achievement Retrieval", userId, `All achievements retrieved successfully by user: ${userId}`);
    res.status(200).json(achievements);
  } catch (error) {
    await logAction("Achievement Retrieval Fails", userId, `Failed to retrieve achievements for user: ${userId}. Error: ${error.message}`, "failure");
    res.status(500).json({ message: "Error fetching achievements", error: error.message });
  }
};




const updateAchievement = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
        "Achievement Creation Failed",
        null,
        `Validation errors: ${JSON.stringify(errors.array())}`,
        "failure"
    );
    return res.status(status).json(response);
  } 
  
  const { userId, achievementName, achieverName, achieverCategory, achievementDescription, session, department, link } = req.body;
  const { id } = req.params;
  try {

    const existingAchievement = await Achievement.findByPk(id);

    if (!existingAchievement) {
      await logAction("Achievement Not Found", userId, `Achievement not found for ID: ${id}`, "failure");
      return res.status(404).json({ message: "Achievement not found" });
    }

    const filePath = await handleFileUpload(req.file, userId, existingAchievement.achievementPicture, "achievementImages");

    const updatedAchievementData = {
      achievementName: achievementName || existingAchievement.achievementName,
      achieverName: achieverName || existingAchievement.achieverName,
      achieverCategory: achieverCategory || existingAchievement.achieverCategory,
      achievementDescription: achievementDescription || existingAchievement.achievementDescription,
      session: session || existingAchievement.session,
      department: department || existingAchievement.department,
      Link: link || existingAchievement.Link,
      achievementPicture: filePath,
    };

    await existingAchievement.update(updatedAchievementData);
    await logAction("Achievement Updated", userId, `Achievement updated successfully for ID: ${id}`);
    
    res.status(200).json(existingAchievement);
  
  } catch (error) {
    await logAction("Achievement Update Fail", userId, `Failed to update achievement for ID: ${id}. Error: ${error.message}`, "failure");
    res.status(500).json({ message: "Error updating achievement", error: error.message });
  }
};

// Delete Achievement
const deleteAchievement = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  try {
    const deleted = await Achievement.destroy({ where: { id } });
    if (!deleted) {
      await logAction("Achievement Deletion Fail", userId, `Achievement not found for ID: ${id}`, "failure");
      return res.status(404).json({ message: "Achievement not found" });
    }

    await logAction("Achievement Deleted", userId, `Achievement deleted successfully for ID: ${id}`);
    res.status(204).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    await logAction("Achievement Deletion Fail", userId, `Failed to delete achievement for ID: ${id}. Error: ${error.message}`, "failure");
    res.status(500).json({ message: "Error deleting achievement", error: error.message });
  }
};

module.exports = {
  createAchievement,
  getAllAchievements,
  updateAchievement,
  deleteAchievement,
  getSpecificAchievements
};
