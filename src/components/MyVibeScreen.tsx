// Rizz Assist Pro - My Vibe & Profile Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check, ChevronLeft, Sparkles, User, Pencil } from 'lucide-react-native';

import { COLORS } from '@/lib/constants';
import { usePersonaStore, PERSONAS, PersonaId } from '@/lib/personaStore';

interface PersonaCardProps {
  persona: typeof PERSONAS[number];
  isSelected: boolean;
  onSelect: () => void;
}

function PersonaCard({ persona, isSelected, onSelect }: PersonaCardProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect();
      }}
      className="mb-3 active:opacity-90"
    >
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: isSelected ? 'rgba(255, 105, 180, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          borderWidth: 2,
          borderColor: isSelected ? COLORS.neonPink : 'transparent',
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <Text className="text-2xl mr-2">{persona.emoji}</Text>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">{persona.name}</Text>
              <Text className="text-white/60 text-sm">{persona.shortDesc}</Text>
            </View>
          </View>
          {isSelected && (
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: COLORS.neonPink }}
            >
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </View>
          )}
        </View>

        {/* Sample Reply Preview */}
        <View
          className="mt-2 p-3 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <Text className="text-white/50 text-xs mb-1">Sample reply:</Text>
          <Text className="text-white/80 text-sm italic">"{persona.sampleReply}"</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function MyVibeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const loadState = usePersonaStore((s) => s.loadState);
  const savedPersonaId = usePersonaStore((s) => s.selectedPersonaId);
  const savedCustomText = usePersonaStore((s) => s.customPersonaText);
  const savedAboutMe = usePersonaStore((s) => s.aboutMe);
  const saveAll = usePersonaStore((s) => s.saveAll);
  const isLoaded = usePersonaStore((s) => s.isLoaded);

  // Local state for editing
  const [selectedId, setSelectedId] = useState<PersonaId | 'custom'>(savedPersonaId);
  const [customText, setCustomText] = useState(savedCustomText);
  const [aboutMe, setAboutMe] = useState(savedAboutMe);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setSelectedId(savedPersonaId);
      setCustomText(savedCustomText);
      setAboutMe(savedAboutMe);
    }
  }, [isLoaded, savedPersonaId, savedCustomText, savedAboutMe]);

  const handleSave = async () => {
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await saveAll(selectedId, customText, aboutMe);

    setIsSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const hasChanges =
    selectedId !== savedPersonaId ||
    customText !== savedCustomText ||
    aboutMe !== savedAboutMe;

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
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 active:opacity-70"
            >
              <ChevronLeft size={28} color="#FFFFFF" />
            </Pressable>
            <Text className="text-white text-xl font-bold">My Vibe & Profile</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Persona Selection Section */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View className="flex-row items-center mb-4">
                <Sparkles size={20} color={COLORS.neonPink} />
                <Text className="text-white font-bold text-lg ml-2">Choose Your Vibe</Text>
              </View>
              <Text className="text-white/60 text-sm mb-4">
                Pick a personality that matches how you want to come across in your replies
              </Text>

              {PERSONAS.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isSelected={selectedId === persona.id}
                  onSelect={() => setSelectedId(persona.id)}
                />
              ))}
            </Animated.View>

            {/* Custom Persona Section */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mt-6">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedId('custom');
                }}
                className="mb-3"
              >
                <View
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: selectedId === 'custom' ? 'rgba(255, 105, 180, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 2,
                    borderColor: selectedId === 'custom' ? COLORS.neonPink : 'transparent',
                  }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-2">✨</Text>
                      <View>
                        <Text className="text-white font-bold text-base">Custom Vibe</Text>
                        <Text className="text-white/60 text-sm">Define your own style</Text>
                      </View>
                    </View>
                    {selectedId === 'custom' && (
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: COLORS.neonPink }}
                      >
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>

              {selectedId === 'custom' && (
                <View
                  className="rounded-xl p-4 mb-2"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <Text className="text-white/70 text-sm mb-2">
                    Describe your personality/style:
                  </Text>
                  <TextInput
                    value={customText}
                    onChangeText={setCustomText}
                    placeholder="E.g., Sarcastic and witty with dry humor, loves dad jokes..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    multiline
                    numberOfLines={3}
                    className="text-white text-base min-h-[80px]"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>
              )}
            </Animated.View>

            {/* About Me Section */}
            <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mt-8">
              <View className="flex-row items-center mb-2">
                <User size={20} color={COLORS.neonPink} />
                <Text className="text-white font-bold text-lg ml-2">About Me</Text>
              </View>
              <Text className="text-white/60 text-sm mb-4">
                Tell us about yourself to make replies more personalized!
              </Text>

              <View
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <View className="flex-row items-center mb-3">
                  <Pencil size={16} color="rgba(255, 255, 255, 0.6)" />
                  <Text className="text-white/70 text-sm ml-2">
                    Likes, Dislikes, Quirks, etc.
                  </Text>
                </View>
                <TextInput
                  value={aboutMe}
                  onChangeText={setAboutMe}
                  placeholder="E.g., I love hiking and bad puns, hate small talk, my quirk is quoting movies randomly..."
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  multiline
                  numberOfLines={5}
                  className="text-white text-base min-h-[120px]"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              <Text className="text-white/40 text-xs mt-2 ml-1">
                Optional but recommended - helps AI craft replies that sound like you
              </Text>
            </Animated.View>
          </ScrollView>

          {/* Save Button */}
          <View
            className="absolute bottom-0 left-0 right-0 px-5"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <Pressable
              onPress={handleSave}
              disabled={isSaving || !hasChanges}
              className="py-4 rounded-2xl items-center active:opacity-80"
              style={{
                backgroundColor: hasChanges ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                shadowColor: COLORS.neonPink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: hasChanges ? 0.4 : 0,
                shadowRadius: 12,
                elevation: hasChanges ? 6 : 0,
              }}
            >
              <Text
                className="font-bold text-lg"
                style={{ color: hasChanges ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

export default MyVibeScreen;
