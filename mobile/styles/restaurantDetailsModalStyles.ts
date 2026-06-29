import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

// Styles are a function so they can react to the active theme colors,
// matching the pattern your SideMenu and other components use.
export const restaurantDetailsModalStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 12,
      width: '100%',
      maxHeight: '85%',
      borderWidth: 1,
      borderColor: colors.icon,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.icon,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      color: colors.background,
      fontSize: 14,
    },
    coverImage: {
      width: '100%',
      height: 200,
    },
    body: {
      padding: 16,
      gap: 12,
    },
    hoursLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    hoursValue: {
      fontWeight: '400',
      color: colors.icon,
    },
    descSection: {
      marginTop: 8,
      gap: 4,
    },
    descTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 14,
    },
    descText: {
      color: colors.icon,
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: colors.icon,
      alignItems: 'flex-end',
    },
    closeFooterBtn: {
      backgroundColor: colors.icon,
      borderRadius: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    closeFooterBtnText: {
      color: colors.background,
      fontSize: 14,
    },
  });