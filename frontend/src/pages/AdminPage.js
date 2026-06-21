import React, { useEffect, useState } from "react";
import { sendGet } from "../services/api";
import { RestaurantForm } from "../components/RestaurantForm";
import { useAuthContext } from "../context/AuthContext";

export const AdminPage = () => {
  const { token } = useAuthContext();
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await sendGet("/api/restaurants");
      setRestaurants(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setError("Could not load restaurants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchRestaurants(); // Refresh list after deletion
      } else {
        alert("Failed to delete. Please check your permissions.");
      }
    } catch (err) {
      alert("Error contacting the server.");
    }
  };

  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button 
          className="btn btn-success" 
          onClick={() => { setEditingRestaurant(null); setShowForm(!showForm); }}
        >
          {showForm ? "Cancel" : "+ Add New Restaurant"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <RestaurantForm 
          existingRestaurant={editingRestaurant} 
          onSuccess={() => { setShowForm(false); fetchRestaurants(); }}
          onCancel={() => setShowForm(false)}
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
            {restaurants.length > 0 ? (
              restaurants.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.cuisine}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2" 
                      onClick={() => { setEditingRestaurant(r); setShowForm(true); }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No restaurants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};