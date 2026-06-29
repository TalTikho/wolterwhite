import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const homeStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    grid: {
      paddingBottom: 32,
      marginTop: 16,
    },
    // Welcome toast — yellow matching the web #ffc107
    toast: {
      position: 'absolute',
      top: 16,
      alignSelf: 'center',
      zIndex: 9999,
      backgroundColor: '#ffc107',
      borderRadius: 12,
      padding: 16,
      paddingRight: 40,
      maxWidth: 360,
      width: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 10,
    },
    toastTitle: {
      fontWeight: '700',
      fontSize: 16,
      color: '#1a1a1a',
      marginBottom: 4,
    },
    toastBody: {
      fontSize: 14,
      color: '#1a1a1a',
    },
    toastClose: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastCloseText: {
      fontSize: 13,
      color: '#1a1a1a',
    },
    status: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.text,
      marginTop: 24,
    },
    statusError: {
      color: '#ff6b6b',
    },
    adminBtn: {
      alignSelf: 'center',
      backgroundColor: colors.tint,
      borderRadius: 8,
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    adminBtnText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
  });