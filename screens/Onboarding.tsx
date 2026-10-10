import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FONT_BODY, FONT_HEADING } from "@/utils/theme";

const logoImg = require("@/assets/images/Logo.png");

const screenWidth = Dimensions.get("window").width;

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
    <View style={styles.container}>
      <Image source={logoImg} style={styles.headerImage} />
      <View style={styles.formContainer}>
        <Text style={styles.text}>Let us get to know you</Text>
        <View>
          <View
          //   style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.lable}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setFirstName}
              value={firstName}
            />
          </View>
          <View
          //   style={{ flex: 0.2, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.lable}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0.2,
          justifyContent: "center",
          alignSelf: "flex-end",
          marginRight: 30,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => onDone?.({ firstName, email })}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // margin: 10,
    // padding: 10,
    // width: "100%",
    // backgroundColor: "#CBD2D9",
  },
  headerImage: {
    width: 280,
    height: 60,
    margin: 10,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    width: 250,
    borderRadius: 10,
    fontFamily: FONT_BODY,
  },
  text: {
    fontSize: 20,
    color: "#495E57",
    fontWeight: "semibold",
    fontFamily: FONT_HEADING,
  },
  formContainer: {
    flex: 1,
    gap: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    // width: "100%",
    backgroundColor: "#CBD2D9",
  },
  lable: {
    fontSize: 18,
    color: "#495E57",
    fontWeight: "medium",
    textAlign: "center",
    fontFamily: FONT_BODY,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#CBD2D9",
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  buttonText: {
    fontSize: 18,
    color: "#495E57",
    fontWeight: "bold",
    fontFamily: FONT_BODY,
  },
});
