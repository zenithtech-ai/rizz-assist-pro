// Rizz Assist Pro - Settings Screen
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Crown,
  RotateCcw,
  ExternalLink,
  Mail,
  Sparkles,
  Camera,
  CameraOff,
  Zap,
  Pencil,
} from 'lucide-react-native';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore, PERSONAS } from '@/lib/personaStore';
import {
  COLORS,
  FREE_DAILY_LIMIT,
  SILVER_MONTHLY_TOKENS,
  GOLD_MONTHLY_TOKENS,
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  DISCLAIMER_TEXT,
} from '@/lib/constants';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isRestoring, setIsRestoring] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const tokens = useTokenStore((s) => s.tokens);
  const isProUser = useTokenStore((s) => s.isProUser);
  const planType = useTokenStore((s) => s.planType);
  const restorePurchase = useTokenStore((s) => s.restorePurchase);
  const weeklyResetDate = useTokenStore((s) => s.weeklyResetDate);

  // Persona store
  const selectedPersonaId = usePersonaStore((s) => s.selectedPersonaId);
  const currentPersona = selectedPersonaId === 'custom'
    ? { name: 'Custom Vibe', emoji: '✨' }
    : PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  // Compute plan details
  const isPaid = planType === 'silver' || planType === 'gold';
  const screenshotEnabled = isPaid;

  const getPlanName = () => {
    if (planType === 'gold') return 'Gold';
    if (planType === 'silver') return 'Silver';
    return 'Free';
  };

  const getMaxTokens = () => {
    if (planType === 'gold') return GOLD_MONTHLY_TOKENS;
    if (planType === 'silver') return SILVER_MONTHLY_TOKENS;
    return FREE_DAILY_LIMIT;
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await restorePurchase();
    setIsRestoring(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleManageSubscription = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL('https://apps.apple.com/account/subscriptions');
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('mailto:contact@rizzassist.pro?subject=Rizz%20Assist%20Pro%20Support');
  };

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  const formatResetDate = () => {
    const date = new Date(weeklyResetDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <View className="px-5 py-3">
          <Text className="text-white text-2xl font-bold">Settings</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Plan Header */}
          <Text className="text-white font-bold text-lg mb-3">Current Plan</Text>

          {/* Your Plan Card */}
          <View className="bg-white/10 rounded-2xl p-5 mb-6">
            {/* Plan Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Crown size={22} color={isPaid ? '#FFD700' : '#888'} />
                <Text className="text-white font-bold text-lg ml-2">
                  {getPlanName()} Plan
                </Text>
              </View>
              {!isPaid && (
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white/80 text-xs">Limited</Text>
                </View>
              )}
            </View>

            {/* Stats Row */}
            <View className="flex-row mb-4">
              <View className="flex-1 bg-white/5 rounded-xl p-3 mr-2">
                <Text className="text-white/50 text-xs mb-1">Replies Left</Text>
                <Text className="text-white font-bold text-xl">
                  {tokens}
                  <Text className="text-white/40 text-sm font-normal">/{getMaxTokens()}</Text>
                </Text>
                <Text className="text-white/40 text-xs mt-1">
                  {isPaid ? `Resets ${formatResetDate()}` : 'Resets daily'}
                </Text>
              </View>
              <View className="flex-1 bg-white/5 rounded-xl p-3 ml-2">
                <Text className="text-white/50 text-xs mb-1">Screenshot Uploads</Text>
                <View className="flex-row items-center mt-1">
                  {screenshotEnabled ? (
                    <>
                      <Camera size={18} color="#4ADE80" />
                      <Text className="text-green-400 font-bold ml-2">ON</Text>
                    </>
                  ) : (
                    <>
                      <CameraOff size={18} color="#F87171" />
                      <Text className="text-red-400 font-bold ml-2">OFF</Text>
                    </>
                  )}
                </View>
                <Text className="text-white/40 text-xs mt-1">
                  {screenshotEnabled ? 'Upload enabled' : 'Upgrade to unlock'}
                </Text>
              </View>
            </View>

            {/* Upgrade CTA */}
            {!isPaid && (
              <Pressable
                onPress={handleUpgrade}
                className="py-4 rounded-xl flex-row items-center justify-center active:opacity-80"
                style={{ backgroundColor: COLORS.neonPink }}
              >
                <Zap size={20} color="#FFF" />
                <Text className="text-white font-bold ml-2">
                  Upgrade for More Replies + Screenshot Uploads
                </Text>
              </Pressable>
            )}

            {planType === 'silver' && (
              <Pressable
                onPress={handleUpgrade}
                className="py-3 rounded-xl flex-row items-center justify-center active:opacity-80"
                style={{ backgroundColor: '#FFD700' }}
              >
                <Crown size={18} color="#000" />
                <Text className="text-black font-bold ml-2">
                  Upgrade to Gold - Double your replies
                </Text>
              </Pressable>
            )}
          </View>

          {/* My Profile */}
          <View className="mb-6">
            <Text className="text-white/50 text-xs font-medium uppercase mb-3 ml-1">
              Personalization
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/my-vibe');
              }}
              className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-between active:opacity-80"
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
                >
                  <Pencil size={20} color={COLORS.neonPink} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold">My Profile</Text>
                  <Text className="text-white/50 text-sm">Update your preferences</Text>
                </View>
              </View>
              <Sparkles size={20} color={COLORS.neonPink} />
            </Pressable>
          </View>

          {/* Account Actions */}
          <View className="mb-6">
            <Text className="text-white/50 text-xs font-medium uppercase mb-3 ml-1">
              Account
            </Text>

            <Pressable
              onPress={handleRestorePurchases}
              disabled={isRestoring}
              className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-between mb-3 active:opacity-80"
            >
              <View className="flex-row items-center">
                <RotateCcw size={20} color="rgba(255, 255, 255, 0.7)" />
                <Text className="text-white font-medium ml-3">Restore Purchases</Text>
              </View>
              {isRestoring && <ActivityIndicator color="#FFF" size="small" />}
            </Pressable>

            {isPaid && (
              <Pressable
                onPress={handleManageSubscription}
                className="bg-white/10 rounded-2xl p-4 flex-row items-center mb-3 active:opacity-80"
              >
                <ExternalLink size={20} color="rgba(255, 255, 255, 0.7)" />
                <Text className="text-white font-medium ml-3">Manage Subscription</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleContactSupport}
              className="bg-white/10 rounded-2xl p-4 flex-row items-center active:opacity-80"
            >
              <Mail size={20} color="rgba(255, 255, 255, 0.7)" />
              <Text className="text-white font-medium ml-3">Contact Support</Text>
            </Pressable>
          </View>

          {/* Legal */}
          <View>
            <Text className="text-white/50 text-xs font-medium uppercase mb-3 ml-1">
              Legal
            </Text>
            <CollapsibleSection title="Disclaimer" content={DISCLAIMER_TEXT} />
            <CollapsibleSection title="Terms of Service" content={TERMS_OF_SERVICE} />
            <CollapsibleSection title="Privacy Policy" content={PRIVACY_POLICY} />
          </View>

          {/* App Info */}
          <View className="mt-6 items-center">
            <Text className="text-white/30 text-sm">Rizz Assist Pro v1.0.0</Text>
          </View>
        </ScrollView>
      </LinearGradient>

      <DisclaimerModal
        visible={showDisclaimer}
        onAccept={() => setShowDisclaimer(false)}
      />
    </View>
  );
}

export default SettingsScreen;
