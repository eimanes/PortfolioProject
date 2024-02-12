import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const getUserService = async (userId) => {
    let user;
    const isUserId = /^[0-9a-fA-F]+$/.test(userId);
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
    }

    if (occupation) {
        filter.occupation = { $regex: occupation, $options: 'i' };
    }

    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(filter).skip(skip).limit(limit);
    return users;
};

const updateUserService = async (userId, firstName, lastName, location, occupation, picturePath) => {

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
}

export { getUserService, getUsersListService, updateUserService};
