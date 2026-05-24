import * as userModel from "../models/userModel.js";

/**
 * Handles user registration
 */
export const registerUser = (req, res) => {

    // Extract user data from request body
    const userData = req.body;

    // Validate required fields
    if (
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

    // Return created user
    res
        .status(201)
        .location(`/api/users/${newUser.id}`)
        .json(newUser);
};