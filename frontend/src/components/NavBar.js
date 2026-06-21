import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { useRestaurantFilter } from '../context/RestaurantFilterContext';

export const Navbar = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const { token, logOut } = useAuthContext();
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

    // Close the filter popup when clicking anywhere outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        window.location.reload();
    };

    return (
        <nav className="navbar-container">
            {/* Brand */}
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo-square">Wo</span>
                <span className="navbar-title">LTerWhite Delivery</span>
            </div>

            {/* Center: search bar — only relevant once logged in */}

                <div className="navbar-search-wrapper">
                    <input
                        type="text"
                        placeholder="🔍 Search restaurants..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="navbar-search-input"
                    />

                    {/* Filter button + popup. Filters by address today; later this
                        popup can grow extra fields (e.g. a distance filter once we
                        have x/y coordinates) — just add another input bound to
                        updateFilter('newKey', value). */}
                    <div className="navbar-filter" ref={filterRef}>
                        <button
                            type="button"
                            onClick={() => setFilterOpen(prev => !prev)}
                            className="navbar-btn navbar-btn-outline"
                            aria-haspopup="true"
                            aria-expanded={filterOpen}
                        >
                            Filter
                        </button>

                        {filterOpen && (
                            <div className="navbar-filter-popup">
                                <label className="navbar-filter-label" htmlFor="filter-address">
                                    Address contains
                                </label>
                                <input
                                    id="filter-address"
                                    type="text"
                                    placeholder="e.g. Tel Aviv"
                                    value={filters.address}
                                    onChange={e => updateFilter('address', e.target.value)}
                                    className="navbar-filter-input"
                                />
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="navbar-btn navbar-btn-ghost navbar-filter-clear"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Toggles the restaurant grid on/off without touching the data itself */}
                    <button
                        type="button"
                        onClick={toggleCardsVisible}
                        className="navbar-btn navbar-btn-outline"
                    >
                        {cardsVisible ? 'Clear' : 'Show'}
                    </button>
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