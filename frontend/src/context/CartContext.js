import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        restaurantId: null,
        items: []
    });

    const addToCart = (restaurantId, product) => {
        if (cart.restaurantId && cart.restaurantId !== restaurantId) {
            setCart({ restaurantId, items: [product] });
            return 'swapped';
        }
        setCart(prev => ({
            restaurantId,
            items: [...prev.items, product]
        }));
        return 'added';
    };

    const removeFromCart = (productId) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => (item.pId || item.id || item._id) !== productId)
        }));
    };

    const clearCart = () => {
        setCart({ restaurantId: null, items: [] });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};