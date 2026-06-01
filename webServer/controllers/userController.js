import * as userModel from "../models/userModel.js";

import crypto from 'crypto';

// Helper function to check if a user is actually connected to the site.
export const is_user_connected = (req, res) => {
    // get id from header.
    const userID = req.headers['x-user-id'];
    if (userID && userModel.getUserById(userID)) {
        return userID
    }
    // guest does not need an id. It is just default for a state without connected users.
    return 'guest' + crypto.randomUUID().toString();

}

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

    // Create the user using the model layer
    const newUser = userModel.createUser(userData);

    // Create userResponse without returning the password
    const { password, ...userResponse } = newUser;

    // Return created user
    return res
        .status(201)
        .location(`/api/users/${newUser.id}`)
        .json(userResponse);
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
    if(!user){
        return res
            .status(404)
            .json({ error: "User not found" });
    }

    // Return the user with 200 OK
    return res
        .status(200)
        .json(user);
};