import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer")) {
            token = token.substring(7).trim();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findOne({ userId: decoded.userId });

        if (!user) {
            return res.status(404).json({
                decoded,
                error: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};