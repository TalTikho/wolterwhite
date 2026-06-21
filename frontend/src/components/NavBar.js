import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';

export const Navbar = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const { token, user, logOut } = useAuthContext(); // Assuming user is available here
    const navigate = useNavigate();

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
        logOut();
        navigate('/login');
        // Removed window.location.reload() for a smoother SPA experience
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo-square">WoLTerWhite Delivery</span>
            </div>

            <div className="navbar-controls">
                <button onClick={toggleTheme} id="theme-toggle" aria-label="Toggle theme">
                    <img src="/WolterWhiteLightTheme.png" alt="Light" className="icon-light" />
                    <img src="/GusFringDarkTheme.png" alt="Dark" className="icon-dark" />
                </button>

                <div className="navbar-profile-section">
                    {token ? (
                        <>
                            {/* Role-based rendering: Only show Admin if user has the correct role */}
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="navbar-btn navbar-btn-outline">Admin</Link>
                            )}
                            <Link to="/orders" className="navbar-btn navbar-btn-outline">Orders</Link>
                            
                            <div className="navbar-user-info">
                                <img src={profilePic} alt="Avatar" className="navbar-avatar" />
                                <span className="navbar-username">{displayName}</span>
                            </div>
                            <button onClick={handleLogout} className="navbar-btn navbar-btn-danger">
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-btn navbar-btn-outline">Login</Link>
                            <Link to="/register" className="navbar-btn navbar-btn-ghost">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};