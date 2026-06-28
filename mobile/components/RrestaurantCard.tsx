import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { restaurantCardStyles } from '@/styles/restaurantCardStyles';

type Restaurant = {
  id: string;
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

  const { id, name, address, image } = restaurant;

  const imageUrl = image
    ? `http://localhost:5000/api/images/${image}`
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/restaurants/${id}`)}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : require('../assets/knock.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>
          📍 {address || 'Address not available'}
        </Text>
        {onQuickView && (
          <TouchableOpacity style={styles.quickViewBtn} onPress={onQuickView}>
            <Text style={styles.quickViewText}>Quick View</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};