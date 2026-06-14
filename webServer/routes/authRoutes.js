import express from "express";
import * as authController from "../controllers/authController.js";

// Create router instance
const router = express.Router();

// POST /api/tokens
// Show the information of a user by id
router.post("/", authController.login);


export default router;