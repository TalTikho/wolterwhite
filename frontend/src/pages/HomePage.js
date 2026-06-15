import React from 'react';
import '../style/index.css';

import { useEffect } from 'react';
import { BackG } from '../components/BgImage';

export const Home = () => {

    //token is saved after login as a string.
    const token = localStorage.getItem("token");
    //payload is in the middle, we need to convert it from base64.
    const payload = JSON.parse(atob(token.split(".")[1]));
    //get the username from the payload.
    const username = payload.username;
    //useEffect to inject the alert js method into the Homepage 
    //without blocking the rendering alltogether.
    //justLoggedIn is no longer neccesary. We want to
    //welcome the user only once after login.
    useEffect(() => {
        if (localStorage.getItem("justLoggedIn")) {
            alert("Welcome " + username);
            localStorage.removeItem("justLoggedIn"); // ← clear it so it won't show again
        }
    }, [username]);
    return (

        <div>
            <h3>Wolterwhite</h3>
            <p>Welcome, {username}!</p>
            <div className="Home">
                <BackG />
            </div>
        </div>


    );
}