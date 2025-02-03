const Achievement = require("../models/Achievements");
const logAction = require('../utils/logService');
const { validationResult } = require('express-validator');
const { handleValidationErrors } = require('../utils/errorHandler');
const { uploadFile, deleteFile, checkFileName } = require('../utils/cloudflareService');



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
    return res.status(status).json(response);
  }  

  const { userId, achievementName, achieverName, achieverCategory, achievementsDescription, session, department, Link } = req.body;
  try {
    let filePath = null;
    if (req.file) {
      try {
        filePath = await uploadFile(req.file, userId, "achievementImages");
      } catch (error) {
        console.error("Error handling file upload:", error.message);
        throw new Error("File processing failed. Please try again.");
      }
    }

    const newAchievement = await Achievement.create({
      achievementName,
      achieverName,
      achieverCategory,
      achievementsDescription,
      session,
      department,
      Link,
      achievementPicture: filePath,
    });

    await logAction("Achievement Created", userId, `User: ${userId} has created a achievement successfully`);
    res.status(201).json({ message: "Achievement Created Successfully" });
  } catch (error) {
    await logAction("Achievement Creation Fail", userId, `User:${userId} has tried to created Achievement but failure due to ${error}`, "failure");
    res.status(500).json({ message: "Error creating achievement", error });
  }
};



const getAllAchievements = async (req, res) => {
  const { userId } = req.body;
  try {
    const achievements = await Achievement.findAll();
    await logAction("Achievement Retrieval", userId, "This User get all Achievements Successfully");
    res.status(200).json(achievements);
  } catch (error) {
    await logAction("Achievement Retrieval Fails", userId, `Error occured while retrieving achievements: ${error}`);
    res.status(500).json({ message: "Error fetching achievements", error });
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
  
  const { userId, achievementName, achieverName, achieverCategory, achievementsDescription, session, department, Link } = req.body;
  try {
    const { id } = req.params;

    const existingAchievement = await Achievement.findOne({ where: {id} });

    if (existingAchievement) {
      await logAction(
        "Achievement Not Found",
        userId,
        "Achievement not found while updating achievement",
        "failure"
      );
      return res.status(404).json({ message: "Achievement not found" });
    }

    let filePath = null;

    if (req.file) {
      const existingFileName = existingAchievement?.achievementPicture;
      try {
        if (!existingFileName) {
          filePath = await uploadFile(req.file, userId, "achievementImages");
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


    const updatedAchievementData = {
      achievementName,
      achieverName,
      achieverCategory: achieverCategory || existingAchievement.achieverCategory,
      achievementsDescription,
      session: session || existingAchievement.session,
      department: department || existingAchievement.department,
      Link: Link || existingAchievement.Link,
      achievementPicture: filePath,
    }; 

    await existingAchievement.update(updatedAchievementData);

    await logAction(
      "Achievement Updated",
      userId,
      "Achievement updated successfully",
      "success"
    );
    res.status(200).json({ message: "Achievement Updated Successfully" });
  } catch (error) {
    await logAction("Achievement Updation Fail", userId, `User:${userId} has tried to update Achievement but failure due to ${error}`, "failure");
    res.status(500).json({ message: "Error updating achievement", error });
  }
};

const deleteAchievement = async (req, res) => {
  const { userId } = req.body;
  try {
    const { id } = req.params;

    const deleted = await Achievement.destroy({
      where: { id },
    });

    if (!deleted) {
      await logAction("Achievement Deletion Fail", userId, `Such Achievement does not Exist in the System`, "failure");
      return res.status(404).json({ message: "Achievement not found" });
    }
    
    await logAction("Achievement Deleted", userId, `UserId: ${userId} has deleted the Achievement Successfully`);
    res.status(204).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    await logAction("Achievement Deletion Fail", userId, error, "failure");
    res.status(500).json({ message: "Error deleting achievement", error });
  }
};

module.exports = {
  createAchievement,
  getAllAchievements,
  updateAchievement,
  deleteAchievement,
};
