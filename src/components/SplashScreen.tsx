// Rizz Assist Pro - Splash Screen
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '@/lib/constants';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 })
    );

    // Animate text
    textOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));

    // Complete after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={logoAnimatedStyle}>
          <Text className="text-7xl">🔥</Text>
        </Animated.View>

        <Animated.View style={[{ marginTop: 20 }, textAnimatedStyle]}>
          <Text className="text-white text-3xl font-bold text-center">
            Rizz Assist Pro
          </Text>
          <Text className="text-white/70 text-base text-center mt-2">
            Your AI Dating Assistant
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
