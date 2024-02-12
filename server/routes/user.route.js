import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.middleware.js"
import { getUserController, getUsersListController, updateUserController } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/:userId", verifyToken, getUserController);
router.get("", getUsersListController);

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/*ROUTES WITH FILES */
//Register route needed to be in index.js because it needs upload picture
//app.post('/auth/register', upload.single('picture'), register);
router.put('/update/:userId', upload.single('picture'), verifyToken, updateUserController);

export default router;