const express = require("express");
const {
  register,
  login,
  verifyEmail,
  getUserByToken,
} = require("../controllers/userController");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter for auth-related routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Register route
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  limiter,
  register
);

// Login route
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  limiter,
  login
);

// Email verification route
router.get("/verify-email", verifyEmail);

// Get user by token route
router.get("/user", getUserByToken);

module.exports = router;
