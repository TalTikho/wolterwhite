import React, { useEffect, useState } from "react";
import { sendGet } from "../services/api";
import { RestaurantForm } from "../components/RestaurantForm";
import { ProductForm } from "../components/ProductForm";
import { useAuthContext } from "../context/AuthContext";

export const AdminPage = () => {
  const { token } = useAuthContext();
  
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await sendGet("/api/restaurants");
      setRestaurants(data);
      setError(null);
    } catch (err) {
      setError("Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

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

  const fetchProducts = async (restaurantId) => {
    try {
      const data = await sendGet(`/api/restaurants/${restaurantId}/products`, token);
      setProducts(data);
    } catch (err) {
      alert("Failed to load menu for this restaurant.");
    }
  };

  const handleManageMenu = (restaurant) => {
    setSelectedRestaurantForMenu(restaurant);
    setShowRestaurantForm(false);
    fetchProducts(restaurant.id || restaurant._id);
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
      <div className="container mt-5 text-white">
        <button className="btn btn-outline-light mb-4" onClick={() => {
            setSelectedRestaurantForMenu(null);
            setShowProductForm(false);
        }}>
          &larr; Back to Restaurants
        </button>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Menu: {selectedRestaurantForMenu.name}</h2>
          <button className="btn btn-success" onClick={() => { setEditingProduct(null); setShowProductForm(!showProductForm); }}>
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

        <table className="table table-dark table-hover mt-4">
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
              <tr key={p.id || p._id || p.pId || index} className="align-middle">
                <td>
                  <img 
                    src={p.image ? `http://localhost:5000/api/images/${p.image}` : "/knock.png"} 
                    alt="product" 
                    style={{width: "50px", height:"50px", objectFit:"cover", borderRadius:"5px"}}
                    onError={(e) => { e.target.src = '/knock.png'; }}
                  />
                </td>
                <td>
                  <strong>{p.pname}</strong><br/>
                  <small className="text-muted">{p.pdescription}</small>
                </td>
                <td>${p.price}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => { setEditingProduct(p); setShowProductForm(true); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id || p._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-success" onClick={() => { setEditingRestaurant(null); setShowRestaurantForm(!showRestaurantForm); }}>
          {showRestaurantForm ? "Cancel" : "+ Add New Restaurant"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showRestaurantForm && (
        <RestaurantForm 
          existingRestaurant={editingRestaurant} 
          onSuccess={() => { setShowRestaurantForm(false); fetchRestaurants(); }}
          onCancel={() => setShowRestaurantForm(false)}
        />
      )}

      {loading ? (
        <p className="text-center mt-5">Loading data...</p>
      ) : (
        <table className="table table-dark table-hover mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cuisine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length > 0 ? restaurants.map((r, index) => (
              <tr key={r.id || r._id || index} className="align-middle">
                <td>{r.name}</td>
                <td>{r.cuisine}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2 fw-bold" onClick={() => handleManageMenu(r)}>Menu</button>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => { setEditingRestaurant(r); setShowRestaurantForm(true); }}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRestaurant(r.id || r._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="text-center">No restaurants found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};