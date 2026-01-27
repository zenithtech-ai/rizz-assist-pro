// Rizz Assist Pro - Reply Generator Page
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
  Lock,
  Check,
  Crown,
  ChevronLeft,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import { ReplyBubble } from '@/components/ReplyBubble';
import { useTokenStore } from '@/lib/tokenStore';
import { usePersonaStore } from '@/lib/personaStore';
import {
  COLORS,
  TONE_OPTIONS,
  ACTION_OPTIONS,
  ToneId,
  ActionId,
  FREE_TOKEN_LIMIT,
} from '@/lib/constants';
import { generateReplies as generateLocalReplies, ResponseLength } from '@/lib/replyGenerator';
import { generateReplies as generateAIReplies } from '@/lib/openai';

// Tone button component
function ToneButton({
  tone,
  isSelected,
  onPress,
}: {
  tone: typeof TONE_OPTIONS[number];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="mr-2 mb-2 active:opacity-80"
    >
      <View
        className="px-3 py-2 rounded-xl flex-row items-center"
        style={{
          backgroundColor: isSelected ? 'rgba(255, 105, 180, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1.5,
          borderColor: isSelected ? COLORS.neonPink : 'transparent',
        }}
      >
        <Text className="text-base mr-1">{tone.emoji}</Text>
        <Text
          className="text-sm font-medium"
          style={{ color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
        >
          {tone.label}
        </Text>
      </View>
    </Pressable>
  );
}

// Action chip component (multiple select)
function ActionChip({
  action,
  isSelected,
  onPress,
}: {
  action: typeof ACTION_OPTIONS[number];
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      className="mr-3 active:opacity-80"
    >
      <View
        className="px-4 py-2.5 rounded-full flex-row items-center"
        style={{
          backgroundColor: isSelected ? 'rgba(255, 105, 180, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1.5,
          borderColor: isSelected ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
        }}
      >
        {isSelected && (
          <View className="mr-1.5">
            <Check size={14} color={COLORS.neonPink} strokeWidth={3} />
          </View>
        )}
        <Text className="text-base mr-1.5">{action.emoji}</Text>
        <Text
          className="text-sm font-semibold"
          style={{ color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
        >
          {action.label}
        </Text>
      </View>
    </Pressable>
  );
}

// Teaser card for About Me upgrade
function AboutMeTeaserCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <Animated.View entering={FadeIn.delay(100).duration(400)}>
      <View
        className="rounded-2xl p-4 mb-4"
        style={{
          backgroundColor: 'rgba(255, 105, 180, 0.15)',
          borderWidth: 1,
          borderColor: 'rgba(255, 105, 180, 0.3)',
        }}
      >
        <View className="flex-row items-start">
          <Crown size={22} color={COLORS.neonPink} />
          <View className="flex-1 ml-3">
            <Text className="text-white font-bold text-base mb-1">
              Want even better, personalized replies?
            </Text>
            <Text className="text-white/60 text-sm mb-3">
              Add your About Me to get replies that sound 100% like you
            </Text>
            <Pressable
              onPress={onUpgrade}
              className="self-start px-4 py-2 rounded-full active:opacity-80"
              style={{ backgroundColor: COLORS.neonPink }}
            >
              <Text className="text-white font-semibold text-sm">Upgrade</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ReplyGeneratorPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneId>('flirty');
  const [selectedActions, setSelectedActions] = useState<ActionId[]>([]);
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

  // Get About Me from persona store
  const aboutMe = usePersonaStore((s) => s.aboutMe);

  // Screenshot is only available for paid users
  const screenshotEnabled = planType !== 'free';

  // Check if user has paid plan for About Me
  const isPaidUser = planType === 'silver' || planType === 'gold';

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

  const toggleAction = (actionId: ActionId) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(a => a !== actionId)
        : [...prev, actionId]
    );
  };

  // Build style string from tone + actions
  const buildStyleString = (): string => {
    const tone = TONE_OPTIONS.find(t => t.id === selectedTone);
    let style = tone?.label || 'Flirty';

    if (selectedActions.length > 0) {
      const actionLabels = selectedActions.map(a =>
        ACTION_OPTIONS.find(opt => opt.id === a)?.label || ''
      ).filter(Boolean);
      style += ' + ' + actionLabels.join(', ');
    }

    return style;
  };

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
      const styleString = buildStyleString();
      console.log('Generating replies with:', {
        hasText: !!message.trim(),
        hasImage: !!screenshotBase64,
        style: styleString,
      });

      const result = await generateAIReplies({
        conversationText: message.trim() || undefined,
        imageBase64: screenshotBase64 || undefined,
        style: styleString,
        count: 3,
        userPersona: styleString,
        userAboutMe: isPaidUser && aboutMe?.trim() ? aboutMe : '',
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
          const localReplies = generateLocalReplies(message, 'flirty', responseLength);
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
        const localReplies = generateLocalReplies(message, 'flirty', responseLength);
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
                router.back();
              }}
              className="flex-row items-center active:opacity-70"
            >
              <ChevronLeft size={20} color="rgba(255, 255, 255, 0.7)" />
              <Text className="text-white/60 text-sm ml-1">Back</Text>
            </Pressable>
            <Text className="text-white font-bold text-lg">Generate Replies</Text>
            <TokenCounter />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Generated Replies with Teaser Card */}
            {generatedReplies.length > 0 && (
              <Animated.View entering={FadeIn}>
                {/* Teaser card for non-paid users without About Me */}
                {!isPaidUser && (
                  <AboutMeTeaserCard
                    onUpgrade={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push('/my-vibe');
                    }}
                  />
                )}

                <Text className="text-white font-bold text-lg mb-3">
                  Tap to copy
                </Text>
                {generatedReplies.map((reply, index) => (
                  <ReplyBubble key={index} text={reply} index={index} />
                ))}

                <View className="h-6" />
              </Animated.View>
            )}

            {/* Message Input with Image Button */}
            <View className="mb-5">
              <Text className="text-white/50 text-xs mb-2 ml-1">
                Paste message or upload screenshot
              </Text>
              <View
                className="bg-white/10 rounded-2xl p-4"
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white/70 text-sm font-medium" style={{ flex: 1, marginRight: 8 }}>
                    {screenshotEnabled
                      ? 'Their message'
                      : 'Their message (screenshots: upgrade required)'}
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
                  placeholder="What did they say to you?"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  multiline
                  numberOfLines={4}
                  className="text-white text-base min-h-[80px]"
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
            </View>

            {/* Tone Selection */}
            <View className="mb-5">
              <Text className="text-white/50 text-xs mb-2 ml-1">
                Choose your tone and action
              </Text>
              <Text className="text-white font-bold text-lg mb-3">
                Choose Your Tone
              </Text>
              <View className="flex-row flex-wrap">
                {TONE_OPTIONS.map((tone) => (
                  <ToneButton
                    key={tone.id}
                    tone={tone}
                    isSelected={selectedTone === tone.id}
                    onPress={() => setSelectedTone(tone.id)}
                  />
                ))}
              </View>
            </View>

            {/* Action/Intent Chips */}
            <View className="mb-6">
              <Text className="text-white font-bold text-base mb-3">
                Action / Intent <Text className="text-white/50 font-normal">(optional)</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
              >
                {ACTION_OPTIONS.map((action) => (
                  <ActionChip
                    key={action.id}
                    action={action}
                    isSelected={selectedActions.includes(action.id)}
                    onPress={() => toggleAction(action.id)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Response Length Toggle - Now above Generate button */}
            <View className="mb-4">
              <Text className="text-white font-bold text-base mb-3">
                Length
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setResponseLength('short')}
                  className="flex-1 py-2.5 px-4 rounded-xl active:opacity-80"
                  style={{
                    backgroundColor: responseLength === 'short' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Text
                    className="font-semibold text-center text-sm"
                    style={{ color: responseLength === 'short' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Short (1 sentence)
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setResponseLength('long')}
                  className="flex-1 py-2.5 px-4 rounded-xl active:opacity-80"
                  style={{
                    backgroundColor: responseLength === 'long' ? COLORS.neonPink : 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Text
                    className="font-semibold text-center text-sm"
                    style={{ color: responseLength === 'long' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Long (2-3 sentences)
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Generate Button */}
            <View className="mb-2">
              <Text className="text-white/50 text-xs text-center mb-3">
                Ready? Generate
              </Text>
              <Animated.View
                style={[
                  {
                    shadowColor: COLORS.neonPink,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 24,
                    elevation: 12,
                  },
                  animatedGlowStyle,
                ]}
              >
                <Pressable
                  onPress={handleGenerate}
                  disabled={isGenerating}
                  className="py-4 rounded-2xl flex-row items-center justify-center active:opacity-80"
                  style={{
                    backgroundColor: isGenerating ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                  }}
                >
                  <Sparkles size={24} color="#FFFFFF" />
                  <Text className="text-white font-bold text-lg ml-2">
                    {isGenerating ? 'Generating...' : 'Generate Replies'}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
