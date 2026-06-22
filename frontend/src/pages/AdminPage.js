import React, { useEffect, useState } from "react";
import { sendGet } from "../services/api";
import { RestaurantForm } from "../components/RestaurantForm";
import { ProductForm } from "../components/ProductForm";
import { useAuthContext } from "../context/AuthContext";
import "../style/AdminPage.css";

export const AdminPage = () => {
  const { token } = useAuthContext();
  
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(() => {
    const saved = localStorage.getItem("active_admin_restaurant_menu");
    return saved ? JSON.parse(saved) : null;
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      console.log("Fetching all restaurants...");
      const data = await sendGet("/api/restaurants");
      console.log("Restaurants data loaded:", data);
      setRestaurants(data);
      setError(null);
    } catch (err) {
      console.error("Error loading restaurants:", err);
      setError("Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (restaurantId) => {
    try {
      console.log(`Fetching products for restaurant ID: ${restaurantId}`);
      
      const data = await sendGet(`/api/restaurants/${restaurantId}/products`);
      console.log("Products payload received from server:", data);
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("Server data structure mismatch. Expected array but got:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error inside fetchProducts block:", err);
      alert("Failed to load menu for this restaurant.");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantForMenu && token) {
      const restaurantId = selectedRestaurantForMenu.id || selectedRestaurantForMenu._id;
      fetchProducts(restaurantId);
    }
  }, [selectedRestaurantForMenu, token]);

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) fetchRestaurants();
      else alert("Failed to delete.");
    } catch (err) {
      alert("Error contacting the server.");
    }
  };

  const handleManageMenu = (restaurant) => {
    console.log("Managing menu for target restaurant:", restaurant);
    setSelectedRestaurantForMenu(restaurant);
    localStorage.setItem("active_admin_restaurant_menu", JSON.stringify(restaurant));
    setShowRestaurantForm(false);
    const restaurantId = restaurant.id || restaurant._id;
    fetchProducts(restaurantId);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product from the menu?")) return;
    const restaurantId = selectedRestaurantForMenu.id || selectedRestaurantForMenu._id;
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/products/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) fetchProducts(restaurantId);
      else alert("Failed to delete product.");
    } catch (err) {
      alert("Error contacting the server.");
    }
  };

  if (selectedRestaurantForMenu) {
    const restaurantId = selectedRestaurantForMenu.id || selectedRestaurantForMenu._id;
    return (
      <div className="admin-page-container">
        <button className="admin-back-btn" onClick={() => {
            setSelectedRestaurantForMenu(null);
            localStorage.removeItem("active_admin_restaurant_menu");
            setShowProductForm(false);
            setProducts([]);
        }}>
          &larr; Back to Restaurants
        </button>
        
        <div className="admin-header-row">
          <h2 className="admin-page-title">Menu: {selectedRestaurantForMenu.name}</h2>
          <button className="admin-primary-action-btn" onClick={() => { setEditingProduct(null); setShowProductForm(!showProductForm); }}>
            {showProductForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {showProductForm && (
          <ProductForm 
            restaurantId={restaurantId}
            existingProduct={editingProduct} 
            onSuccess={() => { setShowProductForm(false); fetchProducts(restaurantId); }}
            onCancel={() => setShowProductForm(false)}
          />
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((p, index) => (
                <tr key={p.id || p._id || p.pId || index}>
                  <td>
                    <img 
                      src={p.image ? `http://localhost:5000/api/images/${p.image}` : "/knock.png"} 
                      alt="product" 
                      className="admin-product-thumb"
                      onError={(e) => { e.target.src = '/knock.png'; }}
                    />
                  </td>
                  <td>
                    <strong className="admin-item-important">{p.pname || p.name}</strong>
                    <div className="admin-item-muted">{p.pdescription || p.description}</div>
                  </td>
                  <td>${p.price}</td>
                  <td>
                    <button className="admin-row-btn admin-btn-edit" onClick={() => { setEditingProduct(p); setShowProductForm(true); }}>Edit</button>
                    <button className="admin-row-btn admin-btn-delete" onClick={() => handleDeleteProduct(p.id || p._id || p.pId)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="admin-table-empty">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header-row">
        <h1 className="admin-page-title">Admin Dashboard</h1>
        <button className="admin-primary-action-btn" onClick={() => { setEditingRestaurant(null); setShowRestaurantForm(!showRestaurantForm); }}>
          {showRestaurantForm ? "Cancel" : "+ Add New Restaurant"}
        </button>
      </div>

      {error && <div className="admin-alert-error">{error}</div>}

      {showRestaurantForm && (
        <RestaurantForm 
          existingRestaurant={editingRestaurant} 
          onSuccess={() => { setShowRestaurantForm(false); fetchRestaurants(); }}
          onCancel={() => setShowRestaurantForm(false)}
        />
      )}

      {loading ? (
        <p className="admin-loading-text">Loading data...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cuisine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length > 0 ? restaurants.map((r, index) => (
                <tr key={r.id || r._id || index}>
                  <td><strong className="admin-item-important">{r.name}</strong></td>
                  <td>{r.cuisine}</td>
                  <td>
                    <button className="admin-row-btn admin-btn-menu" onClick={() => handleManageMenu(r)}>Menu</button>
                    <button className="admin-row-btn admin-btn-edit" onClick={() => { setEditingRestaurant(r); setShowRestaurantForm(true); }}>Edit</button>
                    <button className="admin-row-btn admin-btn-delete" onClick={() => handleDeleteRestaurant(r.id || r._id)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="admin-table-empty">No restaurants found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};