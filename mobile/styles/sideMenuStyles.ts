import { StyleSheet } from "react-native";

export const sideMenuStyles = StyleSheet.create({
    profileContainer: {
        padding: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        marginBottom: 10,
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },

    userName: {
        fontSize: 18,
        fontWeight: "bold",
    },

    linksContainer: {
        flex: 1,
    },

    bottomSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        marginBottom: 20,
    },

    themeToggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    themeText: {
        fontSize: 16,
        fontWeight: "500",
    },

    logoutButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },

    logoutText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});