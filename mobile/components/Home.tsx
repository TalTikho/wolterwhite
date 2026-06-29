import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { useRestaurantFilter } from '@/context/RestaurantFilterContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { RestaurantCard } from '@/components/RestaurantCard'
import { RestaurantDetailsModal } from '@/components/RestaurantDetailsModal';
import { sendGet } from '@/services/api';
import { homeStyles } from '@/styles/homeStyles';

type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  image?: string;
  addressX?: number;
  addressY?: number;
  products?: { pname: string }[];
};

type UserCoords = { x: number; y: number } | null;

const COORD_PATTERN = /^\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)$/;

const parseCoordinates = (addressString?: string): UserCoords => {
  if (!addressString) return null;
  const match = addressString.trim().match(COORD_PATTERN);
  if (!match) return null;
  return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
};

const distanceKm = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const toNumber = (value: any): number | null => {
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
};

// token is guaranteed non-null by index.tsx before this renders
export const Home = ({ token }: { token: string }) => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { search, filters, cardsVisible, nearMeOnly, nearMeRadiusKm } = useRestaurantFilter();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = homeStyles(colors);

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userCoords: UserCoords = (() => {
    const x = toNumber(payload.x);
    const y = toNumber(payload.y);
    if (x !== null && y !== null) return { x, y };
    if (payload.address && typeof payload.address === 'string' && payload.address.includes('(')) {
      const clean = payload.address.replace(/[()]/g, '');
      const [rawX, rawY] = clean.split(',');
      const px = toNumber(rawX);
      const py = toNumber(rawY);
      if (px !== null && py !== null) return { x: px, y: py };
    }
    return parseCoordinates(payload.address);
  })();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState('Guest');

  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkWelcome = async () => {
      const flag = await AsyncStorage.getItem('justLoggedIn');
      if (flag) {
        setWelcome(true);
        await AsyncStorage.removeItem('justLoggedIn');
      }
    };
    checkWelcome();
  }, []);

  useEffect(() => {
    if (welcome) {
      Animated.sequence([
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(4400),
        Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setWelcome(false));
    }
  }, [welcome]);

  useEffect(() => {
    try {
      const p = JSON.parse(atob(token.split('.')[1]));
      setDisplayName(p?.displayName || 'User');
      setIsAdmin(p?.username?.toLowerCase() === 'admin1');
    } catch (e) {
      console.error('Error parsing token payload:', e);
    }
  }, [token]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await sendGet('/api/restaurants', token);
        setRestaurants(data);
      } catch (err) {
        setError('Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
    const intervalId = setInterval(fetchRestaurants, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filtered = restaurants.filter((r) => {
    const searchLower = search.toLowerCase();
    const scope = filters.searchScope || 'both';
    const matchesName = r.name?.toLowerCase().includes(searchLower);
    const matchesProduct = r.products?.some((p) => p.pname?.toLowerCase().includes(searchLower));

    let matchesSearch: boolean;
    if (scope === 'restaurant') matchesSearch = matchesName;
    else if (scope === 'product') matchesSearch = matchesProduct ?? false;
    else matchesSearch = matchesName || (matchesProduct ?? false);

    const matchesAddress = filters.address
      ? r.address?.toLowerCase().includes(filters.address.toLowerCase())
      : true;

    let matchesRadius = true;
    const restX = toNumber(r.addressX);
    const restY = toNumber(r.addressY);
    if (nearMeOnly && userCoords && restX !== null && restY !== null) {
      matchesRadius = distanceKm(userCoords.x, userCoords.y, restX, restY) <= nearMeRadiusKm;
    }
    return matchesSearch && matchesAddress && matchesRadius;
  });

  return (
    <SafeAreaView style={styles.wrapper}>
      {welcome && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastTitle}>Welcome to WolterWhite</Text>
          <Text style={styles.toastBody}>Yeah, Mr. {displayName}! Yeah, Science!</Text>
          <TouchableOpacity style={styles.toastClose} onPress={() => setWelcome(false)}>
            <Text style={styles.toastCloseText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {cardsVisible && (
        <View style={styles.content}>
          {isAdmin && (
            <TouchableOpacity style={styles.adminBtn} onPress={() => router.push('/')}>
              <Text style={styles.adminBtnText}>⚙️ Open Admin Dashboard</Text>
            </TouchableOpacity>
          )}
          {loading && <Text style={styles.status}>Loading restaurants...</Text>}
          {error && <Text style={[styles.status, styles.statusError]}>{error}</Text>}
          {!loading && !error && filtered.length === 0 && search !== '' && (
            <Text style={styles.status}>No restaurants found for {`"${search}"`}</Text>
          )}
          {!loading && !error && (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <RestaurantCard
                  restaurant={item}
                  onQuickView={() => setSelectedRestaurant(item)}
                />
              )}
              contentContainerStyle={styles.grid}
            />
          )}
        </View>
      )}

      <RestaurantDetailsModal
        isOpen={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        restaurant={selectedRestaurant}
      />
    </SafeAreaView>
  );
};