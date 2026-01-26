// Rizz Assist Pro - Token Counter Component
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTokenStore } from '@/lib/tokenStore';
import { COLORS, FREE_TOKEN_LIMIT, PRO_WEEKLY_TOKENS } from '@/lib/constants';

export function TokenCounter() {
  const router = useRouter();
  const tokens = useTokenStore((s) => s.tokens);
  const isProUser = useTokenStore((s) => s.isProUser);

  const maxTokens = isProUser ? PRO_WEEKLY_TOKENS : FREE_TOKEN_LIMIT;
  const bgColor = isProUser ? COLORS.tokenPro : COLORS.tokenFree;
  const label = isProUser ? 'PRO' : 'FREE';

  const handlePress = () => {
    if (!isProUser) {
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
