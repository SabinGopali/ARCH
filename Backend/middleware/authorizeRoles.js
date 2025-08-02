import { errorHandler } from "../utils/error.js";

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (req.user.isSubUser) {
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    return next(errorHandler(403, "Access denied: insufficient permissions"));
  }

  if (req.user.isSupplier || req.user.isAdmin) {
    return next();
  }

  return next(errorHandler(403, "Access denied"));
};
