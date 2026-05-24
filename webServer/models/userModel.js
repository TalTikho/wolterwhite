import { randomUUID } from 'crypto';

// In-memory array used to store users temporarily
// NOTE: Data will be lost whenever the server restarts
export const users = [];

/**
 * Creates and stores a new user
 * 
 * @param {Object} userData - User data from request body
 * @returns {Object} Newly created user
 */
export const createUser = (userData) => {

    // Create a unique ID using the current timestamp
    const uniqueId = randomUUID();
    
    // Create the user object
    const newUser = {
        id: uniqueId,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        password: userData.password
    }

    // Store the user in the in-memory array
    users.push(newUser);

    return newUser;
};