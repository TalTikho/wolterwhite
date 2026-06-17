import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/RestaurantCard.css";

export const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { _id, name, cuisine, address, rating, image } = restaurant;

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurants/${_id}`)}
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
        <p className="restaurant-card__address">📍 {address}</p>

        <div className="restaurant-card__rating">
          <span className="restaurant-card__stars">
            {"★".repeat(Math.floor(rating ?? 0))}
            {"☆".repeat(5 - Math.floor(rating ?? 0))}
          </span>
          <span className="restaurant-card__rating-value">
            ({rating?.toFixed(1) ?? "N/A"})
          </span>
        </div>
      </div>
    </div>
  );
};
