import React from 'react';
import '../style/index.css';

import { useEffect } from 'react';
import { BackG } from '../components/BgImage';
import { useAuthContext } from '../context/AuthContext';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';

export const Home = () => {

    const { token } = useAuthContext();
    //payload is in the middle, we need to convert it from base64.
    const payload = JSON.parse(atob(token.split(".")[1]));
    //get the username from the payload.
    const username = payload.username;
    const [welcome, setWelcome] = useState(false);
    //useEffect to inject the alert js method into the Homepage 
    //without blocking the rendering alltogether.
    //justLoggedIn is no longer neccesary. We want to
    //welcome the user only once after login.
    useEffect(() => {
        if (localStorage.getItem("justLoggedIn")) {
            setWelcome(true);
            localStorage.removeItem("justLoggedIn"); // clear it so it won't show again
        }
        //run exactly once whenthe page opens.
    }, []);
    return (
        <div>
            <div>
                <h3>Wolterwhite</h3>
                <div className="Home">
                    <BackG />
                </div>
            </div>
            <ToastContainer className="p-3"
                position="top-center"
                style={{ position: 'fixed', top: 0, zIndex: 9999, pointerEvents: 'none', color: "#0bd20b" }}>
                <Toast show={welcome} onClose= {() => setWelcome(false)}
                    delay={5000}
                    autohide
                    style={{
                        pointerEvents: 'auto',
                        backgroundColor: '#C4BE00', // Wolt's gown color
                        color: '#1C4028' // The right green color           
                    }}>
                    <Toast.Header>
                        <strong className="me-auto">Welcome to WolterWhite</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>Yeah, Mr. {username}! Yeah, Science!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>


    );
}