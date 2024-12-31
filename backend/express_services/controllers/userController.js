const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logService");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const { sendVerificationEmail, verifyCode } = require("../utils/mailService");
const UserProfile = require("../models/UserProfile");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


//FUNCTION TO HASH PASSWORD
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};


//FUNCTION TO CREATE JWT TOKEN
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//FUNCTION TO HANDLE VALIDATION ERRORS
const handleValidationErrors = (errors) => {
    return { status: 400, response: { errors: errors.array() } };
};

//REGISTER USER
const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const { status, response } = handleValidationErrors(errors);
        await logAction("User Registration Failed", null, `Validation errors: ${JSON.stringify(errors.array())}`, "failure");
        return res.status(status).json(response);
    }


    const {firstName, lastName, email, password, role} = req.body;
    try {
        const existingUser = await User.findOne({ where: {email}});
        if (existingUser) { return res.status(400).json({ message: "User Already Exists" });}

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            isActive: true
        });

        await logAction("User Registration", user.id, `New user registered with email: ${email}`);
        const isMailSend = await sendVerificationEmail(user.id, email);
        if(!isMailSend) {
            await logAction("Verification Email Failed", user.id, `User Account Successfully Created But Issue While Sending Verification Mail`, "failure");
            res.status(400).json({ message: "User Account Successfully Created But Issue While Sending Verification Mail" });
        }

        if (role == "student") {
            const { studentEmail } = req.body;
            await UserProfile.create({
                userId: user.id,
                secondaryEmail: studentEmail,
                primaryEmail: email,
            });
        }
        const token = generateToken(user.id);
        res.status(201).json({ message: "User Registered Successfully.", token: token });
    }
    catch (error) {
        await logAction("User Registration Failed", null, error.message, "failure");
        res.status(500).json({ message: "Server error", error: error.message || "An unexpected error occurred" });
    }
};


const login = async (req, res) => {
    const errors = validationResult(req);
    if(!error.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction("Login Attempt Failed", null, `Validation errors: ${JSON.stringify(errors.array())}`, "failure");
        return res.status(status).json(response);
    }

    const { email, password } = req.body;

    try{
        const user = await User.findOne({ where: { email } });
        if(!user) {
            await logAction("Login Attempt Failed", null, `User Not Found for email: ${email}`, "failure");
            return res.status(404).json({ message: "User Not Found" });
        }

        if(!user.isActive) {
            await logAction("Login Attempt Failed", user.id, `User not Active for email: ${email}`, "failure");
            return res.status(400).json({ message: "User Not Active" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            await logAction("Login Attempt Failed", user.id, `Invalid Credentials for email: ${email}`, "failure");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = generateToken(user.id);
        await logAction("User Logged In", user.id, `User Logged In: ${email}`, "success");
        res.status(200).json({ message: "Logged In Successfully", token: token, isVerified: user.isVerified });
    }
    catch (error) {
        await logAction("Login Attempt Failed", null, `Server error during login: ${error.message}`, "failure");
        res.status(500).json({message: "Server error", error: error.message});
    }
};


const verifyAccount = async (req, res) => {

    const { userId, verificationCode } = req.body;

    try{
        const user = await User.findByPk(userId);
        if(!user) {
            await logAction("Account Verification Failed", userId, "User Not Found Who try to Verify Account", "failed");
            return res.status(400).json({ message: "Invalid User" });
        }

        const result = await verifyCode(userId, verificationCode);
        if(!result.success) {
            await logAction("Account Verification Failed", userId, result.message, "failure");
            res.status(400).json({ message: result.message });
        }

        user.isVerified = true;
        await user.save();

        await logAction("Account Verified", userId, `User with email: ${user.email} verified their account`);
        res.status(200).json({ message: "Account verified successfully!" });
    } catch(error) {
        await logAction("Account Verification Failed", userId, "Failed Email Verification", "failure");
        res.status(500).json({ message: error.message });
    }
}


const reSendVerificationCode = async (req, res) => {
    
    const errors = validationResult(req);
    if(!error.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction("Account Verification Attempt Failed", null, `Validation errors: ${JSON.stringify(errors.array())}`, "failure");
        return res.status(status).json(response);
    }
    
    const { userId } = req.body;
    try{
        const user = await User.findByPk(userId);
        if(!user) {
            await logAction("Verification Code Resend Failed", userId, "User Not Found Who try to Verify Account", "failed");
            return res.status(400).json({ message: "Invalid User" });
        }
        const isMailSend = await sendVerificationEmail(userId, user.email);
        if(!isMailSend) {
            await logAction("Verification Email Failed", user.id, `Issue While Sending Verification Mail`, "failure");
            res.status(400).json({ message: "Issue While Sending Verification Mail" });
        }
        res.status(200).json({ message: "Verification Code Email Resend Successfully!" });
    } catch(error) {
        await logAction("Verification Mail Failed", userId, "Failed Email Verification", "failure");
        res.status(500).json({ message: error.message });
    }
};


module.exports = {register, login, verifyAccount, reSendVerificationCode};