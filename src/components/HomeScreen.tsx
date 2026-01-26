// Rizz Assist Pro - Home Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Sparkles, Image as ImageIcon } from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { StyleButton } from '@/components/StyleButton';
import { ReplyBubble } from '@/components/ReplyBubble';
import { useTokenStore } from '@/lib/tokenStore';
import {
  COLORS,
  REPLY_STYLES,
  ReplyStyleId,
  FREE_TOKEN_LIMIT,
} from '@/lib/constants';
import { generateReplies, ResponseLength } from '@/lib/replyGenerator';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ReplyStyleId>('flirty');
  const [responseLength, setResponseLength] = useState<ResponseLength>('short');
  const [generatedReplies, setGeneratedReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const tokens = useTokenStore((s) => s.tokens);
  const isProUser = useTokenStore((s) => s.isProUser);
  const consumeToken = useTokenStore((s) => s.useToken);
  const totalUses = useTokenStore((s) => s.totalUses);

  const handleGenerate = async () => {
    if (!message.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    // Check if user has tokens
    if (tokens <= 0) {
      router.push('/paywall');
      return;
    }

    // Use a token
    const success = consumeToken();
    if (!success) {
      router.push('/paywall');
      return;
    }

    setIsGenerating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate context-aware replies based on pasted message
    const replies = generateReplies(message, selectedStyle, responseLength);
    setGeneratedReplies(replies);
    setIsGenerating(false);

    // Check if this was the last free token
    const newTotalUses = totalUses + 1;
    if (!isProUser && newTotalUses >= FREE_TOKEN_LIMIT) {
      // Show paywall after a short delay
      setTimeout(() => {
        router.push('/paywall');
      }, 1500);
    }
  };

  const handlePickImage = async () => {
    setIsLoadingImage(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // TODO: Send image to OCR API to extract text
        console.log('TODO: Extract text from screenshot:', result.assets[0].uri);
        // For now, show a placeholder
        setMessage('(Screenshot uploaded - text extraction coming soon)');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoadingImage(false);
    }
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
          <View className="flex-row items-center justify-between px-5 py-3">
            <View>
              <Text className="text-white text-2xl font-bold">RIZZ ASSIST PRO</Text>
              <Text className="text-white/60 text-sm">AI Dating Assistant</Text>
            </View>
            <TokenCounter />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Message Input with Image Button */}
            <View
              className="bg-white/10 rounded-2xl p-4 mb-6"
              style={{
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white/70 text-sm font-medium">
                  Paste their message...
                </Text>
                <Pressable
                  onPress={handlePickImage}
                  disabled={isLoadingImage}
                  className="active:opacity-80"
                >
                  {isLoadingImage ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <ImageIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                  )}
                </Pressable>
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="What did they say to you? Or upload a screenshot"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                numberOfLines={4}
                className="text-white text-base min-h-[100px]"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Response Length Selector */}
            <Text className="text-white font-bold text-lg mb-3">
              Response length
            </Text>
            <View className="flex-row gap-2 mb-6">
              <Pressable
                onPress={() => setResponseLength('short')}
                className="flex-1 py-2 px-4 rounded-lg active:opacity-80"
                style={{
                  backgroundColor: responseLength === 'short' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <Text
                  className="font-semibold text-center"
                  style={{ color: responseLength === 'short' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
                >
                  Short (1 sentence)
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setResponseLength('long')}
                className="flex-1 py-2 px-4 rounded-lg active:opacity-80"
                style={{
                  backgroundColor: responseLength === 'long' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <Text
                  className="font-semibold text-center"
                  style={{ color: responseLength === 'long' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
                >
                  Long (2-3 sentences)
                </Text>
              </Pressable>
            </View>

            {/* Style Selection */}
            <Text className="text-white font-bold text-lg mb-3">
              Choose your style
            </Text>

            <View className="flex-row flex-wrap mb-6">
              {REPLY_STYLES.map((style) => (
                <StyleButton
                  key={style.id}
                  label={style.label}
                  emoji={style.emoji}
                  isSelected={selectedStyle === style.id}
                  onPress={() => setSelectedStyle(style.id)}
                />
              ))}
            </View>

            {/* Generate Button */}
            <Pressable
              onPress={handleGenerate}
              disabled={isGenerating}
              className="py-4 rounded-2xl flex-row items-center justify-center mb-6 active:opacity-80"
              style={{
                backgroundColor: isGenerating ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                shadowColor: COLORS.neonPink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Sparkles size={24} color="#FFFFFF" />
              <Text className="text-white font-bold text-lg ml-2">
                {isGenerating ? 'Generating...' : 'Generate Replies'}
              </Text>
            </Pressable>

            {/* Generated Replies */}
            {generatedReplies.length > 0 && (
              <Animated.View entering={FadeIn}>
                <Text className="text-white font-bold text-lg mb-3">
                  Tap to copy
                </Text>
                {generatedReplies.map((reply, index) => (
                  <ReplyBubble key={index} text={reply} index={index} />
                ))}
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

export default HomeScreen;
