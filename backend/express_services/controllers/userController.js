const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/mailService");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logService");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Function to create JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Function to handle validation errors
const handleValidationErrors = (errors) => {
  return { status: 400, response: { errors: errors.array() } };
};

// Register User
const register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
      "User Registration Failed",
      null,
      `Validation errors: ${JSON.stringify(errors.array())}`,
      "failure"
    );
    return res.status(status).json(response);
  }

  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await logAction(
      "User Registration",
      user.id,
      `New user registered with email: ${email}`
    );

    const token = generateToken(user.id);
    await sendVerificationEmail(user.email, token);

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Please check your email to verify your account.",
      });
  } catch (error) {
    await logAction("User Registration Failed", null, error.message, "failure");
    res
      .status(500)
      .json({
        message: "Server error",
        error: error.message || "An unexpected error occurred",
      });
  }
};

// Sign-in Functionality
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { status, response } = handleValidationErrors(errors);
    await logAction(
      "Login Attempt Failed",
      null,
      `Validation errors: ${JSON.stringify(errors.array())}`,
      "failure"
    );
    return res.status(status).json(response);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      await logAction(
        "Login Attempt Failed",
        null,
        `User not found for email: ${email}`,
        "failure"
      );
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isActive) {
      await logAction(
        "Login Attempt Failed",
        user.id,
        `User not Active for email: ${email}`,
        "failure"
      );
      return res.status(400).json({ message: "User not Active" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAction(
        "Login Attempt Failed",
        user.id,
        `Invalid credentials for email: ${email}`,
        "failure"
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      await logAction(
        "Login Attempt Failed",
        user.id,
        `User not verified for email: ${email}`,
        "failure"
      );
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = generateToken(user.id);
    await logAction(
      "User Logged In",
      user.id,
      `User logged in: ${email}`,
      "success"
    );

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    await logAction(
      "Login Attempt Failed",
      null,
      `Server error during login: ${error.message}`,
      "failure"
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Email Verification
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.isActive = true;
    await user.save();

    await logAction(
      "Email Verification",
      user.id,
      `User with email: ${user.email} verified their account`
    );

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    await logAction(
      "Email Verification Failed",
      null,
      "Failed email verification",
      "failure"
    );
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};

module.exports = { register, login, verifyEmail };
