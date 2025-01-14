const Achievement = require("../models/Achievements");

// Controllers
const createAchievement = async (req, res) => {
  try {
    const {
      achievementName,
      achieverName,
      achieverCategory,
      achievementsDescription,
      session,
      department,
      Link,
    } = req.body;

    const newAchievement = await Achievement.create({
      achievementName,
      achieverName,
      achieverCategory,
      achievementsDescription,
      session,
      department,
      Link
    });
    if (req.file) {
      newAchievement.achievementPicture = `${req.protocol}://${req.get(
        "host"
      )}/uploadsAchieverPhotos/${req.file.filename}`;
    }

    const savedAchievement = await newAchievement.save();

    res.status(201).json(savedAchievement);
  } catch (error) {
    console.error("Error creating achievement:", error);
    res.status(500).json({ message: "Error creating achievement", error });
  }
};

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.findAll();
    res.status(200).json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: "Error fetching achievements", error });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await Achievement.update(updates, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    const updatedAchievement = await Achievement.findByPk(id);
    res.status(200).json(updatedAchievement);
  } catch (error) {
    console.error("Error updating achievement:", error);
    res.status(500).json({ message: "Error updating achievement", error });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Achievement.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    res.status(500).json({ message: "Error deleting achievement", error });
  }
};

module.exports = {
  createAchievement,
  getAllAchievements,
  updateAchievement,
  deleteAchievement,
};
