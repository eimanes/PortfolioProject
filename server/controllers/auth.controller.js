import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import User from '../models/User.js';
import UserVerification from '../models/UserVerification.js';

dotenv.config();

/* REGISTER USER */
const register = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body;

        // Check if username meets the requirements
        if (!username || username.length < 3) {
            return res.status(400).json({
                success: false,
                error: "Username must be at least 3 characters"
            });
        }

        // Check if password meets the requirements
        if (!password || password.length < 5 || !/\d/.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 5 characters long and contain at least 1 number"
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "Passwords do not match"
            });
        }

        // Check if email is missing, empty, or invalid
        if (!email || email.trim() === '' || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: "Email is required and must be valid"
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Username is already taken"
            });
        }

        // Check if username already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                error: "Email is already taken"
            });
        }

        // Generate a userId using uuidv4
        const userId = uuidv4();

        //To encrypt the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate Email verification token using uuidv4
        const verificationToken = uuidv4();

        const newUser = new User({
            userId,
            username,
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: null,
            location: null,
            occupation: null,
            viewedProfile: Math.floor(Math.random() * 10000),
            impression: Math.floor(Math.random() * 10000),
            verified: false
        });

        //save the user
        const savedUser = await newUser.save();

        // Save the user verification token to the database
        const userVerification = new UserVerification({
            userId: savedUser._id,
            uniqueString: verificationToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Token expires in 15 minutes
        });
        await userVerification.save();
        await User.findByIdAndUpdate(savedUser._id, { userId: userVerification.userId }); //replace generated userId from uuid to id from mongo

        // nodemailer trasnporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            debug: true
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Account Verification',
            html: `<p>Click <a href="http://localhost:3001/auth/verify-email?userId=${userVerification.userId}&token=${userVerification.uniqueString}">here</a> to verify your email.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification email:', error);
                return res.status(500).json({ success: false, error: 'Failed to send verification email' });
            } else {
                console.log('Verification email sent:', info.response);
                return res.status(201).json({
                    success: true,
                    message: "Signup successful. Please verify your email",
                    data: savedUser
                });
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/* EMAIL VERIFICATION USER */
const verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.query;

        // Find the user verification entry in the database
        const userVerification = await UserVerification.findOne({ userId, uniqueString: token });

        if (!userVerification) {
            return res.status(404).json({ success: false, error: "Verification token not found" });
        }

        // Check if the verification token has expired
        if (userVerification.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, error: "Verification token expired" });
        }

        // Update the user's verification status
        await User.findByIdAndUpdate(userId, { verified: true });

        // Delete the user verification entry from the database
        await UserVerification.findByIdAndDelete(userVerification._id);

        // Respond with a success message
        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

/* RESEND VERIFICATION EMAIL */
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is missing, empty, or invalid
        if (!email || email.trim() === '' || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: "Email is required and must be valid"
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // If user not found, return an error
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Generate a new verification token
        const verificationToken = uuidv4();

        // Update the verification token and its expiration in the database
        await UserVerification.findOneAndUpdate(
            { userId: user.userId },
            {
                uniqueString: verificationToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Token expires in 15 minutes
            },
            { upsert: true }
        );

        // nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            debug: true
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Account Verification',
            html: `<p>Click <a href="http://localhost:3001/auth/verify-email?userId=${user._id}&token=${verificationToken}">here</a> to verify your email.</p>`
        };

        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification email:', error);
                return res.status(500).json({ success: false, error: 'Failed to send verification email' });
            } else {
                console.log('Verification email sent:', info.response);
                return res.status(200).json({
                    success: true,
                    message: "Verification email resent successfully"
                });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


/* LOGIN USER */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user;

        // Check if the username is a valid email format
        const isEmailFormat = /\S+@\S+\.\S+/.test(username);

        if (isEmailFormat) {
            // If the username is in email format, find the user by email
            user = await User.findOne({ email: username });
        } else {
            // If the username is not in email format, find the user by username
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ success: false, error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Invalid Password!" });
        }

        if (user.verified === false) {
            return res.status(400).json({ success: false, error: "User has not verified" });
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


/* FORGOT PASSWORD */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is missing or empty
        if (!email || email.trim() === '') {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // Find the user by email
        const user = await User.findOne({ email: email });

        // If user doesn't exist, return error message
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found" });
        }

        // Generate a reset token using uuidv4
        const verificationToken = uuidv4();

        // Update the verification token and its expiration in the user document
        await UserVerification.findOneAndUpdate(
            { userId: user.userId },
            {
                uniqueString: verificationToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Token expires in 15 minutes
            },
            { upsert: true }
        );


        // Send an email with the reset token
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            html: `<h1>UPDATE FROM FRONT END</h1><br><p>Copy ${verificationToken} here</a> to reset your password.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password reset email:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to send password reset email'
                });
            } else {
                console.log('Password reset email sent:', info.response);
                return res.status(200).json({
                    success: true,
                    message: "Password reset email sent"
                });
            }
        });

    } catch (error) {
        // If any error occurs, return internal server error
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/* RESET PASSWORD */
const resetPassword = async (req, res) => {
    try {
        const { userId, token } = req.query;
        const { newPassword, confirmNewPassword } = req.body;

        // Check if reset token, new password, or confirm new password is missing or empty
        if (!userId || !token) {
            return res.status(400).json({
                success: false,
                error: "Reset token and UserId are required"
            });
        }

        if ( !newPassword || newPassword.trim() === '' || !confirmNewPassword || confirmNewPassword.trim() === '') {
            return res.status(400).json({
                success: false,
                error: "New password are required"
            });
        }


        // Check if the new password meets the requirements
        if (newPassword.length < 5 || !/\d/.test(newPassword)) {
            return res.status(400).json({ success: false, error: "Password must be at least 5 characters long and contain at least 1 number" });
        }

        // Check if the new password matches the confirm new password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, error: "Passwords do not match" });
        }

        // Find the user by the reset token
        const userVerification = await UserVerification.findOne({ userId, uniqueString: token });

        if (!userVerification) {
            return res.status(404).json({
                success: false,
                error: "Verification token not found"
            });
        }

        // Check if the verification token has expired
        if (userVerification.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, error: "Verification token expired" });
        }

        // Find the user by user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Encrypt the new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update the user's password and remove the reset token
        user.password = passwordHash;
        await user.save();

        // Respond with success message
        return res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        // If any error occurs, return internal server error
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export { register, verifyEmail, resendVerificationEmail, login, forgotPassword, resetPassword };

