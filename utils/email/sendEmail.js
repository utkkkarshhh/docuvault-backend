const nodemailer = require("nodemailer");
const env = require("../dotenvConfig");

if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASSWORD
) {
  throw new Error(
    "Missing required environment variables for SMTP configuration"
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function main(emailFrom, emailTo, emailSubject, emailText, emailHtml) {
  try {
    const info = await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    console.log("Message sent: %s", info.messageId);
    
    return {
      success: true,
      message: `Email ${info.messageId} sent successfully!`
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    
    return {
      success: false,
      message: `Failed to send email: ${error.message}`
    };
  }
}

module.exports = main;