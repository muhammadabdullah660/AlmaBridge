const nodeMailer = require("nodemailer");
const VerificationCode = require('../models/VerificationCode');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const crypto = require('crypto');
const logAction = require('./logService');



const generateVerificationCode = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
};


const verifyCode = async (userId, code) => {
  try {
    const verificationCode = await VerificationCode.findOne({ where: { userId } });

    // If no verification code is found for the user
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


const sendVerificationEmail = async (userId, email) => {
  try{

    // Check if the verification for corresponding userId Exist so, we delete it first. May be the user want to resend verification code.
    await verificationCode.destroy({ where: {userId} });

    //GENERATE SECURE VERIFICATION CODE
    const verificationCode = generateVerificationCode(8);

    await VerificationCode.create({
      userId,
      code: verificationCode,
      expiry: new Date(Date.now() + 10 * 60 * 1000),
    });
    
    await logAction("Verification Code Generate", userId, `A verification Code is generated for the user whose userID is ${userId}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
          }
          .header {
            margin-bottom: 20px;
            color: #4b6cb7;
          }
          .header h2 {
            font-size: 24px;
            font-weight: bold;
          }
          .verification-code {
            background-color: #f3f7fb;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            border: 2px solid #d3e2f7;
            border-radius: 5px;
            color: #4b6cb7;
          }
          .expiry-info {
            margin-top: 10px;
            font-size: 14px;
            color: #999999;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #999999;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h2>Welcome to AlmaBridge!</h2>
            <p>We’re excited to have you onboard.</p>
          </div>

          <p>Please verify your email address to complete your registration process. Below is your unique verification code:</p>
          
          <div class="verification-code">
            <strong>${verificationCode}</strong>
          </div>

          <p class="expiry-info">This code will expire in 10 minutes, so be sure to use it soon!</p>

          <p>If you didn't request this verification code, you can safely ignore this email.</p>

          <div class="footer">
            <p>If you have any issues or need assistance, feel free to contact our support team.</p>
            <p>Thank you for choosing AlmaBridge!</p>
            <p><small>© 2024 AlmaBridge. All rights reserved.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailPassword = process.env.TITAN_SENDER_PASSWORD;
    const smtpServer = process.env.SMTP_SERVER;
    const smtpPort = process.env.SMTP_PORT;
    const senderEmail = process.env.TITAN_SENDER_MAIL;

    // VALIDATE ENVIRONMENT VARIABLES
    if (!emailPassword || !smtpServer || !smtpPort || !senderEmail) {
      throw new Error("Missing email configuration in environment variables.");
    }

    const transporter = nodeMailer.createTransport({
      host: smtpServer,
      port: smtpPort,
      secure: true,
      auth: {
        user: senderEmail,
        pass: emailPassword
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: "Account Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    await logAction("Verification Mail Send", userId, `A verification mail sent to user email whose email is ${email} and it's userID is ${userId}`);
    return true;

  } catch (error) {
    await logAction("Failed Verification Code", userId, error.message, "failure");
    return false;
  }
};


module.exports = { sendVerificationEmail, verifyCode };
