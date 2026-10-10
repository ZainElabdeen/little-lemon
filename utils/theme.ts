import { StyleSheet } from "react-native";

export const FONT_HEADING = "MarkaziText";
export const FONT_BODY = "Karla";

export const FONT_ASSETS = {
  Karla: require("@/assets/fonts/Karla-Regular.ttf"),
  MarkaziText: require("@/assets/fonts/MarkaziText-Regular.ttf"),
};

export const TEXT_STYLES = StyleSheet.create({
  display: {
    fontFamily: FONT_HEADING,
    fontSize: 64,
    fontWeight: "500",
  },
  navbar: {
    fontFamily: FONT_BODY,
    fontSize: 20,
    fontWeight: "bold",
  },
});