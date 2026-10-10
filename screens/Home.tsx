import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "@/components/Banner";
import CategoryList from "@/components/CategoryList";
import MenuItemCard from "@/components/MenuItemCard";
import SearchBar from "@/components/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { fetchMenu } from "@/utils/api";
import {
  filterMenuItems,
  getCategories,
  initMenuDb,
  isMenuEmpty,
  saveMenuItems,
} from "@/utils/db";
import { STORAGE_KEYS } from "@/utils/storage";
import { mergeCategories } from "@/utils/categories";
import { FONT_BODY } from "@/utils/theme";
import { MenuItem } from "@/types/menu";

const logoImg = require("@/assets/images/Logo.png");
const profileImg = require("@/assets/images/Profile.png");
const BRAND_GREEN = "#495E57";
const SEARCH_DELAY_MS = 500;

type HomeProps = {
  onOpenProfile?: () => void;
};

function Home({ onOpenProfile }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(searchText, SEARCH_DELAY_MS);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      AsyncStorage.getItem(STORAGE_KEYS.avatarUri)
        .then((uri) => {
          if (active) setAvatarUri(uri);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [reloadKey]),
  );

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUri]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setError(null);
      try {
        await initMenuDb();
        if (await isMenuEmpty()) {
          const fetched = await fetchMenu();
          await saveMenuItems(fetched);
        }
        const [cats, menuItems] = await Promise.all([
          getCategories(),
          filterMenuItems({ categories: [], query: "" }),
        ]);
        if (cancelled) return;
        setCategories(mergeCategories(cats));
        setItems(menuItems);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load the menu.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const firstFilter = useRef(true);
  useEffect(() => {
    if (firstFilter.current) {
      firstFilter.current = false;
      return;
    }
    let cancelled = false;
    filterMenuItems({
      categories: selectedCategories,
      query: debouncedSearch,
    })
      .then((menuItems) => {
        if (!cancelled) {
          setItems(menuItems);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setError("Failed to filter the menu.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCategories, debouncedSearch]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );
  }, []);

  const retry = useCallback(() => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo} />
        <TouchableOpacity
          onPress={onOpenProfile}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Image
            source={
              avatarFailed
                ? profileImg
                : avatarUri
                  ? { uri: avatarUri }
                  : profileImg
            }
            style={styles.avatar}
            testID="home-avatar"
            onError={() => setAvatarFailed(true)}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading menu…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retry}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MenuItemCard item={item} />}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <Banner />
              <View style={styles.searchArea}>
                <SearchBar
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
              <Text style={styles.categoryHeading}>Order for Delivery</Text>
              <CategoryList
                categories={categories}
                selected={selectedCategories}
                onToggle={toggleCategory}
              />
            </>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No items match your search.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CBD2D9",
  },
  logo: {
    width: 170,
    height: 40,
    resizeMode: "contain",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_GREEN,
  },
  center: {
    paddingVertical: 40,
    alignItems: "center",
  },
  categoryHeading: {
    fontFamily: FONT_BODY,
    fontWeight: "bold",
    fontSize: 20,
    color: "#1F1F1F",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  searchArea: {
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#4A4A4A",
    fontFamily: FONT_BODY,
  },
  emptyText: {
    fontSize: 16,
    color: "#4A4A4A",
    fontFamily: FONT_BODY,
  },
  errorText: {
    fontSize: 16,
    color: "#B5382A",
    textAlign: "center",
    paddingHorizontal: 24,
    fontFamily: FONT_BODY,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: BRAND_GREEN,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_BODY,
  },
});
