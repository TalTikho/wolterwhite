import { randomUUID } from 'crypto';

// In-memory array used to store users temporarily
// NOTE: Data will be lost whenever the server restarts
export const users = [];

export const getAllusers = () => users;

/**
 * Creates and stores a new user
 * 
 * @param {Object} userData - User data from request body
 * @returns {Object} Newly created user
 */
export const createUser = (userData) => {

    // Create a unique ID using the current timestamp
    const uniqueId = randomUUID().toString();
    
    // Create the user object
    const newUser = {
        id: uniqueId,
        username: userData.username,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        password: userData.password
    }

    // Store the user in the in-memory array
    users.push(newUser);

    return newUser;
};

/**
 * Gets a user by their unique ID
 * * @param {string} userId - The unique ID of the user
 * @returns {Object|undefined} The user object if found, otherwise undefined
 */
export const getUserById = (userId) => {

    const matchingUser = users.find(user => user.id === userId);

    return matchingUser;
};

/**
 * Authenticates user by checking name and password
 * @returns {Object|undefined} The user object if found, otherwise undefined
 */
export const authenticateUser = (username, password) => {
    return users.find((user) => user.username === username && user.password === password);
};