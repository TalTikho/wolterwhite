import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import "../style/index.css";
import "../style/RestaurantForm.css";

export const RestaurantForm = ({ existingRestaurant = null, onSuccess, onCancel }) => {
  const { token } = useAuthContext();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    addressX: "", 
    addressY: "", 
    hours: "",        
    description: ""   
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingRestaurant) {
      setFormData({
        name: existingRestaurant.name || "",
        phone: existingRestaurant.phone || "",
        email: existingRestaurant.email || "",
        address: existingRestaurant.address || "",
        addressX: existingRestaurant.addressX || "", 
        addressY: existingRestaurant.addressY || "", 
        hours: existingRestaurant.hours || "",
        description: existingRestaurant.description || ""
      });
    }
  }, [existingRestaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("addressX", formData.addressX);
      data.append("addressY", formData.addressY);
      data.append("hours", formData.hours);
      data.append("description", formData.description);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${isEdit ? "update" : "create"} restaurant.`);
      }

      onSuccess();
      
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-form-card">
      <h3 className="restaurant-form-title">
        {existingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
      </h3>
      
      {error && <div className="restaurant-form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="restaurant-grid-form">
        <div className="form-field-group">
          <label className="form-field-label">Restaurant Name *</label>
          <input type="text" className="form-field-input" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Los Pollos Hermanos" required />
        </div>
        
        <div className="form-field-group">
          <label className="form-field-label">Phone Number</label>
          <input type="tel" className="form-field-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 505-142-5678" />
        </div>
        
        <div className="form-field-group">
          <label className="form-field-label">Email Address</label>
          <input type="email" className="form-field-input" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. info@lospollos.com" />
        </div>
        
        <div className="form-field-group">
          <label className="form-field-label">Address (Text) *</label>
          <input type="text" className="form-field-input" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 12000 Candelaria Rd NE, Albuquerque" required />
        </div>
        
        <div className="form-field-group">
          <label className="form-field-label">Address X (Latitude)</label>
          <input type="number" step="any" className="form-field-input" name="addressX" value={formData.addressX} onChange={handleChange} placeholder="e.g. 35.118" />
        </div>
        
        <div className="form-field-group">
          <label className="form-field-label">Address Y (Longitude)</label>
          <input type="number" step="any" className="form-field-input" name="addressY" value={formData.addressY} onChange={handleChange} placeholder="e.g. -106.601" />
        </div>

        <div className="form-field-group field-full-width">
          <label className="form-field-label">Restaurant Image</label>
          <input type="file" className="form-field-file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="form-field-group field-full-width">
          <label className="form-field-label">Opening Hours</label>
          <input type="text" className="form-field-input" name="hours" value={formData.hours} onChange={handleChange} placeholder="e.g. Mon-Sat: 08:00 - 22:00" />
        </div>
        
        <div className="form-field-group field-full-width">
          <label className="form-field-label">Description</label>
          <textarea className="form-field-textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your restaurant, specialties, or flavor profiles..." rows="3"></textarea>
        </div>

        <div className="form-actions-wrapper field-full-width">
          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? "Saving..." : (existingRestaurant ? "Update Changes" : "Create Restaurant")}
          </button>
          {onCancel && (
            <button type="button" className="form-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};