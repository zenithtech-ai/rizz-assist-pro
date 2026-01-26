// Rizz Assist Pro - Onboarding Screens
import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { COLORS } from '@/lib/constants';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_DATA = [
  {
    id: '1',
    emoji: '💬',
    title: 'Get better dating replies instantly',
    description: 'Paste any message you receive and let AI craft the perfect response for you.',
    illustration: '📱➡️💕',
  },
  {
    id: '2',
    emoji: '🎁',
    title: '5 FREE replies → Unlimited Pro',
    description: 'Start with 5 free replies. Upgrade to Pro for 25 tokens per week and unlimited style access.',
    illustration: '🆓5️⃣ → 🔓♾️',
  },
  {
    id: '3',
    emoji: '✨',
    title: 'Paste chat → Pick style → Copy & send',
    description: 'Choose from 10 unique reply styles. Copy your favorite and send it to make a great impression.',
    illustration: '📋→🎨→📤',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const renderItem = ({ item, index }: { item: typeof ONBOARDING_DATA[0]; index: number }) => (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="items-center">
        <Text className="text-8xl mb-8">{item.emoji}</Text>

        <View className="bg-white/10 rounded-2xl px-8 py-4 mb-8">
          <Text className="text-4xl text-center">{item.illustration}</Text>
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-4">
          {item.title}
        </Text>

        <Text className="text-white/70 text-base text-center leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        {/* Pagination dots */}
        <View className="flex-row justify-center mb-8">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              className="w-2 h-2 rounded-full mx-1"
              style={{
                backgroundColor: index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </View>

        {/* Button */}
        <View className="px-8 pb-12">
          <Pressable
            onPress={handleNext}
            className="py-4 rounded-xl items-center active:opacity-80"
            style={{ backgroundColor: COLORS.neonPink }}
          >
            <Text className="text-white font-bold text-lg">
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}
