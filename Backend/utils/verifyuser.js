import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized: Invalid token"));
    }

    if (!decoded || !decoded.id) {
      return next(errorHandler(401, "Unauthorized: User ID missing in token"));
    }

    req.user = decoded;
    next();
  });
};
