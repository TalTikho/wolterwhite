import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';
import { useRestaurantFilter } from '@/context/RestaurantFilterContext';
import { Colors } from '@/constants/theme';
import { navbarStyles } from '@/styles/navbarStyles';
import { sendGet } from '@/services/api';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { token, logOut } = useAuthContext();
  const {
    search, setSearch, filters, updateFilter,
    clearFilters, cardsVisible, toggleCardsVisible,
    nearMeOnly, toggleNearMeOnly, nearMeRadiusKm,
  } = useRestaurantFilter();
  const router = useRouter();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = navbarStyles(colors);

  const [filterOpen, setFilterOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Operator');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const setParams = async () => {
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setDisplayName(payload.displayName);
          const imageUri = await sendGet(`/api/images/${payload.profilePic}`, token);
          setProfilePic(imageUri);
        } catch (error) {
          console.error('Error decoding token in Navbar:', error);
        }
      }
    };
    setParams();
  }, [token]);

  const handleLogout = async () => {
    await logOut();
    router.replace('/');
  };

  const SearchScopeOption = ({ value, label }: { value: string; label: string }) => {
    const current = filters.searchScope || 'both';
    const selected = current === value;
    return (
      <TouchableOpacity
        style={styles.scopeOption}
        onPress={() => updateFilter('searchScope', value as 'both' | 'restaurant' | 'product')}
      >
        <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.scopeLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbarContainer}>

        {/* Brand */}
        <TouchableOpacity style={styles.brand} onPress={() => router.push('/')}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoText}>Wo</Text>
          </View>
          <Text style={styles.brandTitle}>LTerWhite Delivery</Text>
        </TouchableOpacity>

        {/* Search row */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search restaurants..."
            placeholderTextColor={colors.icon}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.outlineBtn} onPress={() => setFilterOpen(true)}>
            <Text style={styles.outlineBtnText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={toggleCardsVisible}>
            <Text style={styles.outlineBtnText}>{cardsVisible ? 'Clear' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.themeToggle}>
            <Text style={styles.themeLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.tint }}
              thumbColor={isDarkMode ? colors.tint : '#f4f3f4'}
            />
          </View>

          {token ? (
            <View style={styles.profileSection}>
              <Link href="/orders" style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>Orders</Text>
              </Link>
              <View style={styles.userInfo}>
                <Image
                  source={profilePic ? { uri: profilePic } : require('../assets/images/knock.png')}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{displayName}</Text>
              </View>
              <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
                <Text style={styles.dangerBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileSection}>
              <Link href="/" style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>Login</Text>
              </Link>
              <Link href="/" style={styles.ghostBtn}>
                <Text style={styles.ghostBtnText}>Register</Text>
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Filter modal */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterOpen(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.filterPopup}>
            <Text style={styles.filterLabel}>Address contains</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="e.g. Tel Aviv"
              placeholderTextColor={colors.icon}
              value={filters.address}
              onChangeText={(val) => updateFilter('address', val)}
            />

            <View style={styles.divider} />

            <Text style={styles.filterLabel}>The search bar above matches</Text>
            <SearchScopeOption value="both" label="Restaurant & product" />
            <SearchScopeOption value="restaurant" label="Restaurant only" />
            <SearchScopeOption value="product" label="Product only" />

            <View style={styles.divider} />

            <TouchableOpacity style={styles.scopeOption} onPress={toggleNearMeOnly}>
              <View style={[styles.checkbox, nearMeOnly && styles.checkboxChecked]}>
                {nearMeOnly && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.scopeLabel}>Only within {nearMeRadiusKm}km</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => { clearFilters(); setFilterOpen(false); }}
            >
              <Text style={styles.ghostBtnText}>Clear filter</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};