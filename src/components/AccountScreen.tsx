// Rizz Assist Pro - Account Screen
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  User,
  Crown,
  Lock,
  Zap,
  Pencil,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { COLORS } from '@/lib/constants';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore } from '@/lib/personaStore';

export function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const planType = useTokenStore((s) => s.planType);
  const tokens = useTokenStore((s) => s.tokens);
  const isPaidUser = planType === 'silver' || planType === 'gold';

  const aboutMe = usePersonaStore((s) => s.aboutMe);

  const getPlanLabel = () => {
    switch (planType) {
      case 'gold':
        return 'Gold';
      case 'silver':
        return 'Silver';
      default:
        return 'Free';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <View className="flex-row items-center">
            <User size={22} color={COLORS.neonPink} />
            <Text className="text-white font-bold text-xl ml-2">Account</Text>
          </View>
          <TokenCounter />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Plan Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-6">
            <View
              className="rounded-2xl p-5"
              style={{
                backgroundColor: isPaidUser ? 'rgba(255, 105, 180, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: isPaidUser ? 'rgba(255, 105, 180, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Crown size={22} color={isPaidUser ? COLORS.neonPink : 'rgba(255, 255, 255, 0.5)'} />
                  <Text className="text-white font-bold text-lg ml-2">Current Plan</Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: isPaidUser ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Text className="text-white font-semibold text-sm">{getPlanLabel()}</Text>
                </View>
              </View>

              <Text className="text-white/70 text-base mb-1">
                {isPaidUser
                  ? `You have ${tokens} replies remaining this month`
                  : `You have ${tokens} free replies remaining`}
              </Text>

              {!isPaidUser && (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/paywall');
                  }}
                  className="mt-4 py-3 rounded-xl flex-row items-center justify-center active:opacity-80"
                  style={{
                    backgroundColor: COLORS.neonPink,
                    shadowColor: COLORS.neonPink,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Zap size={20} color="#FFFFFF" />
                  <Text className="text-white font-bold text-base ml-2">Upgrade to Pro</Text>
                </Pressable>
              )}
            </View>
          </Animated.View>

          {/* About Me Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View
              className="rounded-2xl p-5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: isPaidUser ? 'rgba(255, 105, 180, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <View className="flex-row items-center mb-3">
                <Pencil size={22} color={COLORS.neonPink} />
                <Text className="text-white font-bold text-lg ml-2">About Me</Text>
                {!isPaidUser && (
                  <View className="ml-2 bg-white/15 px-2 py-0.5 rounded-full flex-row items-center">
                    <Lock size={10} color="rgba(255, 255, 255, 0.7)" />
                    <Text className="text-white/70 text-xs ml-1">PRO</Text>
                  </View>
                )}
              </View>

              {isPaidUser ? (
                <>
                  {aboutMe ? (
                    <View>
                      <Text className="text-white/80 text-base leading-6 mb-3">{aboutMe}</Text>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          router.push('/my-vibe');
                        }}
                        className="active:opacity-70"
                      >
                        <Text className="text-white/50 text-sm">Tap to edit</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/my-vibe');
                      }}
                      className="active:opacity-80"
                    >
                      <View
                        className="py-3 rounded-xl"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: 1,
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          borderStyle: 'dashed',
                        }}
                      >
                        <Text className="text-white/50 text-center text-sm">
                          Add your likes, dislikes, quirks...
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </>
              ) : (
                <View>
                  <Text className="text-white/60 text-sm leading-5 mb-4">
                    Add your likes, dislikes, and quirks to get replies that sound 100% like you.
                  </Text>

                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push('/paywall');
                    }}
                    className="py-3 rounded-xl flex-row items-center justify-center active:opacity-80"
                    style={{
                      backgroundColor: COLORS.neonPink,
                    }}
                  >
                    <Lock size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-sm ml-2">
                      Upgrade to Unlock
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

export default AccountScreen;
