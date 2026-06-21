import * as userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'node:path';

const __dirname = import.meta.dirname;

dotenv.config({ path: './config/.env' });

const key = process.env.JWT_SECRET || "BlueStuff@";

export const login = (req, res) => {
    const { username, password } = req.body;
    const user = userModel.authenticateUser(username, password);

    if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const data = {
        username: user.username,
        displayName: user.displayName,
        id: user.id,
        profilePic: user.profilePic
    };
    
    const token = jwt.sign(data, key);
    return res.status(201).json({ token });
};

export const registerUser = (req, res) => {
    const userData = req.body;
    
    if (userModel.users.some(user => user.username == userData.username)) {
        return res.status(409).json({ error: 'User with the same username already exists' });
    }
    
    const newUser = userModel.createUser(userData);
    const { password, ...userResponse } = newUser;

    const data = {
        username: newUser.username,
        displayName: newUser.displayName,
        id: newUser.id,
        profilePic: newUser.profilePic
    };
    
    const token = jwt.sign(data, key);
    return res.status(201).json({ token });
};

export const getUser = (req, res) => {
    const userId = req.params.id;
    const user = userModel.getUserById(userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
};

export const getImage = (req, res) => {
    const filename = req.params.filename;
    const imageURL = path.join(__dirname, '../uploads', filename);
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(imageURL);
};