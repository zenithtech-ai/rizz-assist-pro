// Rizz Assist Pro - Paywall Screen
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { X, Check, Sparkles, CreditCard } from 'lucide-react-native';

import { useTokenStore } from '@/lib/tokenStore';
import { COLORS, SUBSCRIPTION_PRODUCTS } from '@/lib/constants';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const purchasePro = useTokenStore((s) => s.purchasePro);
  const restorePurchase = useTokenStore((s) => s.restorePurchase);

  const handlePurchase = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mock purchase delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (plan === 'monthly') {
      // TODO: iOS StoreKit 2
      console.log('TODO: StoreKit 2 - rizzassist.pro.monthly');
    } else {
      // TODO: Android Play Billing
      console.log('TODO: BillingClient - rizzassist.pro.yearly');
    }

    await purchasePro();

    setIsLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate back
    router.back();
  };

  const handleRestore = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Mock restore delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = await restorePurchase();

    setIsLoading(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    }
  };

  const handleClose = () => {
    router.back();
  };

  const benefits = [
    'Unlimited replies',
    '25 tokens/week auto-refill',
    'No ads, no waiting',
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, '#2D1B4E', COLORS.gradientEnd]}
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {/* Close Button */}
        <Pressable
          onPress={handleClose}
          className="absolute top-4 right-4 z-10 p-2"
          style={{ top: insets.top + 10 }}
        >
          <View className="bg-white/20 rounded-full p-2">
            <X size={24} color="#FFFFFF" />
          </View>
        </Pressable>

        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="items-center mb-8">
            <View className="bg-white/10 rounded-full p-4 mb-4">
              <Text className="text-5xl">🔥</Text>
            </View>
            <Text className="text-white text-3xl font-bold text-center">
              Rizz Assist Pro
            </Text>
            <Text className="text-white/70 text-lg text-center mt-2">
              UNLOCK ALL 10 STYLES
            </Text>
          </Animated.View>

          {/* Benefits */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-8">
            {benefits.map((benefit, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: COLORS.tokenPro }}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
                <Text className="text-white text-lg">{benefit}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Pricing Cards */}
          <Animated.View entering={FadeInDown.delay(300)}>
            {/* Yearly */}
            <Pressable
              onPress={() => setSelectedPlan('yearly')}
              disabled={isLoading}
              className="mb-3"
            >
              <View
                className="rounded-2xl p-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: selectedPlan === 'yearly' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: selectedPlan === 'yearly' ? 2 : 1,
                  borderColor: selectedPlan === 'yearly' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-white font-bold text-lg">Yearly</Text>
                    <View className="bg-green-500 rounded-full px-2 py-1 ml-2">
                      <Text className="text-white text-xs font-bold">SAVE 17%</Text>
                    </View>
                  </View>
                  <Text className="text-white/70 text-sm mt-1">
                    {SUBSCRIPTION_PRODUCTS.yearly.price}
                  </Text>
                </View>
                <View
                  className="w-6 h-6 rounded-full border-2 items-center justify-center"
                  style={{
                    borderColor: selectedPlan === 'yearly' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: selectedPlan === 'yearly' ? COLORS.neonPink : 'transparent',
                  }}
                >
                  {selectedPlan === 'yearly' && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
            </Pressable>

            {/* Monthly */}
            <Pressable
              onPress={() => setSelectedPlan('monthly')}
              disabled={isLoading}
            >
              <View
                className="rounded-2xl p-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: selectedPlan === 'monthly' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  borderWidth: selectedPlan === 'monthly' ? 2 : 1,
                  borderColor: selectedPlan === 'monthly' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">Monthly</Text>
                  <Text className="text-white/70 text-sm mt-1">
                    {SUBSCRIPTION_PRODUCTS.monthly.price}
                  </Text>
                </View>
                <View
                  className="w-6 h-6 rounded-full border-2 items-center justify-center"
                  style={{
                    borderColor: selectedPlan === 'monthly' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: selectedPlan === 'monthly' ? COLORS.neonPink : 'transparent',
                  }}
                >
                  {selectedPlan === 'monthly' && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Subscribe Button */}
          <Animated.View entering={FadeInUp.delay(400)} className="mt-6">
            <Pressable
              onPress={() => handlePurchase(selectedPlan)}
              disabled={isLoading}
              className="py-4 rounded-2xl flex-row items-center justify-center active:opacity-80"
              style={{
                backgroundColor: isLoading ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                shadowColor: COLORS.neonPink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Sparkles size={24} color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Subscribe Now
                  </Text>
                </>
              )}
            </Pressable>

            {/* Restore */}
            <Pressable
              onPress={handleRestore}
              disabled={isLoading}
              className="py-3 items-center mt-3"
            >
              <View className="flex-row items-center">
                <CreditCard size={16} color="rgba(255, 255, 255, 0.7)" />
                <Text className="text-white/70 text-sm ml-2">
                  Restore Purchases
                </Text>
              </View>
            </Pressable>

            {/* Legal */}
            <Text className="text-white/50 text-xs text-center mt-4 px-4">
              Apple/Google will confirm. Cancel anytime in App Store/Play Store settings.
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}
