// Rizz Assist Pro - Home Screen (Modern Hero Layout)
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { COLORS } from '@/lib/constants';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Animated button glow
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const handleStartGenerating = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/reply-generator');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#1A1A2E']}
        style={{ flex: 1 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
          {/* Header with Token Counter */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            className="flex-row items-center justify-between px-5 py-3"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">💬</Text>
              <Text className="text-white/50 text-xs font-medium tracking-widest">RIZZ ASSIST</Text>
            </View>
            <TokenCounter />
          </Animated.View>

          {/* Main Content - Centered */}
          <View className="flex-1 justify-center px-8">
            {/* Headline - Large & Bold */}
            <Animated.View entering={FadeInDown.delay(200).duration(700)}>
              <Text
                className="text-white text-center font-bold mb-6"
                style={{ fontSize: 42, lineHeight: 48, letterSpacing: -1 }}
              >
                Replies That{'\n'}Actually Sound{'\n'}Like{' '}
                <Text style={{ color: COLORS.neonPink }}>You</Text>
              </Text>
            </Animated.View>

            {/* Subtext - Clean & Punchy */}
            <Animated.View entering={FadeInDown.delay(350).duration(600)} className="mb-10">
              <Text className="text-white/60 text-center text-lg leading-7 mb-3">
                Trained on advanced dating knowledge,{'\n'}psychology + real-world texting patterns
              </Text>
              <Text className="text-white/60 text-center text-lg leading-7 mb-5">
                Finetuned to your exact persona, style & quirks
              </Text>
              <Text className="text-white/90 text-center text-xl font-semibold">
                Stop sounding generic.{'\n'}Get replies that sound{' '}
                <Text style={{ color: COLORS.neonPink }}>100% like you</Text> - instantly.
              </Text>
            </Animated.View>

            {/* CTA Button */}
            <Animated.View entering={FadeInUp.delay(500).duration(600)}>
              <Animated.View
                style={[
                  {
                    shadowColor: COLORS.neonPink,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 24,
                    elevation: 12,
                  },
                  animatedGlowStyle,
                ]}
              >
                <Pressable
                  onPress={handleStartGenerating}
                  className="py-5 rounded-2xl flex-row items-center justify-center active:opacity-90"
                  style={{
                    backgroundColor: COLORS.neonPink,
                  }}
                >
                  <Sparkles size={22} color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Generate My Reply Now
                  </Text>
                </Pressable>
              </Animated.View>

              {/* Edit Persona Link */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/my-vibe');
                }}
                className="mt-5 flex-row items-center justify-center active:opacity-70"
              >
                <Text className="text-white/50 text-sm">
                  Set up your profile
                </Text>
                <ChevronRight size={16} color="rgba(255, 255, 255, 0.3)" />
              </Pressable>
            </Animated.View>
          </View>

          {/* Trust/Social Proof Footer */}
          <Animated.View
            entering={FadeIn.delay(700).duration(600)}
            className="px-6 pb-6"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white/30 text-xs">🔒 Your chats stay 100% private</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default HomeScreen;
