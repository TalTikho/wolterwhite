import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

export const adminStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      padding: 12,
      gap: 16,
      backgroundColor: colors.header,
      borderRadius: 8,
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.tint || '#3498db',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      gap: 8,
      marginTop: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    text: {
      color: colors.text,
    },
    name: {
      flex: 1,
      fontWeight: '600',
      fontSize: 16,
      color: colors.text,
    },
    price: {
      color: colors.text,
      fontWeight: 'bold',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 4,
    },
    empty: {
      textAlign: 'center',
      color: colors.icon,
      padding: 24,
      fontStyle: 'italic',
    },
    actionText: {
      color: colors.tint || '#3498db', //A nice blue that works on dark/light
      fontWeight: '500',
    },
    deleteText: {
      color: '#e74c3c', //Red for delete actions
      fontWeight: '500',
    },
    menuText: {
      color: colors.icon, //Red for delete actions
      fontWeight: '500',
    },
    adminText:{
      
    }
  });