import React, { useEffect, useState } from "react";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { useRestaurantFilter } from "../context/RestaurantFilterContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { sendGet } from "../services/api";
import { Toast, ToastContainer } from 'react-bootstrap';

export const Home = () => {
  const { token } = useAuthContext();
  const { search, filters, cardsVisible } = useRestaurantFilter();
  //payload is in the middle, we need to convert it from base64.
  const payload = JSON.parse(atob(token.split(".")[1]));
  //get the username from the payload.
  const username = payload.username;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [welcome, setWelcome] = useState(false);
  //useEffect to inject the welcoming bootstrap toast into the Homepage 
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

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await sendGet("/api/restaurants");
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRestaurants();

    // Poll every 1 second so newly created restaurants show up
    // without the user needing to refresh the page.
    const intervalId = setInterval(fetchRestaurants, 1000);

    // Stop polling when the component unmounts (e.g. user navigates away)
    return () => clearInterval(intervalId);
  }, []);

  const filtered = restaurants.filter((r) => {
    const matchesName = r.name?.toLowerCase().includes(search.toLowerCase());

    // Address filter — substring match against the restaurant's address.
    // Once x/y coordinates are added, a distance-based check would slot in
    // here alongside (or instead of) the text match.
    const matchesAddress = filters.address
      ? r.address?.toLowerCase().includes(filters.address.toLowerCase())
      : true;

    return matchesName && matchesAddress;
  });
  return (
    <div className="home-wrapper">
      <BackG />
      <ToastContainer className="welcome-toast-container" position="top-center">
        <Toast show={welcome} onClose={() => setWelcome(false)}
          delay={5000}
          autohide
          className="welcome-toast">
          <button
            className="welcome-toast__close"
            onClick={() => setWelcome(false)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="welcome-toast__content">
            <span className="welcome-toast__title">Welcome to WolterWhite</span>
            <span className="welcome-toast__message">Yeah, Mr. {username}! Yeah, Science!</span>
          </div>
        </Toast>
      </ToastContainer>
      {/* When cardsVisible is false, this whole block is skipped, leaving
          just the background image showing through — that's the "Clear"
          toggle in the navbar. */}
      {cardsVisible && (
        <div className="home-content">
          {/* States */}
          {loading && <p className="home-status">Loading restaurants...</p>}
          {error && <p className="home-status home-status--error">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="home-status">No restaurants found for "{search}"</p>
          )}

          {/* Grid */}
          {!loading && !error && (
            <div className="home-grid">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};