// styles/formStyles.ts
import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/theme";

export const sharedFormStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 24,
      marginTop: 20,
      marginBottom: 30,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    title: {
      fontSize: 24, // 1.5rem
      fontWeight: '700',
      color: colors.text,
      marginBottom: 24,
    },
    errorBlock: {
      backgroundColor: 'rgba(229, 62, 62, 0.12)',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e53e3e',
      marginBottom: 24,
    },
    errorText: {
      color: '#e53e3e',
      fontWeight: '600',
      fontSize: 15.2, // ~0.95rem
    },
    fieldGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14, // ~0.88rem
      fontWeight: '600',
      color: colors.text,
      opacity: 0.8,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 15.2,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.text,
    },
    inputError: {
      borderColor: '#e53e3e',
    },
    fieldErrorText: {
      color: '#e53e3e',
      fontSize: 12,
      marginTop: 4,
    },
    textarea: {
      minHeight: 80,
      textAlignVertical: 'top', // Fixes text starting in the middle on Android
    },
    filePickerBtn: {
      padding: 16,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 8,
      alignItems: 'center',
    },
    filePickerText: {
      color: colors.text,
      fontWeight: '600',
    },
    imagePreview: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionsWrapper: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 10,
    },
    submitBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.border,
      alignItems: 'center',
    },
    submitBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#ffffff',
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    cancelBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    }
  });