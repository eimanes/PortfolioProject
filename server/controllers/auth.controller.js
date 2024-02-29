import dotenv from 'dotenv';
import { signUpService, verifyEmailService, resendVerificationEmailService, signInService, forgotPasswordService, resetPasswordService  } from '../services/auth.service.js';

dotenv.config();

/* REGISTER USER */
const signUpController = async (req, res, next) => {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;

    const userData = {
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    try {
        const result = await signUpService(userData);

        if (result.success === true) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error("Error in registerController:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* EMAIL VERIFICATION USER */
const verifyEmailController = async (req, res, next) => {
    const { userId, token } = req.query;

    try {
        const result = await verifyEmailService(userId, token);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


/* RESEND VERIFICATION EMAIL */
const resendVerificationEmailController = async (req, res) => {
    const { email } = req.body;
    try {

    const result = await resendVerificationEmailService(email);
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json(result);
    }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/* LOGIN USER */
const signInController = async (req, res) => {
    const { username, password, rememberMe } = req.body;
    try {
        const result = await signInService(username, password, rememberMe);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


/* FORGOT PASSWORD */
const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await forgotPasswordService(email);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        // If any error occurs, return internal server error
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: error.message });
    }
};

/* RESET PASSWORD */
const resetPasswordController = async (req, res) => {
    const { userId, token } = req.query;
    const { newPassword, confirmNewPassword } = req.body;

    const paramData = { userId, token };
    const passwordData = { newPassword, confirmNewPassword };
    try {
        const result = await resetPasswordService(paramData, passwordData);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};



export { signUpController, verifyEmailController, resendVerificationEmailController, signInController, forgotPasswordController, resetPasswordController };

