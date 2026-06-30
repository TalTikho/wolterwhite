import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  tableHeaderRow: { flex: 1, padding: 16, backgroundColor: '#0c6604' },
  headerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 8 },
  price: { color: '#fff', fontWeight: 'bold' },
  name: { fontWeight: '600', fontSize: 16 },
  image: {},
  empty: { textAlign: 'center', color: '#999', padding: 24, fontStyle: 'italic' },
  imageBox: {},
    input: {
    height: 50,
    backgroundColor: '#d1d9c4',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgb(139, 217, 5)',
  },
});
