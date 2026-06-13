import React from 'react';
import '../index.css';
import { Landing } from '../pages/LandingPage'
import { Home } from '../pages/HomePage'
import { useState } from 'react';

export const HomeRouter = () => {
    //We are using a state so if the token changes the page actually changes.
    //For example if a user logs out after being logged in he will not be able to access
    //protected pages even if he does not refresh.

    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLoginSuccess = (newtoken)=>{
        setToken(newtoken);
    }
    //If the visitor has a wristband to enter the Nacho party, paint the public Landing Page UI
    //We pass it as onLoginSuccess to LandingPage.
    if (!token) {
        return <Landing onLoginSuccess={handleLoginSuccess}/>;
    }

    // If they do have a wristband, paint the private Dashboard UI
    return <Home />;
}