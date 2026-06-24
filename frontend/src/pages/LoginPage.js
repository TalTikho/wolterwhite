import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { useSound } from '../hooks/useSound';
import '../style/index.css';
import '../style/Login.css';

async function login(username, password) {
    const res = await sendPOST('/api/tokens', { username, password });
    return res.token;
}

export const Login = () => {
    const { tokenToStorage } = useAuthContext();
    const { pause, playSound: successLog, playSound: failLog } = useSound();
    const [username, setUsername] = useState("");
    const passwordRef = useRef("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        try {
            pause();
        } catch (error) {
            console.warn("No active sound when the page started.");
        }
    }, [pause]);

    useEffect(() => {
        if (location.state && location.state.authError) {
            setError(location.state.authError);
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const pwd = passwordRef.current.value.trim();
        const usr = username.trim();
        
        if (pwd === "" && usr === "") {
            setError("Please fill all the fields\n");
            return;
        }
        if (usr === "") {
            setError("Please enter your username\n");
            return;
        }
        if (pwd === "") {
            setError("Please enter your password\n");
            return;
        }

        try {
            setError(null);
            const newToken = await login(usr, pwd);
            successLog('/IAmTheCook.wav');
            tokenToStorage(newToken);
            //avoid race condition
            setTimeout(() => navigate("/"), 500);
        } catch (err) {
            setError(err.message);
            failLog('/WhoTheHellAreYou.wav');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo">Wo</span>
                    <h2 className="login-title">LTerWhite Delivery</h2>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="login-input" />
                    <input ref={passwordRef} type="password" placeholder="Password" className="login-input" />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="navbar-btn navbar-btn-outline login-btn">Login</button>
                    <button type="button" onClick={() => navigate('/')} className="navbar-btn navbar-btn-ghost login-btn">Back to Home</button>
                </form>
            </div>
        </div>
    );
};