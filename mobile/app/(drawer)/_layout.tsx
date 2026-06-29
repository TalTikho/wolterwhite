import { Drawer } from 'expo-router/drawer';
import SideMenu from '../../components/SideMenu';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/theme';

export default function DrawerLayout() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Drawer
      screenOptions={{
        headerShown: false, // headers now live in (tabs)/_layout per screen
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: `${colors.text}b3`,
      }}
      drawerContent={(props) => <SideMenu {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home Dashboard' }} />
    </Drawer>
  );
}