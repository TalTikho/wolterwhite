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
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack>
          </GestureHandlerRootView>
        </RestaurantFilterProvider>
      </TokenProvider>
    </ThemeProvider>
  );
}