import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { sendGet } from '../services/api';
import { ProductCard } from '../components/ProductCard';

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
            {restaurant && (
                <div className="card bg-dark mb-4 p-4 border-secondary text-white">
                    <div className="row align-items-center">
                        {restaurant.image && (
                            <div className="col-md-3 mb-3 mb-md-0">
                                <img 
                                    src={`http://localhost:5000/api/images/${restaurant.image}`}
                                    alt={restaurant.name}
                                    className="img-fluid rounded border border-secondary"
                                    style={{ maxHeight: "180px", objectFit: "cover", width: "100%" }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                        <div className={restaurant.image ? "col-md-9" : "col-md-12"}>
                            <h1 className="display-4 fw-bold">{restaurant.name}</h1>
                            <p className="lead text-muted">{restaurant.cuisine || 'Cuisine not specified'}</p>
                            
                            <div className="d-flex gap-4 fs-5 mt-3 flex-wrap">
                                <div><strong>🕒 Opening Hours:</strong> {restaurant.hours || 'N/A'}</div>
                                <div><strong>💰 Min Order Price:</strong> ${restaurant.minPrice || '0'}</div>
                                <div>
                                    <strong>📍 Location Coordinates:</strong> ({restaurant.addressX ?? 'N/A'}, {restaurant.addressY ?? 'N/A'})
                                </div>
                            </div>
                            
                            {restaurant.description && (
                                <div className="mt-3 text-secondary">
                                    <p>{restaurant.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <h3 className="mb-4 fw-bold">Menu</h3>
            {products.length === 0 ? (
                <p className="text-muted">No products available for this restaurant.</p>
            ) : (
                <div className="row g-4">
                    {products.map((product, index) => (
                        <div key={product.id || product._id || product.pId || index} className="col-12 col-md-6 col-lg-4">
                            <ProductCard product={product} restaurantId={id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};