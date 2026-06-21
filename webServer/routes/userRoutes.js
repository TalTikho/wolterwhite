import express from "express";
import * as userController from "../controllers/userController.js";
import { upload }  from "../controllers/multerImageController.js";
import { userDataRegistration } from '../middleware/userRegistration.js'

// Create router instance
const router = express.Router();

// POST /api/users
// Register a new user
// upload.single("profilePic") tells multer to expect a single file called "profilePic"
router.post("/", upload.single("profilePic"), userDataRegistration, userController.registerUser);

// GET /api/users/:id
// Get a user by ID
router.get("/:id", userController.getUser);

export default router;