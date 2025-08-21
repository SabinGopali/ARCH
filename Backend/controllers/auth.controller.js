import User from "../models/user.model.js";
import SubUser from "../models/subuser.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { sendOtp } from "../utils/sendOtp.js";

// Cookie options for cross-site usage
const isProduction = process.env.NODE_ENV === "production";
const cookieDomain = process.env.COOKIE_DOMAIN || undefined; // e.g. .yourdomain.com
const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  domain: cookieDomain,
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

    // Send OTP for activation (email + SMS if phone provided)
    await sendOtp(newUser);

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent to your email and, if available, your phone.",
    });
  } catch (err) {
    next(err);
  }
};

// ================== VERIFY OTP ==================
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found."));

    if (!user.otp || !user.otpExpires) {
      return next(errorHandler(400, "No OTP found. Please request a new one."));
    }
    if (new Date(user.otpExpires).getTime() < Date.now()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return next(errorHandler(400, "OTP expired. Please request a new one."));
    }
    if (String(user.otp) !== String(otp)) {
      return next(errorHandler(400, "Invalid OTP."));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const payload = {
      id: user._id.toString(),
      isAdmin: user.isAdmin,
      isSupplier: user.isSupplier,
      username: user.username,
      isSubUser: false,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    const { password: pass, ...userWithoutPassword } = user._doc;

    return res
      .status(200)
      .cookie("access_token", token, cookieOptions)
      .json({ success: true, message: "OTP verified successfully.", user: userWithoutPassword });
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

      // If first-time email sign-in (not verified), send OTP to both channels and require verification
      if (!validUser.isVerified) {
        await sendOtp(validUser);
        return res.status(202).json({
          success: true,
          message: "Verification required. OTP sent to your email and, if available, your phone.",
        });
      }

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
        .cookie("access_token", token, cookieOptions)
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
      .cookie("access_token", subUserToken, cookieOptions)
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
        isVerified: false,
      });

      await user.save();

      // Send OTP for activation on first Google signup (email; SMS if phone later exists)
      await sendOtp(user);

      return res.status(201).json({
        success: true,
        message: "Account created with Google. Please verify the OTP sent to your email to activate your account.",
      });
    }

    // Existing user flow: if not verified, send/require OTP; else sign in
    if (!user.isVerified) {
      await sendOtp(user);
      return res.status(202).json({
        success: true,
        message: "Verification required. OTP sent to your email.",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, isSupplier: user.isSupplier },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, cookieOptions)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
