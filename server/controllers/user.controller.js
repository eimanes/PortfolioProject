import {
    getUserService,
    getUsersListService,
    updateUserService,
    changeUsernameReqService,
    confirmChangeUsernameService,
    deleteUserReqService,
    confirmDeleteUserService
} from "../services/user.service.js";

const getUserController = async (req, res, next) => {
    try {
        const {userId} = req.params;
        //Verify that the user
        if (req.user.userId.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Access Denied" });
        }

        const user = await getUserService(userId);
        return res.status(201).json({
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUsersListController = async (req, res, next) => {
    const {
        skip,
        limit,
        name,
        occupation,
        location,
    } = req.query;
    try {
        const users = await getUsersListService(parseInt(skip), parseInt(limit), name, occupation, location);
        return res.status(201).json({
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateUserController = async (req, res, next) => {
    const userId = req.params.userId;
    const {
        firstName, lastName, location, occupation, picturePath
    } = req.body;

    const userData = {
        firstName, lastName, location, occupation, picturePath
    };

    try {
        if (req.user.userId.toString() !== userId) {
            return res.status(403).json({ success: false, error: "Access Denied" });
        }
        const user = await updateUserService(userId, userData);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/* REQ CHANGE USERNAME */
const changeUsernameReqController = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await changeUsernameReqService(userId);
        if (result.success) {
            return res.status(200).json(result);
        } else if (!result.success && result.status === 404) {
            return res.status(404).json(result);
        }
        else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: error.message });
    }
};

/* RESET USERNAME */
const confirmChangeUsernameController = async (req, res) => {
    const { userId, token } = req.query;
    const newUsername = req.body.newUsername;

    const paramData = { userId, token };

    try {
        const result = await confirmChangeUsernameService(paramData, newUsername);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error('Change username error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/* REQ DELETE USER */
const deleteUserReqController = async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await deleteUserReqService(userId);
        if (result.success) {
            return res.status(200).json(result);
        } else if (!result.success && result.status === 404) {
            return res.status(404).json(result);
        }
        else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error('Delete User error:', error);
        res.status(500).json({
            success: false,
            error: error.message });
    }
};

/* DELETE USER */
const confirmDeleteUserController = async (req, res) => {
    const { userId, token } = req.query;

    try {
        const result = await confirmDeleteUserService(userId, token);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export {
    getUserController,
    getUsersListController,
    updateUserController,
    changeUsernameReqController,
    confirmChangeUsernameController,
    deleteUserReqController,
    confirmDeleteUserController
};