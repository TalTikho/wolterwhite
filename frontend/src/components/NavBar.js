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
    nearMeOnly,
    toggleNearMeOnly,
    nearMeRadiusKm,
  } = useRestaurantFilter();
  const navigate = useNavigate();

  // Filter popup open/close state, plus a ref so we can detect clicks
  // landing outside the popup and close it.

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close the filter popup when clicking anywhere outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
          const binaryImage = await sendGet(
            `/api/images/${payload.profilePic}`,
          );
          //construct a temp URL so we can view and use the image.
          const imageURL = URL.createObjectURL(binaryImage);
          setProfilePic(imageURL);
        } catch (error) {
          console.error("Error decoding token in Navbar:", error);
        }
      }
    };
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
    navigate("/login");
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
          onChange={(e) => setSearch(e.target.value)}
          className="navbar-search-input"
        />
        {/* Filter button + popup. Filters by address, search scope
                        (restaurant/product/both), and the "near me" radius —
                        all grouped together since they're all ways of
                        narrowing down the same restaurant list. */}
        <div className="navbar-filter" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
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
                onChange={(e) => updateFilter("address", e.target.value)}
                className="navbar-filter-input"
              />
              <hr className="navbar-filter-divider" />
              <span className="navbar-filter-label">
                The search bar above matches
              </span>
              <div className="navbar-filter-scope">
                <label className="navbar-filter-scope-option">
                  <input
                    type="radio"
                    name="search-scope"
                    value="both"
                    checked={(filters.searchScope || "both") === "both"}
                    onChange={() => updateFilter("searchScope", "both")}
                  />
                  Restaurant &amp; product
                </label>
                <label className="navbar-filter-scope-option">
                  <input
                    type="radio"
                    name="search-scope"
                    value="restaurant"
                    checked={filters.searchScope === "restaurant"}
                    onChange={() => updateFilter("searchScope", "restaurant")}
                  />
                  Restaurant only
                </label>
                <label className="navbar-filter-scope-option">
                  <input
                    type="radio"
                    name="search-scope"
                    value="product"
                    checked={filters.searchScope === "product"}
                    onChange={() => updateFilter("searchScope", "product")}
                  />
                  Product only
                </label>
              </div>
              {/* Wolt-style "near me" radius toggle — on by default.
                                Styled like the radio rows above so it reads as
                                part of the same filter group instead of a
                                separate action. */}
              <label className="navbar-filter-scope-option">
                <input
                  type="checkbox"
                  checked={nearMeOnly}
                  onChange={toggleNearMeOnly}
                />
                Only within {nearMeRadiusKm}km
              </label>
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
          {cardsVisible ? "Clear" : "Show"}
        </button>
      </div>
      {/* Right-side controls */}
      <div className="navbar-controls">
        <button
          onClick={toggleTheme}
          id="theme-toggle"
          aria-label="Toggle theme"
        >
          <img
            src="/WolterWhiteLightTheme.png"
            alt="Walter White"
            className="icon-light"
          />
          <img
            src="/GusFringDarkTheme.png"
            alt="Gus Fring"
            className="icon-dark"
          />
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
            <button
              onClick={handleLogout}
              className="navbar-btn navbar-btn-danger"
            >
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