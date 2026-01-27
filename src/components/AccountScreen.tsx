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
  Lock,
  Pencil,
  Crown,
  Star,
  ExternalLink,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { COLORS } from '@/lib/constants';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore } from '@/lib/personaStore';
import { DATING_APPS } from '@/lib/datingAppsKnowledge';

export function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const planType = useTokenStore((s) => s.planType);
  const tokens = useTokenStore((s) => s.tokens);
  const isPaidUser = planType === 'silver' || planType === 'gold';

  const aboutMe = usePersonaStore((s) => s.aboutMe);
  const datingAppProfiles = usePersonaStore((s) => s.datingAppProfiles);

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
            <Text className="text-white font-bold text-xl ml-2">Personalization</Text>
          </View>
          <TokenCounter />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
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
                    <Text className="text-white/70 text-xs ml-1">Silver & Gold</Text>
                  </View>
                )}
                {isPaidUser && planType === 'gold' && (
                  <View className="ml-2 bg-white/15 px-2 py-0.5 rounded-full flex-row items-center">
                    <Crown size={10} color={COLORS.neonPink} />
                    <Text className="text-white/70 text-xs ml-1">Gold</Text>
                  </View>
                )}
                {isPaidUser && planType === 'silver' && (
                  <View className="ml-2 bg-white/15 px-2 py-0.5 rounded-full flex-row items-center">
                    <Star size={10} color={COLORS.neonPink} />
                    <Text className="text-white/70 text-xs ml-1">Silver</Text>
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
                    Add your likes, dislikes, and quirks here. The more you share, the more your replies will sound exactly like you wrote them - sharp, real, and authentically you
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

          {/* Dating Apps Section - PRO Feature */}
          {isPaidUser && (
            <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mt-6">
              <View className="flex-row items-center mb-4">
                <ExternalLink size={22} color={COLORS.neonPink} />
                <Text className="text-white font-bold text-lg ml-2">Your Dating App Profile Analyzer</Text>
              </View>

              <View className="flex-row flex-wrap">
                {DATING_APPS.map((app) => {
                  const profile = datingAppProfiles[app.id];
                  const hasProfile = profile && Object.values(profile).some(v => v?.trim());

                  return (
                    <Pressable
                      key={app.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push(`/my-vibe?appId=${app.id}`);
                      }}
                      className="mb-3 mr-3 active:opacity-70"
                    >
                      <View
                        className="px-4 py-3 rounded-xl flex-row items-center"
                        style={{
                          backgroundColor: hasProfile
                            ? 'rgba(255, 105, 180, 0.2)'
                            : 'rgba(255, 255, 255, 0.08)',
                          borderWidth: 1,
                          borderColor: hasProfile
                            ? COLORS.neonPink
                            : 'rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <Text className="mr-2">{app.emoji}</Text>
                        <Text
                          className="text-sm font-medium"
                          style={{
                            color: hasProfile ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {app.label}
                        </Text>
                        {hasProfile && (
                          <View className="ml-1">
                            <Text style={{ color: COLORS.neonPink }}>✓</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Text className="text-white/50 text-xs mt-3 ml-1">
                Tap any app to add, edit and enhance your profile
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

export default AccountScreen;
