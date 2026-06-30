import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styles } from "@/styles/RestaurantForm";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native";
import { sendPOST, sendPATCH } from '@/services/api';

export const RestaurantForm = ({ existingRestaurant, onSuccess, onCancel }: {
  existingRestaurant: any;
  onSuccess: any;
  onCancel: any;
}) => {
  const { token } = useAuthContext();

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

    if (!formData.name.trim())
      e.name = "Restaurant name is required.";
    if (!formData.address.trim())
      e.address = "Address is required.";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Please enter a valid email address.";
    if (formData.addressX && isNaN(parseFloat(formData.addressX)))
      e.addressX = "Latitude must be a valid number.";
    if (formData.addressY && isNaN(parseFloat(formData.addressY)))
      e.addressY = "Longitude must be a valid number.";

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
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
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
        await sendPATCH(`/api/restaurants/${existingRestaurant._id}`, data, token);
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
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.headerText}>
        {existingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
      </Text>

      {error && <Text>{error}</Text>}
      <Text>Restaurant Name</Text>
      <TextInput
        style={[styles.input, errors.name ? { borderColor: 'red' } : null]}
        value={formData.name}
        onChangeText={(text) => handleFieldUpdate("name", text)}
        placeholder="e.g. Los Pollos Hermanos"
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}
      <Text>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => handleFieldUpdate("phone", text)}
        placeholder="e.g. 505-142-5678"
      />
      <Text>Email Address</Text>
      <TextInput
        style={[styles.input, errors.email ? { borderColor: 'red' } : null]}
        value={formData.email}
        onChangeText={(text) => handleFieldUpdate("email", text)}
        placeholder="e.g. info@lospollos.com"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      <Text>Address *(Text)</Text>
      <TextInput
        style={[styles.input, errors.address ? { borderColor: 'red' } : null]}
        value={formData.address}
        onChangeText={(text) => handleFieldUpdate("address", text)}
        placeholder="e.g. 12000 Candelaria Rd NE, Albuquerque"
      />
      {errors.address && <Text style={styles.error}>{errors.address}</Text>}
      <Text>Address X (Latitude)</Text>
      <TextInput
        style={[styles.input, errors.addressX ? { borderColor: 'red' } : null]}
        value={formData.addressX}
        onChangeText={(text) => handleFieldUpdate("addressX", text)}
        placeholder="e.g. 35.118"
      />
      {errors.addressX && <Text style={styles.error}>{errors.addressX}</Text>}
      <Text>Address Y (Longitude)</Text>
      <TextInput
        style={[styles.input, errors.addressX ? { borderColor: 'red' } : null]}
        value={formData.addressY}
        onChangeText={(text) => handleFieldUpdate("addressY", text)}
        placeholder="e.g. -106.601"
      />
      {errors.addressY && <Text style={styles.error}>{errors.addressY}</Text>}
      <Text>Restaurant Image</Text>
      <TouchableOpacity
        onPress={pickImageAsync}
      ><Text>Image picker</Text></TouchableOpacity>
      //Show Image preview.
      {imageFile && (
        <Image
          source={{ uri: imageFile.uri }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }}
          resizeMode="cover"
        />
      )}

      <Text>Opening Hours</Text>
      <TextInput
        style={styles.input}
        value={formData.hours}
        onChangeText={(text) => handleFieldUpdate("hours", text)}
        placeholder="e.g. Mon-Sat: 08:00 - 22:00"
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.description}
        onChangeText={(text) => handleFieldUpdate("description", text)}
        placeholder="Describe your restaurant, specialties, or flavor profiles..."
      />


      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text>{loading ? "Saving..." : (existingRestaurant ? "Update Changes" : "Create Restaurant")}</Text>
      </TouchableOpacity>
      {onCancel && (
        < TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>

      )}
    </ScrollView>
  );
};