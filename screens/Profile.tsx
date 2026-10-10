import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValidUSPhoneNumber } from "@/utils/validation";
import { FONT_BODY, FONT_HEADING } from "@/utils/theme";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_LABELS,
  NotificationPreferences,
  STORAGE_KEYS,
} from "@/utils/storage";

const logoImg = require("@/assets/images/Logo.png");
const avatarPlaceholderImg = require("@/assets/images/Profile.png");

const BRAND_GREEN = "#495E57";
const BRAND_YELLOW = "#F4CE14";

type ProfileProps = {
  onLogout?: () => void;
  onBack?: () => void;
};

const Profile = ({ onLogout, onBack }: ProfileProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const entries = await AsyncStorage.multiGet([
      STORAGE_KEYS.firstName,
      STORAGE_KEYS.lastName,
      STORAGE_KEYS.email,
      STORAGE_KEYS.phoneNumber,
      STORAGE_KEYS.avatarUri,
      STORAGE_KEYS.notifications,
    ]);
    const stored = Object.fromEntries(entries);

    setFirstName(stored[STORAGE_KEYS.firstName] ?? "");
    setLastName(stored[STORAGE_KEYS.lastName] ?? "");
    setEmail(stored[STORAGE_KEYS.email] ?? "");
    setPhoneNumber(stored[STORAGE_KEYS.phoneNumber] ?? "");
    setAvatarUri(stored[STORAGE_KEYS.avatarUri] ?? null);

    const storedNotifications = stored[STORAGE_KEYS.notifications];
    setNotifications(
      storedNotifications
        ? {
            ...DEFAULT_NOTIFICATION_PREFERENCES,
            ...JSON.parse(storedNotifications),
          }
        : DEFAULT_NOTIFICATION_PREFERENCES,
    );
  }, []);

  useEffect(() => {
    loadProfile().finally(() => setIsLoading(false));
  }, [loadProfile]);

  const pickImage = useCallback(async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photos to choose a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  }, []);

  const removeImage = useCallback(() => {
    setAvatarUri(null);
  }, []);

  const toggleNotification = useCallback(
    (key: keyof NotificationPreferences) => {
      setNotifications((current) => ({ ...current, [key]: !current[key] }));
    },
    [],
  );

  const handlePhoneChange = useCallback((value: string) => {
    setPhoneNumber(value);
    if (value.trim().length === 0) {
      setPhoneError(null);
      return;
    }
    setPhoneError(
      isValidUSPhoneNumber(value)
        ? null
        : "Enter a valid USA phone number, e.g. (555) 123-4567.",
    );
  }, []);

  const saveChanges = useCallback(async () => {
    if (phoneNumber.trim().length > 0 && !isValidUSPhoneNumber(phoneNumber)) {
      setPhoneError("Enter a valid USA phone number, e.g. (555) 123-4567.");
      return;
    }

    const pairs: [string, string][] = [
      [STORAGE_KEYS.lastName, lastName],
      [STORAGE_KEYS.email, email],
      [STORAGE_KEYS.phoneNumber, phoneNumber],
      [STORAGE_KEYS.notifications, JSON.stringify(notifications)],
    ];
    if (avatarUri) {
      pairs.push([STORAGE_KEYS.avatarUri, avatarUri]);
    }

    await AsyncStorage.multiSet(pairs);
    if (!avatarUri) {
      await AsyncStorage.removeItem(STORAGE_KEYS.avatarUri);
    }

    setSavedMessage("Changes saved");
  }, [avatarUri, email, lastName, notifications, phoneNumber]);

  const discardChanges = useCallback(async () => {
    await loadProfile();
    setPhoneError(null);
    setSavedMessage(null);
  }, [loadProfile]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.sectionTitle}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : null}
        <Image source={logoImg} style={styles.headerLogo} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Personal information</Text>

        <View style={styles.avatarSection}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Image source={avatarPlaceholderImg} style={styles.avatar} />
          )}
          <View style={styles.avatarActions}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={pickImage}
              accessibilityRole="button"
            >
              <Text style={styles.avatarButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={removeImage}
              accessibilityRole="button"
            >
              <Text style={styles.avatarButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>First name</Text>
        <TextInput
          style={[styles.input, styles.inputReadOnly]}
          value={firstName}
          editable={false}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          placeholderTextColor="#7C8B87"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor="#7C8B87"
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholder="(555) 123-4567"
          placeholderTextColor="#7C8B87"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Text style={[styles.sectionTitle, styles.notificationsTitle]}>
          Email notifications
        </Text>
        {NOTIFICATION_LABELS.map(({ key, label }) => {
          const checked = notifications[key];
          return (
            <TouchableOpacity
              key={key}
              style={styles.checkboxRow}
              onPress={() => toggleNotification(key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
              </View>
              <Text style={styles.checkboxLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}

        {savedMessage ? (
          <Text style={styles.savedText}>{savedMessage}</Text>
        ) : null}

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            accessibilityRole="button"
          >
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>

          <View style={styles.secondaryRow}>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={discardChanges}
              accessibilityRole="button"
            >
              <Text style={styles.discardButtonText}>Discard changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveChanges}
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD2D9",
  },
  backButton: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: BRAND_GREEN,
    lineHeight: 30,
  },
  headerLogo: {
    width: 185,
    height: 40,
    resizeMode: "contain",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    color: BRAND_GREEN,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: FONT_HEADING,
  },
  notificationsTitle: {
    marginTop: 24,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: "cover",
  },
  avatarActions: {
    flexDirection: "row",
    marginLeft: 16,
    gap: 10,
  },
  avatarButton: {
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  avatarButtonText: {
    color: BRAND_GREEN,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_BODY,
  },
  label: {
    fontSize: 16,
    color: BRAND_GREEN,
    fontWeight: "500",
    marginBottom: 6,
    fontFamily: FONT_BODY,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD2D9",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1F1F1F",
    marginBottom: 16,
    fontFamily: FONT_BODY,
  },
  inputReadOnly: {
    backgroundColor: "#EDEFEE",
    color: "#5A6B66",
  },
  errorText: {
    color: "#D64545",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 16,
    fontFamily: FONT_BODY,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: BRAND_GREEN,
  },
  checkboxTick: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1F1F1F",
    fontFamily: FONT_BODY,
  },
  savedText: {
    color: BRAND_GREEN,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
    fontFamily: FONT_BODY,
  },
  logoutButton: {
    backgroundColor: BRAND_YELLOW,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: {
    color: BRAND_GREEN,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT_BODY,
  },
  bottomActions: {
    marginTop: 20,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  discardButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  discardButtonText: {
    color: BRAND_GREEN,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_BODY,
  },
  saveButton: {
    flex: 1,
    backgroundColor: BRAND_GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_BODY,
  },
});
