// Rizz Assist Pro - My Profile Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, User, Pencil, Lock, Zap } from 'lucide-react-native';

import { COLORS } from '@/lib/constants';
import { usePersonaStore, DatingAppProfile } from '@/lib/personaStore';
import { useTokenStore } from '@/lib/tokenStore';
import { DatingAppsEditor } from './DatingAppsEditor';
import { DatingAppId } from '@/lib/datingAppsKnowledge';

export function MyVibeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const loadState = usePersonaStore((s) => s.loadState);
  const savedAboutMe = usePersonaStore((s) => s.aboutMe);
  const saveAboutMe = usePersonaStore((s) => s.setAboutMe);
  const isLoaded = usePersonaStore((s) => s.isLoaded);
  const datingAppProfiles = usePersonaStore((s) => s.datingAppProfiles);
  const setDatingAppProfile = usePersonaStore((s) => s.setDatingAppProfile);

  // Check if user has a paid plan (silver or gold)
  const planType = useTokenStore((s) => s.planType);
  const isPaidUser = planType === 'silver' || planType === 'gold';

  // Local state for editing
  const [aboutMe, setAboutMe] = useState(savedAboutMe);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAboutMe(savedAboutMe);
    }
  }, [isLoaded, savedAboutMe]);

  const handleSave = async () => {
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await saveAboutMe(aboutMe);

    setIsSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleDatingAppProfileSave = async (appId: DatingAppId, fields: Record<string, string>) => {
    await setDatingAppProfile(appId, fields);
  };

  const hasChanges = aboutMe !== savedAboutMe;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 active:opacity-70"
            >
              <ChevronLeft size={28} color="#FFFFFF" />
            </Pressable>
            <Text className="text-white text-xl font-bold">My Profile</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Dating Apps Section - PRO Feature */}
            {isPaidUser && (
              <Animated.View entering={FadeInDown.duration(300)} className="mb-8">
                <DatingAppsEditor
                  onProfileSave={handleDatingAppProfileSave}
                  savedProfiles={datingAppProfiles}
                  aboutMe={aboutMe}
                />
              </Animated.View>
            )}

            {/* About Me Section */}
            <Animated.View entering={FadeInDown.duration(400)}>
              <View className="flex-row items-center mb-2">
                <Pencil size={20} color={COLORS.neonPink} />
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
                  <Text className="text-white/60 text-sm mb-4">
                    Tell us about yourself to make replies more personalized!
                  </Text>

                  <View
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <View className="flex-row items-center mb-3">
                      <User size={16} color="rgba(255, 255, 255, 0.6)" />
                      <Text className="text-white/70 text-sm ml-2">
                        Likes, Dislikes, Quirks, etc.
                      </Text>
                    </View>
                    <TextInput
                      value={aboutMe}
                      onChangeText={setAboutMe}
                      placeholder="E.g., I love hiking and bad puns, hate small talk, my quirk is quoting movies randomly..."
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      multiline
                      numberOfLines={5}
                      className="text-white text-base min-h-[120px]"
                      style={{ textAlignVertical: 'top' }}
                    />
                  </View>

                  <Text className="text-white/40 text-xs mt-2 ml-1">
                    This is optional but is recommended - this helps AI craft replies that sound more like you. Your About Me will also be used to optimize your dating app profiles!
                  </Text>
                </>
              ) : (
                <View
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 105, 180, 0.3)',
                  }}
                >
                  <Text className="text-white/70 text-sm leading-5 mb-4">
                    Unlock PRO to:{'\n\n'}
                    • Add your About Me for personalized replies{'\n'}
                    • Optimize profiles for 8 dating apps (Tinder, Bumble, Hinge, etc.){'\n'}
                    • Get AI-powered suggestions for each app
                  </Text>

                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push('/paywall');
                    }}
                    className="py-4 rounded-xl flex-row items-center justify-center active:opacity-80"
                    style={{
                      backgroundColor: COLORS.neonPink,
                      shadowColor: COLORS.neonPink,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                  >
                    <Zap size={20} color="#FFF" />
                    <Text className="text-white font-bold text-base ml-2">
                      Upgrade to PRO
                    </Text>
                  </Pressable>

                  <Text className="text-white/40 text-xs text-center mt-3">
                    (Plus unlimited replies)
                  </Text>
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Save Button */}
          <View
            className="absolute bottom-0 left-0 right-0 px-5"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <Pressable
              onPress={handleSave}
              disabled={isSaving || !hasChanges}
              className="py-4 rounded-2xl items-center active:opacity-80"
              style={{
                backgroundColor: hasChanges ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                shadowColor: COLORS.neonPink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: hasChanges ? 0.4 : 0,
                shadowRadius: 12,
                elevation: hasChanges ? 6 : 0,
              }}
            >
              <Text
                className="font-bold text-lg"
                style={{ color: hasChanges ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

export default MyVibeScreen;
