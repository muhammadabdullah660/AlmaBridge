const nodemailer = require("nodemailer");
const VerificationCode = require('../models/VerificationCode');
const logAction = require('./logService');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const checkEmailValidity = async (email) => {
  const emailPassword = process.env.TITAN_SENDER_PASSWORD;
  const smtpServer = process.env.SMTP_SERVER;
  const smtpPort = process.env.SMTP_PORT;
  const senderEmail = process.env.TITAN_SENDER_MAIL;

  // Validate environment variables
  if (!emailPassword || !smtpServer || !smtpPort || !senderEmail) {
    console.error('Missing email configuration in environment variables.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpServer.trim(),
      port: parseInt(smtpPort),
      secure: true,
      auth: {
        user: senderEmail.trim(),
        pass: emailPassword.trim(),
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Attempt to validate recipient email
    return new Promise((resolve) => {
      transporter.sendMail(
        {
          from: senderEmail,
          to: email,
          subject: 'Test Email Validity',
          text: 'This is a test to verify email validity.',
        },
        (error) => {
          if (error) {
            // Log error for debugging but return false
            console.error('Email validation error:', error);
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  } catch (error) {
    // Log any SMTP connection or other errors and return false
    console.error('SMTP connection or validation error:', error);
    return false;
  }
};


const verifyCode = async (userId, code) => {
  try {
    const verificationCode = await VerificationCode.findOne({ where: { userId } });

    if (!verificationCode) {
      await logAction("Email Verification Failed", userId, "No verification code found for the user", "failure");
      return { success: false, message: "Verification code not found." };
    }

    const currentTime = new Date();
    const expiryTime = new Date(verificationCode.expiry);

    // Check if the code is expired
    if (currentTime > expiryTime) {
      await logAction("Email Verification Failed", userId, "The verification code has expired", "failure");
      return { success: false, message: "Verification code has expired." };
    }

    // Check if the verification code matches
    if (verificationCode.code !== code) {
      await logAction("Email Verification Failed", userId, "The verification code did not match", "failure");
      return { success: false, message: "Verification code does not match." };
    }

    // Log success and delete the verification code from the database
    await logAction("Email Verification Successful", userId, "The verification code was successfully verified", "success");

    // Delete the verification code from the database after successful verification
    await VerificationCode.destroy({ where: { userId } });

    return { success: true, message: "Verification successful." };

  } catch (error) {
    console.error('Error during verification:', error);
    return { success: false, message: "An error occurred during verification." };
  }
};



const verifyResetToken = async (code) => {
  try{
    const verificationCode = await VerificationCode.findOne({ where: {code} });

    if(!verificationCode) {
      return { success: false, message: "No Link Found", userId: false};
    }

    const currentTime = new Date();
    const expiryTime = new Date(verificationCode.expiry);

    if (currentTime < expiryTime) {
      return { success: true, message: "Link is valid", userId: verificationCode.userId };
    }

    return { success: false, message: "Link is Expired", userId: null };

  } catch (error) {
    console.error('Error during verification:', error);
    return { success: false, message: "An error occurred during verification." };
  }
};


module.exports = { verifyCode, verifyResetToken, checkEmailValidity };
