import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { sharedFormStyles } from "@/styles/formStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
}
  from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native-gesture-handler";
import { sendPOST, sendPATCH } from '@/services/api';

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
  //dark mode setup.
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = sharedFormStyles(colors);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        pname: existingProduct.pname || existingProduct.name || "",
        pdescription: existingProduct.pdescription || existingProduct.description || "",
        //In the databse products prices' are saved as ints so to read them back in editing mode
        //we need to convert back to string (typescript).
        price: existingProduct.price ? String(existingProduct.price) : ""
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
      quality: 0.5,
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

      //url building and dbug setup.
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
      //fetching product using the fetcher whether to edit/create.
      if (isEdit) {
        await sendPATCH(`/api/restaurants/${restaurantId}/products/${productId}`, data, token);
      } else {
        await sendPOST(`/api/restaurants/${restaurantId}/products`, data, token);
      }
      onSuccess();
    } catch (err) {
      console.error("Caught error in form submission block:", err);
      setError("Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {existingProduct ? "Edit Product" : "Add New Product"}
        </Text>

        {error && (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.pname}
            onChangeText={(text) => handleFieldUpdate("pname", text)}
            placeholder="e.g. Signature Fried Chicken"
            placeholderTextColor={colors.text + '66'}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price ($) *</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => handleFieldUpdate("price", text)}
            placeholder="e.g. 14.99"
            keyboardType="numeric"
            placeholderTextColor={colors.text + '66'}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Product Image</Text>
          <TouchableOpacity style={styles.filePickerBtn} onPress={pickImageAsync}>
            <Text style={styles.filePickerText}>Choose File...</Text>
          </TouchableOpacity>
          {imageFile && (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData.pdescription}
            onChangeText={(text) => handleFieldUpdate("pdescription", text)}
            placeholder="Describe the item ingredients, allergens, or size..."
            multiline={true}
            numberOfLines={3}
            placeholderTextColor={colors.text + '66'}
          />
        </View>

        <View style={styles.actionsWrapper}>
          <TouchableOpacity
            style={[styles.submitBtn, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? "Saving..." : (existingProduct ? "Update Product" : "Create Product")}
            </Text>
          </TouchableOpacity>

          {onCancel && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};