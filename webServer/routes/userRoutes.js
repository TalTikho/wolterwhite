import express from "express";
import * as userController from "../controllers/userController.js";

// Create router instance
const router = express.Router();

// POST /api/users
// Register a new user
router.post("/", userController.registerUser);

// GET /api/users/:id
// Get a user by ID
router.get("/:id", userController.getUser);

export default router;