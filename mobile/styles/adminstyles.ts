// adminstyles.ts
import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/theme";

export const adminStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 50,
      paddingBottom: 40,
      backgroundColor: colors.background,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      gap: 20,
    },
    pageTitle: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
      margin: 0,
      flex: 1,
    },
    primaryActionBtn: {
      flex: 0,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
         },
      }),
    },
    primaryActionBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#ffffff',
      textAlign: 'center',
    },
    backBtn: {
      alignSelf: 'flex-start',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      marginBottom: 24,
    },
    backBtnText: {
      color: colors.text,
      fontWeight: '600',
    },
    tableWrapper: {
      width: '100%',
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    tableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: colors.border,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    tableHeaderText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 15.2,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(150, 150, 150, 0.15)',
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    imageCol: { width: 65 },
    nameCol: { flex: 2, paddingRight: 8 },
    priceCol: { width: 75, paddingRight: 4 },
    actionsCol: { 
      flex: 2.5, 
      flexDirection: 'row', 
      gap: 6, 
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    },
    productThumb: {
      width: 50,
      height: 50,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemImportant: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemMuted: {
      fontSize: 13.6,
      color: colors.text,
      opacity: 0.6,
      marginTop: 2,
    },
    tableEmpty: {
      textAlign: 'center',
      padding: 40,
      color: colors.text,
      opacity: 0.5,
      fontStyle: 'italic',
    },
    rowBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      justifyContent: 'center',
    },
    rowBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#ffffff',
    },
    btnMenu: {
      backgroundColor: colors.border,
    },
    btnEdit: {
      backgroundColor: '#3182ce',
    },
    btnDelete: {
      backgroundColor: '#e53e3e',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: 17.6,
      marginTop: 50,
      color: colors.text,
      opacity: 0.7,
    },
    alertError: {
      backgroundColor: 'rgba(229, 62, 62, 0.15)',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e53e3e',
      marginBottom: 20,
    },
    alertErrorText: {
      color: '#e53e3e',
      fontWeight: '600',
    }
  });