import nodemailer from "nodemailer";
import crypto from "crypto";

// Optional Twilio client for SMS; lazily constructed when needed
let twilioClient = null;
const getTwilioClient = async () => {
  if (twilioClient) return twilioClient;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
  try {
    const twilioModule = await import("twilio");
    twilioClient = twilioModule.default(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN
    );
    return twilioClient;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Twilio init failed; SMS will be skipped.");
    return null;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmailOtp = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  });
};

const sendSmsOtp = async (phoneNumber, otp) => {
  const client = await getTwilioClient();
  if (!client) return; // no-op if Twilio not configured
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) return;
  await client.messages.create({
    to: phoneNumber,
    from: fromNumber,
    body: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  });
};

export const sendOtp = async (user) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Try email first; if it fails, throw error. SMS is best-effort.
  await sendEmailOtp(user.email, otp);

  try {
    if (user.phone) {
      await sendSmsOtp(user.phone, otp);
    }
  } catch (smsErr) {
    // eslint-disable-next-line no-console
    console.warn("Failed to send OTP via SMS:", smsErr?.message || smsErr);
  }
};
