import * as userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'node:path'

const __dirname = import.meta.dirname;

dotenv.config({ path: './config/.env' });

// for safety reasons the env files are in .gitignore so hardcoded 5000 is a fallback
const key = process.env.JWT_SECRET || "BlueStuff@"



/**
 * Handles user registration
 */
export const registerUser = (req, res) => {
    const userData = req.body;
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
        displayName: newUser.displayName,
        id: newUser.id,
        profilePic: newUser.profilePic,
        address: newUser.address,
        username: newUser.username
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


export const getImage = (req, res) => {
    const filename =  req.params.filename;
    const imageURL = path.join(__dirname, '../uploads', filename);
    res.setHeader('Content-Type', 'image/png');
    //help api.js findout this is an image.
    res.sendFile(imageURL);


}