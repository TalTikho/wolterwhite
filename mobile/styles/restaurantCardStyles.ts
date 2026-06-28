import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const restaurantCardStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    },
    image: {
      width: '100%',
      height: 160,
      backgroundColor: colors.icon,
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
      color: colors.icon,
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
      color: colors.background,
      fontSize: 13,
      fontWeight: '600',
    },
  });