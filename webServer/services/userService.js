import * as userModel from "../models/userModel.js";

/**
 * Creates and stores a new user
 * 
 * @param {Object} userData - User data from request body
 * @returns {Object} Newly created user
 */
export const createUser = (userData) => {

    // Create a unique ID using the current timestamp
    const id = Date.now().toString();

    // Create the user object
    const newUser = userModel.createUserObject(
        id,
        userData.name,
        userData.phone,
        userData.address,
        userData.password
    );

    // Store the user in the in-memory array
    userModel.users.push(newUser);

    return newUser;
};