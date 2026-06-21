import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { sendGet } from '../services/api';
import { ProductCard } from '../components/ProductCard'; // <-- Added this import

export const RestaurantPage = () => {
    const { id } = useParams(); 
    const { token } = useAuthContext();
    
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            if (!token) {
                setError("You must be logged in to view this restaurant.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const restaurantData = await sendGet(`/api/restaurants/${id}`, token);
                setRestaurant(restaurantData);

                const productsData = await sendGet(`/api/restaurants/${id}/products`, token);
                setProducts(productsData);
                
            } catch (err) {
                console.error("Failed to fetch restaurant data:", err);
                setError("Could not load restaurant data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRestaurantData();
        }
    }, [id, token]);

    if (loading) {
        return (
            <div className="container text-center mt-5 text-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4 text-light">
            {/* Restaurant Header Section */}
            {restaurant && (
                <div className="card bg-dark mb-4 p-4 border-secondary text-white">
                    <div className="row align-items-center">
                        <div className="col-md-9">
                            <h1 className="display-4 fw-bold">{restaurant.name}</h1>
                            <p className="lead text-muted">{restaurant.cuisine || 'Cuisine not specified'}</p>
                            
                            <div className="d-flex gap-4 fs-5 mt-3 flex-wrap">
                                <div><strong>🕒 Opening Hours:</strong> {restaurant.hours || 'N/A'}</div>
                                <div><strong>💰 Min Price:</strong> ${restaurant.minPrice || '0'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Grid Layout - Now using the new ProductCard component */}
            <h3 className="mb-4 fw-bold">Menu</h3>
            {products.length === 0 ? (
                <p className="text-muted">No products available for this restaurant.</p>
            ) : (
                <div className="row g-4">
                    {products.map((product) => (
                        <div key={product.id || product._id} className="col-12 col-md-6 col-lg-4">
                            {/* Passing restaurantId is crucial here so the C++ View logging logic works */}
                            <ProductCard product={product} restaurantId={id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};