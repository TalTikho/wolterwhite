import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { ThemeProvider } from '../context/ThemeContext';
import { TokenProvider } from '../context/AuthContext';
import { RestaurantFilterProvider } from '../context/RestaurantFilterContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TokenProvider>
        <RestaurantFilterProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" />
              <Stack.Screen name="(drawer)" />
            </Stack>
          </GestureHandlerRootView>
        </RestaurantFilterProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}