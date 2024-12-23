const mailgun = require("mailgun-js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:5000/api/verify-email?token=${token}`;
  console.log(verificationLink);
  const data = {
    from: process.env.MAILGUN_SENDER_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `
            <h2>Email Verification</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email = ${verificationLink}</a>
        `,
  };

  return mg
    .messages()
    .send(data)
    .then((body) => console.log("Email sent:", body))
    .catch((err) => console.log("Mailgun error:", err));
};

module.exports = { sendVerificationEmail };
