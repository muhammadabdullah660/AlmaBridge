const User = require("../models/User");
const emailQueue = require("../utils/queue");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logService");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const { verifyCode, verifyResetToken, checkEmailValidity } = require("../utils/mailService");
const { handleValidationErrors } = require('../utils/errorHandler');
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
    console.log(userId);
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "4h"});
};

const handleError = async (res, error, action, userId = null) => {
    await logAction(action, userId, error.message, "failure");
    return res.status(500).json({ message: "Server error", error: error.message });
}


//REGISTER USER
const register = async (req, res) => {
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
    const { firstName, lastName, email, password, role, studentEmail } = req.body;

    const transaction = await sequelize.transaction();
    try {
        const [user, created] = await User.findOrCreate({
            where: {email},
            defaults: {
                firstName,
                lastName,
                email,
                password: await hashPassword(password),
                role,
                isActive: true,
            },
            transaction
        });

        if (!created) {
            await logAction("User Registration Failed", null, `User already exists: ${email}`, "failure");
            return res.status(409).json({ message: "User Already Exists" });
        }
        
        const userProfileData = {
            userId: user.id,
            ...(role === "student" && { secondaryEmail: studentEmail }),
        };

        await UserProfile.create(userProfileData, { transaction });

        await emailQueue.add({userId: user.id, email, type: 'verification'});

        await transaction.commit();
        await logAction(
            "User Registration",
            user.id,
            `New user registered successfully: ${email}`,
            "success"
        );

        const token = generateToken(user.id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 14400 * 1000,
            path: '/'
        });

        return res.status(201).json({isVerified: user.isVerified, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email});
    } catch (error) {
        if (transaction) await transaction.rollback();
        return handleError(res, error, "User Registration Failed");
    }
};



// Login User
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 14400 * 1000,
            path: '/',
        });
        await logAction("User Logged In", user.id, `User Logged In: ${email}`, "success");
        return res.status(200).json({ isVerified: user.isVerified, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email });
    }
    catch (error) {
        return handleError(res, error, "Login Attempt Failed");
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
        return handleError(res, error, "Account Verification Failed", req.body.userId);
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
        await emailQueue.add({ userId, email: user.email, type: 'verification'});
        return res.status(200).json({ message: "Verification Code Email Resend Successfully!" });
    } catch(error) {
        return handleError(res, error, "Verification Mail Failed", userId);
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
        return res.status(200).json({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
    } catch(error) {
        return handleError(res, error, "User Data Retrieval Failed", userId);
    }
};


const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction(
            "Forgot Password Failed",
            null,
            "Email not provided in the request.",
            "failure"
        );
        return res.status(status).json(response);
    }

    const { email } = req.body;
    console.log('Request Made for Forgot Password Processing');

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            await logAction(
                "Forgot Password Failed",
                null,
                `User Not Found of Provided Email: ${email}`,
                "failure"
            );
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        console.log('USER FOUND SEXFULLY');
        console.log('Adding job to email queue:', { userId: user.id, email, type: 'password_reset' });

        await emailQueue.add({ userId: user.id, email, type: 'password_reset' });

        console.log('Job added to email queue');

        await logAction(
            "Forgot Password Email Sent",
            user.id,
            `Password reset email sent successfully to ${email}.`,
            "success"
        );

        return res.status(200).json({ message: "Password reset email sent successfully. Please check your inbox."});
    } catch (error) {
        return handleError(res, error, "Email Validation Failed");
    }

}

const validateResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction(
            "Reset Password Validation Failed",
            null,
            "Reset Token not provided in the request.",
            "failure"
        );
        return res.status(status).json(response);
    }
    try{
        const { resetToken } = req.body;
        const result = await verifyResetToken(resetToken);
        if(!result.success) {
            return res.status(400).json({isLinkValid: false, message: "Link is not valid" });
        }
        return res.status(200).json({ isLinkValid: true, userId: result.userId });
    } catch (error) {
        return handleError(res, error, "Reset Password Validation Failed");
    }
};



const updatePassword = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const {status, response} = handleValidationErrors(errors);
        await logAction(
            "Forgot Password Failed",
            null,
            "UserId or Password not provided in the request.",
            "failure"
        );
        return res.status(status).json(response);
    }

    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ where: { id: userId } });

        const hashedPassword = await hashPassword(password);

        await user.update({ password: hashedPassword });

        await logAction(
            "Password Change Success",
            userId,
            "User password changed successfully.",
            "success"
        );

        return res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        return handleError(res, error, "Forgot Password Failed");
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
        return handleError(res, error, "User Deletion Failed", userId);
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
        return handleError(res, error, "User Destroy Failed", userId);
    }
};



const getUserWithProfile = async (req, res) => {
    try{
        const { userId } = req.body;

        const user = await User.findOne({
            where: {id: userId},
            include: {
                model: UserProfile,
                as: "profile",
                attributes: ["profileImage"],
            },
            attributes: ["firstName", "email"],
        });

        if (!user) {
            return res.status(404).json({message: "User not Found"});
        }

        return res.status(200).json(user);
    } catch(error) {
        return handleError(res, error, "User Data Retrieval Failed");
    }
};



module.exports = {register, login, verifyAccount, reSendVerificationCode, getUser, deleteUser, destroyUser, updatePassword, forgotPassword, validateResetPassword, getUserWithProfile};