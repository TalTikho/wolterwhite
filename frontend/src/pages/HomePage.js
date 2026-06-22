import React, { useEffect, useState } from "react";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { useRestaurantFilter } from "../context/RestaurantFilterContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { sendGet } from "../services/api";
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { RestaurantDetailsModal } from "../components/RestaurantDetailsModal";

const COORD_PATTERN = /^\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/;
const parseCoordinates = (addressString) => {
  if (!addressString) return null;
  const match = addressString.trim().match(COORD_PATTERN);
  if (!match) return null;
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
};
const distanceKm = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const toNumber = (value) => {
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
};

export const Home = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { search, filters, cardsVisible, nearMeOnly, nearMeRadiusKm } = useRestaurantFilter();
  const payload = JSON.parse(atob(token.split(".")[1]));
  
  const userCoords = (() => {
    const x = toNumber(payload.x);
    const y = toNumber(payload.y);
    if (x !== null && y !== null) return { x, y };
    if (payload.address && typeof payload.address === 'string' && payload.address.includes('(')) {
      const cleanString = payload.address.replace(/[()]/g, '');
      const [rawX, rawY] = cleanString.split(',');
      const x = toNumber(rawX);
      const y = toNumber(rawY);
      if (x !== null && y !== null) return { x: x, y: y };
    }
    return parseCoordinates(payload.address);
  })();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn")) {
      setWelcome(true);
      localStorage.removeItem("justLoggedIn");
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setDisplayName(payload?.displayName || "User");
        setIsAdmin(payload?.username?.toLowerCase() === "admin1");
      } catch (e) {
        console.error("Error parsing token payload:", e);
      }
    }
  }, [token]);

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
    fetchRestaurants();
    const intervalId = setInterval(fetchRestaurants, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filtered = restaurants.filter((r) => {
    const searchLower = search.toLowerCase();
    const scope = filters.searchScope || 'both';
    const matchesName = r.name?.toLowerCase().includes(searchLower);
    const matchesProduct = r.products?.some((p) => p.pname?.toLowerCase().includes(searchLower));
    
    let matchesSearch;
    if (scope === 'restaurant') matchesSearch = matchesName;
    else if (scope === 'product') matchesSearch = matchesProduct;
    else matchesSearch = matchesName || matchesProduct;

    const matchesAddress = filters.address ? r.address?.toLowerCase().includes(filters.address.toLowerCase()) : true;
    
    let matchesRadius = true;
    const restX = toNumber(r.addressX);
    const restY = toNumber(r.addressY);
    if (nearMeOnly && userCoords && restX !== null && restY !== null) {
      matchesRadius = distanceKm(userCoords.x, userCoords.y, restX, restY) <= nearMeRadiusKm;
    }
    return matchesSearch && matchesAddress && matchesRadius;
  });

  return (
    <div className="home-wrapper">
      <BackG />
      <ToastContainer className="welcome-toast-container" position="top-center">
        <Toast show={welcome} onClose={() => setWelcome(false)} delay={5000} autohide className="welcome-toast">
          <Toast.Header><strong className="me-auto">Welcome to WolterWhite</strong></Toast.Header>
          <Toast.Body>Yeah, Mr. {displayName}! Yeah, Science!</Toast.Body>
        </Toast>
      </ToastContainer>
      {cardsVisible && (
        <div className="home-content">
          {isAdmin && (
            <div className="d-flex justify-content-center mb-4">
              <button className="btn btn-warning btn-lg fw-bold px-5 py-3 shadow" onClick={() => navigate("/admin")}>
                ⚙️ Open Admin Dashboard
              </button>
            </div>
          )}
          {loading && <p className="home-status">Loading restaurants...</p>}
          {error && <p className="home-status home-status--error">{error}</p>}
          {!loading && !error && filtered.length === 0 && search !== "" && (
            <p className="home-status">No restaurants found for "{search}"</p>
          )}
          {!loading && !error && (
            <div className="home-grid">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} onQuickView={() => setSelectedRestaurant(restaurant)} />
              ))}
            </div>
          )}
          <RestaurantDetailsModal isOpen={!!selectedRestaurant} onClose={() => setSelectedRestaurant(null)} restaurant={selectedRestaurant} />
        </div>
      )}
    </div>
  );
};