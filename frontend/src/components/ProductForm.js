import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

export const ProductForm = ({ restaurantId, existingProduct = null, onSuccess, onCancel }) => {
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    pname: "",
    pdescription: "",
    price: ""
  });
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save product.");

      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-white border-secondary p-4 mt-3">
      <h4 className="mb-4 fw-bold text-warning">
        {existingProduct ? "Edit Product" : "Add New Product"}
      </h4>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted">Product Name</label>
            <input type="text" className="form-control" name="pname" value={formData.pname} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted">Price ($)</label>
            <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="col-md-12">
            <label className="form-label text-muted">Description</label>
            <textarea className="form-control" name="pdescription" value={formData.pdescription} onChange={handleChange} rows="2"></textarea>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? "Saving..." : (existingProduct ? "Update Product" : "Create Product")}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
};