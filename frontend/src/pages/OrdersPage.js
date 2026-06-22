import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { sendPOST, sendGet } from '../services/api';
import '../style/Orders.css';

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
        <div className="orders-page-container">
            <h3 className="orders-section-title">Active Cart</h3>
            {cart.items.length > 0 ? (
                <div className="orders-card-custom active-cart-card">
                    {cart.items.map((item, idx) => (
                        <div key={idx} className="cart-item-row">
                            <span className="cart-item-text">
                                {item.pname || item.name} - <strong className="cart-item-price">${item.price}</strong>
                            </span>
                            <button className="orders-btn-danger" onClick={() => removeFromCart(item.pId || item.id || item._id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    
                    <hr className="orders-divider" />
                    
                    <div className="cart-total-row">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <button className="orders-btn-checkout" onClick={handleCheckout}>
                        Checkout (${totalAmount.toFixed(2)})
                    </button>
                </div>
            ) : <p className="orders-empty-msg">Cart is empty</p>}

            <h3 className="orders-section-title">My Orders</h3>
            {pastOrders.length > 0 ? (
                pastOrders.map(order => (
                    <div key={order.id} className="orders-card-custom past-order-card">
                        <p className="past-order-text">
                            <span>Order ID:</span> <span className="order-id-highlight">{order.id}</span>
                        </p>
                        <p className="past-order-text">
                            <span>Status:</span> <span className={`order-status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                        </p>
                    </div>
                ))
            ) : <p className="orders-empty-msg">No orders found</p>}
        </div>
    );
};