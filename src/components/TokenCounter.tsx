// Rizz Assist Pro - Token Counter Component
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTokenStore } from '@/lib/tokenStore';
import { COLORS, FREE_TOKEN_LIMIT, SILVER_MONTHLY_TOKENS, GOLD_MONTHLY_TOKENS } from '@/lib/constants';

export function TokenCounter() {
  const router = useRouter();
  const planType = useTokenStore((s) => s.planType);
  const tokens = useTokenStore((s) => s.tokens);

  // Determine max tokens and label based on plan type
  let maxTokens = FREE_TOKEN_LIMIT;
  let label = 'FREE';
  let bgColor = COLORS.tokenFree;

  if (planType === 'gold') {
    maxTokens = GOLD_MONTHLY_TOKENS;
    label = 'GOLD';
    bgColor = '#22C55E'; // Green color
  } else if (planType === 'silver') {
    maxTokens = SILVER_MONTHLY_TOKENS;
    label = 'SILVER';
    bgColor = '#22C55E'; // Green color
  }

  const handlePress = () => {
    if (planType === 'free') {
      router.push('/paywall');
    }
  };

  return (
    <Pressable onPress={handlePress} className="active:opacity-80">
      <View
        className="flex-row items-center px-3 py-2 rounded-full"
        style={{ backgroundColor: bgColor }}
      >
        <Text className="text-white font-bold text-sm">
          {tokens}/{maxTokens} {label}
        </Text>
      </View>
    </Pressable>
  );
}

