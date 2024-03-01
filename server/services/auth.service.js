import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import UserVerification from '../models/UserVerification.js';

dotenv.config();

/* DElETE UNVERIFIED USER */
const deleteUnverifiedUsers = async () => {
    const expiredUsers = await UserVerification.find({
        isRegister: true,
        expiresAt: { $lt: new Date() } // Find tokens that have expired
    });

    // Delete unverified users' data
    for (const user of expiredUsers) {
        await User.deleteOne({ userId: user.userId });
        await UserVerification.deleteOne({ userId: user.userId });
        console.log(`Deleted data for unverified user with userId: ${user.userId}`);
    }
};

/* RANDOM TOKEN FOR VERIFICATION, FORGOT PASSWORD, ANY OTHER*/
const generateRandomToken = (length = 10) => (
    crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
);

/* REGISTER USER */
const signUpService = async (userData) => {

    await deleteUnverifiedUsers();

    const {
      username,
      password,
      confirmPassword,
      email,
      firstName,
      lastName,
    } = userData;

    // Check if username meets the requirements
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allows alphanumeric characters and underscore
    if (!usernameRegex.test(username) || !username) {
        return {
            success: false,
            error: "Username can only contain alphanumeric characters and underscore"
        };
    }

    if (username.length < 5) {
        return {
            success: false,
            error: "Username must be at least 5 characters long"
        };
    }

    // Check if password meets the requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return {
            success: false,
            error: "Password must be at least 8 characters long, contain at least 1 number, and contain at least 1 special character"
        };
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    // Check if email is missing, empty, or invalid
    if (!email || email.trim() === "" || !email.includes("@")) {
      return {
        success: false,
        error: "Email is required and must be valid",
      };
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        error: "Email is already taken",
      };
    }

    // Generate a userId using uuidv4
    const userId = uuidv4();

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate Email verification token using uuidv4
    const verificationToken = generateRandomToken();

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
      verified: false,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Save the user verification token to the database
    const userVerification = new UserVerification({
      userId: savedUser.userId,
      uniqueString: verificationToken,
      isRegister: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Token expires in 15 minutes
    });
    await userVerification.save();

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Account Verification",
        html: `<p>Click <a href="http://localhost:3001/auth/verify-email?userId=${userVerification.userId}&token=${userVerification.uniqueString}">here</a> to verify your email.</p>`,
    };

    // Send verification email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        debug: true,
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending verification email:", error);
                reject({
                    success: false,
                    error: "Failed to send verification email"
                });
            } else {
                console.log("Verification email sent:", info.response);
                resolve({
                    success: true,
                    message: "Signup successful. Please verify your email",
                    data: savedUser,
                });
            }
        });
    });
};


/* EMAIL VERIFICATION USER */
const verifyEmailService = async (userId, token) => {
    try {
        // Find the user verification entry in the database
        const userVerification = await UserVerification.findOne({ userId, uniqueString: token, isRegister: true });

        if (!userVerification) {
            return {
                success: false,
                error: "Verification token not found"
            };
        }

        // Check if the verification token has expired
        if (userVerification.expiresAt < Date.now()) {
            return {
                success: false,
                error: "Verification token expired"
            };
        }

        // Update the user's verification status
        await User.findOneAndUpdate({userId : userId}, { verified: true }, {new: true});

        // Delete the user verification entry from the database
        await UserVerification.findOneAndDelete(userVerification._id);

        return {
            success: true,
            message: "Email verified successfully"
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


/* RESEND VERIFICATION EMAIL */
const resendVerificationEmailService = async (email) => {

    // Check if email is missing, empty, or invalid
    if (!email || email.trim() === '' || !email.includes('@')) {
        return {
            success: false,
            error: "Email is required and must be valid"
        };
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
        return {
            status: 404,
            success: false,
            error: "User not found"
        };
    }

    if (user.verified) {
        return {
            success: false,
            error: "User has been verified"
        };
    }

    // Generate a new verification token
    const verificationToken = generateRandomToken();

    // Update the verification token and its expiration in the database
    await UserVerification.findOneAndUpdate(
        { userId: user.userId },
        {
            uniqueString: verificationToken,
            isRegister: true,
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
        html: `<p>Click <a href="http://localhost:3001/auth/verify-email?userId=${user.userId}&token=${verificationToken}">here</a> to verify your email.</p>`
    };

    return new Promise((resolve, reject) => {
        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending verification email:', error);
                reject ({
                    success: false,
                    error: 'Failed to send verification email'
                });
            } else {
                console.log('Verification email sent:', info.response);
                resolve ({
                    success: true,
                    message: "Verification email resent successfully"
                });
            }
        });
    });
};


/* LOGIN USER */
const signInService = async (username, password, rememberMe = false) => {

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
        return {
            success: false,
            error: "User not found"
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return {
            success: false,
            error: "Invalid Password"
        };
    }

    if (!user.verified) {
        return {
            success: false,
            error: "User not verified"
        };
    }

    const expirationTime = rememberMe ? '15d' : '1h';
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: expirationTime });
    const time = new Date();
    const expirationDate = new Date(time.getTime() + (rememberMe ? 15 : 1) * 24 * 60 * 60 * 1000);
    delete user.password;
    return {
        success: true,
        token,
        loginAt: time,
        rememberMe,
        expirationDate,
        user,
    };
};


