import { Text, View } from "react-native";
import { ordersStyles } from "../../../styles/ordersStyles";

export default function OrdersScreen() {
    return (
        <View style={ordersStyles.container}>
            <Text style={ordersStyles.text}>
                Your Orders History will be here! 📦
            </Text>
        </View>
    );
}