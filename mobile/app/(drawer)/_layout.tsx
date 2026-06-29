
import { Drawer } from 'expo-router/drawer';
import SideMenu from '../../components/SideMenu';

export default function RootLayout() {
  return (

        <Drawer
          screenOptions={{ headerShown: true }}
          drawerContent={(props) => <SideMenu {...props} />}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Home Dashboard',
              title: 'WolterWhite 🏠',
            }}
          />
        </Drawer>

  );
}