import React from 'react';


import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//curly braces in register destructure the input user form object.
async function register(username, name, password, phone, address) {
    const body = { username, name, password, phone, address };
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
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    //Take the token setter from the Auth hook's getter.
    const { tokenToStorage } = useAuthContext();

    //Error should rerender the page as we display the login errors to the user.
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        try {
            setError(null);
            const newToken = await register(username, name, password, phone, address);

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

            <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="login-form"  onSubmit={handleRegister}>
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
                    value={name}
                    onChange={handleFieldChange(setName)}
                    placeholder="name"
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

                {error && <p>{error}</p>}

                <button type="submit">
                    Register
                </button>

                <button type="button" onClick={() => navigate('/')} >
                    Back to Home
                </button>
            </form>

        </div>
    );
}