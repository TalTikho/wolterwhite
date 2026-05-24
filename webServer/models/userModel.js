// In-memory array used to store users temporarily
// NOTE:
// Data will be lost whenever the server restarts
export const users = [];

/**
 * Creates a user object
 * 
 * @param {string} id - Unique user ID
 * @param {string} name - User's full name
 * @param {string} phone - User's phone number
 * @param {string} address - User's address
 * @param {string} password - User's password
 * 
 * @returns {Object} User object
 */
export const createUserObject = (id, name, phone, address, password) => {
    return {
        id,
        name,
        phone,
        address,
        password
    };
};