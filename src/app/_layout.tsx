// Rizz Assist Pro - Root Layout
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { SplashScreen } from '@/components/SplashScreen';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import AuthScreen from '@/app/auth';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore } from '@/lib/personaStore';
import { useAuthStore } from '@/lib/authStore';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

type AppState = 'splash' | 'auth' | 'disclaimer' | 'onboarding' | 'ready';

function RootLayoutNav() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="my-vibe"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [appState, setAppState] = useState<AppState>('splash');

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const loadState = useTokenStore((s) => s.loadState);
  const loadPersonaState = usePersonaStore((s) => s.loadState);
  const isLoaded = useTokenStore((s) => s.isLoaded);
  const hasAcceptedDisclaimer = useTokenStore((s) => s.hasAcceptedDisclaimer);
  const hasSeenOnboarding = useTokenStore((s) => s.hasSeenOnboarding);
  const acceptDisclaimer = useTokenStore((s) => s.acceptDisclaimer);
  const completeOnboarding = useTokenStore((s) => s.completeOnboarding);

  const checkAuth = useAuthStore((s) => s.checkAuth);
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);

  useEffect(() => {
    loadState();
    loadPersonaState();
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoaded && appState === 'splash') {
      // Data loaded, but stay on splash until animation completes
    }
  }, [isLoaded, appState]);

  const handleSplashComplete = async () => {
    await ExpoSplashScreen.hideAsync();

    // Check auth first - if no user, show auth screen
    if (!user && !authLoading) {
      setAppState('auth');
    } else if (!hasAcceptedDisclaimer) {
      setAppState('disclaimer');
    } else if (!hasSeenOnboarding) {
      setAppState('onboarding');
    } else {
      setAppState('ready');
    }
  };

  const handleAcceptDisclaimer = async () => {
    await acceptDisclaimer();
    // Update local state immediately so disclaimer won't show again
    if (!hasSeenOnboarding) {
      setAppState('onboarding');
    } else {
      setAppState('ready');
    }
  };

  const handleCompleteOnboarding = async () => {
    await completeOnboarding();
    setAppState('ready');
  };

  // Show splash screen
  if (appState === 'splash' || !isLoaded || !fontsLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <SplashScreen onComplete={handleSplashComplete} />
      </View>
    );
  }

  // Show auth screen
  if (appState === 'auth') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <StatusBar style="light" />
          <AuthScreen onAuthSuccess={() => {
            if (!hasAcceptedDisclaimer) {
              setAppState('disclaimer');
            } else if (!hasSeenOnboarding) {
              setAppState('onboarding');
            } else {
              setAppState('ready');
            }
          }} />
        </KeyboardProvider>
      </GestureHandlerRootView>
    );
  }

  // Show onboarding
  if (appState === 'onboarding') {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={handleCompleteOnboarding} />
      </View>
    );
  }

  // Main app
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <StatusBar style="light" />
          <RootLayoutNav />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
