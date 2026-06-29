import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Image, TouchableOpacity, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import { useRestaurantFilter } from '../context/RestaurantFilterContext';
import { Colors } from '../constants/theme';
import { sideMenuStyles } from '../styles/sideMenuStyles';

export default function SideMenu(props: any) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token, logOut } = useAuthContext();
  const { filters, updateFilter, clearFilters, nearMeOnly, toggleNearMeOnly, nearMeRadiusKm } = useRestaurantFilter();
  const router = useRouter();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  const [displayName, setDisplayName] = useState('Guest User');
  const [userImage, setUserImage] = useState<string | null> (null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setDisplayName(payload?.displayName || 'User');
        setUserImage(payload?.profilePic || null);
      } catch (e) {
        console.error('Error parsing token in SideMenu:', e);
      }
    }
  }, [token]);

  const getImageUrl = () => {
    if (!userImage || userImage.trim() === '') return null;
    if (userImage.startsWith('http://') || userImage.startsWith('https://')) {
      return userImage;
    }

    const baseUrl = Platform.select({
      android: 'http://10.0.2.2:5000',
      ios: 'http://localhost:5000',
      default: 'http://localhost:5000',
    });

    return `${baseUrl}/api/images/${userImage}`;
  };

  const finalImageUrl = getImageUrl();

  const handleLogout = async () => {
    await logOut();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ flex: 1, backgroundColor: colors.surface }}
    >

      {/* Profile section */}
      <View style={[sideMenuStyles.profileContainer, { borderBottomColor: colors.border }]}>
        <Image
          source={
            finalImageUrl
              ? { uri: finalImageUrl }
              : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' } // fallback stays as placeholder
          }
          style={sideMenuStyles.avatar}
        />
        <Text style={[sideMenuStyles.userName, { color: colors.text }]}>{displayName}</Text>
      </View>

      {/* Nav links */}
      <View style={sideMenuStyles.linksContainer}>
        <DrawerItemList 
          {...props} 
          descriptors={Object.fromEntries(
            Object.entries(props.descriptors).map(([key, value]: any) => [
              key,
              {
                ...value,
                options: {
                  ...value.options,
                  drawerInactiveTintColor: isDarkMode ? '#ffffff' : '#1a1a1a',
                  drawerActiveTintColor: isDarkMode ? '#ffffff' : colors.border,
                }
              }
            ])
          )}
        />
      </View>

      {/* Filter section */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>Filters</Text>

        {/* Near me toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontSize: 13 }}>
            Within {nearMeRadiusKm}km only
          </Text>
          <Switch
            value={nearMeOnly}
            onValueChange={toggleNearMeOnly}
            trackColor={{ false: '#767577', true: colors.border }}
            thumbColor={nearMeOnly ? colors.border : '#f4f3f4'}
          />
        </View>

        {/* Search scope */}
        <Text style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>Search matches:</Text>
        {(['both', 'restaurant', 'product'] as const).map((scope) => (
          <TouchableOpacity
            key={scope}
            onPress={() => updateFilter('searchScope', scope)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 }}
          >
            <View style={{
              width: 16, height: 16, borderRadius: 8,
              borderWidth: 2,
              borderColor: filters.searchScope === scope ? colors.border : colors.icon,
              alignItems: 'center', justifyContent: 'center',
            }}>
              {filters.searchScope === scope && (
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border }} />
              )}
            </View>
            <Text style={{ color: colors.text, fontSize: 13, textTransform: 'capitalize' }}>{scope}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={clearFilters} style={{ marginTop: 4 }}>
          <Text style={{ color: isDarkMode ? '#ffffff' : colors.border, fontSize: 13, fontWeight: '600' }}>
            Clear filters
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom section */}
      <View style={[sideMenuStyles.bottomSection, { borderTopColor: colors.border }]}>
        <View style={sideMenuStyles.themeToggleContainer}>
          <Text style={[sideMenuStyles.themeText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.border }}
            thumbColor={isDarkMode ? colors.border : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[sideMenuStyles.logoutButton, { backgroundColor: colors.border }]}
          onPress={token ? handleLogout : () => router.replace('/login')}
        >
          <Text style={sideMenuStyles.logoutText}>
            {token ? 'Log Out' : 'Login / Register'}
          </Text>
        </TouchableOpacity>
      </View>

    </DrawerContentScrollView>
  );
}