import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const restaurantCardStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface, 
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      flexDirection: 'column', // FIXED: Explicitly forces the image to stay on top, text on bottom
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
    imageWrapper: {
      width: '100%',
      height: 160,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.background, 
    },
    body: {
      padding: 12,
      gap: 6,
    },
    name: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
    },
    address: {
      fontSize: 13,
    },
    quickViewBtn: {
      marginTop: 8,
      alignSelf: 'flex-start',
      backgroundColor: colors.tint, 
      borderRadius: 6,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    quickViewText: {
      color: '#ffffff', 
      fontSize: 13,
      fontWeight: '600',
    },
  });