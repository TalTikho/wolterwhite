import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { ThemeProvider } from '..//context/ThemeContext';


export default function RootLayout() {
    return (
        <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack>
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                </Stack>
            </GestureHandlerRootView>
        </ThemeProvider >
    );


}