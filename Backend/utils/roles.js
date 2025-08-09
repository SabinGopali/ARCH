// utils/roles.js
import { errorHandler } from "./error.js";

// Main suppliers or sub-users with "Full Supplier Access"
export const requireSupplierOrFullAccess = (req, res, next) => {
  if (req.user?.isSupplier || (req.user?.isSubUser && req.user.role === "Full Supplier Access")) {
    next();
  } else {
    return next(errorHandler(403, "Access denied"));
  }
};

// Any supplier or sub-user
export const requireAnySupplier = (req, res, next) => {
  if (req.user?.isSupplier || req.user?.isSubUser) {
    next();
  } else {
    return next(errorHandler(403, "Access denied"));
  }
};
