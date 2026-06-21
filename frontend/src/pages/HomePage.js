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


// Same shape the registration middleware validates: "(x,y)", e.g. "(32.07, 34.79)".
const COORD_PATTERN = /^\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/;
// Parses an "(x,y)" address string into { x, y }. Returns null if the
// string is missing or doesn't match the expected format.
const parseCoordinates = (addressString) => {
  if (!addressString) return null;
  const match = addressString.trim().match(COORD_PATTERN);
  if (!match) return null;
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
};
// Straight-line distance in km between two points, assuming addressX/addressY
// are plain Cartesian coordinates already in kilometers. If these turn out to
// be real GPS latitude/longitude instead, swap this for the Haversine formula.
const distanceKm = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
// Coerces a coordinate value (string or number) into a number, returning
// null if it isn't a valid one. addressX/addressY come through as strings
// from the API (e.g. "1.5"), so a strict `typeof === "number"` check would
// always fail — this is the fix for that.
const toNumber = (value) => {
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
};

export const Home = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { search, filters, cardsVisible, nearMeOnly, nearMeRadiusKm } = useRestaurantFilter();
  //payload is in the middle, we need to convert it from base64.
  const payload = JSON.parse(atob(token.split(".")[1]));
  //get the username from the payload.
  const username = payload.username;
  // The logged-in user's own coordinates, used for the "near me" radius
  // filter. Handles either an already-numeric/numeric-string pair on the
  // token (payload.addressX/addressY) or a raw "(x,y)" address string.
  const userCoords = (() => {
    const x = toNumber(payload.x);
    const y = toNumber(payload.y);
    if (x !== null && y !== null) return { x, y };
    if (payload.address && typeof payload.address === 'string' && payload.address.includes('(')) {
      // 1. Remove the brackets: "(32.1,34.8)" becomes "32.1,34.8"
      const cleanString = payload.address.replace(/[()]/g, '');

      // 2. Split at the comma: ["32.1", "34.8"]
      const [rawX, rawY] = cleanString.split(',');

      const x = toNumber(rawX);
      const y = toNumber(rawY);

      if (x !== null && y !== null) {
        return { x: x, y: y };
      }
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
  //useEffect to inject the welcoming bootstrap toast into the Homepage
  //without blocking the rendering alltogether.
  //justLoggedIn is no longer neccesary. We want to
  //welcome the user only once after login.
  useEffect(() => {
    if (localStorage.getItem("justLoggedIn")) {
      setWelcome(true);
      localStorage.removeItem("justLoggedIn"); // clear it so it won't show again
    }
  }, []);
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

  //  useEffect(() => {
  //    if (localStorage.getItem("justLoggedIn") && token) {
  //      setWelcome(true);
  //      localStorage.removeItem("justLoggedIn");
  //    }
  //  }, [token]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await sendGet("/api/restaurants");
        setRestaurants(data);
      } catch (err) {
        setError("Failed to load restaurants.");
        setRestaurants([{ id: "1", name: "Los Pollos Hermanos", cuisine: "Fast Food, Chicken", hours: "08:00 - 22:00", minPrice: 15, description: "..." }]);
      } finally {
        setLoading(false);
      }
    };


    // Initial fetch
    fetchRestaurants();
    // Poll every 1 seconds so newly created restaurants show up
    // without the user needing to refresh the page.
    const intervalId = setInterval(fetchRestaurants, 1000);
    // Stop polling when the component unmounts (e.g. user navigates away)
    return () => clearInterval(intervalId);
  }, []);

  const filtered = restaurants.filter((r) => {
    const searchLower = search.toLowerCase();
    const scope = filters.searchScope || 'both';
    const matchesName = r.name?.toLowerCase().includes(searchLower);
    // Matches if any product/menu item on this restaurant contains the
    // search text. Assumes restaurant.products is an array of objects with
    // a `name` field (as returned by /api/restaurants) — adjust the field
    // names here if your shape differs.
    const matchesProduct = r.products?.some((p) =>
      p.pname?.toLowerCase().includes(searchLower)
    );
    // The "Search matches" option in the navbar filter popup narrows which
    // of the two checks above actually counts.
    let matchesSearch;
    if (scope === 'restaurant') {
      matchesSearch = matchesName;
    } else if (scope === 'product') {
      matchesSearch = matchesProduct;
    } else {
      matchesSearch = matchesName || matchesProduct;
    }

    // Address filter — substring match against the restaurant's address.
    // Once x/y coordinates are added, a distance-based check would slot in
    // here alongside (or instead of) the text match.
    const matchesAddress = filters.address
      ? r.address?.toLowerCase().includes(filters.address.toLowerCase())
      : true;
    // "Near me" radius filter. Only applied when nearMeOnly is on and we
    // actually have both the user's and the restaurant's coordinates — if
    // either is missing, we don't filter the restaurant out (better to show
    // it than to silently hide everything due to incomplete data).
    let matchesRadius = true;
    const restX = toNumber(r.addressX);
    const restY = toNumber(r.addressY);
    if (nearMeOnly && userCoords && restX !== null && restY !== null) {
      matchesRadius =
        distanceKm(userCoords.x, userCoords.y, restX, restY) <= nearMeRadiusKm;
    }
    return matchesSearch && matchesAddress && matchesRadius;
  });

  return (
    <div className="home-wrapper">
      <BackG />
      <ToastContainer className="welcome-toast-container" position="top-center">
        <Toast show={welcome} onClose={() => setWelcome(false)}
          delay={5000}
          autohide
          className="welcome-toast">
          <Toast.Header><strong className="me-auto">Welcome to WolterWhite</strong></Toast.Header>
          <Toast.Body>Yeah, Mr. {displayName}! Yeah, Science!</Toast.Body>
        </Toast>
      </ToastContainer>
      {/* When cardsVisible is false, this whole block is skipped, leaving
          just the background image showing through — that's the "Clear"
          toggle in the navbar. */}
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
          {/* States */}
          {loading && <p className="home-status">Loading restaurants...</p>}
          {error && <p className="home-status home-status--error">{error}</p>}
          {!loading && !error && filtered.length === 0 && search !== "" && (
            <p className="home-status">No restaurants found for "{search}"</p>
          )}

          {/* Grid */}

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