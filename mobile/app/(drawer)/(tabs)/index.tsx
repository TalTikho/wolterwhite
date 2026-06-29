import { Text, View } from "react-native";
import { homeStyles } from "../../../styles/homeStyles";

export default function HomeScreen() {
    return (
        <View style={homeStyles.container}>
            <Text style={homeStyles.text}>
                Welcome to WOLTerWhite Dashboard! 🍔
            </Text>
        </View>
    );
}