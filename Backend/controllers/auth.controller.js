import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import SubUser from "../models/subuser.model.js";
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res, next) => {
  return next(errorHandler(403, 'Signup is only allowed via Google (gmail.com)'));
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

// Verify Google ID token helper
async function verifyGoogleIdToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload; // contains email, email_verified, name, picture, sub, etc.
}

export const google = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return next(errorHandler(400, 'Missing Google idToken'));
    }

    const payload = await verifyGoogleIdToken(idToken);

    if (!payload?.email_verified) {
      return next(errorHandler(401, 'Google email not verified'));
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const googlePhotoUrl = payload.picture;

    // Enforce gmail.com domain only
    if (!/^[^@]+@gmail\.com$/i.test(email)) {
      return next(errorHandler(403, 'Only gmail.com accounts are allowed'));
    }

    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, isSupplier: user.isSupplier },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json(rest);
    }

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
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleSupplierSignup = async (req, res, next) => {
  const { idToken, company_name, company_location, phone, businessTypes = [] } = req.body;

  try {
    if (!idToken) return next(errorHandler(400, 'Missing Google idToken'));

    const payload = await verifyGoogleIdToken(idToken);

    if (!payload?.email_verified) {
      return next(errorHandler(401, 'Google email not verified'));
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const googlePhotoUrl = payload.picture;

    // Enforce gmail.com domain only
    if (!/^[^@]+@gmail\.com$/i.test(email)) {
      return next(errorHandler(403, 'Only gmail.com accounts are allowed'));
    }

    if (!company_name || !company_location || !phone) {
      return next(errorHandler(400, 'Company name, location, and phone are required for suppliers.'));
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but not supplier, upgrade supplier fields
      if (!user.isSupplier) {
        user.isSupplier = true;
        user.company_name = company_name;
        user.company_location = company_location;
        user.phone = phone;
        user.businessTypes = Array.isArray(businessTypes) ? businessTypes : [];
        await user.save();
      }
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isSupplier: true,
        company_name,
        company_location,
        phone,
        businessTypes: Array.isArray(businessTypes) ? businessTypes : [],
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, isSupplier: user.isSupplier },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password, ...rest } = user._doc;

    return res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};