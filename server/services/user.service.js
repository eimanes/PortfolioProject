import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import UserVerification from '../models/UserVerification.js';

dotenv.config();

const getUserService = async (userId) => {
    let user;
    const isUserId = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
    if (isUserId) {
        user = await User.findOne({ userId });
    } else {
        user = await User.findOne({ username: userId });
    }

    let countUser;
    if (isUserId) {
        countUser = await User.countDocuments({userId});
    } else {
        countUser = await User.countDocuments({username: userId});
    }

    if (countUser === 0) {
        throw ({
            status: 404,
            success: false,
            message: "User not found"
        })
    }
    return user;
};

const getUsersListService = async (skip, limit, name, occupation, location) => {
    let filter = {};

    if (name) {
        filter.$or = [
            { firstName: { $regex: name, $options: 'i' } },
            { lastName: { $regex: name, $options: 'i' } },
            { username: { $regex: name, $options: 'i' } }
        ];
        if (occupation) {
            filter.occupation = { $regex: occupation, $options: 'i' };
            if (location) {
                filter.location = { $regex: location, $options: 'i' };
            }
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
    }

    if (occupation) {
        filter.occupation = { $regex: occupation, $options: 'i' };
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
    }

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }
    

    const users = await User.find(filter).skip(skip).limit(limit);
    return users;
};

const updateUserService = async (userId, userData) => {

    const {
        firstName, 
        lastName, 
        location, 
        occupation, 
        picturePath
    } = userData;

    if (!userId) {
        throw ({
            status: 400,
            success: false,
            message: "User ID is required"
        })
    }

    const user = await User.findOne({ userId: userId });
    const countUser = await User.countDocuments({userId});
    if (countUser === 0 || !user) {
        throw ({
            status: 404,
            success: false,
            message: "User not found"
        })
    }

    // Update the user document fields if provided
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (location) {
        user.location = location;
    }
    if (occupation) {
        user.occupation = occupation;
    }
    if (picturePath) {
        user.picturePath = picturePath;
    }

    await user.save();

    return user;
};

/* CHANGE USERNAME REQUEST */
const changeUsernameReqService = async (userId) => {

    if (!userId || userId.trim() === '') {
        return res.status(400).json({ success: false, error: "UserId is required" });
    }

    // Find the user by email
    const user = await User.findOne({ userId });

    // If user doesn't exist, return error message
    if (!user) {
        return {
            status: 404,
            success: false,
            error: "User not found" 
        };
    }

    const email = user.email;

    // Generate a reset token using uuidv4
    const verificationToken = uuidv4();

    await UserVerification.findOneAndUpdate(
        { userId, isUsername: true },
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
        subject: 'Username Reset',
        html: `<h1>UPDATE FROM FRONT END</h1><br><p>Copy <a>${verificationToken} here</a> to reset your password.</p>`
    };

    return new Promise((resolve, reject) => {
        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending username reset email:', error);
                reject ({ 
                    success: false, 
                    error: 'Failed to send username reset email' 
                });
            } else {
                console.log('Username reset email sent:', info.response);
                resolve ({
                    success: true,
                    message: "Username reset email sent"
                });
            }
        });
    });
};

/* RESET USERNAME */
const confirmChangeUsernameService = async (paramData, username) => {
    const { userId, token } = paramData;

    // Check if reset token, new password, or confirm new password is missing or empty
    if (!userId || !token) {
        return {
            success: false,
            error: "Reset token and UserId are required"
        };
    }

    if (!username || username.length === 0) {
        return {
            success: false,
            error: "New username are required"
        };
    }

    // Check if the new username meets the requirements
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allows alphanumeric characters and underscore
    if (!usernameRegex.test(username)) {
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

    // Find the user by the reset token
    const userVerification = await UserVerification.findOne({ userId, uniqueString: token , isUsername: true });

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
            error: "User not found" 
        };
    }

    user.username = username;
    await user.save();
    await UserVerification.findOneAndDelete(userVerification._id);

    // Respond with success message
    return { 
        success: true, 
        message: "Username reset successfully" 
    };
};

/* CHANGE USERNAME REQUEST */
const deleteUserReqService = async (userId) => {

    if (!userId || userId.trim() === '') {
        return { 
            success: false, 
            error: "UserId is required" 
        };
    }

    // Find the user by email
    const user = await User.findOne({ userId });

    // If user doesn't exist, return error message
    if (!user) {
        return {
            success: false,
            error: "User not found" };
    }

    const email = user.email;

    // Generate a reset token using uuidv4
    const verificationToken = uuidv4();

    await UserVerification.findOneAndUpdate(
        { userId, isDeleteUser: true },
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
        subject: 'Delete account',
        html: `<h1>UPDATE FROM FRONT END</h1><br><p>Copy <a>${verificationToken} here</a> to reset your password.</p>`
    };

    return new Promise((resolve, reject) => {
        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending delete user email:', error);
                reject ({ 
                    success: false, 
                    error: 'Failed to send udelete user email' 
                });
            } else {
                console.log('Delete user email sent:', info.response);
                resolve ({
                    success: true,
                    message: "Delete user email sent"
                });
            }
        });
    });
};

/* DELETE USER */
const confirmDeleteUserService = async (userId, token) => {

    if (!userId || !token) {
        return {
            success: false,
            error: "Reset token and UserId are required"
        };
    }

    // Find the user by the reset token
    const userVerification = await UserVerification.findOne({ userId, uniqueString: token, isDeleteUser: true });

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
            error: "User not found" 
        };
    }

    // Delete the user
    await User.deleteOne({ userId });
    await UserVerification.findOneAndDelete(userVerification._id);

    // Respond with success message
    return { 
        success: true, 
        message: "User deleted successfully" 
    };
};

export { getUserService, getUsersListService, updateUserService, changeUsernameReqService, confirmChangeUsernameService, deleteUserReqService, confirmDeleteUserService };
