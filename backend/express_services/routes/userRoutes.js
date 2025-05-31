const express = require("express");
const {
  register, login, verifyAccount, reSendVerificationCode, getUser,
  deleteUser,
  destroyUser,
  updatePassword,
  forgotPassword,
  validateResetPassword,
  getUserWithProfile
} = require("../controllers/userController");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { verifyToken, verifyIsAdmin } = require("../middlewares/authMiddleware");


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
  login,
);

// Account Verification Route
router.post(
  "/verifyAccount",
  [
    check("verificationCode", "Verification Code is required").exists(),
  ],
  limiter,
  verifyToken,
  verifyAccount
);


// Re-Send Verification Route
router.post("/resendCode", limiter, verifyToken , reSendVerificationCode);

// Get user Data
router.get("/user", limiter ,verifyToken, getUser);

// Delete User Data
router.post("/delUser", limiter, verifyToken, deleteUser);

// Destroy User Data
router.delete("/user", limiter, verifyToken, verifyIsAdmin, destroyUser);

// Send Reset Password Request
router.post(
  "/forgotPassword",
  [
    check("email", "Please include a valid email").isEmail(),
  ], 
  limiter,
  forgotPassword
);

// Update Password
router.post(
  "/updatePassword",
  [
    check("userId", "Please include a valid userId").exists().isNumeric(),
    check("password", "Please include a valid password").exists(),
  ], 
  limiter,
  updatePassword
);

router.post(
  "/validateLink",
  [
    check("resetToken", "Reset Token is required").exists(),
  ],
  limiter,
  validateResetPassword
);


router.get(
  "/userWithProfile",
  limiter,
  verifyToken,
  getUserWithProfile
)


module.exports = router;
