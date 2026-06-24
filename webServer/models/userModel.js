import mongoose from 'mongoose';
import { validationRules } from '../middleware/userRegistration.js';

const Schema = mongoose.Schema;


/**
 * Creates and stores a new user in database.
 * middleware gatekeeps invalid input and users with
 * direct access to the db are already authorized (mostly the devs)
 * so here we do another less thorough validation to prevent those with direct access to
 * ruin data.
 * We do not repeat as the logic in the imported middleware in still used here as is.
 * There are checks like 'unique' that are here and not in the middleware for separation of responsibility. 
 * 'type' check is easier in MOngoDB.
 */
const userSchema = new Schema({
    username: {
        type: String,

        required: true,
        unique: true, 
        minLength: validationRules.username.minLength.expect,
        match: validationRules.username.numbers_and_letters.expect
    },
    displayName: {
        type: String,
        required: true,
        minLength: validationRules.displayName.minLength.expect
    },
    phone: {
        type: String,
        required: true,
        match: validationRules.phone.pattern.expect

    },
    address: {
        type: String,
        required: true, 
        match: validationRules.address.pattern.expect
    },
    password: {
        type: String,
        required: true, 
        minLength: validationRules.password.minLength.expect
    },
    profilePic: {
        type: String,
        required: true
    }

});


export const User = mongoose.model('User', userSchema);