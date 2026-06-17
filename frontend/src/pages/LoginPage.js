import '../style/index.css';
import '../style/Login.css';

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
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
            //Error loging in so we ask the user "WhoTheHellAreYou".
            failLog('/WhoTheHellAreYou.wav');
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
                <form>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        className="login-input"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                        className="login-input"
                    />

                    <button onClick={handleLogin} className="navbar-btn navbar-btn-outline login-btn" type='submit'>
                        Login
                    </button>
                </form>


                {error && <p className="login-error">{error}</p>}

                <button type="button" onClick={() => navigate('/')} className="navbar-btn navbar-btn-ghost login-btn">
                    Back to Home
                </button>
            </div>
        </div>

    );
};