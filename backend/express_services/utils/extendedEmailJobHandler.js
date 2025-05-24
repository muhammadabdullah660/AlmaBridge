const originalProcessEmail = require('./emailJobHandler');
const nodeMailer = require('nodemailer');
const logAction = require('./logService');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const createTransporter = () => {
  const emailPassword = process.env.TITAN_SENDER_PASSWORD;
  const smtpServer = process.env.SMTP_SERVER;
  const smtpPort = process.env.SMTP_PORT;
  const senderEmail = process.env.TITAN_SENDER_MAIL;

  if (!emailPassword || !smtpServer || !smtpPort || !senderEmail) {
    throw new Error("Missing email configuration in environment variables.");
  }

  return nodeMailer.createTransport({
    host: smtpServer.trim(),
    port: parseInt(smtpPort),
    secure: true,
    auth: {
      user: senderEmail.trim(),
      pass: emailPassword,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

const getEventCreationEmailTemplate = (eventTitle, eventId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
      <div style="background: linear-gradient(90deg, #007BFF, #00C4FF); padding: 20px; text-align: center;">
        <img src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="AlmaBridge Logo" style="max-width: 150px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 10px 0;">🎉 New Event Alert!</h1>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-size: 20px;">Hello AlmaBridge User,</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          We're excited to announce a new event: <strong>"${eventTitle}"</strong>!
          Join us to connect with students, alumni, and the university community.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Ready to participate? Check out the details and RSVP now!
        </p>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">
          🕒 Don’t miss out—this event is your chance to engage and inspire!
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
        <p>© 2025 AlmaBridge. All rights reserved.</p>
        <p>Need help? <a href="mailto:noreply.almabridge@gmail.com" style="color: #007BFF; text-decoration: none;">Contact Support</a></p>
      </div>
    </div>
  `;
};

const getEventUpdateEmailTemplate = (eventTitle, eventId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
      <div style="background: linear-gradient(90deg, #28A745, #34C759); padding: 20px; text-align: center;">
        <img src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="AlmaBridge Logo" style="max-width: 150px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 10px 0;">📢 Event Update!</h1>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-size: 20px;">Hello AlmaBridge User,</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          The event <strong>"${eventTitle}"</strong> has been updated with new details.
          Stay in the loop and check out what’s changed!
        </p>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">
          📅 Keep your calendar ready for this exciting event!
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
        <p>© 2025 AlmaBridge. All rights reserved.</p>
        <p>Need help? <a href="mailto:noreply.almabridge@gmail.com" style="color: #28A745; text-decoration: none;">Contact Support</a></p>
      </div>
    </div>
  `;
};

const getEventDeletionEmailTemplate = (eventTitle, eventId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
      <div style="background: linear-gradient(90deg, #DC3545, #FF6B6B); padding: 20px; text-align: center;">
        <img src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="AlmaBridge Logo" style="max-width: 150px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 10px 0;">🔔 Event Cancelled</h1>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-size: 20px;">Hello AlmaBridge User,</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          We’re sorry to inform you that the event <strong>"${eventTitle}"</strong> has been cancelled.
          Thank you for your understanding.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Have questions? Our support team is here to help.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="mailto:noreply.almabridge@gmail.com" style="background-color: #DC3545; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: inline-block;">Contact Support</a>
        </div>
      </div>
      <div style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
        <p>© 2025 AlmaBridge. All rights reserved.</p>
      </div>
    </div>
  `;
};

const getEventAttendanceEmailTemplate = (eventTitle, eventId, attendeeName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
      <div style="background: linear-gradient(90deg, #FFC107, #FFD700); padding: 20px; text-align: center;">
        <img src="https://almabridgeworker.muhammadshahzaibijaz34.workers.dev/almabridgeLogo.png" alt="AlmaBridge Logo" style="max-width: 150px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 10px 0;">🎟️ Attendance Confirmed!</h1>
      </div>
      <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-size: 20px;">Hello AlmaBridge User,</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Great news! ${attendeeName} has registered for the event <strong>"${eventTitle}"</strong>.
          Get ready for an amazing experience!
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
         View event details on AlmaBridge.
        </p>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">
          🌟 We can’t wait to see you there!
        </p>
      </div>
      <div style="text-align: center; padding: 10px; color: #777; font-size: 12px;">
        <p>© 2025 AlmaBridge. All rights reserved.</p>
        <p>Need assistance? <a href="mailto:noreply.almabridge@gmail.com" style="color: #FFC107; text-decoration: none;">Contact Support</a></p>
      </div>
    </div>
  `;
};


const processEmail = async (job) => {
  const { userId, email, type, eventId, eventTitle, attendeeId } = job.data;

  try {
    if (type === 'verification' || type === 'password_reset') {
      return await originalProcessEmail(job);
    }

    let emailContent;
    switch (type) {
      case 'event_creation':
        emailContent = {
          subject: `New Event Created: ${eventTitle}`,
          html: getEventCreationEmailTemplate(eventTitle, eventId),
        };
        break;
      case 'event_update':
        emailContent = {
          subject: `Event Updated: ${eventTitle}`,
          html: getEventUpdateEmailTemplate(eventTitle, eventId),
        };
        break;
      case 'event_deletion':
        emailContent = {
          subject: `Event Deleted: ${eventTitle}`,
          html: getEventDeletionEmailTemplate(eventTitle, eventId),
        };
        break;
      case 'event_attendance':
        const attendee = await User.findByPk(attendeeId);
        emailContent = {
          subject: `Attendance Registered for ${eventTitle}`,
          html: getEventAttendanceEmailTemplate(eventTitle, eventId, attendee.firstName),
        };
        break;
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }

    const transporter = createTransporter();
    await transporter.verify();

    const mailOptions = {
      from: process.env.TITAN_SENDER_MAIL,
      to: email,
      ...emailContent,
    };

    await transporter.sendMail(mailOptions);

    await logAction(
      `${type.charAt(0).toUpperCase() + type.slice(1)} Email Sent`,
      userId,
      `A ${type} email was sent to ${email} for event ${eventTitle} (ID: ${eventId})`,
      'success'
    );
  } catch (error) {
    console.error('Email sending error:', error);
    await logAction(
      `Failed ${type} Email`,
      userId,
      `Failed to send ${type} email to ${email}: ${error.message}`,
      'failure'
    );
    throw error;
  }
};

module.exports = processEmail;