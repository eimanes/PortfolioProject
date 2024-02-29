import express from "express";
import { socketController } from "../controllers/socket.controller";

const router = express.Router();

router.post('/message', socketController.handleMessage);

export default router;