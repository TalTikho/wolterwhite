import { StyleSheet } from 'react-native';

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.icon,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    marginBottom: 12,
  },
  passwordInput: {
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.tint,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: colors.text,
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    color: colors.tint,
  },
});