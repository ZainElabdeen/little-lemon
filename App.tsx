import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Onboarding from "@/screens/Onboarding";
import Profile from "@/screens/Profile";
import SplashScreen from "@/screens/SplashScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Profile: undefined;
};

const ONBOARDING_KEY = "onboardingCompleted";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setIsOnboardingCompleted(value === "true");
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingState();
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setIsOnboardingCompleted(true);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isOnboardingCompleted ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding">
            {() => <Onboarding onDone={completeOnboarding} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
