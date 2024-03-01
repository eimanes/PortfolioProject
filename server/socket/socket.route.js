import express from "express";
import { socketController } from "./socket.controller.js";

const router = express.Router();

router.post('/message', socketController.handleMessage);

export default router;