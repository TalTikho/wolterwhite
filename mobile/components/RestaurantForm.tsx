import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  ScrollView
} from 'react-native';
import { sharedFormStyles } from "@/styles/formStyles";
import * as ImagePicker from 'expo-image-picker';
import { sendPOST, sendPATCH } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';

export const RestaurantForm = ({ existingRestaurant, onSuccess, onCancel }: {
  existingRestaurant: any;
  onSuccess: any;
  onCancel: any;
}) => {
  const { token } = useAuthContext();
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const styles = sharedFormStyles(colors);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    addressX: "",
    addressY: "",
    hours: "",
    description: ""
  });

  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    //validate neccesary fields and enter them into a dictionary.
    if (!existingRestaurant && !formData.name.trim()) e.name = "Restaurant name is required.";
    if (!existingRestaurant && !formData.address.trim()) e.address = "Address is required.";
    if (!existingRestaurant && !formData.hours.trim()) e.hours = "Hours are required.";
    if (!existingRestaurant && !formData.addressX.trim()) e.addressX = "Latitude is required.";
    if (!existingRestaurant && !formData.addressY.trim()) e.addressY = "Longitude is required.";
    if (!existingRestaurant && !formData.phone.trim()) e.phone = "phone number is required.";
    if (!existingRestaurant && !formData.description.trim()) e.description = "description is required.";
    if (!existingRestaurant && !formData.email) {
      e.email = "email address is required.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Please enter a valid email address: losPollos@at.site";
    }

    if (formData.addressX && isNaN(parseFloat(formData.addressX))) e.addressX = "Latitude must be a valid number.";
    if (formData.addressY && isNaN(parseFloat(formData.addressY))) e.addressY = "Longitude must be a valid number.";

    // Only require an image if we are creating a brand new restaurant
    if (!existingRestaurant && !imageFile) {
      e.image = "An image is required for new restaurants.";
    }

    // Set a general error if absolutely any key exists inside our validation tracking dictionary
    if (Object.keys(e).length > 0 && !existingRestaurant) {
      e.general = "All required fields must be filled correctly.";
    }
    else if (Object.keys(e).length > 0 && existingRestaurant) {
      e.general = "All edited fields must be filled correctly.";
    }

    setErrors(e);
    return Object.keys(e).length === 0; //true = valid
  };

  useEffect(() => {
    if (existingRestaurant) {
      setFormData({
        name: existingRestaurant.name || "",
        phone: existingRestaurant.phone || "",
        email: existingRestaurant.email || "",
        address: existingRestaurant.address || "",
        addressX: existingRestaurant.addressX ? String(existingRestaurant.addressX) : "",
        addressY: existingRestaurant.addressY ? String(existingRestaurant.addressY) : "",
        hours: existingRestaurant.hours || "",
        description: existingRestaurant.description || ""
      });
    }
  }, [existingRestaurant]);

  const handleFieldUpdate = (fieldName: string, text: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: text }));
    //clear errors as user types
    setErrors((prev) => ({ ...prev, [fieldName]: '', general: '' }));
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
      // Clear image error if they pick one
      setErrors((prev) => ({ ...prev, image: '', general: '' }));
    } else {
      Alert.alert("You cancelled the image picker");
    }
  };

  const handleSubmit = async (e: any) => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!existingRestaurant;
      const url = isEdit ? `/api/restaurants/${existingRestaurant._id}` : `/api/restaurants`;
      const method = isEdit ? "PATCH" : "POST";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address);
      //formData needs strings while they are numbers in the db.
      data.append("addressX", (parseFloat(formData.addressX) || 0).toString());
      data.append("addressY", (parseFloat(formData.addressY) || 0).toString());
      data.append("hours", formData.hours);
      data.append("description", formData.description);

      if (imageFile) {
        //We construct the object exactly as a mobile server expects to receive a multipart/form-data file
        data.append("image", {
          uri: imageFile.uri,
          name: imageFile.fileName || 'upload.jpg',
          type: imageFile.mimeType || 'image/jpeg',
        } as any);
      }

      //try editing or posting, error will be throughn through the api if the call is not good.
      if (isEdit) {
        await sendPATCH(url, data, token);
      } else {
        await sendPOST(`/api/restaurants`, data, token);
      }

      onSuccess();

    } catch (err: any) {
      console.error("Form submission error:", err);
      setError("Failed to process request. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {existingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
        </Text>

        {error && (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Restaurant Name *</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={formData.name}
            onChangeText={(text) => handleFieldUpdate("name", text)}
            placeholder="e.g. Los Pollos Hermanos"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.name && <Text style={styles.fieldErrorText}>{errors.name}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={formData.phone}
            onChangeText={(text) => handleFieldUpdate("phone", text)}
            placeholder="e.g. 505-142-5678"
            keyboardType="phone-pad"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.phone && <Text style={styles.fieldErrorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={formData.email}
            onChangeText={(text) => handleFieldUpdate("email", text)}
            placeholder="e.g. info@lospollos.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.email && <Text style={styles.fieldErrorText}>{errors.email}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address (Text) *</Text>
          <TextInput
            style={[styles.input, errors.address ? styles.inputError : null]}
            value={formData.address}
            onChangeText={(text) => handleFieldUpdate("address", text)}
            placeholder="e.g. 12000 Candelaria Rd NE, Albuquerque"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.address && <Text style={styles.fieldErrorText}>{errors.address}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address X (Latitude) *</Text>
          <TextInput
            style={[styles.input, errors.addressX ? styles.inputError : null]}
            value={formData.addressX}
            onChangeText={(text) => handleFieldUpdate("addressX", text)}
            placeholder="e.g. 35.118"
            keyboardType="numeric"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.addressX && <Text style={styles.fieldErrorText}>{errors.addressX}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address Y (Longitude) *</Text>
          <TextInput
            style={[styles.input, errors.addressY ? styles.inputError : null]}
            value={formData.addressY}
            onChangeText={(text) => handleFieldUpdate("addressY", text)}
            placeholder="e.g. -106.601"
            keyboardType="numeric"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.addressY && <Text style={styles.fieldErrorText}>{errors.addressY}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Restaurant Image *</Text>
          <TouchableOpacity style={[styles.filePickerBtn, errors.image ? styles.inputError : null]} onPress={pickImageAsync}>
            <Text style={styles.filePickerText}>Choose File...</Text>
          </TouchableOpacity>
          {errors.image && <Text style={styles.fieldErrorText}>{errors.image}</Text>}
          {imageFile && (
            <Image
              source={{ uri: imageFile.uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Opening Hours *</Text>
          <TextInput
            style={[styles.input, errors.hours ? styles.inputError : null]}
            value={formData.hours}
            onChangeText={(text) => handleFieldUpdate("hours", text)}
            placeholder="e.g. Mon-Sat: 08:00 - 22:00"
            placeholderTextColor={colors.text + '66'}
          />
          {errors.hours && <Text style={styles.fieldErrorText}>{errors.hours}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea, errors.hours ? styles.inputError : null]}
            value={formData.description}
            onChangeText={(text) => handleFieldUpdate("description", text)}
            placeholder="Describe your restaurant, specialties, or flavor profiles..."
            multiline={true}
            numberOfLines={3}
            placeholderTextColor={colors.text + '66'}
          />
          {errors.description && <Text style={styles.fieldErrorText}>{errors.description}</Text>}
        </View>

        {/* Render general error right before buttons */}
        {errors.general && <Text style={[styles.fieldErrorText, { marginBottom: 12, textAlign: 'center' }]}>{errors.general}</Text>}

        <View style={styles.actionsWrapper}>
          <TouchableOpacity
            style={[styles.submitBtn, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
              {loading ? "Saving..." : (existingRestaurant ? "Update Changes" : "Create Restaurant")}
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