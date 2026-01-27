// Rizz Assist Pro - Dating App Detail Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

import { COLORS } from '@/lib/constants';
import { usePersonaStore } from '@/lib/personaStore';
import { DatingAppId, DATING_APPS } from '@/lib/datingAppsKnowledge';
import { DatingAppsEditor } from '@/components/DatingAppsEditor';

export default function DatingAppDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const appId = (params?.appId as DatingAppId) || null;
  const appName = appId ? DATING_APPS.find(app => app.id === appId)?.label : '';
  const aboutMe = usePersonaStore((s) => s.aboutMe);
  const datingAppProfiles = usePersonaStore((s) => s.datingAppProfiles);
  const setDatingAppProfile = usePersonaStore((s) => s.setDatingAppProfile);
  const deleteDatingAppProfile = usePersonaStore((s) => s.deleteDatingAppProfile);
  const loadState = usePersonaStore((s) => s.loadState);
  const loadDatingAppProfiles = usePersonaStore((s) => s.loadDatingAppProfiles);

  useEffect(() => {
    loadState();
    loadDatingAppProfiles();
  }, [loadState, loadDatingAppProfiles]);

  const handleDatingAppProfileSave = async (appId: DatingAppId, fields: Record<string, string>) => {
    await setDatingAppProfile(appId, fields);
  };

  const handleSaveSuccess = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleDatingAppProfileDelete = async (appId: DatingAppId) => {
    await deleteDatingAppProfile(appId);
  };

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
            <Text className="text-white text-xl font-bold flex-1 text-center">Your {appName} Profile</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.duration(300)}>
              {appId && (
                <DatingAppsEditor
                  onProfileSave={handleDatingAppProfileSave}
                  onProfileDelete={handleDatingAppProfileDelete}
                  savedProfiles={datingAppProfiles}
                  aboutMe={aboutMe}
                  autoExpandAppId={appId}
                  hideHeader={false}
                  singleAppMode={true}
                  onSaveSuccess={handleSaveSuccess}
                />
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
