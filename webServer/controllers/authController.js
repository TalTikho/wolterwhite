import * as userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

// for safety reasons the env files are in .gitignore so hardcoded 5000 is a fallback
const key = process.env.JWT_SECRET || "BlueStuff@"
/**
 * Handles login request
 */
export const login = (req, res) => {
    // Destructuring
    const { username, password } = req.body;

    // Call service to authenticate
    const user = userModel.authenticateUser(username, password);

    // If user not found (authentication failed), return 401 Unauthorized
    if (!user) {
        return res
            .status(401)
            .json({ error: "Invalid username or password" });
    }

    // Return the user token on success
    const data = {
        displayName: user.displayName,
        id: user.id,
        profilePic: user.profilePic,
        address: user.address
    };
    const token = jwt.sign(data, key)
    return res.status(201).json({ token });
};
