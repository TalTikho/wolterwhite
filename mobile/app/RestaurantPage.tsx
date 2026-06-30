// app/RestaurantPage.tsx (or wherever your screens are located)
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { sendGet } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Product, Restaurant } from '../components/Types';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { restaurantPageStyles } from '@/styles/RestaurantPage';

export default function RestaurantPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token } = useAuthContext();
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const colors = isDarkMode ? Colors.dark : Colors.light;
    const styles = restaurantPageStyles(colors);

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const getNativeImageUrl = (imagePath?: string | null) => {
        if (!imagePath || imagePath.trim() === '') return null;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        const baseUrl = Platform.select({
            android: 'http://10.0.2.2:5000',
            ios: 'http://localhost:5000',
            default: 'http://localhost:5000'
        });
        return `${baseUrl}/api/images/${imagePath}`;
    };

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
    //navigate back home or to orders as we are not in tabs or drawers.
    const quickNav = (
        <View style={{
            flexDirection: 'row',
            gap: 10,
            padding: 12,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        }}>
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.tint, paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                onPress={() => router.push('/')}
            >
                <Text style={{ color: '#fff', fontWeight: '600' }}>🏠 Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.tint, paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                onPress={() => router.push('/orders')}
            >
                <Text style={{ color: '#fff', fontWeight: '600' }}>🧾 My Orders</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={[styles.centerContainer, { flex: 1 }]}>
                    <ActivityIndicator size="large" color={colors.tint} />
                </View>
                {quickNav}
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={[styles.centerContainer, { flex: 1 }]}>
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                </View>
                {quickNav}
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {restaurant && (
                    <View style={styles.card}>
                        {restaurant.image && (
                            <Image
                                source={getNativeImageUrl(restaurant.image) ? { uri: getNativeImageUrl(restaurant.image) as string } : require('@/assets/images/knock.png')}
                                style={styles.restaurantImage}
                                resizeMode="cover"
                            />
                        )}
                        <View>
                            <Text style={styles.title}>{restaurant.name}</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoBold}>🕒 Opening Hours: </Text>
                                    {restaurant.hours || 'N/A'}
                                </Text>
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoBold}>📍 Location Coordinates: </Text>
                                    ({restaurant.addressX ?? 'N/A'}, {restaurant.addressY ?? 'N/A'})
                                </Text>
                            </View>
                            {restaurant.description && (
                                <View style={styles.descriptionContainer}>
                                    <Text style={styles.descriptionText}>{restaurant.description}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <Text style={styles.menuTitle}>Menu</Text>

                {products.length === 0 ? (
                    <Text style={styles.emptyText}>No products available for this restaurant.</Text>
                ) : (
                    <View style={styles.grid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                restaurantId={id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {/*always visible regardless of scroll position */}
            {quickNav}
        </View>
    );
};