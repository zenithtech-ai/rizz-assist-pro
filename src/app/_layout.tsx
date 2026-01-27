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

import { SplashScreen } from '@/components/SplashScreen';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore } from '@/lib/personaStore';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

type AppState = 'splash' | 'disclaimer' | 'onboarding' | 'ready';

function RootLayoutNav() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="reply-generator"
          options={{
            headerShown: false,
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

  const loadState = useTokenStore((s) => s.loadState);
  const loadPersonaState = usePersonaStore((s) => s.loadState);
  const isLoaded = useTokenStore((s) => s.isLoaded);
  const hasAcceptedDisclaimer = useTokenStore((s) => s.hasAcceptedDisclaimer);
  const hasSeenOnboarding = useTokenStore((s) => s.hasSeenOnboarding);
  const acceptDisclaimer = useTokenStore((s) => s.acceptDisclaimer);
  const completeOnboarding = useTokenStore((s) => s.completeOnboarding);

  useEffect(() => {
    loadState();
    loadPersonaState();
  }, []);

  useEffect(() => {
    if (isLoaded && appState === 'splash') {
      // Data loaded, but stay on splash until animation completes
    }
  }, [isLoaded, appState]);

  const handleSplashComplete = async () => {
    await ExpoSplashScreen.hideAsync();

    if (!hasAcceptedDisclaimer) {
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
  if (appState === 'splash' || !isLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <SplashScreen onComplete={handleSplashComplete} />
      </View>
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
