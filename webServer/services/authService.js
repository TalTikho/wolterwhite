import * as userModel from "../models/userModel.js";

/**
 * Authenticates user by checking name and password
 * @returns {Object|undefined} The user object if found, otherwise undefined
 */
export const authenticateUser = (name, password) => {
    return userModel.users.find((user) => user.name === name && user.password === password);
};