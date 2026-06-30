import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { sendPOST } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { getStyles } from '@/styles/loginStyles';

export default function LoginScreen() {
  const { tokenToStorage } = useAuthContext();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = getStyles(colors);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const data = await sendPOST('/api/tokens', { username, password });
      await tokenToStorage(data.token);
      router.replace('/(drawer)/(tabs)');
    } catch (e: any) {
      setError(e.status === 401 ? 'Invalid username or password' : 'Login failed, try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WolterWhite 🏠</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.icon} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Password" placeholderTextColor={colors.icon} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerContainer} onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerLink}>Register here</Text></Text>
      </TouchableOpacity>
    </View>
  );
}