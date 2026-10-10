import { StyleSheet, TextInput } from "react-native";
import { FONT_BODY } from "@/utils/theme";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

function SearchBar({
  value,
  onChangeText,
  placeholder = "Search for dishes…",
}: SearchBarProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#7C8B87"
      accessibilityRole="search"
    />
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#EDEFEE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F1F1F",
    fontFamily: FONT_BODY,
  },
});