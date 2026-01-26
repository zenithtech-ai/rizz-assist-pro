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
  FileText,
  Shield,
  AlertCircle,
  Mail,
} from 'lucide-react-native';

import { CollapsibleSection } from '@/components/CollapsibleSection';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { useTokenStore } from '@/lib/tokenStore';
import {
  COLORS,
  FREE_TOKEN_LIMIT,
  PRO_WEEKLY_TOKENS,
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
  const restorePurchase = useTokenStore((s) => s.restorePurchase);
  const weeklyResetDate = useTokenStore((s) => s.weeklyResetDate);

  const maxTokens = isProUser ? PRO_WEEKLY_TOKENS : FREE_TOKEN_LIMIT;

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await restorePurchase();

    setIsRestoring(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleManageSubscription = async () => {
    // TODO: Deep link to App Store subscription management
    console.log('TODO: Open App Store subscription management');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Mock: Open App Store
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
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
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
          {/* Pro Status Card */}
          <View
            className="bg-white/10 rounded-2xl p-5 mb-6"
            style={{
              borderWidth: 1,
              borderColor: isProUser ? COLORS.tokenPro : 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <View className="flex-row items-center mb-3">
              <Crown
                size={24}
                color={isProUser ? COLORS.tokenPro : 'rgba(255, 255, 255, 0.5)'}
              />
              <Text className="text-white font-bold text-xl ml-2">
                {isProUser ? 'Pro Member' : 'Free User'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white/70">Tokens Remaining</Text>
              <Text
                className="font-bold text-lg"
                style={{ color: isProUser ? COLORS.tokenPro : COLORS.tokenFree }}
              >
                {tokens}/{maxTokens}
              </Text>
            </View>

            {isProUser && (
              <View className="flex-row justify-between items-center">
                <Text className="text-white/70">Weekly Reset</Text>
                <Text className="text-white/90 font-medium">
                  {formatResetDate()}
                </Text>
              </View>
            )}

            {!isProUser && (
              <Pressable
                onPress={handleUpgrade}
                className="mt-4 py-3 rounded-xl items-center active:opacity-80"
                style={{ backgroundColor: COLORS.neonPink }}
              >
                <Text className="text-white font-bold">Upgrade to Pro</Text>
              </Pressable>
            )}
          </View>

          {/* Actions */}
          <View className="mb-6">
            <Text className="text-white/60 text-sm font-medium uppercase mb-3 ml-1">
              Account
            </Text>

            {/* Restore Purchases */}
            <Pressable
              onPress={handleRestorePurchases}
              disabled={isRestoring}
              className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-between mb-3 active:opacity-80"
            >
              <View className="flex-row items-center flex-1">
                <RotateCcw size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text className="text-white font-medium ml-3">Restore Purchases</Text>
              </View>
              {isRestoring && <ActivityIndicator color="#FFFFFF" size="small" />}
            </Pressable>

            {/* Manage Subscription */}
            {isProUser && (
              <Pressable
                onPress={handleManageSubscription}
                className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-between mb-3 active:opacity-80"
              >
                <View className="flex-row items-center flex-1">
                  <ExternalLink size={20} color="rgba(255, 255, 255, 0.8)" />
                  <Text className="text-white font-medium ml-3">Manage Subscription</Text>
                </View>
              </Pressable>
            )}

            {/* Contact Support */}
            <Pressable
              onPress={handleContactSupport}
              className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-between active:opacity-80"
            >
              <View className="flex-row items-center flex-1">
                <Mail size={20} color="rgba(255, 255, 255, 0.8)" />
                <Text className="text-white font-medium ml-3">Contact Support</Text>
              </View>
            </Pressable>
          </View>

          {/* Legal Section */}
          <View>
            <Text className="text-white/60 text-sm font-medium uppercase mb-3 ml-1">
              Legal
            </Text>

            <CollapsibleSection
              title="Disclaimer"
              content={DISCLAIMER_TEXT}
            />

            <CollapsibleSection
              title="Terms of Service"
              content={TERMS_OF_SERVICE}
            />

            <CollapsibleSection
              title="Privacy Policy"
              content={PRIVACY_POLICY}
            />
          </View>

          {/* App Info */}
          <View className="mt-6 items-center">
            <Text className="text-white/40 text-sm">Rizz Assist Pro v1.0.0</Text>
            <Text className="text-white/30 text-xs mt-1">
              Made with 🔥 for better conversations
            </Text>
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
