import express from "express";
import * as userController from "../controllers/userController.js";

// Create router instance
const router = express.Router();

// POST /api/users
// Register a new user
router.post("/", userController.registerUser);

export default router;