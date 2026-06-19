import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { sendGet } from '../services/api';

export const Navbar = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const { token, logOut } = useAuthContext();
    const navigate = useNavigate();


    //We should update the screen if the user's credentials are retrieved.
    const [displayName, setDisplayName] = useState("Operator");
    const [profilePic, setProfilePic] = useState("/knock.png");

    useEffect(() => {
        //helper method to make an async call inside useEffect.
        const setParams = async () => {
            if (token) {
                try {
                    //parse the 64base token to a json.
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    //extract the username and the profilePic binary.
                    setDisplayName(payload.displayName);
                    //get the binary's url through a token validating get request.
                    const binaryImage = await sendGet(`/api/images/${payload.profilePic}`);
                    //construct a temp URL so we can view and use the image.
                    const imageURL = URL.createObjectURL(binaryImage);
                    setProfilePic(imageURL);
                } catch (error) {
                    console.error("Error decoding token in Navbar:", error);
                }
            }
        }
        setParams();
        //cleanup the URL so we do not have a chunk of URLs in RAM if a user logs in and out many times.
        return () => {
            if (profilePic !== "/knock.png") {
                URL.revokeObjectURL(profilePic);
                console.log("Memory freed!");
            }
        };
    }, [token]);



    const handleLogout = () => {
        logOut();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar-container">
            {/* Brand */}
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo-square">WoLTerWhite Delivery</span>
                <span className="navbar-title"></span>
            </div>

            {/* Right-side controls */}
            <div className="navbar-controls">
                <button onClick={toggleTheme} id="theme-toggle" aria-label="Toggle theme">
                    <img src="/WolterWhiteLightTheme.png" alt="Walter White" className="icon-light" />
                    <img src="/GusFringDarkTheme.png" alt="Gus Fring" className="icon-dark" />
                </button>

                {token ? (
                    <div className="navbar-profile-section">
                        <Link to="/orders" className="navbar-btn navbar-btn-outline">Orders</Link>
                        <div className="navbar-user-info">
                            <img src={profilePic} alt="Avatar" className="navbar-avatar" />
                            <span className="navbar-username">{displayName}</span>
                        </div>
                        <button onClick={handleLogout} className="navbar-btn navbar-btn-danger">
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="navbar-profile-section">
                        <Link to="/login" className="navbar-btn navbar-btn-outline">Login</Link>
                        <Link to="/register" className="navbar-btn navbar-btn-ghost">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};