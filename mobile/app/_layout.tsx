import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import SideMenu from '../components/SideMenu';
import { ThemeProvider } from '../context/ThemeContext';
import { TokenProvider } from '../context/AuthContext';
import { RestaurantFilterProvider } from '../context/RestaurantFilterContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <RestaurantFilterProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
              screenOptions={{ headerShown: true }}
              drawerContent={(props) => <SideMenu {...props} />}
            >
              <Drawer.Screen
                name="index"
                options={{
                  drawerLabel: 'WolterWhite',
                  title: 'WolterWhite 🏠',
                }}
              />
              <Drawer.Screen
                name="orders"
                options={{
                  drawerLabel: 'My Orders',
                  title: 'My Orders 📦',
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
          </GestureHandlerRootView>
        </RestaurantFilterProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}