import React from "react";
import { View, Text, Switch, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useTheme } from "../context/ThemeContext";
import { sideMenuStyles } from "../styles/sideMenuStyles";

export default function SideMenu(props: any) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1 }}
        >
            <View style={sideMenuStyles.profileContainer}>
                <Image
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={sideMenuStyles.avatar}
                />

                <Text style={sideMenuStyles.userName}>
                    Guest User
                </Text>
            </View>

            <View style={sideMenuStyles.linksContainer}>
                <DrawerItemList {...props} />
            </View>

            <View style={sideMenuStyles.bottomSection}>
                <View style={sideMenuStyles.themeToggleContainer}>
                    <Text style={sideMenuStyles.themeText}>
                        Dark Mode
                    </Text>

                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{
                            false: "#767577",
                            true: "#81b0ff",
                        }}
                        thumbColor={
                            isDarkMode
                                ? "#007bff"
                                : "#f4f3f4"
                        }
                    />
                </View>

                <TouchableOpacity style={sideMenuStyles.logoutButton}>
                    <Text style={sideMenuStyles.logoutText}>
                        Login / Register
                    </Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}