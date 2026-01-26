// Rizz Assist Pro - Home Screen (Modern Hero Layout)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {
  Sparkles,
  Image as ImageIcon,
  X,
  ChevronRight,
  Shield,
  Lock,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { StyleButton } from '@/components/StyleButton';
import { ReplyBubble } from '@/components/ReplyBubble';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore, PERSONAS } from '@/lib/personaStore';
import {
  COLORS,
  REPLY_STYLES,
  ReplyStyleId,
  FREE_TOKEN_LIMIT,
} from '@/lib/constants';
import { generateReplies as generateLocalReplies, ResponseLength } from '@/lib/replyGenerator';
import { generateReplies as generateAIReplies } from '@/lib/openai';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showGenerator, setShowGenerator] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ReplyStyleId>('flirty');
  const [responseLength, setResponseLength] = useState<ResponseLength>('short');
  const [generatedReplies, setGeneratedReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);

  const tokens = useTokenStore((s) => s.tokens);
  const isProUser = useTokenStore((s) => s.isProUser);
  const planType = useTokenStore((s) => s.planType);
  const consumeToken = useTokenStore((s) => s.useToken);
  const totalUses = useTokenStore((s) => s.totalUses);

  // Screenshot is only available for paid users
  const screenshotEnabled = planType !== 'free';

  // Persona store
  const selectedPersonaId = usePersonaStore((s) => s.selectedPersonaId);
  const getActivePersonaDescription = usePersonaStore((s) => s.getActivePersonaDescription);
  const aboutMe = usePersonaStore((s) => s.aboutMe);

  // Get current persona info for display
  const currentPersona = selectedPersonaId === 'custom'
    ? { name: 'Custom Vibe', emoji: '✨' }
    : PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  // Animated button glow
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const handleGenerate = async () => {
    // Need either text or screenshot
    if (!message.trim() && !screenshotBase64) {
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

    // Try AI generation first, fall back to local if it fails
    try {
      console.log('Generating replies with:', {
        hasText: !!message.trim(),
        hasImage: !!screenshotBase64,
        style: selectedStyle,
        persona: currentPersona.name
      });

      const result = await generateAIReplies({
        conversationText: message.trim() || undefined,
        imageBase64: screenshotBase64 || undefined,
        style: selectedStyle,
        count: 3,
        userPersona: getActivePersonaDescription(),
        userAboutMe: aboutMe,
      });

      console.log('AI result:', {
        repliesCount: result.replies.length,
        error: result.error
      });

      if (result.replies.length > 0) {
        setGeneratedReplies(result.replies);
        // Clear screenshot after successful generation
        if (screenshotBase64) {
          setScreenshotBase64(null);
          setHasScreenshot(false);
        }
      } else if (result.error) {
        console.error('AI generation error:', result.error);
        // Fallback to local generation (only works with text)
        if (message.trim()) {
          const localReplies = generateLocalReplies(message, selectedStyle, responseLength);
          setGeneratedReplies(localReplies);
        }
        // If only screenshot and it failed, show error via haptic
        if (screenshotBase64 && !message.trim()) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      if (message.trim()) {
        const localReplies = generateLocalReplies(message, selectedStyle, responseLength);
        setGeneratedReplies(localReplies);
      }
      // If only screenshot and it failed, show error via haptic
      if (screenshotBase64 && !message.trim()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

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
    // Check if screenshots are enabled for this plan
    if (!screenshotEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    setIsLoadingImage(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setScreenshotBase64(asset.base64);
          setHasScreenshot(true);
          console.log('Screenshot uploaded with base64, length:', asset.base64.length);
        } else {
          console.error('No base64 data returned from image picker');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleStartGenerating = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowGenerator(true);
  };

  // Hero/Welcome Screen
  if (!showGenerator) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0D0D1A', '#1A1A2E', '#16213E']}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            {/* Header with Token Counter */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              className="flex-row items-center justify-between px-5 py-3"
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">💬</Text>
                <Text className="text-white/60 text-sm font-medium">RIZZ ASSIST</Text>
              </View>
              <TokenCounter />
            </Animated.View>

            {/* Main Content - Centered */}
            <View className="flex-1 justify-center px-6">
              {/* Speech Bubble Emojis */}
              <Animated.View
                entering={FadeInDown.delay(200).duration(600)}
                className="flex-row justify-center mb-6"
              >
                <View className="flex-row items-end">
                  <Text className="text-4xl mr-2">😏</Text>
                  <View
                    className="px-4 py-2 rounded-2xl rounded-bl-sm"
                    style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
                  >
                    <Text className="text-white text-lg">hey you...</Text>
                  </View>
                </View>
                <View className="ml-3 flex-row items-end">
                  <View
                    className="px-4 py-2 rounded-2xl rounded-br-sm"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
                  >
                    <Text className="text-white text-lg">oh really? 🔥</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Headline */}
              <Animated.Text
                entering={FadeInDown.delay(300).duration(600)}
                className="text-white text-center font-bold mb-4"
                style={{ fontSize: 28, lineHeight: 34 }}
              >
                Replies That Actually{'\n'}Sound Like{' '}
                <Text style={{ color: COLORS.neonPink }}>You</Text>
              </Animated.Text>

              {/* Subtext */}
              <Animated.View entering={FadeInDown.delay(400).duration(600)} className="mb-8">
                <Text className="text-white/70 text-center text-base leading-6 mb-2">
                  AI-powered dating replies trained on psychology
                </Text>
                <Text className="text-white/90 text-center text-lg font-medium">
                  Get replies that sound{' '}
                  <Text style={{ color: COLORS.neonPink }}>100% like you</Text>
                </Text>
              </Animated.View>

              {/* CTA Button */}
              <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                <Animated.View
                  style={[
                    {
                      shadowColor: COLORS.neonPink,
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 20,
                      elevation: 10,
                    },
                    animatedGlowStyle,
                  ]}
                >
                  <Pressable
                    onPress={handleStartGenerating}
                    className="py-5 rounded-2xl flex-row items-center justify-center active:scale-98"
                    style={{
                      backgroundColor: COLORS.neonPink,
                    }}
                  >
                    <Sparkles size={24} color="#FFFFFF" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Generate My Reply
                    </Text>
                  </Pressable>
                </Animated.View>

                {/* Edit Persona Link */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/my-vibe');
                  }}
                  className="mt-4 flex-row items-center justify-center active:opacity-70"
                >
                  <Text className="text-xl mr-2">{currentPersona.emoji}</Text>
                  <Text className="text-white/60 text-sm">
                    {aboutMe ? `${currentPersona.name} + About Me` : 'Set up your vibe & profile'}
                  </Text>
                  <ChevronRight size={16} color="rgba(255, 255, 255, 0.4)" />
                </Pressable>
              </Animated.View>
            </View>

            {/* Trust/Social Proof Footer */}
            <Animated.View
              entering={FadeIn.delay(600).duration(600)}
              className="px-6 pb-4"
            >
              <View className="flex-row items-center justify-center">
                <View className="flex-row items-center">
                  <Shield size={12} color="rgba(255, 255, 255, 0.4)" />
                  <Text className="text-white/40 text-xs ml-1">Your chats stay 100% private</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Generator Screen (existing functionality)
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
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowGenerator(false);
                setGeneratedReplies([]);
              }}
              className="flex-row items-center active:opacity-70"
            >
              <Text className="text-white/60 text-sm">← Back</Text>
            </Pressable>
            <Text className="text-white font-bold text-lg">Generate Replies</Text>
            <TokenCounter />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* My Vibe Card - Edit Persona Button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/my-vibe');
              }}
              className="mb-4 active:opacity-90"
            >
              <View
                className="rounded-2xl p-4 flex-row items-center"
                style={{
                  backgroundColor: 'rgba(255, 105, 180, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 105, 180, 0.3)',
                }}
              >
                <Text className="text-2xl mr-3">{currentPersona.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">{currentPersona.name}</Text>
                  {aboutMe ? (
                    <Text className="text-white/60 text-xs mt-0.5" numberOfLines={1}>
                      + About Me configured
                    </Text>
                  ) : (
                    <Text className="text-white/50 text-xs mt-0.5">
                      Tap to edit persona & About Me
                    </Text>
                  )}
                </View>
                <ChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
              </View>
            </Pressable>

            {/* Message Input with Image Button */}
            <View
              className="bg-white/10 rounded-2xl p-4 mb-6"
              style={{
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white/70 text-sm font-medium" style={{ flex: 1, marginRight: 8 }}>
                  {screenshotEnabled
                    ? 'Paste their message or upload a screenshot'
                    : 'Paste their message (screenshots: upgrade required)'}
                </Text>
                <Pressable
                  onPress={handlePickImage}
                  disabled={isLoadingImage}
                  className="active:opacity-80 flex-row items-center"
                >
                  {isLoadingImage ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : screenshotEnabled ? (
                    <ImageIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                  ) : (
                    <View className="flex-row items-center">
                      <Lock size={14} color={COLORS.tokenFree} />
                      <ImageIcon size={20} color="rgba(255, 255, 255, 0.3)" style={{ marginLeft: 4 }} />
                    </View>
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
              {hasScreenshot && (
                <View className="flex-row items-center justify-between mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <View className="flex-row items-center">
                    <ImageIcon size={16} color={COLORS.neonPink} />
                    <Text className="text-white/80 text-sm ml-2">Screenshot uploaded</Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      setHasScreenshot(false);
                      setScreenshotBase64(null);
                    }}
                    className="p-1 active:opacity-70"
                  >
                    <X size={16} color="rgba(255, 255, 255, 0.6)" />
                  </Pressable>
                </View>
              )}
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
