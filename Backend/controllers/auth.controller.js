import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import SubUser from "../models/subuser.model.js";
import { sendVerificationOtpEmail } from "../utils/email.js";



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

  // Enforce Gmail-only addresses (gmail.com or googlemail.com)
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|googlemail\.com)$/i;
  if (!gmailRegex.test(email)) {
    return next(errorHandler(400, 'Please use a valid Gmail address (e.g., name@gmail.com).'));
  }

  if (isSupplier && (!company_name || !company_location || !phone)) {
    return next(errorHandler(400, 'Company name, location, and phone are required for suppliers.'));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, 'User with this email or username already exists'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Generate 6-digit OTP valid for 10 minutes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      company_name,
      company_location,
      phone,
      businessTypes,
      isSupplier: Boolean(isSupplier),
      isEmailVerified: false,
      emailVerificationOtp: otp,
      emailVerificationOtpExpiresAt: otpExpiresAt,
    });

    await newUser.save();

    try {
      await sendVerificationOtpEmail({ to: email, otp, username });
    } catch (mailErr) {
      return next(errorHandler(500, 'Failed to send verification email. Please try resending the OTP.'));
    }

    res.status(201).json({ success: true, message: 'Signup created. Verification OTP sent to your Gmail.', email });
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
        isEmailVerified: true,
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

export const verifyEmailOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(errorHandler(400, 'Email and OTP are required.'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }
    if (user.isEmailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified.' });
    }
    if (!user.emailVerificationOtp || !user.emailVerificationOtpExpiresAt) {
      return next(errorHandler(400, 'No OTP requested. Please resend OTP.'));
    }
    if (new Date() > new Date(user.emailVerificationOtpExpiresAt)) {
      return next(errorHandler(400, 'OTP has expired. Please resend a new OTP.'));
    }
    if (user.emailVerificationOtp !== String(otp)) {
      return next(errorHandler(400, 'Invalid OTP.'));
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpiresAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
};

export const resendEmailOtp = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, 'Email is required.'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }
    if (user.isEmailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpiresAt = otpExpiresAt;
    await user.save();

    try {
      await sendVerificationOtpEmail({ to: email, otp, username: user.username });
    } catch (mailErr) {
      return next(errorHandler(500, 'Failed to send verification email. Please try again later.'));
    }

    return res.status(200).json({ success: true, message: 'A new OTP has been sent to your Gmail.' });
  } catch (error) {
    next(error);
  }
};