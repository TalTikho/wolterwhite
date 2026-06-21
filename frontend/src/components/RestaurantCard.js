import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/RestaurantCard.css";

// Added onQuickView to the component props
export const RestaurantCard = ({ restaurant, onQuickView }) => {
  const navigate = useNavigate();
  const { id, name, cuisine, address, rating, image } = restaurant;

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurants/${id}`)}
    >
      <div className="restaurant-card__image-wrapper">
        <img
          src={image || "/knock.png"}
          alt={name}
          className="restaurant-card__image"
        />
      </div>

      <div className="restaurant-card__body">
        <h3 className="restaurant-card__name">{name}</h3>
        <span className="restaurant-card__cuisine">{cuisine}</span>
        <p className="restaurant-card__address">📍 {address || "Address not available"}</p>

        <div className="restaurant-card__rating">
          <span className="restaurant-card__stars">
            {"★".repeat(Math.floor(rating ?? 0))}
            {"☆".repeat(5 - Math.floor(rating ?? 0))}
          </span>
          <span className="restaurant-card__rating-value">
            ({rating?.toFixed(1) ?? "N/A"})
          </span>
        </div>

        {/* Quick View Button. 
          e.stopPropagation() is critical here to prevent the parent div's onClick 
          from triggering and navigating away to the full restaurant page.
        */}
        {onQuickView && (
          <button 
            className="btn btn-outline-light btn-sm mt-3 w-100"
            onClick={(e) => {
              e.stopPropagation(); 
              onQuickView();
            }}
          >
            Quick View
          </button>
        )}
      </div>
    </div>
  );
};