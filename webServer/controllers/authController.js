import * as authService from "../services/authService.js";

/**
 * Handles login request
 */
export const login = (req, res) => {
    // Destructuring
    const { name, password } = req.body;

    // Call service to authenticate
    const user = authService.authenticateUser(name, password);

    // If user not found (authentication failed), return 401 Unauthorized
    if (!user) {
        return res
            .status(401)
            .json({ error: "Invalid name or password" });
    }

    // Return the user ID on success
    return res
        .status(200)
        .json({ id: user.id });
};