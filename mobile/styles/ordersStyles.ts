import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export const ordersStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Match page background base
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginTop: 16,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface, // Uses dimensional surface background
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    cartItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    cartItemText: {
      fontSize: 15,
      fontWeight: '500',
      flex: 1,
      marginRight: 8,
    },
    cartItemPrice: {
      fontWeight: '700',
      color: colors.tint, // Highlights prices with primary branding color
    },
    btnDanger: {
      backgroundColor: '#cc3333',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    btnText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '600',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    totalText: {
      fontSize: 18,
      fontWeight: '700',
    },
    btnCheckout: {
      backgroundColor: colors.tint, // Primary brand button
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnCheckoutText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '700',
    },
    emptyMsg: {
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 24,
    },
    pastOrderCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      gap: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    pastOrderText: {
      fontSize: 14,
    },
    label: {
      fontWeight: '600',
      opacity: 0.8,
    },
    orderIdHighlight: {
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', // Clean technical hash text format
      fontWeight: '500',
    },
    statusBadge: {
      fontWeight: '700',
      color: colors.tint,
    },
  });