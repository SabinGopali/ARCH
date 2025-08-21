import express from "express";
import {
  signup,
  signin,
  google,
  verifyOtp,
  // later: resetPassword, requestPasswordReset
} from "../controllers/auth.controller.js";

const router = express.Router();

// User signup (sends OTP on first registration)
router.post("/signup", signup);

// Verify OTP after signup
router.post("/verify-otp", verifyOtp);

// Normal signin (main user + subuser)
router.post("/signin", signin);

// Google auth (OTP also sent if first signup)
router.post("/google", google);

// 👉 For later: password reset with OTP
// router.post("/request-reset", requestPasswordReset);
// router.post("/reset-password", resetPassword);

export default router;
