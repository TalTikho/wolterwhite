import { Tabs } from "expo-router";
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme } from '../../../context/ThemeContext';
import { useRestaurantFilter } from '../../../context/RestaurantFilterContext';
import { Colors } from '../../../constants/theme';

function HeaderSearch() {
  const { search, setSearch, cardsVisible, toggleCardsVisible } = useRestaurantFilter();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 8 }}>
      <TextInput
        placeholder="🔍 Search..."
        placeholderTextColor={`${colors.text}73`}
        value={search}
        onChangeText={setSearch}
        style={{
          flex: 1,
          backgroundColor: colors.background,
          borderWidth: 1.5,
          borderColor: colors.border,
          borderRadius: 999,
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

export default function TabsLayout() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.header,
          borderBottomWidth: 2,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,

        // 👇 new — tab bar theming
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1.5,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'WolterWhite',
          headerTitle: () => <HeaderSearch />,
          headerTitleContainerStyle: { flex: 1 },
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../../assets/images/WolterWhiteLightTheme.png')}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'My Orders',
          title: 'My Orders 📦',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../../assets/images/SaulGoodman.png')}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </Tabs>
  );
}