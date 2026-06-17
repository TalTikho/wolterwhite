import React, { useEffect, useState } from "react";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { sendGet } from "../services/api";

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

  //useEffect to inject the alert js method into the Homepage
  //without blocking the rendering alltogether.
  //justLoggedIn is no longer neccesary. We want to
  //welcome the user only once after login.
  useEffect(() => {
    if (localStorage.getItem("justLoggedIn")) {
      alert("Welcome " + username);
      localStorage.removeItem("justLoggedIn"); // clear it so it won't show again
    }
  }, [username]);

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
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
