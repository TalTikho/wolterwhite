import * as userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

/**
 * Handles user registration
 */
export const registerUser = (req, res) => {

    // Extract user data from request body
    const userData = req.body;

    // Validate required fields
    if (
        !userData.username?.trim() ||
        !userData.name?.trim() ||
        !userData.phone?.trim() ||
        !userData.address?.trim() ||
        !userData.password?.trim()
    ) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }
    //Make sure the username is unique.
    if (userModel.users.some(user => user.username == userData.username)) {
        return res.status(409).json({ error: 'User with the same username already exists' });
    }
    // Create the user using the model layer
    const newUser = userModel.createUser(userData);
    // Create userResponse without returning the password
    const { password, ...userResponse } = newUser;

    // Return the user token on success
    const data = {
        username: user.username,
        id: user.id
    };
    const token = jwt.sign(data, key)
    return res.status(201).json({ token });
};

/**
 * Handles fetching a single user by ID
 */
export const getUser = (req, res) => {

    // Get the ID from the URL parameters
    const userId = req.params.id;

    // Call the service to find the user
    const user = userModel.getUserById(userId);

    // If user is not found, return 404
    if (!user) {
        return res
            .status(404)
            .json({ error: "User not found" });
    }

    // Return the user with 200 OK
    return res
        .status(200)
        .json(user);
};