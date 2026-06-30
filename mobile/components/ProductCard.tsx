// components/ProductCard.tsx
import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { sendGet } from "../services/api";
import { useAuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { productCardStyles } from '@/styles/productCard';


export const ProductCard = ({ product, restaurantId }: {
  product: any;
  restaurantId: any;
}) =>  {
  const { token } = useAuthContext();
  const { addToCart } = useContext(CartContext);
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = productCardStyles(colors);

  const handleProductClick = async () => {
    try {
      if (token) {
        await sendGet(`/api/restaurants/${restaurantId}/products/${product.pId || product.id || product._id}`, token);
      }
    } catch (err) {
      console.error("Failed to record product view", err);
    }
  };

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

  //Changed from /uploads/ to /api/images/
  const finalImageUrl = getNativeImageUrl(product.image);

  return (
    <TouchableOpacity style={styles.card} onPress={handleProductClick} activeOpacity={0.9}>
      {/* Added Image Wrapper for Product */}
      <View style={styles.imageWrapper}>
        <Image
          source={finalImageUrl ? { uri: finalImageUrl } : require('@/assets/images/knock.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.name} numberOfLines={1}>{product.pname || product.name}</Text>
          <Text style={styles.address} numberOfLines={2}>
            {product.pdescription || product.description || "No description available."}
          </Text>
        </View>

        <View style={styles.priceWrapper}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity
            style={styles.btnQuickView}
            onPress={() => {
              const status = addToCart(restaurantId, product);
              if (status === 'swapped') {
                Alert.alert("Cart cleared!", "New product added from this restaurant.");
              } else {
                Alert.alert("Added!", `${product.pname || product.name} added to your order!`);
              }
            }}
          >
            <Text style={styles.btnQuickViewText}>Add to Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};