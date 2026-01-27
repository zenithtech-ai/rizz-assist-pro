import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Zap } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { COLORS } from '@/lib/constants';

interface TokenCost {
  feature: string;
  tokens: number;
  cost: string;
  description: string;
}

export default function TokenUsageGuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tokenCosts: TokenCost[] = [
    {
      feature: 'Reply Generation (Text)',
      tokens: 1,
      cost: '~$0.008',
      description: 'Generate AI replies to a text message',
    },
    {
      feature: 'Reply Generation (Screenshot)',
      tokens: 2,
      cost: '~$0.015',
      description: 'Generate replies from a conversation screenshot',
    },
    {
      feature: 'Profile Analysis',
      tokens: 3,
      cost: '~$0.04',
      description: 'Analyze dating profile screenshots to understand personality and interests',
    },
    {
      feature: 'Generate Openers from Analysis',
      tokens: 1,
      cost: '~$0.008',
      description: 'Create personalized conversation starters based on profile analysis',
    },
    {
      feature: 'Profile Optimization',
      tokens: 2,
      cost: '~$0.015',
      description: 'Optimize your dating profile for a specific app with AI suggestions',
    },
  ];

  const planDetails = [
    {
      plan: 'Free',
      tokens: '5 per day',
      price: 'Free',
      reset: 'Daily at midnight',
    },
    {
      plan: 'Silver',
      tokens: '1,000 per month',
      price: '$9.95/month',
      reset: 'Monthly',
    },
    {
      plan: 'Gold',
      tokens: '2,000 per month',
      price: '$17.95/month',
      reset: 'Monthly',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="flex-row items-center active:opacity-70"
          >
            <ChevronLeft size={24} color="rgba(255, 255, 255, 0.7)" />
            <Text className="text-white/60 text-base ml-2">Back</Text>
          </Pressable>
          <Text className="flex-1 text-white font-bold text-xl text-center mr-8">
            Token Usage Guide
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Overview */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <View className="bg-white/10 rounded-2xl p-5 mb-6">
              <View className="flex-row items-center mb-3">
                <Zap size={24} color={COLORS.neonPink} />
                <Text className="text-white font-bold text-lg ml-3">What are Tokens?</Text>
              </View>
              <Text className="text-white/80 text-sm leading-6">
                Tokens are the currency used to power AI features in Rizz Assist. Each action (like generating replies or analyzing profiles) costs a specific number of tokens.
              </Text>
            </View>
          </Animated.View>

          {/* Token Costs */}
          <Animated.View entering={FadeInUp.delay(150)}>
            <Text className="text-white font-bold text-lg mb-4">Token Costs by Feature</Text>

            {tokenCosts.map((item, index) => (
              <View
                key={index}
                className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-semibold text-base">{item.feature}</Text>
                    <Text className="text-white/60 text-xs mt-1">{item.description}</Text>
                  </View>
                  <View className="bg-pink-500/20 px-3 py-2 rounded-lg">
                    <Text className="text-pink-300 font-bold text-sm">{item.tokens} token</Text>
                  </View>
                </View>
                <Text className="text-white/40 text-xs">Cost: {item.cost}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Plans */}
          <Animated.View entering={FadeInUp.delay(200)} className="mt-6">
            <Text className="text-white font-bold text-lg mb-4">Your Plan & Tokens</Text>

            {planDetails.map((plan, index) => (
              <View
                key={index}
                className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-semibold text-base">{plan.plan}</Text>
                  <Text className="text-white/60 text-sm">{plan.price}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/70 text-sm">{plan.tokens}</Text>
                  <Text className="text-white/40 text-xs">{plan.reset}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Tips */}
          <Animated.View entering={FadeInUp.delay(250)} className="mt-6">
            <View className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
              <Text className="text-white font-bold text-base mb-3">💡 Token Tips</Text>
              <Text className="text-white/70 text-sm mb-2">
                • Profile analysis (3 tokens) is more expensive because it uses more AI processing
              </Text>
              <Text className="text-white/70 text-sm mb-2">
                • Screenshot analysis costs more than text (2 vs 1 token) due to vision AI
              </Text>
              <Text className="text-white/70 text-sm">
                • Upgrade to Silver/Gold for more tokens and better value per token
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
