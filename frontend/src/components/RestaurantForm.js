import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import "../style/index.css";

export const RestaurantForm = ({ existingRestaurant = null, onSuccess, onCancel }) => {
  const { token } = useAuthContext();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    hours: "",        
    description: ""   
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingRestaurant) {
      setFormData({
        name: existingRestaurant.name || "",
        phone: existingRestaurant.phone || "",
        email: existingRestaurant.email || "",
        address: existingRestaurant.address || "",
        hours: existingRestaurant.hours || "",
        description: existingRestaurant.description || ""
      });
    }
  }, [existingRestaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.address) {
      setError("Name and address are required fields.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!existingRestaurant;
      const url = isEdit ? `/api/restaurants/${existingRestaurant.id}` : `/api/restaurants`;
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} restaurant.`);
      }

      onSuccess();
      
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-white border-secondary p-4 mt-3">
      <h3 className="mb-4 fw-bold text-success">
        {existingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
      </h3>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted">Restaurant Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted">Phone Number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="050-1234567" />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted">Email Address</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted">Address</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Street Name, City" required />
          </div>
          <div className="col-md-12">
            <label className="form-label text-muted">Opening Hours</label>
            <input type="text" className="form-control" name="hours" value={formData.hours} onChange={handleChange} placeholder="08:00 - 22:00" />
          </div>
          <div className="col-md-12">
            <label className="form-label text-muted">Description</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} placeholder="A short description..." rows="3"></textarea>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Saving..." : (existingRestaurant ? "Update Changes" : "Create Restaurant")}
            </button>
            {onCancel && (
                <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </div>
      </form>
    </div>
  );
};