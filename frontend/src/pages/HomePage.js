import React, { useEffect, useState } from "react";
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
  const { search, filters, cardsVisible } = useRestaurantFilter();
  
  const username = token ? JSON.parse(atob(token.split(".")[1]))?.username : "Guest";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
        console.warn("Backend server not reached, loading home mock data:", err);
        setRestaurants([
          { id: "1", name: "Los Pollos Hermanos", cuisine: "Fast Food, Chicken", hours: "08:00 - 22:00", minPrice: 15, description: "..." },
          { id: "2", name: "Burgertory", cuisine: "Burgers & Shakes", hours: "12:00 - 23:59", minPrice: 22, description: "..." }
        ]);
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
    const matchesAddress = filters.address
      ? r.address?.toLowerCase().includes(filters.address.toLowerCase())
      : true;
    return matchesName && matchesAddress;
  });

  return (
    <div className="home-wrapper">
      <BackG />
      
      <ToastContainer className="welcome-toast-container" position="top-center">
        <Toast show={welcome} onClose={() => setWelcome(false)} delay={5000} autohide className="welcome-toast">
          <Toast.Header>
            <strong className="me-auto">Welcome to WolterWhite</strong>
          </Toast.Header>
          <Toast.Body>Yeah, Mr. {username}! Yeah, Science!</Toast.Body>
        </Toast>
      </ToastContainer>

      {cardsVisible && (
        <div className="home-content">
          {loading && <p className="home-status">Loading restaurants...</p>}
          {!loading && filtered.length === 0 && (
            <p className="home-status">No restaurants found.</p>
          )}

          {!loading && (
            <div className="home-grid">
              {filtered.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  onQuickView={() => setSelectedRestaurant(restaurant)} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      <RestaurantDetailsModal 
        isOpen={!!selectedRestaurant} 
        onClose={() => setSelectedRestaurant(null)} 
        restaurant={selectedRestaurant} 
      />
    </div>
  );
};