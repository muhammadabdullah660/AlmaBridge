const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUserProfiles,
} = require("../controllers/userProfileController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { uploadFileMiddleware } = require('../middlewares/uploadMiddleware');
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Rate limiter for auth-related routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});


// TO CREATE OR UPDATE USER PROFILE DATA
router.post(
  "/profile",
  limiter,
  uploadFileMiddleware,
  verifyToken,
  updateUserProfile
);

// TO GET SELF USER PROFILE DATA
router.get("/profile", limiter, verifyToken, getUserProfile);

// TO GET ALL USER PROFILE DATA
router.get("/profiles", limiter, verifyToken, verifyRole, getAllUserProfiles);

// GET ALL WITHOUT AUTH
router.get("/userProfiles", getAllUserProfiles);

module.exports = router;
