if (__DEV__) {
  require("../ReactotronConfig");
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import "react-native-reanimated";
import { NinetailedProvider } from "@ninetailed/experience.js-react";
import { Ninetailed } from "@ninetailed/experience.js";
import { NinetailedApiClient } from "@ninetailed/experience.js-shared";

import { useColorScheme } from "@/hooks/useColorScheme";

import ProfileDump from "@/components/ProfileDump";
import NinetailedPageTracker from "@/components/NinetailedPageTracker";

import queryString from "query-string";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const ninetailed = useMemo(() => {
    const ninetailedApiClient = new NinetailedApiClient({
      clientId: "3c00cace-cacb-4086-807b-c97b4453e197",
      environment: "b2b-demo",
      fetchImpl: fetch,
    });
    return new Ninetailed(ninetailedApiClient, {
      // TODO: This isn't pulling from the hook value dynamically
      buildClientContext: () => {
        return {
          url: `https://reactnativeapp.dev${pathname}?${queryString.stringify(
            params
          )}`,
          referrer: "",
          locale: "en-US",
          userAgent: "",
        };
      },
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NinetailedProvider ninetailed={ninetailed}>
        <ProfileDump />
        <NinetailedPageTracker />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NinetailedProvider>
    </ThemeProvider>
  );
}
