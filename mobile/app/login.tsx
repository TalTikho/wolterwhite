import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { sendPOST } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const { tokenToStorage } = useAuthContext();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const data = await sendPOST('/api/login', { username, password });
      await tokenToStorage(data.token);
      router.replace('/');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 24 }}>
        WolterWhite 🏠
      </Text>

      {error ? (
        <Text style={{ color: '#ff6b6b', marginBottom: 12 }}>{error}</Text>
      ) : null}

      <TextInput
        style={{ borderWidth: 1, borderColor: colors.icon, borderRadius: 8, padding: 12, color: colors.text, marginBottom: 12 }}
        placeholder="Username"
        placeholderTextColor={colors.icon}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: colors.icon, borderRadius: 8, padding: 12, color: colors.text, marginBottom: 24 }}
        placeholder="Password"
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={{ backgroundColor: colors.tint, borderRadius: 8, padding: 14, alignItems: 'center' }}
        onPress={handleLogin}
      >
        <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 16 }}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}