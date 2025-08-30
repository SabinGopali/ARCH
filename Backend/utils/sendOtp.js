import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtp = async (user) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  // Only persist OTP if email send succeeds — prevents OTPs for fake emails
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  });

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
};
