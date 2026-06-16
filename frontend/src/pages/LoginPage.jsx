import React from 'react';
import '../style/index.css';

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useSound } from '../hooks/useSound'

async function login(username, password) {
    const body = { username, password };
    //send a post request to tokens in api to register a token.
    const res = await sendPOST('/api/tokens', body);

    //release the token property from the api's response.
    const { token } = res;
    return token;
}

export const Login = () => {

    //Take the token setter from the Auth hook's getter.
    const { tokenToStorage } = useAuthContext();

    //Play and pause awesome soundbites using the useSound hook.
    const { pause, playSound: successLog, playSound: failLog } = useSound();

    //No need for the password to render the screen after we get the login but username should be available to render
    //for instance on welcoming toasts. Password useState and validation belong in the registration page.
    const [username, setUsername] = useState("");
    const passwordRef = useRef("");

    //Error should rerender the page as we display the login errors to the user.
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //We use location to get the error recieved from the protected page
    //the user (hacker) tried to access before logging in.
    const location = useLocation();


    useEffect(() => {
        try {
            //Avoid echoing from previous sounds.
            pause();
        }
        catch (error) {
            console.warn("No active sound when the page started.");
        }
        //We do not want to track pause. It needs to go once when login page is entered to pause any previous
        //(if there is) sound playing.
    }, []);
    useEffect(() => {
        // If the router passed us an authError state, put it on the screen!
        if (location.state && location.state.authError) {
            setError(location.state.authError);
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const password = passwordRef.current.value;
            setError(null);
            const newToken = await login(username, password);

            //Play awesome cooking soundBite because login is going to succeed.
            successLog('/IAmTheCook.wav');
            //set the token's state using AuthContext's setter.
            tokenToStorage(newToken);
            //navigate to HomePage (same address as landing but different page)
            //HomeRouter should find the token and send us to HomePage and not to LandingPage
            navigate("/");
        } catch (err) {
            setError(err.message);
            //Error loging in so we ask the user "WhoTheHellAreYou".
            failLog('/WhoTheHellAreYou.wav');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username" />
                <input ref={passwordRef} type="password" placeholder='Password' />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}