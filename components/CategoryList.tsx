import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FONT_BODY } from "@/utils/theme";

type CategoryListProps = {
  categories: string[];
  selected: string[];
  onToggle: (category: string) => void;
};

function CategoryList({ categories, selected, onToggle }: CategoryListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.container}
    >
      {categories.map((category) => {
        const active = selected.includes(category);
        return (
          <TouchableOpacity
            key={category}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onToggle(category)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  row: {
    paddingHorizontal: 16,
    gap: 12,
  },
  pill: {
    backgroundColor: "#ffffff",
    borderColor: "#495E57",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: "#495E57",
  },
  pillText: {
    color: "#495E57",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: FONT_BODY,
  },
  pillTextActive: {
    color: "#ffffff",
  },
});