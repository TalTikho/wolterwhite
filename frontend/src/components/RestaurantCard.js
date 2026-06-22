import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/RestaurantCard.css";

export const RestaurantCard = ({ restaurant, onQuickView }) => {
  const navigate = useNavigate();
  const { id, name, address, image } = restaurant;

  // Fixed path: Changed from /uploads/ to /api/images/
  const imageUrl = image
    ? `http://localhost:5000/api/images/${image}`
    : "/knock.png";

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurants/${id}`)}
    >
      <div className="restaurant-card__image-wrapper">
        <img
          src={imageUrl}
          alt={name}
          className="restaurant-card__image"
          onError={(e) => {
            e.target.src = "/knock.png";
          }}
        />
      </div>

      <div className="restaurant-card__body">
        <h3 className="restaurant-card__name">{name}</h3>
        <p className="restaurant-card__address">
          📍 {address || "Address not available"}
        </p>

        {onQuickView && (
          <button
            className="btn-quick-view"
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
