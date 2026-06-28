import { Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/theme";
import { homeStyles } from "../styles/homeStyles";

export default function HomeScreen() {
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? Colors.dark : Colors.light;
    const styles = homeStyles(colors);

    return (
        <View style={styles.wrapper}>
            <View style={styles.content}>
              <Text style={styles.status}>Welcome to WOLTerWhite Dashboard! 🍔</Text>
            </View>
        </View>
    );
}