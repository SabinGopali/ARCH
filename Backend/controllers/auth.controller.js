import User from "../models/user.model.js";
import SubUser from "../models/subuser.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";

// ================== OTP STORE ==================
const otpStore = new Map(); // Stores temporary user data and OTPs

// ================== NODEMAILER ==================
let transporter = null;

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Initialize transporter
transporter = createTransporter();

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP with better error handling
const sendOtpEmail = async (email, otp) => {
  try {
    if (!transporter) {
      console.warn("SMTP not configured, using console OTP for development:");
      console.log(`OTP for ${email}: ${otp}`);
      return { success: true, development: true };
    }

    // Verify transporter connection
    await transporter.verify();

    const mailOptions = {
      from: `"Auth System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP Code for Verification",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p>Hello,</p>
          <p>Your OTP code for verification is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>Auth System</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully to:", email);
    return info;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err.message);
    
    // For development, log OTP to console
    console.log(`OTP for ${email}: ${otp}`);
    
    // Provide specific error messages
    if (err.code === 'EAUTH') {
      throw errorHandler(500, "Email authentication failed. Please check SMTP credentials.");
    } else if (err.code === 'ECONNECTION') {
      throw errorHandler(500, "Email service connection failed. Please try again later.");
    } else {
      throw errorHandler(500, "Failed to send OTP email. Please try again.");
    }
  }
};

// ================== SIGNUP ==================
export const signup = async (req, res, next) => {
  const {
    username,
    email,
    password,
    company_name,
    company_location,
    phone,
    businessTypes = [],
    isSupplier = false,
  } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "Username, email, and password are required."));
  }

  if (isSupplier && (!company_name || !company_location || !phone)) {
    return next(errorHandler(400, "Company info required for suppliers."));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return next(errorHandler(400, "Invalid email format."));

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return next(errorHandler(400, "Email or username already exists."));

    // Store user data temporarily instead of saving to database
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Create a temporary user object (not saved to DB yet)
    const tempUserData = {
      username,
      email,
      password: hashedPassword,
      company_name,
      company_location,
      phone,
      businessTypes,
      isSupplier,
      isVerified: false // Will be set to true after OTP verification
    };

    // Generate OTP and store with user data
    const otp = generateOtp();
    otpStore.set(email, { 
      otp, 
      expiresAt: Date.now() + 5 * 60 * 1000,
      userData: tempUserData  // Store the user data temporarily
    });
    
    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
      email: email
    });
  } catch (err) {
    next(err);
  }
};

// ================== VERIFY OTP ==================
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const record = otpStore.get(email);
    if (!record) return next(errorHandler(400, "No OTP found for this email."));
    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return next(errorHandler(400, "OTP expired."));
    }
    if (record.otp !== parseInt(otp)) {
      return next(errorHandler(400, "Invalid OTP."));
    }

    // OTP is valid - now save the user to database and mark as verified
    const newUser = new User({
      ...record.userData,
      isVerified: true // Mark as verified
    });
    await newUser.save();

    // Clean up
    otpStore.delete(email);
    
    res.status(201).json({ 
      success: true, 
      message: "Registration successful. You can now sign in." 
    });
  } catch (err) {
    next(err);
  }
};

// ================== RESEND OTP ==================
export const resendOtp = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(errorHandler(400, "Email is required."));

  try {
    // Check if user exists in OTP store (pending registration)
    const record = otpStore.get(email);
    if (!record) return next(errorHandler(400, "No pending registration found for this email."));

    // Generate new OTP
    const otpCode = generateOtp();
    await sendOtpEmail(email, otpCode);
    
    // Update OTP but keep the same user data
    otpStore.set(email, { 
      otp: otpCode, 
      expiresAt: Date.now() + 5 * 60 * 1000,
      userData: record.userData
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email.",
    });
  } catch (err) {
    next(err);
  }
};

// ================== RESEND VERIFICATION OTP ==================
export const resendVerificationOtp = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(errorHandler(400, "Email is required."));

  try {
    // Check if user exists but is not verified
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found."));
    
    if (user.isVerified) {
      return next(errorHandler(400, "Email is already verified."));
    }

    // Check if user data exists in otpStore
    const record = otpStore.get(email);
    if (!record || !record.userData) {
      return next(errorHandler(400, "No pending registration found. Please sign up again."));
    }

    // Generate new OTP
    const otpCode = generateOtp();
    await sendOtpEmail(email, otpCode);
    
    // Update OTP store with new OTP but keep the same user data
    otpStore.set(email, { 
      otp: otpCode, 
      expiresAt: Date.now() + 5 * 60 * 1000,
      userData: record.userData
    });

    res.status(200).json({
      success: true,
      message: "New verification OTP sent to your email.",
    });
  } catch (err) {
    next(err);
  }
};

// ================== SIGNIN ==================
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(errorHandler(400, "Email and password are required."));

  try {
    // Check main user (including unverified users)
    const validUser = await User.findOne({ email });
    if (validUser) {
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(400, "Invalid password."));

      // Check if user is verified (completed OTP verification)
      if (!validUser.isVerified) {
        return next(errorHandler(401, "Please verify your email first. Check your inbox for OTP or request a new one."));
      }

      // User is verified, proceed with login
      const payload = {
        id: validUser._id.toString(),
        isAdmin: validUser.isAdmin,
        isSupplier: validUser.isSupplier,
        username: validUser.username,
        isSubUser: false,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
      const { password: pass, ...userWithoutPassword } = validUser._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        .json(userWithoutPassword);
    }

    // SubUser login (no OTP required for sub-users)
    const subUser = await SubUser.findOne({ email, isActive: true });
    if (!subUser) return next(errorHandler(404, "User not found."));

    const isSubUserPasswordValid = bcryptjs.compareSync(password, subUser.password);
    if (!isSubUserPasswordValid) return next(errorHandler(400, "Invalid password."));

    const subUserPayload = {
      id: subUser._id.toString(),
      isAdmin: false,
      isSupplier: false,
      isSubUser: true,
      role: subUser.role,
      supplierId: subUser.supplierRef?.toString?.() || null,
      username: subUser.username,
      email: subUser.email,
    };

    const subUserToken = jwt.sign(subUserPayload, process.env.JWT_SECRET, { expiresIn: "1d" });
    const { password: subPass, ...subUserWithoutPassword } = subUser._doc;

    return res
      .status(200)
      .cookie("access_token", subUserToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .json({ ...subUserWithoutPassword, isSubUser: true });
  } catch (err) {
    next(err);
  }
};

// ================== GOOGLE AUTH ==================
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isSupplier: false,
        isVerified: true, // Google users are automatically verified
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, isSupplier: user.isSupplier },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .json(rest);
  } catch (err) {
    next(err);
  }
};