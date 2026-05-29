import * as userModel from "../models/userModel.js";

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

    // Return the user ID on success
    return res
        .status(200)
        .json({ id: user.id });
};