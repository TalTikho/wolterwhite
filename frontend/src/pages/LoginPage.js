import React from 'react';
import '../style/index.css';


import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

async function login(username, password) {
    const body = { username, password };
    //send a post request to tokens in api to register a token.
    const res = await sendPOST('/api/tokens', body);

    //release the token property from the api's response.
    const { token } = res;
    return token;
}

export const Login = () => {
    //No need for the password to render the screen after we get the login but username should be available to render
    //for instance on welcoming toasts.

    //Take the token setter from the Auth hook's getter.
    const { tokenToStorage } = useAuthContext();

    const [username, setUsername] = useState("");
    const passwordRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        // If the router passed us an authError state, put it on the screen!
        if (location.state && location.state.authError) {
            setError(location.state.authError);
        }
    }, [location]);
    const handleLogin = async () => {
        try {
            setError(null);
            const password = passwordRef.current.value;
            const newToken = await login(username, password);

            //set the token's state using AuthContext's setter.
            tokenToStorage(newToken);
            //navigate to HomePage (same address as landing but different page)
            //HomeRouter should find the token and send us to HomePage and not to LandingPage
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <input value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" />
            <input ref={passwordRef} type="password" placeholder='Password' />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}