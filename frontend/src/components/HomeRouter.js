import React from 'react';
import '../index.css';
import { Landing } from '../pages/LandingPage'
import { Home } from '../pages/HomePage'
import { useAuthContext } from '../context/AuthContext';

export const HomeRouter = () => {
    //We are using a state so if the token changes the page actually changes.
    //For example if a user logs out after being logged in he will not be able to access
    //protected pages even if he does not refresh.

    const { token } = useAuthContext();
    //If the visitor has a wristband to enter the Nacho party, paint the public Landing Page UI
    //We pass it as onLoginSuccess to LandingPage.
    if (!token) {
        return <Landing />;
    }

    // If they do have a wristband, paint the private Dashboard UI
    return <Home />;
}