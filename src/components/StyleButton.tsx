// Rizz Assist Pro - Style Button Component
import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/lib/constants';

interface StyleButtonProps {
  label: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StyleButton({ label, emoji, isSelected, onPress }: StyleButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="flex-1 min-w-[30%] m-1 py-3 px-2 rounded-xl items-center justify-center"
      style={[
        animatedStyle,
        {
          backgroundColor: isSelected ? COLORS.neonPink : 'rgba(255, 255, 255, 0.15)',
          borderWidth: isSelected ? 0 : 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
      ]}
    >
      <Text className="text-xl mb-1">{emoji}</Text>
      <Text
        className="font-semibold text-xs text-center"
        style={{ color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)' }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
