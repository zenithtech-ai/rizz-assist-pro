// Rizz Assist Pro - Profile Analysis Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Upload,
  Sparkles,
  User,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  X,
  Lock,
  Zap,
  ScanSearch,
  Trash2,
} from 'lucide-react-native';

import { TokenCounter } from '@/components/TokenCounter';
import {
  COLORS,
  TONE_OPTIONS,
  ACTION_OPTIONS,
  ToneId,
  ActionId,
} from '@/lib/constants';
import { useTokenStore } from '@/lib/tokenStore';
import { generateReplies as generateAIReplies } from '@/lib/openai';
import { analyzeProfileScreenshots, generateProfileOpeners } from '@/lib/profileAnalysis';
import { usePersonaStore } from '@/lib/personaStore';

interface AnalysisResult {
  personality: string;
  interests: string[];
  conversationStyle: string;
  suggestedApproach: string;
  error?: string;
}

// Tone button component (reused from HomeScreen)
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

// Opener card with copy functionality
function OpenerCard({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <Pressable
        onPress={handleCopy}
        className="mb-3 active:opacity-90"
      >
        <View
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <Text className="text-white text-base leading-6 mb-3">{text}</Text>
          <View className="flex-row items-center justify-end">
            {copied ? (
              <View className="flex-row items-center">
                <Check size={16} color={COLORS.neonPink} />
                <Text className="text-white/70 text-xs ml-1">Copied!</Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Copy size={16} color="rgba(255, 255, 255, 0.5)" />
                <Text className="text-white/50 text-xs ml-1">Tap to copy</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Paywall gate component for free users
function PaywallGate({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <View className="flex-1 justify-center px-6">
      <Animated.View entering={FadeIn.duration(400)}>
        <View
          className="rounded-3xl p-6 items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 105, 180, 0.3)',
          }}
        >
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-5"
            style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
          >
            <Lock size={40} color={COLORS.neonPink} />
          </View>

          <Text className="text-white font-bold text-2xl text-center mb-3">
            Profile Analysis
          </Text>

          <Text className="text-white/60 text-base text-center leading-6 mb-4">
            Upload screenshots of their dating profile. I'll break down their energy, their tells, and what actually gets a response. Then I'll hand you openers that feel like you wrote them - sharp, personal, impossible to ignore.
          </Text>

          <View className="my-4 w-full">
            <View className="flex-row items-center mb-2">
              <ScanSearch size={18} color={COLORS.neonPink} />
              <Text className="text-white/80 text-sm ml-2">Figure out if they're into teasing, flirting, or bold moves</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Sparkles size={18} color={COLORS.neonPink} />
              <Text className="text-white/80 text-sm ml-2">Get the most effectiive openers tailored to their profile</Text>
            </View>
            <View className="flex-row items-center">
              <User size={18} color={COLORS.neonPink} />
              <Text className="text-white/80 text-sm ml-2">Walk away with the perfect conversation plan</Text>
            </View>
          </View>

          <View
            className="w-full h-px my-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />

          <Text className="text-white/50 text-sm text-center mb-5">
            This feature is available for Silver & Gold subscribers
          </Text>

          <Pressable
            onPress={onUpgrade}
            className="w-full py-4 rounded-2xl flex-row items-center justify-center active:opacity-80"
            style={{
              backgroundColor: COLORS.neonPink,
              shadowColor: COLORS.neonPink,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Zap size={22} color="#FFFFFF" />
            <Text className="text-white font-bold text-lg ml-2">Upgrade to Unlock</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

export function ProfileAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [openers, setOpeners] = useState<string[]>([]);
  const [isGeneratingOpeners, setIsGeneratingOpeners] = useState(false);

  // Tone & Action state for custom generation
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneId>('flirty');
  const [selectedActions, setSelectedActions] = useState<ActionId[]>([]);

  const tokens = useTokenStore((s) => s.tokens);
  const consumeToken = useTokenStore((s) => s.useToken);
  const planType = useTokenStore((s) => s.planType);

  // Get user's About Me from persona store
  const aboutMe = usePersonaStore((s) => s.aboutMe);

  // Check if user has paid plan
  const isPaidUser = planType === 'silver' || planType === 'gold';

  const toggleAction = (actionId: ActionId) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(a => a !== actionId)
        : [...prev, actionId]
    );
  };

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/paywall');
  };

  const handlePickImages = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5,
        quality: 0.5, // Reduced quality for faster processing
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const base64Images = result.assets
          .filter(asset => asset.base64)
          .map(asset => asset.base64 as string);

        setUploadedImages(prev => [...prev, ...base64Images]);
        setAnalysisResult(null);
        setOpeners([]);
        setShowToneSelector(false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleAnalyze = async (images: string[]) => {
    console.log('handleAnalyze called with', images.length, 'images');
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      console.log('Starting analysis...');
      const result = await analyzeProfileScreenshots(images);
      console.log('Analysis result:', result);

      if (result.error) {
        console.error('Analysis error:', result.error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setAnalysisResult({
          personality: 'Error analyzing profile',
          interests: [],
          conversationStyle: 'Please try again',
          suggestedApproach: result.error,
          error: result.error,
        });
      } else {
        console.log('Analysis successful');
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAnalysisResult({
        personality: 'Error analyzing profile',
        interests: [],
        conversationStyle: 'Please try again',
        suggestedApproach: 'An unexpected error occurred',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateFromAnalysis = async () => {
    if (tokens <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    if (!analysisResult || uploadedImages.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const success = consumeToken();
    if (!success) return;

    setIsGeneratingOpeners(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const openersResult = await generateProfileOpeners(analysisResult, aboutMe);
      if (openersResult.openers.length > 0) {
        setOpeners(openersResult.openers);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('Error generating openers:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGeneratingOpeners(false);
    }
  };

  const handleGenerateWithTone = async () => {
    if (tokens <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    if (!analysisResult || uploadedImages.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const success = consumeToken();
    if (!success) return;

    setIsGeneratingOpeners(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Build style string
    const tone = TONE_OPTIONS.find(t => t.id === selectedTone);
    let style = tone?.label || 'Flirty';
    if (selectedActions.length > 0) {
      const actionLabels = selectedActions.map(a =>
        ACTION_OPTIONS.find(opt => opt.id === a)?.label || ''
      ).filter(Boolean);
      style += ' + ' + actionLabels.join(', ');
    }

    try {
      const openersResult = await generateProfileOpeners(analysisResult, aboutMe);
      if (openersResult.openers.length > 0) {
        setOpeners(openersResult.openers);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('Error generating openers:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGeneratingOpeners(false);
      setShowToneSelector(false);
    }
  };

  const handleClearImages = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUploadedImages([]);
    setAnalysisResult(null);
    setOpeners([]);
    setShowToneSelector(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <View className="flex-row items-center">
            <ScanSearch size={22} color={COLORS.neonPink} />
            <Text className="text-white font-bold text-xl ml-2">Profile Analysis & Smart Openers</Text>
          </View>
          <TokenCounter />
        </View>

        {/* Show paywall gate for free users */}
        {!isPaidUser ? (
          <PaywallGate onUpgrade={handleUpgrade} />
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Upload Section */}
            {uploadedImages.length === 0 ? (
              <Animated.View entering={FadeIn.duration(400)}>
                <Pressable
                  onPress={handlePickImages}
                  className="active:opacity-90"
                >
                  <View
                    className="rounded-3xl p-8 items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderWidth: 2,
                      borderColor: 'rgba(255, 105, 180, 0.3)',
                      borderStyle: 'dashed',
                      minHeight: 200,
                    }}
                  >
                    <View
                      className="w-16 h-16 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
                    >
                      <Upload size={32} color={COLORS.neonPink} />
                    </View>
                    <Text className="text-white font-bold text-lg mb-2">
                      Upload Dating Profile Screenshot(s)
                    </Text>
                    <Text className="text-white/50 text-sm text-center">
                      Upload 1-5 screenshots to analyze their profile{'\n'}and generate personalized openers
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn.duration(300)} className="mb-6">
                {/* Uploaded indicator */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <ImageIcon size={18} color={COLORS.neonPink} />
                    <Text className="text-white font-semibold text-base ml-2">
                      {uploadedImages.length} screenshot{uploadedImages.length > 1 ? 's' : ''} selected
                    </Text>
                  </View>
                </View>

                {/* Image Gallery */}
                <View className="mb-4">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexGrow: 0 }}
                  >
                    {uploadedImages.map((base64, index) => (
                      <Animated.View
                        key={index}
                        entering={FadeInDown.delay(index * 100).duration(300)}
                        className="mr-3"
                      >
                        <View
                          className="relative rounded-2xl overflow-hidden"
                          style={{ width: 140, height: 180 }}
                        >
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${base64}` }}
                            style={{ width: '100%', height: '100%' }}
                          />
                          {/* Delete button overlay */}
                          <Pressable
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setUploadedImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-2 right-2 active:opacity-60"
                          >
                            <View
                              className="w-8 h-8 rounded-full items-center justify-center"
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            >
                              <Trash2 size={16} color="#FFFFFF" />
                            </View>
                          </Pressable>
                        </View>
                      </Animated.View>
                    ))}
                  </ScrollView>
                </View>

                {/* Add more images button */}
                <Pressable
                  onPress={handlePickImages}
                  className="mb-4 active:opacity-80"
                >
                  <View
                    className="py-3 rounded-xl flex-row items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Upload size={18} color="rgba(255, 255, 255, 0.7)" />
                    <Text className="text-white/70 font-medium text-sm ml-2">
                      Add more screenshots
                    </Text>
                  </View>
                </Pressable>

                {/* Submit button */}
                <Pressable
                  onPress={() => handleAnalyze(uploadedImages)}
                  disabled={isAnalyzing}
                  className="active:opacity-80"
                >
                  <View
                    className="py-4 rounded-2xl flex-row items-center justify-center"
                    style={{
                      backgroundColor: isAnalyzing ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                      shadowColor: COLORS.neonPink,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text className="text-white font-bold text-base ml-2">Analyzing...</Text>
                      </>
                    ) : (
                      <>
                        <ScanSearch size={22} color="#FFFFFF" />
                        <Text className="text-white font-bold text-base ml-2">Analyze Profile</Text>
                      </>
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            )}

            {/* Analyzing State */}
            {isAnalyzing && (
              <Animated.View entering={FadeIn.duration(300)} className="items-center py-8">
                <ActivityIndicator size="large" color={COLORS.neonPink} />
                <Text className="text-white/70 text-base mt-4">Analyzing profile...</Text>
              </Animated.View>
            )}

            {/* Analysis Result Card */}
            {analysisResult && !isAnalyzing && (
              <Animated.View entering={FadeInDown.duration(400)} className="mb-6">
                <View
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 105, 180, 0.3)',
                  }}
                >
                  <View className="flex-row items-center mb-4">
                    <Sparkles size={20} color={COLORS.neonPink} />
                    <Text className="text-white font-bold text-lg ml-2">Analysis Results</Text>
                  </View>

                  <View className="mb-3">
                    <Text className="text-white/50 text-xs mb-1">PERSONALITY</Text>
                    <Text className="text-white text-base">{analysisResult.personality}</Text>
                  </View>

                  <View className="mb-3">
                    <Text className="text-white/50 text-xs mb-1">INTERESTS</Text>
                    <View className="flex-row flex-wrap">
                      {analysisResult.interests.map((interest, i) => (
                        <View
                          key={i}
                          className="px-3 py-1 rounded-full mr-2 mb-2"
                          style={{ backgroundColor: 'rgba(255, 105, 180, 0.2)' }}
                        >
                          <Text className="text-white text-sm">{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className="mb-3">
                    <Text className="text-white/50 text-xs mb-1">CONVERSATION STYLE</Text>
                    <Text className="text-white text-base">{analysisResult.conversationStyle}</Text>
                  </View>

                  <View>
                    <Text className="text-white/50 text-xs mb-1">SUGGESTED APPROACH</Text>
                    <Text className="text-white text-base">{analysisResult.suggestedApproach}</Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Generate Options - Only show after analysis */}
            {analysisResult && !isAnalyzing && openers.length === 0 && (
              <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                {/* Generate from Analysis Button */}
                <Pressable
                  onPress={handleGenerateFromAnalysis}
                  disabled={isGeneratingOpeners}
                  className="mb-4 active:opacity-80"
                >
                  <View
                    className="py-4 rounded-2xl flex-row items-center justify-center"
                    style={{
                      backgroundColor: isGeneratingOpeners ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                      shadowColor: COLORS.neonPink,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 6,
                    }}
                  >
                    <Sparkles size={22} color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-2">
                      {isGeneratingOpeners ? 'Generating...' : 'Suggest Openers from Analysis'}
                    </Text>
                  </View>
                </Pressable>

                {/* Or Use Tone & Action */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowToneSelector(!showToneSelector);
                  }}
                  className="mb-4 active:opacity-80"
                >
                  <View
                    className="py-3 rounded-xl flex-row items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Text className="text-white/80 font-medium text-base">Or Use Tone & Action</Text>
                    {showToneSelector ? (
                      <ChevronUp size={20} color="rgba(255, 255, 255, 0.6)" style={{ marginLeft: 8 }} />
                    ) : (
                      <ChevronDown size={20} color="rgba(255, 255, 255, 0.6)" style={{ marginLeft: 8 }} />
                    )}
                  </View>
                </Pressable>

                {/* Tone & Action Selector */}
                {showToneSelector && (
                  <Animated.View entering={FadeIn.duration(300)} className="mb-4">
                    {/* Tone Selection */}
                    <Text className="text-white font-bold text-base mb-3">Choose Your Tone</Text>
                    <View className="flex-row flex-wrap mb-4">
                      {TONE_OPTIONS.map((tone) => (
                        <ToneButton
                          key={tone.id}
                          tone={tone}
                          isSelected={selectedTone === tone.id}
                          onPress={() => setSelectedTone(tone.id)}
                        />
                      ))}
                    </View>

                    {/* Action Chips */}
                    <Text className="text-white font-bold text-base mb-3">
                      Action / Intent <Text className="text-white/50 font-normal">(optional)</Text>
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ flexGrow: 0 }}
                      className="mb-4"
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

                    {/* Generate with Tone Button */}
                    <Pressable
                      onPress={handleGenerateWithTone}
                      disabled={isGeneratingOpeners}
                      className="active:opacity-80"
                    >
                      <View
                        className="py-4 rounded-2xl flex-row items-center justify-center"
                        style={{
                          backgroundColor: isGeneratingOpeners ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
                        }}
                      >
                        <Sparkles size={20} color="#FFFFFF" />
                        <Text className="text-white font-bold text-base ml-2">
                          {isGeneratingOpeners ? 'Generating...' : 'Generate with Selected Tone'}
                        </Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                )}
              </Animated.View>
            )}

            {/* Generated Openers */}
            {openers.length > 0 && (
              <Animated.View entering={FadeIn.duration(400)}>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white font-bold text-lg">Suggested Openers</Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setOpeners([]);
                    }}
                    className="active:opacity-70"
                  >
                    <Text className="text-white/50 text-sm">Generate new</Text>
                  </Pressable>
                </View>

                {openers.map((opener, index) => (
                  <OpenerCard key={index} text={opener} index={index} />
                ))}
              </Animated.View>
            )}
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

export default ProfileAnalysisScreen;
