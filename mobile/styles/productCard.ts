// styles/productCardStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export const productCardStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    /* ==========================================================================
       Card Container
       ========================================================================== */
    card: {
      backgroundColor: colors.surface, // משתנה שמשתנה אוטומטית לפי המצב
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    /* ==========================================================================
       Card Image
       ========================================================================== */
    imageWrapper: {
      width: '100%',
      height: 160,
      overflow: 'hidden',
      backgroundColor: '#ccc', // רקע נייטרלי לתמונות שלא נטענו
    },
    image: {
      width: '100%',
      height: '100%',
    },
    /* ==========================================================================
       Card Body
       ========================================================================== */
    body: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      flex: 1,
      justifyContent: 'space-between',
    },
    name: {
      margin: 0,
      fontSize: 16, // ~1rem
      fontWeight: '700',
      color: colors.text,
    },
    address: {
      margin: 0,
      fontSize: 13, // ~0.8rem
      color: colors.text,
      opacity: 0.7,
      marginTop: 8,
    },
    priceWrapper: {
      marginTop: 12,
    },
    price: {
      fontSize: 20, // ~fs-5
      fontWeight: 'bold',
      color: '#198754', // text-success green
    },
    /* ==========================================================================
       Quick View Button
       ========================================================================== */
    /* כפתור מותאם אישית שמשתמש בטקסט וצבעים של המערכת במקום Bootstrap */
    btnQuickView: {
      marginTop: 10,
      width: '100%',
      paddingVertical: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      alignItems: 'center',
    },
    btnQuickViewText: {
      color: colors.text,
      fontSize: 14, // ~0.85rem
      fontWeight: '600',
    },
  });