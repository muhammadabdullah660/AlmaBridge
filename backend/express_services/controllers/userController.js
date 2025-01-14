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
    if (!errors.isEmpty()) {
        const { status, response } = handleValidationErrors(errors);
        await logAction("User Registration Failed", null, `Validation errors: ${JSON.stringify(errors.array())}`, "failure");
        return res.status(status).json(response);
    }

    const { firstName, lastName, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            isActive: true,
        });
        
        const userId = user.id;
        
        const isMailSend = await sendVerificationEmail(userId, email);
        if (!isMailSend) {
            await User.destroy({where: {userId} });
            await logAction(
                "Verification Email Failed",
                user.id,
                `Issue While Sending Verification Mail`,
                "failure"
            );

            return res.status(400).json({
                message: "Issue While Sending Verification Mail",
            });
        }

        await logAction("User Registration", user.id, `New user registered with email: ${email}`);
        const userProfileData = {
            userId: user.id,
            ...(role === "student" && { secondaryEmail: req.body.studentEmail }), // Add secondaryEmail only if role is "student"
        };
        
        await UserProfile.create(userProfileData);
        
        const token = generateToken(user.id);
        return res.status(201).json({ message: "User Registered Successfully.", token: token });
    } catch (error) {
        await logAction("User Registration Failed", null, error.message, "failure");
        return res.status(500).json({
            message: "Server error",
            error: error.message || "An unexpected error occurred",
        });
    }
};



const login = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
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
        return res.status(200).json({ message: "Logged In Successfully", token: token, isVerified: user.isVerified });
    }
    catch (error) {
        await logAction("Login Attempt Failed", null, `Server error during login: ${error.message}`, "failure");
        return res.status(500).json({message: "Server error", error: error.message});
    }
};


const verifyAccount = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction("Account Verification Attempt Failed", null, `Validation errors: ${JSON.stringify(errors.array())}`, "failure");
        return res.status(status).json(response);
    }
    
    try{
        const { userId, verificationCode } = req.body;
        const user = await User.findByPk(userId);
        if(!user) {
            await logAction("Account Verification Failed", userId, "User Not Found Who try to Verify Account", "failed");
            return res.status(400).json({ message: "Invalid User" });
        }

        const result = await verifyCode(userId, verificationCode);
        if(!result.success) {
            await logAction("Account Verification Failed", userId, result.message, "failure");
            return res.status(400).json({ message: result.message });
        }

        user.isVerified = true;
        await user.save();

        await logAction("Account Verified", userId, `User with email: ${user.email} verified their account`);
        return res.status(200).json({ message: "Account verified successfully!" });
    } catch(error) {
        await logAction("Account Verification Failed", userId, "Failed Email Verification", "failure");
        return res.status(500).json({ message: error.message });
    }
}


const reSendVerificationCode = async (req, res) => {
    
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
            return res.status(400).json({ message: "Issue While Sending Verification Mail" });
        }
        return res.status(200).json({ message: "Verification Code Email Resend Successfully!" });
    } catch(error) {
        await logAction("Verification Mail Failed", userId, "Failed Email Verification", "failure");
        return res.status(500).json({ message: error.message });
    }
};


const getUser = async (req, res) => {
    const { userId } = req.body;
    try{
        const user = await User.findByPk(userId);
        if(!user || !user.isActive) {
            return res.status(404).json({ message: "User Not Found" });
        }
        await logAction("User Retrieve Successful", userId, `ID: ${userId} get the user Data`);
        return res.status(200).json({ user });
    } catch(error) {
        await logAction("User Data Retrieval Failed", userId, "Error Occur's While Retrieve User Data", "failure");
        return res.status(500).json({ message: error.message });
    }
};


const updateUser = async (req, res) => {
    // Extract userId and omit it from updateData
    const { userId, ...updateData } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            await logAction("User Retrieval Failed", userId, "Error Occured while Update the User Data", "failure");
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Update the user with new data
        await user.update(updateData);
        await logAction("User Data Update", userId, "User Data Updated Successfully");
    
        // Return the updated user
        return res.status(200).json({
            message: 'User updated successfully',
            user,
        });
  
    } catch (error) {
        await logAction("User Updation Failed", userId, "Error Occured while Update the User Data", "failure");
        return res.status(500).json({
            message: 'An error occurred while updating the user',
            error: error.message,
        });
    }
};


const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try{
        const user = await User.findByPk(userId);
        if (!user) {
            await logAction("User Retrieval Failed", userId, "Error Occured while Deleting the User Data", "failure");
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = false;
        await user.save();
        await logAction("User Data Delete", userId, "User Data Deleted Successfully!");
        return res.status(204).json({ message: "User Data Deleted Succesfully" });
    } catch (error) {
        await logAction("User Deletion Failed", userId, "Error Occured while Deleting the User Data", "failure");
        return res.status(500).json({
            message: 'An error occurred while deleting the user',
            error: error.message,
        });
    }
};



const destroyUser = async (req, res) => {
    const { userId } = req.body;
    try{
        await User.destroy({ where: { userId } });
        return res.status(204).json({
            message: "Data Deleted From the database Successfully",
        });
    } catch (error) {
        await logAction("User Destroy Failed", userId, "Error Occured while Destroy the User Data", "failure");
        return res.status(500).json({
            message: 'An error occurred while deleting the user',
            error: error.message,
        });
    }
};

module.exports = {register, login, verifyAccount, reSendVerificationCode, getUser, updateUser, deleteUser, destroyUser};