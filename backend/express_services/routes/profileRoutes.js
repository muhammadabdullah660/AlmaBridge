const express = require("express");
const multer = require("multer");
const {
  getUserProfile,
  updateUserProfile,
  getAllUserProfiles,
} = require("../controllers/userProfileController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Rate limiter for auth-related routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//User Profile Routes

// TO CREATE OR UPDATE USER PROFILE DATA
router.post(
  "/profile",
  limiter,
  upload.single("resume"),
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
