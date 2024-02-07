import express from "express";
import { register, login, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;