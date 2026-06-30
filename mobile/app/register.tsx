import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '@/context/AuthContext';
import { sendPOST } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { getStyles } from '@/styles/registerStyles';

export default function RegisterScreen() {
    const { tokenToStorage } = useAuthContext();
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? Colors.dark : Colors.light;
    const styles = getStyles(colors);
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [serverError, setServerError] = useState('');

    const isLengthValid = password.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const passwordsMatch = password !== '' && password === confirmPassword;
    const addressRegex = /^\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)$/;
    const isAddressValid = addressRegex.test(address.replace(/\s/g, ''));

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setProfilePic(result.assets[0].uri);
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!username) newErrors.username = 'Username is required';
        if (!displayName) newErrors.displayName = 'Display Name is required';
        if (!phone) newErrors.phone = 'Phone is required';
        if (!isAddressValid) newErrors.address = 'Address must be in (x,y) format';
        if (!isLengthValid || !hasLetters || !hasNumbers) newErrors.password = 'Password does not meet requirements';
        if (!passwordsMatch) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        setServerError('');
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('displayName', displayName);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('address', address);
            if (profilePic) {
                const filename = profilePic.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
                formData.append('profilePic', { uri: profilePic, name: filename, type } as any);
            }
            const data = await sendPOST('/api/users', formData);
            await tokenToStorage(data.token);
            router.replace('/(drawer)/(tabs)');
        } catch (e: any) {
            setServerError(e.message?.includes('409') ? 'Username is already taken' : 'Registration failed');
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Account 📝</Text>
                {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

                <View style={styles.imagePickerContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.placeholderPic}>
                                <Text style={styles.placeholderText}>+ Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {[
                    { val: username, set: setUsername, ph: 'Username', err: errors.username },
                    { val: displayName, set: setDisplayName, ph: 'Display Name', err: errors.displayName },
                    { val: phone, set: setPhone, ph: 'Phone', err: errors.phone },
                    { val: address, set: setAddress, ph: 'Address (e.g. 32.1,-15.4)', err: errors.address },
                ].map((item, i) => (
                    <View key={i}>
                        <TextInput style={[styles.input, { borderColor: item.err ? '#ff6b6b' : colors.icon, color: colors.text }]} placeholder={item.ph} placeholderTextColor={colors.icon} value={item.val} onChangeText={item.set} autoCapitalize="none" />
                        {item.err && <Text style={styles.errorText}>{item.err}</Text>}
                    </View>
                ))}

                <TextInput style={[styles.input, { borderColor: errors.password ? '#ff6b6b' : colors.icon, color: colors.text, marginBottom: 8 }]} placeholder="Password" placeholderTextColor={colors.icon} value={password} onChangeText={setPassword} secureTextEntry />
                <View style={styles.checklistContainer}>
                    <Text style={[styles.checklistItem, { color: isLengthValid ? '#4CAF50' : colors.icon }]}>{isLengthValid ? '✓' : '○'} At least 8 characters</Text>
                    <Text style={[styles.checklistItem, { color: hasLetters ? '#4CAF50' : colors.icon }]}>{hasLetters ? '✓' : '○'} Contains letters</Text>
                    <Text style={[styles.checklistItem, { color: hasNumbers ? '#4CAF50' : colors.icon }]}>{hasNumbers ? '✓' : '○'} Contains numbers</Text>
                </View>

                <TextInput style={[styles.input, { borderColor: errors.confirmPassword ? '#ff6b6b' : colors.icon, color: colors.text }]} placeholder="Confirm Password" placeholderTextColor={colors.icon} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                {confirmPassword !== '' && !passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginLinkContainer} onPress={() => router.back()}>
                    <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkHighlight}>Log in</Text></Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}