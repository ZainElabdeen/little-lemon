import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { menuItemImageUrl } from "@/utils/api";
import { FONT_BODY, FONT_HEADING } from "@/utils/theme";

function MenuItemCard({ item }: { item: MenuItem }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      {imageFailed ? (
        <View style={styles.imageFallback}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={28}
            color="#7C8B87"
          />
        </View>
      ) : (
        <Image
          source={{ uri: menuItemImageUrl(item.image) }}
          style={styles.image}
          onError={() => setImageFailed(true)}
        />
      )}
    </View>
  );
}

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD2D9",
    backgroundColor: "#ffffff",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 4,
    fontFamily: FONT_HEADING,
  },
  description: {
    fontSize: 16,
    lineHeight: 19,
    color: "#495E57",
    marginBottom: 8,
    flexShrink: 1,
    fontFamily: FONT_BODY,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495E57",
    fontFamily: FONT_BODY,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageFallback: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#EDEFEE",
    alignItems: "center",
    justifyContent: "center",
  },
});
