const nodeMailer = require("nodemailer");
const VerificationCode = require('../models/VerificationCode');
const crypto = require('crypto');
const logAction = require('./logService');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// function will generate verification code with length of 6 character
const generateVerificationCode = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
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


const sendVerificationEmail = async (userId, email) => {
  try{

    // Check if the verification for corresponding userId Exist so, we delete it first. May be the user want to resend verification code.
    await VerificationCode.destroy({ where: {userId} });

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
          <title>Verify Your Email</title>
          <style>
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
              }

              @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
              }

              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  line-height: 1.6;
                  background-color: #f5f7fa;
                  margin: 0;
                  padding: 20px;
                  color: #2d3748;
              }

              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: linear-gradient(145deg, #ffffff, #f8fafc);
                  border-radius: 16px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                              0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  overflow: hidden;
                  animation: fadeIn 0.8s ease-out;
              }

              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  padding: 40px 20px;
                  text-align: center;
                  color: white;
              }

              .logo-container {
                  width: 140px;
                  height: 140px;
                  margin: 0 auto -30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }

              .logo-image {
                  max-width: 100%;
                  height: auto;
                  border-radius: 10px;
              }

              .content {
                  padding: 40px 30px;
                  text-align: center;
              }

              .title {
                  font-size: 24px;
                  font-weight: 700;
                  margin-bottom: 16px;
                  color: #1a202c;
              }

              .description {
                  color: #4a5568;
                  margin-bottom: 32px;
                  font-size: 16px;
              }

              .verification-code {
                  background: linear-gradient(145deg, #f7fafc, #edf2f7);
                  border-radius: 12px;
                  padding: 20px;
                  margin: 20px 0;
                  font-size: 32px;
                  letter-spacing: 8px;
                  font-weight: 700;
                  color: #2d3748;
                  animation: pulse 2s infinite;
                  display: inline-block;
              }

              .expiry-notice {
                  color: #e53e3e;
                  font-size: 14px;
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 5px;
              }

              .divider {
                  height: 1px;
                  background: linear-gradient(to right, transparent, #cbd5e0, transparent);
                  margin: 32px 0;
              }

              .footer {
                  background-color: #f8fafc;
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #718096;
              }

              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  margin-top: 20px;
                  transition: transform 0.2s;
              }

              .button:hover {
                  transform: translateY(-2px);
              }

              .support-text {
                  font-size: 14px;
                  color: #718096;
                  margin-top: 16px;
              }

              @media (max-width: 600px) {
                  body {
                      padding: 10px;
                  }
                  
                  .container {
                      border-radius: 8px;
                  }

                  .header {
                      padding: 30px 15px;
                  }

                  .logo-container {
                      width: 120px;
                      height: 120px;
                  }

                  .content {
                      padding: 30px 20px;
                  }

                  .verification-code {
                      font-size: 24px;
                      letter-spacing: 6px;
                      padding: 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo-container">
                      <!-- Replace the src with your Cloudflare Workers image URL -->
                      <img class="logo-image" src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="Company Logo">
                  </div>
                  <h1 style="font-size: 28px; margin-bottom: 10px;line-height: normal;">Welcome to Almabridge!</h1>
                  <p style="opacity: 0.9">We're excited to have you join us</p>
              </div>
              
              <div class="content">
                  <h2 class="title">Verify Your Email Address</h2>
                  <p class="description">
                      To complete your registration and ensure the security of your account, 
                      please enter the verification code below:
                  </p>

                  <div class="verification-code">
                      ${verificationCode}
                  </div>

                  <p class="expiry-notice">
                      <span>⏰</span>
                      <span>This code will expire in 10 minutes</span>
                  </p>

                  <div class="divider"></div>

                  <p class="support-text">
                      If you didn't request this verification code, please ignore this email or 
                      contact our support team if you have concerns.
                  </p>

                  <a href="#" class="button">Visit Our Help Center</a>
              </div>

              <div class="footer">
                  <p style="margin-bottom: 10px;">&copy; 2024 Almabridge. All rights reserved.</p>
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

    if (error.code === "EENVELOPE") {
      await logAction("Invalid Email Address", userId, `Email address ${email} is invalid or undeliverable. Error: ${error.message}`,
      "failure"
      );
    } else if (error.response && error.response.includes("550")) {
      await logAction("Undeliverable Email", userId, `Failed to deliver email to ${email}: ${error.response}`, "failure");  
    } else {
      await logAction("Failed Verification Code", userId, `Unexpected error: ${error.message}`, "failure");
    }
    return false;
  }
};


const sendForgotPasswordMail = async (userId, email) => {

  try{

    await VerificationCode.destroy({ where: {userId} });

    const verificationCode = generateVerificationCode(8);

    await VerificationCode.create({
      userId,
      code: verificationCode,
      expiry: new Date(Date.now() + 30 * 60 * 1000),
    });


    const resetUrl = `http://localhost:3000/forgot-password?resetToken=${verificationCode}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  line-height: 1.6;
                  background-color: #f5f7fa;
                  margin: 0;
                  padding: 20px;
                  color: #334155;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
              }

              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 16px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }

              .header {
                  background: #2563EB;
                  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
                  padding: 40px 20px;
                  text-align: center;
                  color: white;
              }

              .header h1 {
                  font-size: 32px;
                  letter-spacing: -0.5px;
                  margin-bottom: 10px;
              }

              .header p {
                  font-size: 16px;
                  opacity: 0.9;
              }

              .logo-container {
                  width: 120px;
                  height: 120px;
                  margin: 0 auto -20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }

              .logo-image {
                  max-width: 100%;
                  height: auto;
                  margin-left: -5px;
              }

              .content {
                  padding: 40px 30px;
                  text-align: center;
                  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
              }

              .security-notice {
                  background-color: #F0F9FF;
                  border: 1px solid #BAE6FD;
                  border-radius: 8px;
                  padding: 15px;
                  margin: 20px 0;
                  text-align: left;
              }

              .security-notice h3 {
                  color: #0369A1;
                  font-size: 16px;
                  margin-bottom: 8px;
              }

              .security-notice p {
                  font-size: 14px;
                  color: #0C4A6E;
                  margin: 5px 0;
              }

              .reset-button {
                  display: inline-block;
                  padding: 16px 32px;
                  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                  font-size: 16px;
                  margin: 25px 0;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border: 1px solid rgba(255, 255, 255, 0.1);
              }

              .expiry-notice {
                  color: #0369A1;
                  font-size: 14px;
                  margin-top: 12px;
                  display: block;
              }

              .divider {
                  height: 1px;
                  background: linear-gradient(to right, transparent, #E2E8F0, transparent);
                  margin: 32px 0;
              }

              .info-box {
                  background-color: #F8FAFC;
                  border: 1px solid #E2E8F0;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
                  text-align: left;
              }

              .info-box h3 {
                  color: #1E293B;
                  font-size: 16px;
                  margin-bottom: 10px;
              }

              .info-box ul {
                  font-size: 14px;
                  color: #475569;
                  margin-left: 20px;
                  line-height: 1.8;
              }

              .footer {
                  background-color: #F8FAFC;
                  border-top: 1px solid #E2E8F0;
                  padding: 24px 20px;
                  text-align: center;
              }

              .footer p {
                  font-size: 13px;
                  color: #64748B;
                  margin-bottom: 8px;
              }

              @media (max-width: 600px) {
                  body {
                      padding: 10px;
                  }
                  
                  .container {
                      border-radius: 8px;
                  }

                  .header {
                      padding: 30px 15px;
                  }

                  .header h1 {
                      font-size: 28px;
                  }

                  .logo-container {
                      width: 100px;
                      height: 100px;
                  }

                  .content {
                      padding: 30px 20px;
                  }

                  .reset-button {
                      padding: 14px 28px;
                      font-size: 15px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo-container">
                      <!-- Replace with your Cloudflare Workers image URL -->
                      <img class="logo-image" src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="Company Logo">
                  </div>
                  <h1>Reset Your Password</h1>
                  <p>We've received a request to reset your password</p>
              </div>
              
              <div class="content">
                  <div class="security-notice">
                      <h3>🔒 Security Notice</h3>
                      <p>A password reset was requested for your account.</p>
                      <p>If you didn't make this request, please contact our support team immediately.</p>
                  </div>

                  <p style="font-size: 16px; color: #334155;">Click the secure button below to reset your password:</p>

                  <a href="${resetUrl}" class="reset-button" target="_blank">
                      Reset Password
                  </a>

                  <p class="expiry-notice">
                      ⏰ This secure link expires in 30 minutes
                  </p>

                  <div class="divider"></div>

                  <div class="info-box">
                      <h3>💡 Password Security Tips:</h3>
                      <ul>
                          <li>Use at least 12 characters</li>
                          <li>Include numbers and special characters</li>
                          <li>Avoid using personal information</li>
                          <li>Don't reuse passwords across accounts</li>
                      </ul>
                  </div>

                  <p style="font-family: Verdana; font-size: 14px; color: #475569;">
                      For your security, this password reset link can only be used once and will expire after use.
                  </p>
              </div>

              <div class="footer">
                  <p style="font-weight: bold;">&copy; 2024 Almabridge. All rights reserved</p>
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
      subject: "Reset Password",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    await logAction("Reset Password Mail Send", userId, `A verification mail sent to user email whose email is ${email} and it's userID is ${userId}`);
    return true;
  
  } catch (error) {
    if (error.response && error.response.includes("550")) {
      await logAction("Undeliverable Email", userId, `Failed to deliver email to ${email}: ${error.response}`, "failure");  
    } else {
      await logAction("Reset Password Mail Fail", userId, `Unexpected error: ${error.message}`, "failure");
    }
    return false;
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


module.exports = { sendVerificationEmail, verifyCode, sendForgotPasswordMail, verifyResetToken };
