if (__DEV__) {
  require("../ReactotronConfig");
}

import "react-native-get-random-values";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useRef } from "react";
import "react-native-reanimated";
import { NinetailedProvider } from "@ninetailed/experience.js-react";
import { Ninetailed } from "@ninetailed/experience.js";
import { NinetailedApiClient } from "@ninetailed/experience.js-shared";

import { useColorScheme } from "@/hooks/useColorScheme";

import ProfileDump from "@/components/ProfileDump";
import NinetailedPageTracker from "@/components/NinetailedPageTracker";

import queryString from "query-string";
import NinetailedInsightsPlugin from "@ninetailed/experience.js-plugin-insights";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  console.log(`Current pathanme`, pathname);
  console.log(`Current params`, params);

  // useRef + useEffect avoids closure in useMemo
  const navigation = useRef({ pathname, params });
  useEffect(() => {
    navigation.current = { pathname, params };
  }, [pathname, params]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const ninetailed = useMemo(() => {
    const ninetailedApiClient = new NinetailedApiClient({
      clientId: process.env.EXPO_PUBLIC_NINETAILED_CLIENT_ID || "",
      environment: process.env.EXPO_PUBLIC_NINETAILED_ENV || "main",
      fetchImpl: fetch,
    });
    return new Ninetailed(ninetailedApiClient, {
      buildClientContext: () => {
        return {
          url: `https://reactnativeapp.dev${
            navigation.current.pathname
          }?${queryString.stringify(navigation.current.params)}`,
          referrer: "",
          locale: "en-US",
          userAgent: "",
        };
      },
      plugins: [new NinetailedInsightsPlugin()],
    });
  }, [navigation]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NinetailedProvider ninetailed={ninetailed}>
        {/* <ProfileDump /> */}
        <NinetailedPageTracker />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NinetailedProvider>
    </ThemeProvider>
  );
}
