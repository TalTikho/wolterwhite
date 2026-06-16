import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export const Navbar = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    let displayName = "Operator";
    let profilePic = "/knock.png";

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            displayName = payload.displayName || payload.username;
            profilePic = payload.profilePic || "/knock.png";
        } catch (error) {
            console.error("Error decoding token in Navbar:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("justLoggedIn");
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar-container">
            {/* Brand */}
            <div className="navbar-brand" onClick={() => navigate(token ? '/home' : '/')}>
                <span className="navbar-logo-square">WoLTerWhite Delivery</span>
                <span className="navbar-title"></span>
            </div>

            {/* Right-side controls */}
            <div className="navbar-controls">
                {/* Theme toggle */}
                <button onClick={toggleTheme} id="theme-toggle" aria-label="Toggle theme">
                    <img src="/WolterWhiteLightTheme.png" alt="Walter White" className="icon-light" />
                    <img src="/GusFringDarkTheme.png" alt="Gus Fring" className="icon-dark" />
                </button>

                {token ? (
                    <div className="navbar-profile-section">
                        <Link to="/orders" className="navbar-btn navbar-btn-outline">
                            Orders
                        </Link>
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
                        <Link to="/login" className="navbar-btn navbar-btn-outline">
                            Login
                        </Link>
                        <Link to="/register" className="navbar-btn navbar-btn-ghost">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};