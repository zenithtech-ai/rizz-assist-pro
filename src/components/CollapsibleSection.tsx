// Rizz Assist Pro - Collapsible Section Component
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { COLORS } from '@/lib/constants';

interface CollapsibleSectionProps {
  title: string;
  content: string;
}

export function CollapsibleSection({ title, content }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withTiming(isExpanded ? 0 : 180, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="bg-white/10 rounded-2xl mb-3 overflow-hidden">
      <Pressable
        onPress={toggleExpand}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="text-white font-semibold text-base flex-1 pr-2">
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color="rgba(255, 255, 255, 0.7)" />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <View className="px-4 pb-4">
          <View className="border-t border-white/10 pt-4">
            <Text className="text-white/70 text-sm leading-5">
              {content}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
