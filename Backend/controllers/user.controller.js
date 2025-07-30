import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Product from '../models/product.model.js';





export const getUserProduct = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const products = await Product.find({ userRef: req.params.id});
      res.status(200).json(products);
    } catch (error) {
      next (error)
    }
  } else {
    return next (errorHandler(401, 'You can only view your own applications!'));
  }
}



export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, "Not authenticated"));
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};



export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(401, "Invalid credentials"));

    // Check password match
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, "Invalid credentials"));

    // Create JWT payload with id and isSupplier
    const tokenPayload = {
      id: user._id.toString(),
      isSupplier: user.isSupplier,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send token as httpOnly cookie
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};




// Get supplier/user info by id - only owner can access
export const getUserById = async (req, res, next) => {
  try {
    // Check if user is supplier
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can access this route"));
    }

    // Check if user is requesting own data
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You are not authorized to access this user"));
    }

    // Fetch user without password
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


export const test = (req, res) => {
    res.json({message: 'API is working'})
};

export const signout = (req, res, next) => {
try {
  res.clearCookie('access_token').status(200).json('User has been signed out');
} catch (error) {
  next(error);
}
}

export const deleteUser = async (req, res, next) => {
  try {
    // ✅ Only admin can proceed
    if (!req.user || !req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied: Admins only'));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({ success: true, message: 'User has been deleted' });
  } catch (error) {
    next(error);
  }
};



export const getUsers = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const users = await User.find().sort({ createdAt: -1 }); // sort by newest

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
