import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { CartContext } from '../../../context/CartContext';
import { useAuthContext } from '../../../context/AuthContext';
import { sendGet, sendPOST } from '../../../services/api';
import { ordersStyles } from '../../../styles/ordersStyles';
import { useTheme } from '../../../context/ThemeContext';
import { Colors } from '@/constants/theme';

interface Order {
    id?: string;
    _id?: string;
    orderId?: string;
    status?: string;
}

export default function OrdersScreen() {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const { token } = useAuthContext();
    const [pastOrders, setPastOrders] = useState<Order[]>([]);

    const { isDarkMode } = useTheme(); 
    const colors = isDarkMode ? Colors.dark : Colors.light;
    const styles = ordersStyles(colors);

    const items = cart?.items ?? [];
    const totalAmount = items.reduce(
        (sum, item) => sum + (parseFloat(String(item.price)) || 0),
        0
    );

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await sendGet('/api/orders', token);
                setPastOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            }
        };
        fetchOrders();
    }, [token]);

    const handleCheckout = async () => {
        try {
            const productIds = items.map(item => item.pId || item.id || item._id);
            await sendPOST('/api/orders', {
                restaurantId: cart?.restaurantId,
                products: productIds,
            }, token);

            Alert.alert('Success', 'Order placed successfully!');
            clearCart();
        } catch (err) {
            Alert.alert('Error', 'Failed to place order.');
        }
    };

    const getOrderId = (order: Order): string =>
        order.id ?? order._id ?? order.orderId ?? 'N/A';

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                Active Cart
            </Text>

            {items.length > 0 ? (
                <View style={styles.card}>
                    {/* RESTORED: Your mapping loop so the items actually show up! */}
                    {items.map((item, idx) => {
                        // Extracted the ID to cleanly pass to the remove function
                        const itemId = item.pId || item.id || item._id || '';

                        return (
                            <View key={idx} style={styles.cartItemRow}>
                                <Text style={[styles.cartItemText, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                                    {item.pname || item.name} -{' '}
                                    <Text style={styles.cartItemPrice}>${item.price}</Text>
                                </Text>
                                <TouchableOpacity
                                    style={styles.btnDanger}
                                    onPress={() => removeFromCart(itemId)}
                                >
                                    <Text style={styles.btnText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalText, { color: isDarkMode ? '#ffffff' : colors.text }]}>Total:</Text>
                        <Text style={[styles.totalText, { color: isDarkMode ? '#ffffff' : colors.text }]}>${totalAmount.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity style={styles.btnCheckout} onPress={handleCheckout}>
                        <Text style={styles.btnCheckoutText}>
                            Checkout (${totalAmount.toFixed(2)})
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={[styles.emptyMsg, { color: isDarkMode ? '#ffffff' : colors.text, opacity: 0.5 }]}>
                        🛒 Your cart is completely empty
                    </Text>
                </View>
            )}

            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                My Orders
            </Text>

            {pastOrders.length > 0 ? (
                pastOrders.map(order => (
                    <View key={getOrderId(order)} style={styles.pastOrderCard}>
                        {/* RESTORED: Your past order text elements */}
                        <Text style={[styles.pastOrderText, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                            <Text style={styles.label}>Order ID: </Text>
                            <Text style={styles.orderIdHighlight}>{getOrderId(order)}</Text>
                        </Text>
                        <Text style={[styles.pastOrderText, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                            <Text style={styles.label}>Status: </Text>
                            <Text style={styles.statusBadge}>{order.status}</Text>
                        </Text>
                    </View>
                ))
            ) : (
                <View style={styles.card}>
                    <Text style={[styles.emptyMsg, { color: isDarkMode ? '#ffffff' : colors.text, opacity: 0.5 }]}>
                        📦 No order history found yet
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}