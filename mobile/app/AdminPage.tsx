// admin.tsx
import React, { useEffect, useState } from "react";
import { sendGet, sendDELETE } from '@/services/api';
import { RestaurantForm } from "@/components/RestaurantForm";
import { ProductForm } from "@/components/ProductForm";
import { useAuthContext } from "@/context/AuthContext";
import { Product, Restaurant } from "@/components/Types";
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Button,
  Alert,
  Image,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminStyles } from "@/styles/adminstyles";
import { router, useRouter } from 'expo-router';
import { routePatternToRegex } from "expo-router/build/fork/getStateFromPath-forks";

export default function AdminPage() {
  //Accepts any image string (from a restaurant OR a product) and returns the native-safe URL
  const getNativeImageUrl = (imagePath?: string | null) => {
    if (!imagePath || imagePath.trim() === '') return null;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const baseUrl = Platform.select({
      android: 'http://10.0.2.2:5000',
      ios: 'http://localhost:5000',
      default: 'http://localhost:5000'
    });

    return `${baseUrl}/api/images/${imagePath}`;
  };
  const { token } = useAuthContext();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = adminStyles(colors);

  //Restaurant and Product arrays as defined in Types according to their schemas in webServer moddels.
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  //could be null
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState<Restaurant | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showRestaurantForm, setShowRestaurantForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedMenu = async () => {
      try {
        const saved = await AsyncStorage.getItem("active_admin_restaurant_menu");

        //If we found something, parse it and update the state
        if (saved) {
          setSelectedRestaurantForMenu(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading saved restaurant menu:", error);
      }
    };

    //Execute the lambda
    loadSavedMenu();
  }, []);


  const [showProductForm, setShowProductForm] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      console.log("Fetching all restaurants...");
      const data = await sendGet('/api/restaurants', token);
      console.log("Restaurants data loaded:", data);
      setRestaurants(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading restaurants:", err);
      setError("Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (restaurantId: string) => {
    try {
      console.log(`Fetching products for restaurant ID: ${restaurantId}`);

      const data = await sendGet(`/api/restaurants/${restaurantId}/products`, token);
      console.log("Products payload received from server:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error("Server data structure mismatch. Expected array but got:", data);
        setProducts([]);
      }
    } catch (err: any) {
      console.error("Error inside fetchProducts block:", err);
      Alert.alert("Failed to load menu for this restaurant.");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantForMenu && token) {
      const restaurantId = selectedRestaurantForMenu._id;
      fetchProducts(restaurantId);
    }
  }, [selectedRestaurantForMenu, token]);


  //using React Native's Alert to alert the user before deleting a restaurant.
  const handleDeleteRestaurant = async (id: string) => {
    Alert.alert(
      "Restaurant Deletion",
      "Are you sure you want to delete this restaurant?",
      [
        {
          text: "Cancel",
          style: "cancel", //Gives it a subtle/default look depending on OS
        },
        {
          text: "Delete",
          style: "destructive",
          //The actual deletion logic runs ONLY when this button is tapped
          onPress: async () => {
            try {
              const response = await sendDELETE(`/api/restaurants/${id}`, null, token);
              fetchRestaurants(); //Refresh the list
            }
            catch (err) {
              Alert.alert("Error", "Failed to delete.");
            }
          },
        },
      ],
      { cancelable: true } //Allows tapping outside the alert box to close it on Android
    );
  };

  const handleManageMenu = async (restaurant: Restaurant) => {
    console.log("Managing menu for target restaurant:", restaurant);
    setSelectedRestaurantForMenu(restaurant);
    await AsyncStorage.setItem("active_admin_restaurant_menu", JSON.stringify(restaurant));
    setShowRestaurantForm(false);
    const restaurantId = restaurant._id;
    fetchProducts(restaurantId);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!selectedRestaurantForMenu) {
      Alert.alert("Error", "No restaurant selected.");
      return;
    }
    const restaurantId = selectedRestaurantForMenu._id;


    Alert.alert(
      "Product Deletion",
      "Delete this product from the menu?",
      [
        {
          text: "Cancel",
          style: "cancel", //Gives it a subtle/default look depending on OS
        },
        {
          text: "Delete",
          style: "destructive",
          //The actual deletion logic runs when this button is tapped
          onPress: async () => {
            try {

              const response = await sendDELETE(`/api/restaurants/${restaurantId}/products/${productId}`, null, token);
              //sendDELETE already handles errors.
              fetchProducts(restaurantId);
            }
            catch (err) {
              Alert.alert("Error", "Error deleting the product.");
            }
          },
        },
      ],
      { cancelable: true } //Allows tapping outside the alert box to close it on Android
    );
  };
  //async opertaion cannot be inside a React comp as it is synchronous.
  const removeRestFromMem = async () => {
    AsyncStorage.removeItem("active_admin_restaurant_menu");
  }
  if (selectedRestaurantForMenu) {
    const restaurantId = selectedRestaurantForMenu._id;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          setSelectedRestaurantForMenu(null);
          removeRestFromMem();
          setShowProductForm(false);
          setProducts([]);
        }}>
          <Text style={styles.backBtnText}>← Back to Restaurants</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.pageTitle} numberOfLines={1}>Menu: {selectedRestaurantForMenu.name}</Text>
          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => { setEditingProduct(null); setShowProductForm(!showProductForm); }}>
            <Text style={styles.primaryActionBtnText}>{showProductForm ? "Cancel" : "+ Add Product"}</Text>
          </TouchableOpacity>
        </View>

        {showProductForm && (
          <ProductForm
            restaurantId={restaurantId}
            existingProduct={editingProduct}
            onSuccess={() => { setShowProductForm(false); fetchProducts(restaurantId); }}
            onCancel={() => setShowProductForm(false)}
          />
        )}
        <View />

        <View style={styles.tableWrapper}>
          <FlatList
            data={products}

            // If products is empty, FlatList automatically renders this:
            ListEmptyComponent={<Text style={styles.tableEmpty}>No products found.</Text>}

            keyExtractor={(item) => item._id}
            ListHeaderComponent={
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.imageCol]}>Image</Text>
                <Text style={[styles.tableHeaderText, styles.nameCol]}>Name</Text>
                <Text style={[styles.tableHeaderText, styles.priceCol]}>Price</Text>
                <Text style={[styles.tableHeaderText, styles.actionsCol, { textAlign: 'right' }]}>Actions</Text>
              </View>
            }
            renderItem={({ item }) => {
              const finalImageUrl = getNativeImageUrl(item.image);
              return (
                <View style={styles.tableRow}>
                  <View style={styles.imageCol}>
                    <Image
                      source={finalImageUrl ? { uri: finalImageUrl } : require('@/assets/images/knock.png')}
                      style={styles.productThumb}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.nameCol}>
                    <Text style={styles.itemImportant}>{item.pname}</Text>
                    <Text style={styles.itemMuted} numberOfLines={2}>{item.pdescription}</Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.itemImportant}>${item.price}</Text>
                  </View>
                  <View style={styles.actionsCol}>
                    <TouchableOpacity style={[styles.rowBtn, styles.btnEdit]} onPress={() => { setEditingProduct(item); setShowProductForm(true); }}>
                      <Text style={styles.rowBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rowBtn, styles.btnDelete]} onPress={() => handleDeleteProduct(item._id)}>
                      <Text style={styles.rowBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.primaryActionBtn} onPress={() => { router.replace('/') }}>
          <Text style={styles.primaryActionBtnText}>Back Home</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.primaryActionBtn} onPress={() => { setEditingRestaurant(null); setShowRestaurantForm(!showRestaurantForm); }}>
          <Text style={styles.primaryActionBtnText}>{showRestaurantForm ? "Cancel" : "+ Add New Restaurant"}</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>{error}</Text>
        </View>
      )}

      {showRestaurantForm && (
        <RestaurantForm
          existingRestaurant={editingRestaurant}
          onSuccess={() => { setShowRestaurantForm(false); fetchRestaurants(); }}
          onCancel={() => setShowRestaurantForm(false)}
        />
      )}

      {loading ? (
        <Text style={styles.loadingText}>Loading data...</Text>
      ) : (
        <View style={styles.tableWrapper}>
          <FlatList
            data={restaurants}

            // If products is empty, FlatList automatically renders this:
            ListEmptyComponent={<Text style={styles.tableEmpty}>No restaurants found.</Text>}

            keyExtractor={(item) => item._id}
            ListHeaderComponent={
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, styles.nameCol]}>Name</Text>
                <Text style={[styles.tableHeaderText, styles.actionsCol, { textAlign: 'right' }]}>Actions</Text>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <View style={styles.tableRow}>
                  <View style={styles.nameCol}>
                    <Text style={styles.itemImportant}>{item.name}</Text>
                  </View>
                  <View style={styles.actionsCol}>
                    <TouchableOpacity style={[styles.rowBtn, styles.btnMenu]} onPress={() => handleManageMenu(item)}>
                      <Text style={styles.rowBtnText}>Menu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rowBtn, styles.btnEdit]} onPress={() => { setEditingRestaurant(item); setShowRestaurantForm(true); }}>
                      <Text style={styles.rowBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rowBtn, styles.btnDelete]} onPress={() => handleDeleteRestaurant(item._id)}>
                      <Text style={styles.rowBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );

            }}
          />
        </View>
      )}
    </SafeAreaView>
  )
};