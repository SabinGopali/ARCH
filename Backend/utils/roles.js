// utils/roles.js
import { errorHandler } from "./error.js";
import SubUser from "../models/subuser.model.js";

// Main suppliers or sub-users with "Full Supplier Access"
export const requireSupplierOrFullAccess = async (req, res, next) => {
  try {
    if (req.user?.isSubUser) {
      const subUser = await SubUser.findById(req.user.id).select("role isActive");
      if (!subUser || subUser.isActive === false) {
        return next(errorHandler(403, "Access denied: account inactive"));
      }
      if (subUser.role === "Full Supplier Access") {
        return next();
      }
      return next(errorHandler(403, "Access denied: insufficient permissions"));
    }

    if (req.user?.isSupplier || req.user?.isAdmin) {
      return next();
    }

    return next(errorHandler(403, "Access denied"));
  } catch (err) {
    return next(err);
  }
};

// Any supplier or sub-user
export const requireAnySupplier = async (req, res, next) => {
  try {
    if (req.user?.isSubUser) {
      const subUser = await SubUser.findById(req.user.id).select("isActive");
      if (!subUser || subUser.isActive === false) {
        return next(errorHandler(403, "Access denied: account inactive"));
      }
      return next();
    }

    if (req.user?.isSupplier || req.user?.isAdmin) {
      return next();
    }

    return next(errorHandler(403, "Access denied"));
  } catch (err) {
    return next(err);
  }
};