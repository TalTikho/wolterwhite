import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import "../style/ProductForm.css";

export const ProductForm = ({ restaurantId, existingProduct = null, onSuccess, onCancel }) => {
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    pname: "",
    pdescription: "",
    price: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        pname: existingProduct.pname || existingProduct.name || "",
        pdescription: existingProduct.pdescription || existingProduct.description || "",
        price: existingProduct.price || ""
      });
    }
  }, [existingProduct]);

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

    console.log("Submit triggered. Current restaurantId:", restaurantId);
    console.log("Form data state before send:", formData);

    if (!restaurantId) {
      setError("Internal Error: Missing Restaurant ID. Please close the form and try again.");
      return;
    }

    if (!formData.pname || !formData.price) {
      setError("Name and Price are required fields.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!existingProduct;
      const productId = existingProduct ? (existingProduct.pId || existingProduct.id || existingProduct._id) : "";
      
      const url = isEdit 
        ? `/api/restaurants/${restaurantId}/products/${productId}` 
        : `/api/restaurants/${restaurantId}/products`;
      const method = isEdit ? "PATCH" : "POST";

      console.log(`Sending target request to URL: ${url} | Method: ${method}`);

      const data = new FormData();
      data.append("pname", formData.pname);
      data.append("pdescription", formData.pdescription);
      data.append("price", formData.price);
      
      if (imageFile) {
        data.append("image", imageFile);
        console.log("Image file attached:", imageFile.name);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      // Debugging lines to capture full server outcome
      const responseData = await response.json().catch(() => null); 
      console.log("Server Response Status:", response.status);
      console.log("Server Response Data Object:", responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || `Server rejected with status ${response.status}`);
      }

      console.log("Product saved successfully, executing onSuccess callback.");
      onSuccess();
    } catch (err) {
      console.error("Caught error in form submission block:", err);
      setError(err.message || "Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-card">
      <h4 className="product-form-title">
        {existingProduct ? "Edit Product" : "Add New Product"}
      </h4>
      
      {error && <div className="product-form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="product-grid-form">
        <div className="product-field-group">
          <label className="product-field-label">Product Name *</label>
          <input 
            type="text" 
            className="product-field-input" 
            name="pname" 
            value={formData.pname} 
            onChange={handleChange} 
            placeholder="e.g. Signature Fried Chicken" 
            required 
          />
        </div>
        
        <div className="product-field-group">
          <label className="product-field-label">Price ($) *</label>
          <input 
            type="number" 
            step="0.01" 
            className="product-field-input" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder="e.g. 14.99" 
            required 
          />
        </div>
        
        <div className="product-field-group prod-field-full-width">
          <label className="product-field-label">Product Image</label>
          <input 
            type="file" 
            className="product-field-file" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
        
        <div className="product-field-group prod-field-full-width">
          <label className="product-field-label">Description</label>
          <textarea 
            className="product-field-textarea" 
            name="pdescription" 
            value={formData.pdescription} 
            onChange={handleChange} 
            placeholder="Describe the item ingredients, allergens, or size..." 
            rows="2"
          ></textarea>
        </div>

        <div className="product-actions-wrapper prod-field-full-width">
          <button type="submit" className="product-submit-btn" disabled={loading}>
            {loading ? "Saving..." : (existingProduct ? "Update Product" : "Create Product")}
          </button>
          <button type="button" className="product-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};