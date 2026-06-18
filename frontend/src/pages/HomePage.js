import React, { useEffect, useState } from "react";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { sendGet } from "../services/api";
import { Toast, ToastContainer } from 'react-bootstrap';

export const Home = () => {
  const { token } = useAuthContext();
  //payload is in the middle, we need to convert it from base64.
  const payload = JSON.parse(atob(token.split(".")[1]));
  //get the username from the payload.
  const username = payload.username;

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
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
        setLoading(true);
        const data = await sendGet("/api/restaurants");
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="home-wrapper">
      <BackG />
      <ToastContainer className="p-3"
        position="top-center"
        style={{ position: 'fixed', top: 0, zIndex: 9999, pointerEvents: 'none', color: "#0bd20b" }}>
        <Toast show={welcome} onClose={() => setWelcome(false)}
          delay={5000}
          autohide
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#C4BE00', // Wolt's gown color
            color: '#1C4028' // The right green color           
          }}>
          <Toast.Header>
            <strong className="me-auto">Welcome to WolterWhite</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>Yeah, Mr. {username}! Yeah, Science!</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="home-content">
        {/* Search bar */}
        <div className="home-search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="home-search-input"
          />
        </div>

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
    </div>
  );

  
};
