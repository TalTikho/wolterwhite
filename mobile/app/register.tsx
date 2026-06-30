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

    const [formData, setFormData] = useState({
        username: '', displayName: '', phone: '', address: '', password: '', confirmPassword: ''
    });
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});

    const handleRegister = async () => {
        setErrors({});

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: ['Passwords do not match'] });
            return;
        }

        try {
            const dataToSend = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (key !== 'confirmPassword') dataToSend.append(key, val);
            });

            if (profilePic) {
                dataToSend.append('profilePic', { uri: profilePic, name: 'pic.jpg', type: 'image/jpeg' } as any);
            }

            const data = await sendPOST('/api/users', dataToSend);

            if (data && data.token) {
                await tokenToStorage(data.token);
                router.replace('/(drawer)/(tabs)');
            }
        } catch (e: any) {
            if (e.status === 400 && e.message) {
                try {
                    const parsed = JSON.parse(e.message);
                    setErrors(parsed.errors || {});
                } catch {
                    setErrors({ general: ['Registration failed'] });
                }
            } else {
                setErrors({ general: ['Registration failed, please try again'] });
            }
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Account 📝</Text>

                {errors.general && <Text style={styles.errorText}>{errors.general.join(', ')}</Text>}

                <TouchableOpacity onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
                    if (!result.canceled) setProfilePic(result.assets[0].uri);
                }}>
                    <View style={styles.imagePickerContainer}>
                        {profilePic ? <Image source={{ uri: profilePic }} style={styles.profilePic} /> :
                            <View style={styles.placeholderPic}><Text style={styles.placeholderText}>+ Add Photo</Text></View>}
                    </View>
                </TouchableOpacity>

                {Object.keys(formData).map((key) => (
                    <View key={key}>
                        <TextInput
                            style={[styles.input, { borderColor: errors[key] ? '#ff6b6b' : colors.icon }]}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace('confirmPassword', 'Confirm Password')}
                            placeholderTextColor={colors.icon}
                            value={formData[key as keyof typeof formData]}
                            onChangeText={(val) => setFormData(prev => ({ ...prev, [key]: val }))}
                            secureTextEntry={key === 'password' || key === 'confirmPassword'}
                            autoCapitalize="none"
                        />
                        {errors[key] && <Text style={styles.errorText}>{errors[key][0]}</Text>}
                    </View>
                ))}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}