import React from 'react';
import '../style/index.css';
import '../style/Register.css'

import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//curly braces in register destructure the input user form object.
async function register(username, displayName, password, phone, address, profilePic) {
    const body = new FormData();
    body.append('username', username);
    body.append('displayName', displayName);
    body.append('password', password);
    body.append('phone', phone);
    body.append('address', address);

    if (profilePic) {
        body.append('profilePic', profilePic);
    }
    //send a post request to tokens in api to register a token.
    const res = await sendPOST('/api/users', body);

    //release the token property from the api's response.
    const { token } = res;
    return token;
}
const handleFieldChange = (stateSetter) => (e) => {
    stateSetter(e.target.value);
};

export const Register = () => {
    //We check username and password constantly so they are in useState but the other values can
    //be useRef as they are not restricted.
    //However due to the form's for uniformity and order
    //all are in useState.

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const profilePicRef = useRef(null);

    //Take the token setter from the Auth hook's getter.
    const { tokenToStorage } = useAuthContext();

    //Error should rerender the page as we display the login errors to the user.
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            //extract the image.
            const profilePic = profilePicRef.current.files[0];
            const newToken = await register(username, displayName, password, phone, address, profilePic);

            //set the token's state using AuthContext's setter.
            tokenToStorage(newToken);
            //navigate to HomePage (same address as landing but different page)
            //HomeRouter should find the token and send us to HomePage and not to LandingPage
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <div className='register-form-container '>
                <form onSubmit={handleRegister}>
                    <input
                        value={username}
                        onChange={handleFieldChange(setUsername)}
                        placeholder="Username"
                    />
                    <input
                        value={password}
                        onChange={handleFieldChange(setPassword)}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        value={displayName}
                        onChange={handleFieldChange(setDisplayName)}
                        placeholder="Display Name"
                    />
                    <input
                        value={phone}
                        onChange={handleFieldChange(setPhone)}
                        placeholder="phone"
                    />
                    <input
                        value={address}
                        onChange={handleFieldChange(setAddress)}
                        placeholder="address"
                    />
                    <input type='file' id='profilePic' ref={profilePicRef} accept="image/*"

                    />


                    {error && <p className='register-error'>{error}</p>}

                    <button type="submit">
                        Register
                    </button>

                    <button type="button" onClick={() => navigate('/')} >
                        Back to Home
                    </button>
                </form></div>


        </div>
    );
}