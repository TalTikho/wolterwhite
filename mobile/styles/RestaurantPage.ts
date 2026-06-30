// styles/restaurantPageStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export const restaurantPageStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorBox: {
      backgroundColor: 'rgba(229, 62, 62, 0.15)',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e53e3e',
      margin: 16,
      alignItems: 'center',
    },
    errorText: {
      color: '#e53e3e',
      fontSize: 16,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    restaurantImage: {
      width: '100%',
      height: 180,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    title: {
      fontSize: 32, // display-4 approx
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'column',
      gap: 12,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 16, // fs-5
      color: colors.text,
    },
    infoBold: {
      fontWeight: 'bold',
    },
    descriptionContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border + '40', // light border
    },
    descriptionText: {
      color: colors.text,
      opacity: 0.7,
      fontSize: 15,
      lineHeight: 22,
    },
    menuTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    emptyText: {
      color: colors.text,
      opacity: 0.6,
      fontSize: 16,
    },
    grid: {
      flexDirection: 'column',
      gap: 16,
    }
  });