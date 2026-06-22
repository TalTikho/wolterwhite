import React, { useEffect } from "react";

export const RestaurantDetailsModal = ({ isOpen, onClose, restaurant }) => {
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !restaurant) return null;

    const imageUrl = restaurant.image 
        ? `http://localhost:5000/uploads/${restaurant.image}` 
        : null;

    return (
        <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={onClose}
        >
            <div 
                className="modal-dialog modal-dialog-centered" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content bg-dark text-white border-secondary">
                    
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title fw-bold fs-3">{restaurant.name}</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            aria-label="Close" 
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body p-0">
                        {imageUrl && (
                            <img 
                                src={imageUrl} 
                                alt={restaurant.name} 
                                className="w-100" 
                                style={{ height: "200px", objectFit: "cover" }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <div className="p-3">
                            <p className="lead text-muted">{restaurant.cuisine || 'Cuisine not specified'}</p>
                            <hr className="border-secondary" />
                            
                            <div className="my-3 fs-5">
                                <div className="mb-2">
                                    <strong>🕒 Opening Hours:</strong> {restaurant.hours || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <strong>💰 Min Order Price:</strong> ${restaurant.minPrice || '0'}
                                </div>
                            </div>

                            {restaurant.description && (
                                <div className="mt-4">
                                    <h6 className="fw-bold">About Restaurant:</h6>
                                    <p className="text-muted">{restaurant.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer border-secondary">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};