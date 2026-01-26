// Rizz Assist Pro - Reply Bubble Component
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInDown,
} from 'react-native-reanimated';
import { Copy, Check } from 'lucide-react-native';
import { COLORS } from '@/lib/constants';

interface ReplyBubbleProps {
  text: string;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReplyBubble({ text, index }: ReplyBubbleProps) {
  const scale = useSharedValue(1);
  const [copied, setCopied] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSequence(
      withSpring(1.05),
      withSpring(1)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <AnimatedPressable
        onPress={handleCopy}
        className="bg-white rounded-2xl p-4 mb-3 flex-row items-center active:opacity-90"
        style={[
          animatedStyle,
          {
            shadowColor: COLORS.cardShadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          },
        ]}
      >
        <View className="flex-1">
          <Text className="text-gray-800 text-base leading-5">{text}</Text>
        </View>
        <View className="ml-3">
          {copied ? (
            <Check size={20} color={COLORS.tokenPro} />
          ) : (
            <Copy size={20} color={COLORS.neonPink} />
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
