import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';



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

  if (
    !username ||
    !email ||
    !password ||
    !company_name ||
    !company_location ||
    !phone
  ) {
    return next(errorHandler(400, 'All required fields must be filled.'));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, 'User with this email or username already exists'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      company_name,
      company_location,
      phone,
      businessTypes,
      isSupplier: Boolean(isSupplier),
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'Signup successful' });
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
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
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
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d', // optional, good practice
    });

    const { password: pass, ...userWithoutPassword } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        // secure: true, // enable in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .json(userWithoutPassword);
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
        { expiresIn: '1d' } // 1 day token expiry
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
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
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin, isSupplier: newUser.isSupplier },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // 1 day token expiry
      );

      const { password, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

