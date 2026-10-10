import { Image, StyleSheet, Text, View } from "react-native";
import { FONT_BODY, FONT_HEADING, TEXT_STYLES } from "@/utils/theme";

const heroImg = require("@/assets/images/Hero image.png");

function Banner() {
  return (
    <View style={styles.banner}>
      <View style={styles.textBlock}>
        <Text style={[TEXT_STYLES.display, styles.title]}>Little Lemon</Text>
        <Text style={styles.subtitle}>Chicago</Text>
        <View style={styles.heroDescription}>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
          <Image source={heroImg} style={styles.heroImage} />
        </View>
      </View>
    </View>
  );
}

export default Banner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#495E57",
    padding: 16,
  },
  textBlock: {
    flex: 1,
  },
  heroDescription: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#F4CE14",
    fontSize: 64,
  },
  subtitle: {
    color: "#EDEFEE",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: FONT_HEADING,
  },
  description: {
    flex: 1,
    marginRight: 12,
    color: "#EDEFEE",
    fontSize: 18,
    lineHeight: 20,
    fontFamily: FONT_BODY,
  },
  heroImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    resizeMode: "cover",
  },
});