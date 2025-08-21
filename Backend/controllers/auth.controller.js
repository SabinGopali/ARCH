import User from "../models/user.model.js";
import SubUser from "../models/subuser.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";

// ================== OTP STORE ==================
const otpStore = new Map(); // better: move to DB

// ================== NODEMAILER ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL, // must be set in .env
    pass: process.env.SMTP_PASS,  // Gmail App Password
  },
});

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP
const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Auth System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    throw errorHandler(500, "Failed to send OTP email");
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

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      company_name,
      company_location,
      phone,
      businessTypes,
      isSupplier,
    });

    await newUser.save();

    // Send OTP only once on signup
    const otp = generateOtp();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent to email.",
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

    otpStore.delete(email);
    res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (err) {
    next(err);
  }
};

// ================== SIGNIN ==================
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(errorHandler(400, "All fields are required."));

  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(400, "Invalid password."));

      // Do NOT send OTP here again — only first signup
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

    // SubUser login
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
      });

      await user.save();

      // OTP only first time Google signup
      const otp = generateOtp();
      otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
      await sendOtpEmail(email, otp);
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
