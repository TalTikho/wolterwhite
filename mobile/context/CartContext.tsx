import React, { createContext, useState } from 'react';

interface CartItem {
    pId?: string;
    id?: string;
    _id?: string;
    pname?: string;
    name?: string;
    price: number | string;
}

interface Cart {
    restaurantId: string | null;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart;
    addToCart: (restaurantId: string, product: CartItem) => 'swapped' | 'added';
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<Cart>({
        restaurantId: null,
        items: []
    });

    const addToCart = (restaurantId: string, product: CartItem): 'swapped' | 'added' => {
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

    const removeFromCart = (productId: string) => {
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