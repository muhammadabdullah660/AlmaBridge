const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { uploadFileMiddleware } = require('../middlewares/uploadMiddleware');
const rateLimit = require("express-rate-limit");
const {
  createAchievement,
  getAllAchievements,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementsController");
const { check } = require("express-validator");

const router = express.Router();

// Rate limiter for auth-related routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});




//User Profile Routes
router.post(
  "/achievement",
  [
    check("achievementName", "achievementName is required").exists(),
    check("achieverName", "achieverName is required").exists(),
    check("achievementDescription", "achievementDescription is required").exists(),
  ],
  limiter,
  uploadFileMiddleware,
  verifyToken, 
  createAchievement
);

// Get All Achievement Route
router.get(
  "/achievements",
  limiter,
  verifyToken,
  getAllAchievements
);

// Update Achievement Route
router.put(
  "/achievement/:id",
  [
    check("achievementName", "achievementName is required").exists(),
    check("achieverName", "achieverName is required").exists(),
    check("achievementDescription", "achievementDescription is required").exists(),
  ],
  limiter,
  uploadFileMiddleware,
  verifyToken,
  updateAchievement
);

// Delete Achievement Route
router.delete(
  "/achievement/:id",
  deleteAchievement
);

module.exports = router;
