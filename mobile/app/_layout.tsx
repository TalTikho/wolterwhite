import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import SideMenu from '../components/SideMenu';
import { ThemeProvider } from '../context/ThemeContext';
import { TokenProvider } from '../context/AuthContext';
import { RestaurantFilterProvider } from '../context/RestaurantFilterContext';
import { useRestaurantFilter } from '../context/RestaurantFilterContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/theme';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';

function HeaderSearch() {
  const { search, setSearch, cardsVisible, toggleCardsVisible } = useRestaurantFilter();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8 }}>
      <TextInput
        placeholder="🔍 Search..."
        placeholderTextColor={`${colors.text}73`} // Added opacity to match placeholder styling
        value={search}
        onChangeText={setSearch}
        style={{
          flex: 1,
          backgroundColor: colors.background, // Matches input background
          borderWidth: 1.5,
          borderColor: colors.border,
          borderRadius: 999, // Pill style matching your web layout (.navbar-search-input)
          paddingHorizontal: 14,
          paddingVertical: 6,
          fontSize: 13,
          color: colors.text,
          minWidth: 140,
        }}
      />
      <TouchableOpacity
        onPress={toggleCardsVisible}
        style={{
          borderWidth: 1.5,
          borderColor: colors.border,
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: cardsVisible ? colors.border : 'transparent',
        }}
      >
        <Text style={{ color: cardsVisible ? '#ffffff' : colors.text, fontSize: 12, fontWeight: '600' }}>
          {cardsVisible ? 'Clear' : 'Show'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ThemedDrawer() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderSearch />,
        headerTitleContainerStyle: { flex: 1 },
        headerStyle: { 
          backgroundColor: colors.surface, // Matches .navbar-container background
          borderBottomWidth: 2,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.surface }, // Matches background surface
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: `${colors.text}b3`,
      }}
      drawerContent={(props) => <SideMenu {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{ drawerLabel: 'WolterWhite', title: 'WolterWhite 🏠' }}
      />
      <Drawer.Screen
        name="orders"
        options={{
          drawerLabel: 'My Orders',
          title: 'My Orders 📦',
          headerTitle: 'My Orders 📦',
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
          title: 'Login',
        }}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <RestaurantFilterProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedDrawer />
          </GestureHandlerRootView>
        </RestaurantFilterProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}