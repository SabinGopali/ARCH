import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';


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
