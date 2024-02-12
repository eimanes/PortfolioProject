import { getUserService, getUsersListService, updateUserService } from "../services/user.service.js";

const getUserController = async (req, res, next) => {
    try {
        const {userId} = req.params;
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

    try {
        const user = await updateUserService(userId, firstName, lastName, location, occupation, picturePath);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


export { getUserController, getUsersListController, updateUserController };