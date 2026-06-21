import React from "react";
import { sendGet } from "../services/api";
import { useAuthContext } from "../context/AuthContext";
import "../style/RestaurantCard.css"; // Reuse the same CSS!

export const ProductCard = ({ product, restaurantId }) => {
  const { token } = useAuthContext();

  // Task 14.1.2: Record view via GET request to trigger C++ recommendation server
  const handleProductClick = async () => {
    try {
      if (token) {
        await sendGet(`/api/restaurants/${restaurantId}/products/${product.id || product._id}`, token);
        console.log("Product view recorded successfully!");
      }
    } catch (err) {
      console.error("Failed to record product view", err);
    }
  };

  return (
    <div className="restaurant-card" onClick={handleProductClick}>
      <div className="restaurant-card__image-wrapper">
        <img
          src={product.image || "/knock.png"}
          alt={product.name}
          className="restaurant-card__image"
        />
      </div>

      <div className="restaurant-card__body d-flex flex-column justify-content-between">
        <div>
          <h3 className="restaurant-card__name">{product.name}</h3>
          <p className="restaurant-card__address mt-2" style={{ fontSize: "0.9rem" }}>
            {product.description || "No description available."}
          </p>
        </div>

        <div className="mt-3">
          <span className="fs-5 fw-bold text-success">${product.price}</span>
          <button
            className="btn btn-primary btn-sm mt-3 w-100 fw-bold"
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card's onClick from firing when clicking the button
              alert(`Added ${product.name} to order! (Cart feature coming soon)`);
            }}
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};