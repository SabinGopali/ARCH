import express from "express";
import {
  signup,
  signin,
  google,
  verifyOtp,
  resendOtp,
  resendVerificationOtp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/resend-verification-otp", resendVerificationOtp);
router.post("/signin", signin);
router.post("/google", google);

export default router;