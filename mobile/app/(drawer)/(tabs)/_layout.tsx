import { Tabs } from "expo-router";
import { View, Text, Image } from 'react-native';

export default function TabsLayout() {
  return (
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="index" options={{
            tabBarLabel: 'WolterWhite',
            title: 'WolterWhite 🏠',
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../../assets/images/logo-glow.png')}
                style={{ width: size, height: size, tintColor: color }}

              />
            ),
          }} />
          <Tabs.Screen name="orders" options={{
            tabBarLabel: 'My Orders',
            title: 'My Orders 📦',
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../../assets/images/logo-glow.png')}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }} />
        </Tabs>
  );
}