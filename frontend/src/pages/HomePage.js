import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { useRestaurantFilter } from "../context/RestaurantFilterContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { RestaurantDetailsModal } from "../components/RestaurantDetailsModal";
import { sendGet } from "../services/api";
import { Toast, ToastContainer } from 'react-bootstrap';

export const Home = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { search, filters, cardsVisible } = useRestaurantFilter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [welcome, setWelcome] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setDisplayName(payload?.displayName || "User");
        
        if (payload?.username?.toLowerCase() === "admin1") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("Error parsing token payload:", e);
      }
    }
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") && token) {
      setWelcome(true);
      localStorage.removeItem("justLoggedIn");
    }
  }, [token]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await sendGet("/api/restaurants");
        setRestaurants(data);
      } catch (err) {
        setRestaurants([{ id: "1", name: "Los Pollos Hermanos", cuisine: "Fast Food, Chicken", hours: "08:00 - 22:00", minPrice: 15, description: "..." }]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
    const intervalId = setInterval(fetchRestaurants, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filtered = restaurants.filter((r) => {
    const matchesName = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchesAddress = filters.address ? r.address?.toLowerCase().includes(filters.address.toLowerCase()) : true;
    return matchesName && matchesAddress;
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
              <button 
                className="btn btn-warning btn-lg fw-bold px-5 py-3 shadow"
                onClick={() => navigate("/admin")}
              >
                ⚙️ Open Admin Dashboard
              </button>
            </div>
          )}

          {loading && <p className="home-status">Loading restaurants...</p>}
          {!loading && filtered.length === 0 && <p className="home-status">No restaurants found.</p>}
          {!loading && (
            <div className="home-grid">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} onQuickView={() => setSelectedRestaurant(restaurant)} />
              ))}
            </div>
          )}
        </div>
      )}
      <RestaurantDetailsModal isOpen={!!selectedRestaurant} onClose={() => setSelectedRestaurant(null)} restaurant={selectedRestaurant} />
    </div>
  );
};