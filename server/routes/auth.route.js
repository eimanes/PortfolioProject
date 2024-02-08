import express from "express";
import { register, login, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import passport from "../config/passport.config.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

/* GOOGLE AUTH */
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3001/dashboard",
    failureRedirect: "http://localhost:3001/login",
  }));

  router.get("/login/success", async (req, res) => {
    if (req.user) {
      res.status(200).json({ message: "user Login", user: req.user });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  });

  router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect("http://localhost:3001");
    });
  });


export default router;