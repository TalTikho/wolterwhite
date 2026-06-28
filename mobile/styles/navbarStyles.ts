import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const navbarStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
    },
    navbarContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.background,
      gap: 10,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logoSquare: {
      width: 36,
      height: 36,
      backgroundColor: colors.tint,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: colors.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
    brandTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.text,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    themeLabel: {
      color: colors.text,
      fontSize: 13,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    username: {
      color: colors.text,
      fontSize: 14,
    },
    outlineBtn: {
      borderWidth: 1,
      borderColor: colors.tint,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    outlineBtnText: {
      color: colors.tint,
      fontSize: 13,
    },
    ghostBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    ghostBtnText: {
      color: colors.icon,
      fontSize: 13,
    },
    dangerBtn: {
      backgroundColor: '#e94560',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    dangerBtnText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
    },
    // Filter modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterPopup: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 20,
      width: '85%',
      gap: 10,
      borderWidth: 1,
      borderColor: colors.icon,
    },
    filterLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    filterInput: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.background,
    },
    divider: {
      height: 1,
      backgroundColor: colors.icon,
      marginVertical: 4,
      opacity: 0.3,
    },
    scopeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    scopeLabel: {
      fontSize: 14,
      color: colors.text,
    },
    radioCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.icon,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioCircleSelected: {
      borderColor: colors.tint,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.tint,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.icon,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    checkmark: {
      color: colors.background,
      fontSize: 12,
      fontWeight: 'bold',
    },
  });