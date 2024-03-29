import express from "express";
import { signUpController, verifyEmailController, resendVerificationEmailController, signInController, forgotPasswordController, resetPasswordController } from "../controllers/auth.controller.js";
import passport from "../config/passport.config.js";
const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.get("/verify-email", verifyEmailController);
router.post("/resend-verify-email", resendVerificationEmailController);
router.post("/forgot-password", forgotPasswordController);
router.put("/reset-password", resetPasswordController);

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