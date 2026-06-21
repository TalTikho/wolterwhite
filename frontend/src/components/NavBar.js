import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { useRestaurantFilter } from '../context/RestaurantFilterContext';
import { sendGet } from '../services/api';

export const Navbar = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const { token, user, logOut } = useAuthContext();
    const {
        search,
        setSearch,
        filters,
        updateFilter,
        clearFilters,
        cardsVisible,
        toggleCardsVisible,
    } = useRestaurantFilter();
    
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const [displayName, setDisplayName] = useState("Operator");
    const [profilePic, setProfilePic] = useState("/knock.png");

    useEffect(() => {
        const setParams = async () => {
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setDisplayName(payload.displayName);
                    const binaryImage = await sendGet(`/api/images/${payload.profilePic}`);
                    const imageURL = URL.createObjectURL(binaryImage);
                    setProfilePic(imageURL);
                } catch (error) {
                    console.error("Error decoding token in Navbar:", error);
                }
            }
        }
        setParams();
        return () => {
            if (profilePic !== "/knock.png") URL.revokeObjectURL(profilePic);
        };
    }, [token]);

    const handleLogout = () => {
        logOut();
        navigate('/login');
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo-square">Wo</span>
                <span className="navbar-title">LTerWhite Delivery</span>
            </div>

            <div className="navbar-search-wrapper">
                <input
                    type="text"
                    placeholder="🔍 Search restaurants..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="navbar-search-input"
                />

                <div className="navbar-filter" ref={filterRef}>
                    <button type="button" onClick={() => setFilterOpen(prev => !prev)} className="navbar-btn navbar-btn-outline">
                        Filter
                    </button>
                    {filterOpen && (
                        <div className="navbar-filter-popup">
                            <label htmlFor="filter-address">Address contains</label>
                            <input
                                id="filter-address"
                                type="text"
                                value={filters.address}
                                onChange={e => updateFilter('address', e.target.value)}
                                className="navbar-filter-input"
                            />
                            <button type="button" onClick={clearFilters} className="navbar-btn navbar-btn-ghost">Clear</button>
                        </div>
                    )}
                </div>

                <button type="button" onClick={toggleCardsVisible} className="navbar-btn navbar-btn-outline">
                    {cardsVisible ? 'Clear' : 'Show'}
                </button>
            </div>

            <div className="navbar-controls">
                <button onClick={toggleTheme} id="theme-toggle" aria-label="Toggle theme">
                    <img src="/WolterWhiteLightTheme.png" alt="Light" className="icon-light" />
                    <img src="/GusFringDarkTheme.png" alt="Dark" className="icon-dark" />
                </button>

                <div className="navbar-profile-section">
                    {token ? (
                        <>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="navbar-btn navbar-btn-outline">Admin</Link>
                            )}
                            <Link to="/orders" className="navbar-btn navbar-btn-outline">Orders</Link>
                            <div className="navbar-user-info">
                                <img src={profilePic} alt="Avatar" className="navbar-avatar" />
                                <span className="navbar-username">{displayName}</span>
                            </div>
                            <button onClick={handleLogout} className="navbar-btn navbar-btn-danger">Log Out</button>
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