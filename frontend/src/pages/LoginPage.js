import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import '../style/index.css';
import '../style/Login.css';

export const Login = () => {
    const [username, setUsername] = useState("");
    const passwordRef = useRef(null);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const { tokenToStorage } = useAuthContext();

    useEffect(() => {
        if (location.state?.authError) {
            setError(location.state.authError);
        }
    }, [location]);

    const handleLogin = async () => {
        try {
            setError(null);
            
            // 1. Post credentials to your backend endpoint
            const body = { username, password: passwordRef.current.value };
            const res = await sendPOST('/api/tokens', body);
            
            // 2. Feed the received token directly into your Context State Manager!
            // This safely updates both localStorage AND the reactive state simultaneously.
            if (res && res.token) {
                tokenToStorage(res.token);
                
                // 3. Navigate cleanly to your root viewport router gateway
                navigate("/home");
            } else {
                throw new Error("Authentication response did not contain an access token.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo">Wo</span>
                    <h2 className="login-title">LTerWhite Delivery</h2>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Username"
                    className="login-input"
                />
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    onKeyDown={handleKeyDown}
                    className="login-input"
                />

                {error && <p className="login-error">{error}</p>}

                <button onClick={handleLogin} className="navbar-btn navbar-btn-outline login-btn">
                    Login
                </button>
                <button onClick={() => navigate('/')} className="navbar-btn navbar-btn-ghost login-btn">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    );
};