import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { restaurantCardStyles } from '@/styles/restaurantCardStyles';

type Restaurant = {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  image?: string;
};

type Props = {
  restaurant: Restaurant;
  onQuickView?: () => void;
};

export const RestaurantCard = ({ restaurant, onQuickView }: Props) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = restaurantCardStyles(colors);

  const { name, address, image } = restaurant;
  const targetId = restaurant.id || restaurant._id;

  // Evaluates the image string and safely handles empty database entries
  const getImageUrl = () => {
    if (!image || image.trim() === '') return null;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // FIXED: Resolves localhost network bridging errors for physical devices and emulators
    const baseUrl = Platform.select({
      android: 'http://10.0.2.2:5000', // Redirects Android network internal requests to host PC
      ios: 'http://localhost:5000',    // Standard default for macOS iOS Simulators
      default: 'http://localhost:5000' // Fallback web address proxy
    });

    return `${baseUrl}/api/images/${image}`;
  };

  const finalImageUrl = getImageUrl();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${targetId}` as any)} 
    >
      <View style={styles.imageWrapper}>
        <Image
          source={finalImageUrl ? { uri: finalImageUrl } : require('../assets/images/knock.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : colors.text }]}>
          {name}
        </Text>
        <Text style={[styles.address, { color: isDarkMode ? '#ffffff' : colors.text, opacity: 0.7 }]}>
          📍 {address || 'Address not available'}
        </Text>
        {onQuickView && (
          <TouchableOpacity style={styles.quickViewBtn} onPress={onQuickView}>
            <Text style={[styles.quickViewText, { color: isDarkMode ? '#ffffff' : colors.text }]}>
              Quick View
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};