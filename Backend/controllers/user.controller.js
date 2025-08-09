import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Product from '../models/product.model.js';
import SubUser from '../models/subuser.model.js';





export const getSupplierUsers = async (req, res, next) => {
  try {
    const supplierId = req.user?.isSupplier
      ? req.user.id
      : req.user?.isSubUser
      ? req.user.supplierRef
      : null;

    if (!supplierId) {
      return res.status(403).json({ message: "Only suppliers or sub-users can access this data" });
    }

    const mainSupplier = await User.findById(supplierId).select("-password");
    if (!mainSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ supplier: mainSupplier });
  } catch (error) {
    next(error);
  }
};





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

    if (req.user.isSupplier) {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return next(errorHandler(404, "User not found"));
      return res.status(200).json(user);
    }

    if (req.user.isSubUser) {
      const subUser = await SubUser.findById(req.user.id).select("-password");
      if (!subUser) return next(errorHandler(404, "Sub-user not found"));
      return res.status(200).json(subUser);
    }

    return next(errorHandler(403, "Access denied"));
  } catch (error) {
    next(error);
  }
};




export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check main user
    let user = await User.findOne({ email });
    let isSubUser = false;

    // If not found, check sub-user
    if (!user) {
      user = await SubUser.findOne({ email });
      if (user) isSubUser = true;
    }

    if (!user) return next(errorHandler(401, "Invalid credentials"));

    // Validate password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, "Invalid credentials"));

    // Create token payload
    let tokenPayload;
    if (isSubUser) {
      tokenPayload = {
        id: user._id.toString(),
        isSubUser: true,
        role: user.role,
        supplierRef: user.supplierRef,
      };
    } else {
      tokenPayload = {
        id: user._id.toString(),
        isSupplier: user.isSupplier,
        isAdmin: user.isAdmin || false,
      };
    }

    // Sign JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          ...(isSubUser
            ? {
                isSubUser: true,
                role: user.role,
                supplierRef: user.supplierRef,
              }
            : {
                isSupplier: user.isSupplier,
                isAdmin: user.isAdmin || false,
              }),
        },
      });
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
    const userIdToDelete = req.params.userId;
    const loggedInUserId = req.user._id || req.user.id;

    if (!loggedInUserId) {
      return next(errorHandler(401, "Unauthorized: Missing user info"));
    }

    if (loggedInUserId.toString() !== userIdToDelete && !req.user.isAdmin) {
      return next(errorHandler(403, "Access denied: Not authorized to delete this user"));
    }

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const { password } = req.body;
    if (!password) {
      return next(errorHandler(400, "Password is required to confirm deletion"));
    }

const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password. Account not deleted."));
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};


export const requestUserDeletion = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { password } = req.body;

    if (!req.user || String(req.user.id) !== userId) {
  return next(errorHandler(403, "Access denied"));
}

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password"));
    }

    user.deletionRequested = true;
    await user.save();

    res.status(200).json({ success: true, message: "Deletion request sent for admin approval." });
  } catch (err) {
    next(err);
  }
};


export const adminDeleteUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return next(errorHandler(403, "Only admin can delete"));

    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "User not found"));

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ success: true, message: "User deleted by admin." });
  } catch (err) {
    next(err);
  }
};



export const adminRejectDeletion = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) return next(errorHandler(403, "Only admin can reject deletion"));

    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "User not found"));

    // Reset deletion request flags/fields
    user.deletionRequested = false;
    user.deletionReason = "";
    await user.save();

    res.status(200).json({ success: true, message: "Deletion request rejected." });
  } catch (err) {
    next(err);
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
