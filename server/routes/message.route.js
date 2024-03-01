import express from "express";
import { getMessagesController, sendMessageController } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/:id", verifyToken, getMessagesController);
router.post("/send/:id", verifyToken, sendMessageController);

export default router;
