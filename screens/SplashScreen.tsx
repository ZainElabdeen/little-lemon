import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const logoImg = require("@/assets/images/Logo.png");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.logo} />
      <Text style={styles.title}>Little Lemon</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 280,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#495E57",
  },
});
