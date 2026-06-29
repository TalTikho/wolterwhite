import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { restaurantDetailsModalStyles } from '@/styles/restaurantDetailsModalStyles';

type Restaurant = {
  name: string;
  image?: string;
  hours?: string;
  description?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
};

export const RestaurantDetailsModal = ({ isOpen, onClose, restaurant }: Props) => {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = restaurantDetailsModalStyles(colors);

  if (!restaurant) return null;

  // FIXED: Evaluates the image string and safely handles empty database entries
  const getImageUrl = () => {
    const { image } = restaurant;
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

    return `${baseUrl}/api/images/${image}`; // Fixed from /uploads/ to /api/images/
  };

  const finalImageUrl = getImageUrl();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>

          <View style={styles.header}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* FIXED: Removed the condition that hid the image entirely if imageUrl was null, 
                now it renders either the remote image or your fallback asset */}
            <Image
              source={finalImageUrl ? { uri: finalImageUrl } : require('../assets/images/knock.png')}
              style={styles.coverImage}
              resizeMode="cover"
            />
            
            <View style={styles.body}>
              <Text style={styles.hoursLabel}>
                🕒 Opening Hours:{' '}
                <Text style={styles.hoursValue}>{restaurant.hours || 'N/A'}</Text>
              </Text>
              {restaurant.description && (
                <View style={styles.descSection}>
                  <Text style={styles.descTitle}>About Restaurant:</Text>
                  <Text style={[styles.descText, { color: isDarkMode ? '#ffffff' : colors.text }]}>
                    {restaurant.description}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
              <Text style={styles.closeFooterBtnText}>Close</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};