import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { styles } from '@/styles/ProductForm'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
}
  from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native-gesture-handler";
export const ProductForm = ({
  restaurantId,
  existingProduct = null,
  onSuccess,
  onCancel
}: {
  restaurantId: any;
  existingProduct: any;
  onSuccess: any;
  onCancel: any;
}) => {
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    pname: "",
    pdescription: "",
    price: ""
  });
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        pname: existingProduct.pname || existingProduct.name || "",
        pdescription: existingProduct.pdescription || existingProduct.description || "",
        price: existingProduct.price || ""
      });
    }
  }, [existingProduct]);

  //update fields with explicit types.
  const handleFieldUpdate = (fieldName: string, text: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: text }));
  };

  //expo image picker usage for the form.
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      mediaTypes: ["images"]
    });

    if (!result.canceled) {
      //Save the image object to state
      setImageFile(result.assets[0]);
    } else {
      Alert.alert("You cancelled the image picker");
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    console.log("Submit triggered. Current restaurantId:", restaurantId);
    console.log("Form data state before send:", formData);

    if (!restaurantId) {
      setError("Internal Error: Missing Restaurant ID. Please close the form and try again.");
      return;
    }

    if (!formData.pname || !formData.price) {
      setError("Name and Price are required fields.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!existingProduct;
      const productId = existingProduct ? (existingProduct.pId || existingProduct.id || existingProduct._id) : "";

      const url = isEdit
        ? `/api/restaurants/${restaurantId}/products/${productId}`
        : `/api/restaurants/${restaurantId}/products`;
      const method = isEdit ? "PATCH" : "POST";

      console.log(`Sending target request to URL: ${url} | Method: ${method}`);

      const data = new FormData();
      data.append("pname", formData.pname);
      data.append("pdescription", formData.pdescription);
      data.append("price", formData.price);

      if (imageFile) {
        //We construct the object exactly as a mobile server expects to receive a multipart/form-data file
        data.append("image", {
          uri: imageFile.uri,
          name: imageFile.fileName || 'upload.jpg',
          type: imageFile.mimeType || 'image/jpeg',
        } as any);
      }
      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      // Debugging lines to capture full server outcome
      const responseData = await response.json().catch(() => null);
      console.log("Server Response Status:", response.status);
      console.log("Server Response Data Object:", responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || `Server rejected with status ${response.status}`);
      }

      console.log("Product saved successfully, executing onSuccess callback.");
      onSuccess();
    } catch (err) {
      console.error("Caught error in form submission block:", err);
      setError("Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="product-form-card">
      <Text className="product-form-title">
        {existingProduct ? "Edit Product" : "Add New Product"}
      </Text>

      {error && <Text className="product-form-error">{error}</Text>}
      {error && <Text>{error}</Text>}
      <Text>Product Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.pname}
        onChangeText={(text) => handleFieldUpdate("pname", text)}
        placeholder="e.g. Signature Fried Chicken"
      />
      <Text>Price ($) *</Text>
      <TextInput
        style={styles.input}
        value={formData.price}
        onChangeText={(text) => handleFieldUpdate("price", text)}
        placeholder="e.g. 14.99"
      />
      <Text>Product Image</Text>
      <TouchableOpacity
        onPress={pickImageAsync}
      ><Text>Image picker</Text></TouchableOpacity>

      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.pdescription}
        onChangeText={(text) => handleFieldUpdate("pdescription", text)}
        placeholder="Describe the item ingredients, allergens, or size..."
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text>{loading ? "Saving..." : (existingProduct ? "Update Changes" : "Create Restaurant")}</Text>
          <TouchableOpacity 
          onPress={handleSubmit}
           disabled={loading}
           >
            <Text>{loading ? "Saving..." : (existingProduct ? "Update Product" : "Create Product")}</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
    </ScrollView >
  );
};