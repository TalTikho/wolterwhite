import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { sendPOST, sendGet } from '../services/api';

export const Orders = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { token } = useAuthContext();
    const [pastOrders, setPastOrders] = useState([]);

    const totalAmount = cart.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await sendGet('/api/orders', token);
                setPastOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        };
        fetchOrders();
    }, [token]);

    const handleCheckout = async () => {
        try {
            const productIds = cart.items.map(item => item.pId || item.id || item._id);
            await sendPOST('/api/orders', {
                restaurantId: cart.restaurantId,
                products: productIds
            }, token);
            
            alert("Order placed successfully!");
            clearCart();
            window.location.reload(); 
        } catch (err) {
            alert("Failed to place order.");
        }
    };

    return (
        <div className="container mt-4">
            <h3>Active Cart</h3>
            {cart.items.length > 0 ? (
                <div className="card p-3 mb-4">
                    {cart.items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                            {}
                            <span>{item.pname || item.name} - <strong>${item.price}</strong></span>
                            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.pId || item.id || item._id)}>Remove</button>
                        </div>
                    ))}
                    
                    <hr />
                    {}
                    <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <button className="btn btn-success mt-3" onClick={handleCheckout}>
                        Checkout (${totalAmount.toFixed(2)})
                    </button>
                </div>
            ) : <p>Cart is empty</p>}

            <h3>My Orders</h3>
            {pastOrders.map(order => (
                <div key={order.id} className="card p-3 mb-2">
                    <p>Order ID: {order.id} - Status: {order.status}</p>
                </div>
            ))}
        </div>
    );
};