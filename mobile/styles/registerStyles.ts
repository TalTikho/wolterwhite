import { StyleSheet } from 'react-native';

export const getStyles = (colors: any) => StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
    paddingBottom: 60,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  serverError: {
    color: '#ff6b6b',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.icon,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  checklistContainer: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  checklistItem: {
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: colors.tint,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: colors.text,
    fontSize: 14,
  },
  loginLinkHighlight: {
    fontWeight: 'bold',
    color: colors.tint,
  },
});