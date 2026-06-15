import React from 'react';
import '../style/index.css';


import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useLocation } from 'react-router-dom';

async function login(username, password, onLoginSuccess) {
    const body = { username, password };
    //send a post request to tokens in api to register a token.
    const res = await sendPOST('/api/tokens', body);

    //set the token is localStorage to access it in future calls to backend api.
    const { token } = res;
    localStorage.setItem("token", token);
    //sanity check to make sure the func onLoginSuccess actually arrived.
    if (onLoginSuccess){
        //set the token state.
        onLoginSuccess(token);
    }
    //Welcome the user once after login, we
    //will remove justLoggedIn after welcoming the
    //user with an alert.
    localStorage.setItem("justLoggedIn", "true");
    return token;
}

export const Login = ({onLoginSuccess}) => {
    //No need for the password after we get the login but username should be reachable and updated.
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
            await login(username, password, onLoginSuccess);
            //navigate to HomePage (same address as landing but different page)
            //HomeRouter should find the token and send us to HomePage and not to LandingPage
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBackHome = async () =>{
        navigate ("/")
    };
    return (
        <div>
            <input value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" />
            <input ref={passwordRef} type="password" placeholder='Password' />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleBackHome}> Back</button>
        </div>
    );
}