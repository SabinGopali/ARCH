import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import SubUser from "../models/subuser.model.js";



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
    return next(errorHandler(400, 'Username, email, and password are required.'));
  }

  if (isSupplier && (!company_name || !company_location || !phone)) {
    return next(errorHandler(400, 'Company name, location, and phone are required for suppliers.'));
  }

  try {
    // Enforce Gmail-only domain
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      return next(errorHandler(400, 'Please use a valid Gmail address (example@gmail.com).'));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, 'User with this email or username already exists'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate verification code (6 digits)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      company_name,
      company_location,
      phone,
      businessTypes,
      isSupplier: Boolean(isSupplier),
      emailVerified: false,
      emailVerificationCode: code,
      emailVerificationExpiry: expiry,
    });

    await newUser.save();

    // Send OTP email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_FROM || 'no-reply@archphaze.local',
        to: email,
        subject: 'Verify your email - Archphaze',
        text: `Hi ${username},\n\nYour verification code is ${code}. It expires in 15 minutes.\n\nIf you did not sign up, ignore this email.`,
        html: `<p>Hi ${username},</p><p>Your verification code is <b>${code}</b>.</p><p>It expires in 15 minutes.</p><p>If you did not sign up, ignore this email.</p>`,
      });
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
    }

    res.status(201).json({ success: true, message: 'Signup successful. Please verify your email.', requiresVerification: true });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Try authenticating a main account first
    const validUser = await User.findOne({ email });

    if (validUser) {
      if (!validUser.emailVerified) {
        return next(errorHandler(403, 'Please verify your email to sign in.'));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }

      const payload = {
        id: validUser._id.toString(),
        isAdmin: validUser.isAdmin,
        isSupplier: validUser.isSupplier,
        username: validUser.username,
        isSubUser: false,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      const { password: pass, ...userWithoutPassword } = validUser._doc;

      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          // sameSite and secure omitted for local dev
          // secure: true, // enable in production
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(userWithoutPassword);
    }

    // If not a main account, try sub-user
    const subUser = await SubUser.findOne({ email, isActive: true });
    if (!subUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const isSubUserPasswordValid = bcryptjs.compareSync(password, subUser.password);
    if (!isSubUserPasswordValid) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const subUserPayload = {
      id: subUser._id.toString(),
      isAdmin: false,
      isSupplier: false,
      isSubUser: true,
      role: subUser.role,
      supplierId: subUser.supplierRef?.toString?.() || null,
      supplierRef: subUser.supplierRef?.toString?.() || null,
      username: subUser.username,
      email: subUser.email,
    };

    const subUserToken = jwt.sign(subUserPayload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const { password: subPass, ...subUserWithoutPassword } = subUser._doc;

    return res
      .status(200)
      .cookie('access_token', subUserToken, {
        httpOnly: true,
        // sameSite and secure omitted for local dev
        // secure: true, // enable in production
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        ...subUserWithoutPassword,
        isSubUser: true,
        isSupplier: false,
        isAdmin: false,
        role: subUser.role,
        supplierId: subUser.supplierRef,
        isActive: subUser.isActive,
      });
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      // Ensure verified if Google login succeeds
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save();
      }
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, isSupplier: user.isSupplier },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          // sameSite and secure omitted for local dev
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(rest);
    } else {
      // For Google auth, mark as verified automatically
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isSupplier: false,
        emailVerified: true,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin, isSupplier: newUser.isSupplier },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const { password, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          // sameSite and secure omitted for local dev
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;
  if (!email || !code) return next(errorHandler(400, 'Email and code are required'));

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));
    if (user.emailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified.' });
    }

    const now = new Date();
    if (!user.emailVerificationCode || !user.emailVerificationExpiry || user.emailVerificationExpiry < now) {
      return next(errorHandler(400, 'Verification code is expired. Please resend a new one.'));
    }

    if (String(user.emailVerificationCode) !== String(code)) {
      return next(errorHandler(400, 'Invalid verification code.'));
    }

    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    return next(err);
  }
};

export const resendOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(errorHandler(400, 'Email is required'));

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));
    if (user.emailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    user.emailVerificationCode = code;
    user.emailVerificationExpiry = expiry;
    await user.save();

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_FROM || 'no-reply@archphaze.local',
        to: email,
        subject: 'Your new verification code - Archphaze',
        text: `Your new verification code is ${code}. It expires in 15 minutes.`,
        html: `<p>Your new verification code is <b>${code}</b>. It expires in 15 minutes.</p>`,
      });
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
    }

    return res.status(200).json({ success: true, message: 'Verification code resent.' });
  } catch (err) {
    return next(err);
  }
};