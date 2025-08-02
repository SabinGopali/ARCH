import SubUser from "../models/subuser.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

// Create SubUser
export const createSubUser = async (req, res, next) => {
  try {
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can create sub-users."));
    }

    const { email, name, password, role } = req.body;

    const exists = await SubUser.findOne({ email, supplierRef: req.user.id });
    if (exists) return next(errorHandler(400, "Sub-user already exists."));

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newSubUser = new SubUser({
      supplierRef: req.user.id,
      email,
      username: name,
      role,
      password: hashedPassword,
    });

    await newSubUser.save();
    res.status(201).json({ message: "Sub-user created successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all sub-users of current supplier
export const getSubUsers = async (req, res, next) => {
  try {
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can view their sub-users."));
    }

    const subUsers = await SubUser.find({ supplierRef: req.user.id }).select("-password");
    res.status(200).json(subUsers);
  } catch (err) {
    next(err);
  }
};


// DELETE a sub-user under the current supplier
export const deleteSubUser = async (req, res, next) => {
  try {
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can delete sub-users."));
    }

    const subUserId = req.params.id;

    const subUser = await SubUser.findOne({
      _id: subUserId,
      supplierRef: req.user.id, // ensure only their own sub-users can be deleted
    });

    if (!subUser) {
      return next(errorHandler(404, "Sub-user not found or unauthorized."));
    }

    await SubUser.findByIdAndDelete(subUserId);

    res.status(200).json({ message: "Sub-user deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// Update a sub-user under the current supplier
export const updateSubUser = async (req, res, next) => {
  try {
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can update sub-users."));
    }

    const subUserId = req.params.id;
    const { email, name, password, role, isActive } = req.body;

    // Ensure the sub-user belongs to the supplier
    const subUser = await SubUser.findOne({
      _id: subUserId,
      supplierRef: req.user.id,
    });

    if (!subUser) {
      return next(errorHandler(404, "Sub-user not found or unauthorized."));
    }

    // Update fields if they are provided
    if (email) subUser.email = email;
    if (name) subUser.username = name;
    if (role) subUser.role = role;
    if (typeof isActive === "boolean") subUser.isActive = isActive;

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      subUser.password = hashedPassword;
    }

    await subUser.save();
    res.status(200).json({ message: "Sub-user updated successfully." });
  } catch (err) {
    next(err);
  }
};


