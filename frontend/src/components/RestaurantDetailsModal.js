import React, { useEffect } from 'react';

export const RestaurantDetailsModal = ({ isOpen, onClose, restaurant }) => {
    
    // Listen for the Escape key to close the modal dynamically
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup the event listener when the component unmounts or closes
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // If the modal is not active or data hasn't loaded yet, render nothing
    if (!isOpen || !restaurant) return null;

    return (
        <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={onClose} // Clicking the dark backdrop closes the modal
        >
            <div 
                className="modal-dialog modal-dialog-centered" 
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal content
            >
                <div className="modal-content bg-dark text-white border-secondary">
                    
                    {/* Modal Header */}
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title fw-bold fs-3">{restaurant.name}</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            aria-label="Close" 
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        {/* Assuming 'cuisine' is still used, keep as is */}
                        <p className="lead text-muted">{restaurant.cuisine || 'Cuisine not specified'}</p>
                        <hr className="border-secondary" />
                        
                        <div className="my-3 fs-5">
                            <div className="mb-2">
                                {/* Corrected from openingHours to hours */}
                                <strong>🕒 Opening Hours:</strong> {restaurant.hours || 'N/A'}
                            </div>
                            <div className="mb-2">
                                {/* Ensure 'minPrice' exists in your DB or remove this line */}
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

                    {/* Modal Footer */}
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