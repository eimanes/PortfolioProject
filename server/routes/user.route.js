import express from "express";
import { getUserController, getUsersListController } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:userId", getUserController);
router.get("", getUsersListController);
//updateUserRoute is in index.js
//router.put("/:userId", updateUserController);

export default router;