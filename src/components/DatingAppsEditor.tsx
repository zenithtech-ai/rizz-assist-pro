// Dating Apps Profile Editor Component
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/lib/constants';
import {
  DATING_APPS,
  DatingAppId,
  APP_PROFILE_FIELDS,
  APP_BEST_PRACTICES,
} from '@/lib/datingAppsKnowledge';
import { optimizeProfile, getFieldCharacterLimit } from '@/lib/profileOptimizer';
import { ChevronDown, Sparkles, Check, AlertCircle } from 'lucide-react-native';

interface DatingAppsEditorProps {
  onProfileSave: (appId: DatingAppId, fields: Record<string, string>) => Promise<void>;
  savedProfiles: Partial<Record<DatingAppId, { appId: DatingAppId; fieldValues: Record<string, string> }>>;
  aboutMe: string;
}

export function DatingAppsEditor({ onProfileSave, savedProfiles, aboutMe }: DatingAppsEditorProps) {
  const [selectedApp, setSelectedApp] = useState<DatingAppId | null>(null);
  const [showAppSelector, setShowAppSelector] = useState(true);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [showOptimizationTips, setShowOptimizationTips] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const appConfig = selectedApp ? APP_PROFILE_FIELDS[selectedApp] : null;
  const bestPractices = selectedApp ? APP_BEST_PRACTICES[selectedApp] : null;

  // Load saved profile when app is selected
  const handleAppSelect = (appId: DatingAppId) => {
    setSelectedApp(appId);
    const saved = savedProfiles[appId]?.fieldValues || ({} as Record<string, string>);
    const config = APP_PROFILE_FIELDS[appId];

    // Initialize with saved values or empty
    const initialized: Record<string, string> = {};
    config.fields.forEach(field => {
      initialized[field.key] = saved[field.key] || '';
    });
    setFieldValues(initialized);
    setShowAppSelector(false);
    setOptimizationResult(null);
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    const limit = getFieldCharacterLimit(selectedApp!, fieldKey);
    if (limit && value.length > limit) {
      return; // Don't allow exceeding limit
    }
    setFieldValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleOptimize = async () => {
    if (!selectedApp) return;

    setIsOptimizing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await optimizeProfile(selectedApp, fieldValues, aboutMe);
    setOptimizationResult(result);

    if (!result.error) {
      setShowOptimizationTips(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setIsOptimizing(false);
  };

  const handleApplySuggestions = () => {
    if (optimizationResult?.optimizedFields) {
      setFieldValues(optimizationResult.optimizedFields);
      setShowOptimizationTips(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSave = async () => {
    if (!selectedApp) return;

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onProfileSave(selectedApp, fieldValues);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowAppSelector(true);
      setSelectedApp(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setIsSaving(false);
  };

  if (showAppSelector || !selectedApp || !appConfig || !bestPractices) {
    return (
      <View className="mb-6">
        <Text className="text-white font-bold text-lg mb-3">Dating Apps Profiles</Text>
        <Text className="text-white/60 text-sm mb-4">
          Optimize your profiles for each dating app with AI-powered suggestions
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          className="mb-4"
        >
          {DATING_APPS.map(app => {
            const hasSaved = !!savedProfiles[app.id];
            return (
              <Pressable
                key={app.id}
                onPress={() => handleAppSelect(app.id)}
                className="mr-3 active:opacity-80"
              >
                <View
                  className="px-4 py-3 rounded-xl items-center min-w-[100px]"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    borderColor: hasSaved ? COLORS.neonPink : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Text className="text-2xl mb-2">{app.emoji}</Text>
                  <Text className="text-white text-xs font-semibold text-center">{app.label}</Text>
                  {hasSaved && (
                    <View className="mt-2">
                      <Check size={14} color={COLORS.neonPink} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Editor view
  return (
    <View className="mb-6">
      {/* Header with back button and app name */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              setShowAppSelector(true);
              setOptimizationResult(null);
            }}
            className="active:opacity-70 mr-3"
          >
            <ChevronDown size={24} color="rgba(255, 255, 255, 0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
          </Pressable>
          <View>
            <Text className="text-white text-lg font-bold">{appConfig.name}</Text>
            <Text className="text-white/50 text-xs">{bestPractices.bioStyle}</Text>
          </View>
        </View>
        <Text className="text-2xl">{DATING_APPS.find(a => a.id === selectedApp)?.emoji}</Text>
      </View>

      {/* Best practices tips */}
      <View
        className="rounded-xl p-3 mb-4"
        style={{ backgroundColor: 'rgba(255, 105, 180, 0.15)' }}
      >
        <Text className="text-white/80 text-xs font-semibold mb-2">Quick Tips:</Text>
        {bestPractices.tips.slice(0, 2).map((tip, i) => (
          <Text key={i} className="text-white/70 text-xs mb-1">
            • {tip}
          </Text>
        ))}
      </View>

      {/* Form fields */}
      {appConfig.fields.map(field => {
        const value = fieldValues[field.key] || '';
        const limit = appConfig.characterLimits[field.key];
        const percentage = Math.round((value.length / limit) * 100);

        return (
          <View key={field.key} className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-semibold text-sm">{field.label}</Text>
              <Text className={`text-xs ${percentage > 90 ? 'text-red-400' : 'text-white/60'}`}>
                {value.length}/{limit}
              </Text>
            </View>

            <View
              className="rounded-lg p-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor:
                  percentage > 100
                    ? 'rgba(255, 100, 100, 0.5)'
                    : percentage > 90
                      ? 'rgba(255, 200, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <TextInput
                value={value}
                onChangeText={v => handleFieldChange(field.key, v)}
                placeholder={field.placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                numberOfLines={field.type === 'long' ? 4 : 2}
                className="text-white text-base"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>
        );
      })}

      {/* Optimize and Save Buttons */}
      <View className="flex-row gap-2 mt-6 mb-4">
        <Pressable
          onPress={handleOptimize}
          disabled={isOptimizing}
          className="flex-1 py-3 rounded-lg active:opacity-80 flex-row items-center justify-center"
          style={{
            backgroundColor: isOptimizing ? 'rgba(255, 105, 180, 0.5)' : COLORS.neonPink,
          }}
        >
          {isOptimizing ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Sparkles size={18} color="#FFF" />
              <Text className="text-white font-bold ml-2">Optimize</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="flex-1 py-3 px-4 rounded-lg active:opacity-80 flex-row items-center justify-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1.5,
            borderColor: COLORS.neonPink,
          }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={COLORS.neonPink} />
          ) : (
            <>
              <Check size={18} color={COLORS.neonPink} />
              <Text className="text-white font-bold ml-2">Save</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Optimization Results Modal */}
      <Modal visible={showOptimizationTips} transparent={true} animationType="slide">
        <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View
            className="mt-auto rounded-t-3xl p-6"
            style={{ backgroundColor: '#1A0D2E' }}
          >
            <Text className="text-white font-bold text-xl mb-4">Optimization Suggestions</Text>

            {optimizationResult?.error ? (
              <View className="flex-row items-center mb-4">
                <AlertCircle size={20} color="#FF6B9D" />
                <Text className="text-red-400 ml-3">{optimizationResult.error}</Text>
              </View>
            ) : (
              <>
                {/* Improvements */}
                {optimizationResult?.improvements && optimizationResult.improvements.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-white/80 font-semibold mb-3">How to Improve:</Text>
                    {optimizationResult.improvements.map((imp: any, idx: number) => (
                      <View
                        key={idx}
                        className="rounded-lg p-3 mb-3"
                        style={{ backgroundColor: 'rgba(255, 105, 180, 0.1)' }}
                      >
                        <Text className="text-white/80 text-sm font-semibold mb-2">{imp.field}</Text>
                        <Text className="text-white/60 text-xs mb-2">Before: {imp.before}</Text>
                        <Text className="text-white/60 text-xs mb-2">Suggestion: {imp.suggestion}</Text>
                        <Text className="text-white/50 text-xs italic">{imp.reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* App-specific tips */}
                {optimizationResult?.tips && optimizationResult.tips.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-white/80 font-semibold mb-3">App-Specific Tips:</Text>
                    {optimizationResult.tips.map((tip: string, idx: number) => (
                      <View key={idx} className="flex-row mb-2">
                        <Text className="text-white/60 mr-2">•</Text>
                        <Text className="text-white/60 text-sm flex-1">{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Apply button */}
                <Pressable
                  onPress={handleApplySuggestions}
                  className="py-4 rounded-lg active:opacity-80 flex-row items-center justify-center mb-3"
                  style={{ backgroundColor: COLORS.neonPink }}
                >
                  <Check size={20} color="#FFF" />
                  <Text className="text-white font-bold ml-2">Apply Suggestions</Text>
                </Pressable>
              </>
            )}

            <Pressable
              onPress={() => setShowOptimizationTips(false)}
              className="py-3 rounded-lg active:opacity-80"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Text className="text-white font-semibold text-center">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
