// Rizz Assist Pro - Paywall Screen
import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { X, Check, Sparkles, CreditCard, Camera, CameraOff } from 'lucide-react-native';

import { useTokenStore } from '@/lib/tokenStore';
import { COLORS, SUBSCRIPTION_PRODUCTS, FREE_DAILY_LIMIT, SILVER_MONTHLY_TOKENS, GOLD_MONTHLY_TOKENS } from '@/lib/constants';

type PlanType = 'free' | 'silver' | 'gold';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('gold');

  const purchasePro = useTokenStore((s) => s.purchasePro);
  const restorePurchase = useTokenStore((s) => s.restorePurchase);

  const handlePurchase = async (plan: PlanType) => {
    if (plan === 'free') {
      router.back();
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mock purchase delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (plan === 'silver') {
      console.log('TODO: StoreKit 2 - rizzassist.silver.monthly');
    } else {
      console.log('TODO: StoreKit 2 - rizzassist.gold.monthly');
    }

    await purchasePro();

    setIsLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    router.back();
  };

  const handleRestore = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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

  const plans = [
    {
      id: 'free' as PlanType,
      name: 'Free',
      price: '$0',
      period: '',
      description: '3 tokens per day',
      tokens: FREE_DAILY_LIMIT,
      screenshot: false,
      highlight: false,
    },
    {
      id: 'silver' as PlanType,
      name: 'Silver',
      price: SUBSCRIPTION_PRODUCTS.silver.price,
      period: '/month',
      description: '1000 tokens a month',
      tokens: SILVER_MONTHLY_TOKENS,
      screenshot: true,
      highlight: false,
    },
    {
      id: 'gold' as PlanType,
      name: 'Gold',
      price: SUBSCRIPTION_PRODUCTS.gold.price,
      period: '/month',
      description: '2000 tokens a month',
      tokens: GOLD_MONTHLY_TOKENS,
      screenshot: true,
      highlight: true,
      badge: 'BEST VALUE',
    },
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

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} className="items-center mt-4 mb-6">
            <View className="bg-white/10 rounded-full p-4 mb-4">
              <Text className="text-5xl">🔥</Text>
            </View>
            <Text className="text-white text-3xl font-bold text-center">
              Choose Your Plan
            </Text>
            <Text className="text-white/70 text-base text-center mt-2">
              More replies = more chances to connect
            </Text>
          </Animated.View>

          {/* Plan Cards */}
          <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
            {plans.map((plan, index) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                disabled={isLoading}
                className="mb-3"
              >
                <View
                  className="rounded-2xl p-4 overflow-hidden"
                  style={{
                    backgroundColor: selectedPlan === plan.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    borderWidth: selectedPlan === plan.id ? 2 : 1,
                    borderColor: selectedPlan === plan.id
                      ? (plan.highlight ? '#FFD700' : COLORS.neonPink)
                      : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {plan.badge && (
                    <View
                      className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl"
                      style={{ backgroundColor: '#FFD700' }}
                    >
                      <Text className="text-xs font-bold text-black">{plan.badge}</Text>
                    </View>
                  )}

                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl">{plan.name}</Text>
                      <View className="flex-row items-baseline mt-1">
                        <Text className="text-white text-2xl font-bold">{plan.price}</Text>
                        {plan.period && (
                          <Text className="text-white/60 text-sm ml-1">{plan.period}</Text>
                        )}
                      </View>
                    </View>
                    <View
                      className="w-7 h-7 rounded-full border-2 items-center justify-center"
                      style={{
                        borderColor: selectedPlan === plan.id
                          ? (plan.highlight ? '#FFD700' : COLORS.neonPink)
                          : 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: selectedPlan === plan.id
                          ? (plan.highlight ? '#FFD700' : COLORS.neonPink)
                          : 'transparent',
                      }}
                    >
                      {selectedPlan === plan.id && <Check size={16} color={plan.highlight ? '#000' : '#FFFFFF'} strokeWidth={3} />}
                    </View>
                  </View>

                  {/* Features */}
                  <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                    <View className="flex-row items-center mb-2">
                      <Check size={14} color={COLORS.tokenPro} />
                      <Text className="text-white/80 text-sm ml-2">{plan.description}</Text>
                    </View>
                    <View className="flex-row items-center">
                      {plan.screenshot ? (
                        <>
                          <Camera size={14} color={COLORS.tokenPro} />
                          <Text className="text-white/80 text-sm ml-2">Screenshot analysis enabled</Text>
                        </>
                      ) : (
                        <>
                          <CameraOff size={14} color={COLORS.tokenFree} />
                          <Text className="text-white/50 text-sm ml-2">Screenshot analysis disabled</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Subscribe Button */}
          <Animated.View entering={FadeInUp.delay(300)}>
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
                    {selectedPlan === 'free' ? 'Continue with Free' : 'Subscribe Now'}
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
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
