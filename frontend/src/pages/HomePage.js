import React, { useEffect, useState } from "react";
import "../style/index.css";
import "../style/HomePage.css";
import { BackG } from "../components/BgImage";
import { useAuthContext } from "../context/AuthContext";
import { RestaurantCard } from "../components/RestaurantCard";
import { RestaurantDetailsModal } from "../components/RestaurantDetailsModal";
import { sendGet } from "../services/api";
import { Toast, ToastContainer } from 'react-bootstrap';

export const Home = () => {
  const { token } = useAuthContext();
  
  // Extract username from token for the welcome message
  const username = token ? JSON.parse(atob(token.split(".")[1]))?.username : "Guest";

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [welcome, setWelcome] = useState(false);

  // State to track the currently selected restaurant for the quick view modal
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Handle welcome toast after login
  useEffect(() => {
    if (localStorage.getItem("justLoggedIn") && token) {
      setWelcome(true);
      localStorage.removeItem("justLoggedIn"); 
    }
  }, [token]);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await sendGet("/api/restaurants");
        setRestaurants(data);
      } catch (err) {
        console.warn("Backend server not reached, loading home mock data for testing:", err);
        
        // Fallback mock data: Updated property 'hours' to match backend schema and Modal
        setRestaurants([
          { 
            id: "1", 
            name: "Los Pollos Hermanos", 
            cuisine: "Fast Food, Chicken", 
            hours: "08:00 - 22:00", 
            minPrice: 15,
            description: "The finest ingredients are brought together with love and care and then slow cooked to perfection." 
          },
          { 
            id: "2", 
            name: "Burgertory", 
            cuisine: "Burgers & Shakes", 
            hours: "12:00 - 23:59", 
            minPrice: 22,
            description: "Taste our heavenly burgers made from locally sourced fresh beef." 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants based on search input
  const filtered = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="home-wrapper">
      <BackG />
      
      {/* Welcome Toast Notification */}
      <ToastContainer className="p-3"
        position="top-center"
        style={{ position: 'fixed', top: 0, zIndex: 9999, pointerEvents: 'none', color: "#0bd20b" }}>
        <Toast show={welcome} onClose={() => setWelcome(false)}
          delay={5000}
          autohide
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#C4BE00', 
            color: '#1C4028', 
            fontSize: 17           
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

        {/* Loading/Error/No Results States */}
        {loading && <p className="home-status">Loading restaurants...</p>}
        {error && <p className="home-status home-status--error">{error}</p>}
        {!loading && filtered.length === 0 && (
          <p className="home-status">No restaurants found for "{search}"</p>
        )}

        {/* Restaurant Grid */}
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

      {/* Quick View Modal */}
      <RestaurantDetailsModal 
        isOpen={!!selectedRestaurant} 
        onClose={() => setSelectedRestaurant(null)} 
        restaurant={selectedRestaurant} 
      />
    </div>
  );
};