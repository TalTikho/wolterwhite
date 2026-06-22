import React, { useContext } from "react";
import { sendGet } from "../services/api";
import { useAuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "../style/RestaurantCard.css";

export const ProductCard = ({ product, restaurantId }) => {
  const { token } = useAuthContext();
  const { addToCart } = useContext(CartContext);

  const handleProductClick = async () => {
    try {
      if (token) {
        await sendGet(`/api/restaurants/${restaurantId}/products/${product.pId || product.id || product._id}`, token);
      }
    } catch (err) {
      console.error("Failed to record product view", err);
    }
  };

  // Fixed path: Changed from /uploads/ to /api/images/
  const imageUrl = product.image 
    ? `http://localhost:5000/api/images/${product.image}` 
    : "/knock.png";

  return (
    <div className="restaurant-card" onClick={handleProductClick}>
      {/* Added Image Wrapper for Product */}
      <div className="restaurant-card__image-wrapper" style={{ height: "150px" }}>
        <img
          src={imageUrl}
          alt={product.pname || product.name}
          className="restaurant-card__image"
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
          onError={(e) => { e.target.src = '/knock.png'; }}
        />
      </div>

      <div className="restaurant-card__body d-flex flex-column justify-content-between">
        <div>
          <h3 className="restaurant-card__name">{product.pname || product.name}</h3>
          <p className="restaurant-card__address mt-2" style={{ fontSize: "0.9rem" }}>
            {product.pdescription || product.description || "No description available."}
          </p>
        </div>

        <div className="mt-3">
          <span className="fs-5 fw-bold text-success">${product.price}</span>
          <button
            className="btn btn-primary btn-sm mt-3 w-100 fw-bold"
            onClick={(e) => {
              e.stopPropagation();
              const status = addToCart(restaurantId, product);
              if (status === 'swapped') {
                alert("Cart cleared! New product added from this restaurant.");
              } else {
                alert(`${product.pname || product.name} added to your order!`);
              }
            }}
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};