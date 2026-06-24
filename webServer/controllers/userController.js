import * as userService from '../services/userService.js';
import { formatter } from '../services/mongoErrorFormatter.js';
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
export const registerUser = async (req, res) => {
    const userData = req.body;
    try {
        const newUser = await userService.createUser(userData);
        // Return the user token on success
        const data = {
            displayName: newUser.displayName,
            id: newUser.id,
            profilePic: newUser.profilePic,
            address: newUser.address,
            username: newUser.username
        };
        //delete the token after 1h.
        const token = jwt.sign(data, key, { expiresIn: '1h' });
        return await res.status(201).json({ token });
    }
    catch (err) {
        //catch double username error. The ids are unique due to mongo.
        if (err.code === 11000 && err.keyValue?.username) {
            return res.status(409).json({
                error: "This username is already taken."
            });
        }
        console.error("Server Error:", err); //Keeping this for logging.
        return res.status(500).json({
            error: "An unexpected error occurred. Please try again."
        });

    }

}

/**
 * Handles fetching a single user by ID
 */
export const getUser = async (req, res) => {

    try {
        // Get the ID from the URL parameters
        const userId = req.params.id;

        // Call the service to find the user
        const user = await userService.getUserById(userId);

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
    }
    catch (err) {

        console.error("Server Error:", err); //Keeping this for logging.
        return res.status(500).json({
            error: "An unexpected error occurred. Please try again."
        });

    }


};

//multer is synchronous
export const getImage = (req, res) => {
    const filename = req.params.filename;
    const imageURL = path.join(__dirname, '../uploads', filename);
    res.setHeader('Content-Type', 'image/png');
    //help api.js findout this is an image.
    res.sendFile(imageURL);


}