/* FORGOT PASSWORD */
const forgotPasswordService = async (email) => {

    if (!email || email.trim() === '' || !email.includes('@')) {
        return {
            success: false,
            error: "Email is required and must be valid"
        };
    }

    // Find the user by email
    const user = await User.findOne({ email: email });

    // If user doesn't exist, return error message
    if (!user) {
        return {
            success: false,
            error: "User not found"
        };
    }

    // Generate a reset token using uuidv4
    const verificationToken = generateRandomToken();

    await UserVerification.findOneAndUpdate(
        { userId: user.userId, isPassword: true },
        {
            uniqueString: verificationToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        },
        { upsert: true, new: true }
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

    return new Promise((resolve, reject) => {
        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending password reset email:', error);
                reject ({
                    success: false,
                    error: 'Failed to send password reset email'
                });
            } else {
                console.log('Password reset email sent:', info.response);
                resolve ({
                    success: true,
                    message: "Password reset email sent"
                });
            }
        });
    });

};

/* RESET PASSWORD */
const resetPasswordService = async (paramData, passwordData) => {
    const { userId, token } = paramData;
    const { newPassword, confirmNewPassword } = passwordData;

    // Check if reset token, new password, or confirm new password is missing or empty
    if (!userId || !token) {
        return {
            success: false,
            error: "Reset token and UserId are required"
        };
    }

    if ( !newPassword || newPassword.trim() === '' || !confirmNewPassword || confirmNewPassword.trim() === '') {
        return {
            success: false,
            error: "New password are required"
        };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return {
            success: false,
            error: "Password must be at least 8 characters long, contain at least 1 number, and contain at least 1 special character"
        };
    }

    // Check if the new password matches the confirm new password
    if (newPassword !== confirmNewPassword) {
        return {
            success: false,
            error: "Passwords do not match"
        };
    }

    // Find the user by the reset token
    const userVerification = await UserVerification.findOne({ userId, uniqueString: token, isPassword: true });

    if (!userVerification) {
        return {
            success: false,
            error: "Verification token not found"
        };
    }

    // Check if the verification token has expired
    if (userVerification.expiresAt < Date.now()) {
        return {
            success: false,
            error: "Verification token expired"
        };
    }

    // Find the user by user ID
    const user = await User.findOne({userId});

    if (!user) {
        return {
            success: false,
            error: "User not found" };
    }

    // Encrypt the new password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the user's password and remove the reset token
    user.password = passwordHash;
    await user.save();
    await UserVerification.findOneAndDelete(userVerification._id);

    // Respond with success message
    return {
        success: true,
        message: "Password reset successfully"
    };
};



export { signUpService, verifyEmailService, resendVerificationEmailService, signInService, forgotPasswordService, resetPasswordService };

