import { User } from "../models/userModel.js";

export const getAllusers = async () => { return await User.find({}); };
export const getUserById = async (id) => { return await User.findById(id); };

export const createUser = async (userData) => {
    //All fields are required so we can create the full object right away and not field by field.
    console.log("PAYLOAD GOING TO MONGOOSE:", userData);
    const user = new User({
        username: userData.username,
        displayName: userData.displayName,
        phone: userData.phone,
        address: userData.address,
        password: userData.password,
        profilePic: userData.profilePic
    });
    if (!user) {
        return null;
    }
    return await user.save();
}
export const authenticateUser = async (username, password) => {
    return await User.findOne({ username: username, password: password });
};



