import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Onboarding, { OnboardingData } from "@/screens/Onboarding";
import Profile from "@/screens/Profile";
import SplashScreen from "@/screens/SplashScreen";
import { STORAGE_KEYS } from "@/utils/storage";

export type RootStackParamList = {
  Onboarding: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const value = await AsyncStorage.getItem(
          STORAGE_KEYS.onboardingCompleted,
        );
        setIsOnboardingCompleted(value === "true");
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingState();
  }, []);

  const completeOnboarding = async ({ firstName, email }: OnboardingData) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.firstName, firstName],
      [STORAGE_KEYS.email, email],
      [STORAGE_KEYS.onboardingCompleted, "true"],
    ]);
    setIsOnboardingCompleted(true);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setIsOnboardingCompleted(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isOnboardingCompleted ? (
            <Stack.Screen name="Profile">
              {() => <Profile onLogout={logout} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Onboarding">
              {() => <Onboarding onDone={completeOnboarding} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
