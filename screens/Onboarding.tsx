import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "@/components/Banner";
import { FONT_BODY, FONT_HEADING } from "@/utils/theme";

const logoImg = require("@/assets/images/Logo.png");

const BRAND_GREEN = "#495E57";
const BRAND_YELLOW = "#F4CE14";

export type OnboardingData = {
  firstName: string;
  email: string;
};

type OnboardingProps = {
  onDone?: (data: OnboardingData) => void;
};

const Onboarding = ({ onDone }: OnboardingProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Image source={logoImg} style={styles.headerLogo} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Banner />

          <View style={styles.form}>
            <Text style={styles.heading}>Let us get to know you</Text>

            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={firstName}
              placeholder="First name"
              placeholderTextColor="#7C8B87"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              placeholderTextColor="#7C8B87"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => onDone?.({ firstName, email })}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD2D9",
  },
  headerLogo: {
    width: 185,
    height: 40,
    resizeMode: "contain",
  },
  content: {
    paddingBottom: 40,
  },
  form: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    color: BRAND_GREEN,
    fontFamily: FONT_HEADING,
    marginBottom: 16,
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
  button: {
    backgroundColor: BRAND_YELLOW,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: BRAND_GREEN,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT_BODY,
  },
});