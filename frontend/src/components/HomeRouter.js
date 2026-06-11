import React from 'react';
import '../index.css'; 
import { Landing }from '../pages/LandingPage'
import { Home } from '../pages/HomePage'

export const HomeRouter = () => {
const token = localStorage.getItem("token");

    //If the visitor has a wristband to enter the Nacho party, paint the public Landing Page UI
    if (!token) {
        return <Landing />; 
    }

    // If they do have a wristband, paint the private Dashboard UI
    return <Home />;
}