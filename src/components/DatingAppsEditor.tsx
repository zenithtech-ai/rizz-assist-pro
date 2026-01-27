// Dating Apps Profile Editor Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/lib/constants';
import {
  DATING_APPS,
  DatingAppId,
  APP_PROFILE_FIELDS,
  APP_BEST_PRACTICES,
} from '@/lib/datingAppsKnowledge';
import { optimizeProfile, getFieldCharacterLimit } from '@/lib/profileOptimizer';
import { Sparkles, Check, AlertCircle, ChevronUp, ChevronDown, Trash2, Copy } from 'lucide-react-native';

interface DatingAppsEditorProps {
  onProfileSave: (appId: DatingAppId, fields: Record<string, string>) => Promise<void>;
  onProfileDelete: (appId: DatingAppId) => Promise<void>;
  savedProfiles: Partial<Record<DatingAppId, { appId: DatingAppId; fieldValues: Record<string, string> }>>;
  aboutMe: string;
  autoExpandAppId?: DatingAppId | null;
  hideHeader?: boolean;
  singleAppMode?: boolean;
  onSaveSuccess?: () => void;
}

interface AppEditState {
  fieldValues: Record<string, string>;
  isOptimizing: boolean;
  optimizationResult: any;
  showOptimizationTips: boolean;
  isSaving: boolean;
}

export function DatingAppsEditor({ onProfileSave, onProfileDelete, savedProfiles, aboutMe, autoExpandAppId, hideHeader, singleAppMode, onSaveSuccess }: DatingAppsEditorProps) {
  const [expandedApps, setExpandedApps] = useState<Set<DatingAppId>>(
    autoExpandAppId && !singleAppMode ? new Set([autoExpandAppId]) : (singleAppMode && autoExpandAppId ? new Set([autoExpandAppId]) : new Set())
  );
  const [appStates, setAppStates] = useState<Partial<Record<DatingAppId, AppEditState>>>({});
  const [deleteConfirmAppId, setDeleteConfirmAppId] = useState<DatingAppId | null>(null);
  const [copiedFieldKey, setCopiedFieldKey] = useState<string | null>(null);

  // Initialize state for auto-expanded app
  useEffect(() => {
    if (autoExpandAppId && !appStates[autoExpandAppId]) {
      const saved = savedProfiles[autoExpandAppId]?.fieldValues || ({} as Record<string, string>);
      const config = APP_PROFILE_FIELDS[autoExpandAppId];
      const initialized: Record<string, string> = {};
      config.fields.forEach(field => {
        initialized[field.key] = saved[field.key] || '';
      });
      setAppStates(prev => ({
        ...prev,
        [autoExpandAppId]: {
          fieldValues: initialized,
          isOptimizing: false,
          optimizationResult: null,
          showOptimizationTips: false,
          isSaving: false,
        },
      }));
    }
  }, [autoExpandAppId]);

  const toggleApp = (appId: DatingAppId) => {
    const newExpanded = new Set(expandedApps);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
      // Initialize state for this app if not already done
      if (!appStates[appId]) {
        const saved = savedProfiles[appId]?.fieldValues || ({} as Record<string, string>);
        const config = APP_PROFILE_FIELDS[appId];
        const initialized: Record<string, string> = {};
        config.fields.forEach(field => {
          initialized[field.key] = saved[field.key] || '';
        });
        setAppStates(prev => ({
          ...prev,
          [appId]: {
            fieldValues: initialized,
            isOptimizing: false,
            optimizationResult: null,
            showOptimizationTips: false,
            isSaving: false,
          },
        }));
      }
    }
    setExpandedApps(newExpanded);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateFieldValue = (appId: DatingAppId, fieldKey: string, value: string) => {
    const limit = getFieldCharacterLimit(appId, fieldKey);
    if (limit && value.length > limit) {
      return;
    }
    setAppStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId]!,
        fieldValues: { ...prev[appId]!.fieldValues, [fieldKey]: value },
      },
    }));
  };

  const handleCopyField = async (fieldKey: string, value: string) => {
    if (!value.trim()) return;
    await Clipboard.setStringAsync(value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedFieldKey(fieldKey);
    setTimeout(() => setCopiedFieldKey(null), 1500);
  };

  const handleOptimize = async (appId: DatingAppId) => {
    const state = appStates[appId];
    if (!state) return;

    setAppStates(prev => ({
      ...prev,
      [appId]: { ...prev[appId]!, isOptimizing: true },
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await optimizeProfile(appId, state.fieldValues, aboutMe);
    setAppStates(prev => ({
      ...prev,
      [appId]: {
        ...prev[appId]!,
        isOptimizing: false,
        optimizationResult: result,
        showOptimizationTips: !result.error,
      },
    }));

    if (!result.error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleApplySuggestions = (appId: DatingAppId) => {
    const state = appStates[appId];
    if (state?.optimizationResult?.optimizedFields) {
      setAppStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId]!,
          fieldValues: state.optimizationResult.optimizedFields,
          showOptimizationTips: false,
        },
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSave = async (appId: DatingAppId) => {
    const state = appStates[appId];
    if (!state) return;

    setAppStates(prev => ({
      ...prev,
      [appId]: { ...prev[appId]!, isSaving: true },
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Call the parent's save function with the current field values
      await onProfileSave(appId, state.fieldValues);
      console.log('Profile saved successfully for', appId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Only collapse if not in single app mode
      if (!singleAppMode) {
        const newExpanded = new Set(expandedApps);
        newExpanded.delete(appId);
        setExpandedApps(newExpanded);
      } else {
        // In single app mode, call the success callback to navigate back
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }

      // Reset optimization state
      setAppStates(prev => ({
        ...prev,
        [appId]: {
          ...prev[appId]!,
          isSaving: false,
          optimizationResult: null,
          showOptimizationTips: false,
        },
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAppStates(prev => ({
        ...prev,
        [appId]: { ...prev[appId]!, isSaving: false },
      }));
    }
  };

  const handleDelete = async (appId: DatingAppId) => {
    await onProfileDelete(appId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Only collapse if not in single app mode
    if (!singleAppMode) {
      const newExpanded = new Set(expandedApps);
      newExpanded.delete(appId);
      setExpandedApps(newExpanded);
    }
    // Clear the delete confirmation
    setDeleteConfirmAppId(null);
  };

  return (
    <View className="mb-6">
      {!hideHeader && autoExpandAppId && (
        <>
          <Text className="text-white font-bold text-lg mb-3">
            Your {DATING_APPS.find(app => app.id === autoExpandAppId)?.label} Profile
          </Text>
          <Text className="text-white/60 text-sm mb-4">
            Optimize your {DATING_APPS.find(app => app.id === autoExpandAppId)?.label} profile with AI-powered suggestions
          </Text>
        </>
      )}
      {!hideHeader && !autoExpandAppId && (
        <>
          <Text className="text-white font-bold text-lg mb-3">Dating Apps Profiles</Text>
          <Text className="text-white/60 text-sm mb-4">
            Optimize your profiles for each dating app with AI-powered suggestions
          </Text>
        </>
      )}

      {/* Dating Apps List */}
      {DATING_APPS.filter(app => singleAppMode && autoExpandAppId ? app.id === autoExpandAppId : true).map(app => {
        const isExpanded = expandedApps.has(app.id);
        const state = appStates[app.id];
        const hasSaved = !!savedProfiles[app.id];
        const appConfig = APP_PROFILE_FIELDS[app.id];
        const bestPractices = APP_BEST_PRACTICES[app.id];

        return (
          <Animated.View
            key={app.id}
            entering={FadeInDown.duration(300)}
            className="mb-3"
          >
            {/* App Header - Always Visible */}
            <Pressable
              onPress={() => !singleAppMode && toggleApp(app.id)}
              className="active:opacity-70"
            >
              <View
                className="rounded-xl p-4 flex-row items-center justify-between"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderWidth: 1,
                  borderColor: isExpanded
                    ? COLORS.neonPink
                    : hasSaved
                      ? 'rgba(255, 105, 180, 0.3)'
                      : 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{app.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">{app.label}</Text>
                    {hasSaved && (
                      <Text className="text-white/50 text-xs mt-1">Profile saved</Text>
                    )}
                  </View>
                </View>
                {hasSaved && !isExpanded && (
                  <Check size={18} color={COLORS.neonPink} />
                )}
                {isExpanded ? (
                  <ChevronUp size={20} color={COLORS.neonPink} />
                ) : (
                  <ChevronDown size={20} color="rgba(255, 255, 255, 0.5)" />
                )}
              </View>
            </Pressable>

            {/* Expanded Content */}
            {isExpanded && state && (
              <View
                className="rounded-b-xl p-4 mt-0"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderWidth: 1,
                  borderTopWidth: 0,
                  borderColor: COLORS.neonPink,
                }}
              >
                {/* Best practices tips */}
                <View
                  className="rounded-lg p-3 mb-4"
                  style={{ backgroundColor: 'rgba(255, 105, 180, 0.15)' }}
                >
                  <Text className="text-white/80 text-xs font-semibold mb-2">Quick Tips:</Text>
                  {bestPractices.tips.slice(0, 2).map((tip: string, i: number) => (
                    <Text key={i} className="text-white/70 text-xs mb-1">
                      • {tip}
                    </Text>
                  ))}
                </View>

                {/* Form fields */}
                {appConfig.fields.map(field => {
                  const value = state.fieldValues[field.key] || '';
                  const limit = appConfig.characterLimits[field.key];
                  const percentage = Math.round((value.length / limit) * 100);
                  const isCopied = copiedFieldKey === field.key;

                  return (
                    <View key={field.key} className="mb-4">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-white font-semibold text-sm">{field.label}</Text>
                        <View className="flex-row items-center">
                          <Text
                            className={`text-xs mr-2 ${
                              percentage > 90 ? 'text-red-400' : 'text-white/60'
                            }`}
                          >
                            {value.length}/{limit}
                          </Text>
                          {value.trim().length > 0 && (
                            <Pressable
                              onPress={() => handleCopyField(field.key, value)}
                              className="active:opacity-70 p-1"
                            >
                              {isCopied ? (
                                <Check size={16} color={COLORS.neonPink} />
                              ) : (
                                <Copy size={16} color="rgba(255, 255, 255, 0.5)" />
                              )}
                            </Pressable>
                          )}
                        </View>
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
                          onChangeText={v => updateFieldValue(app.id, field.key, v)}
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
                <View className="flex-row gap-2 mt-6">
                  <Pressable
                    onPress={() => handleOptimize(app.id)}
                    disabled={state.isOptimizing}
                    className="flex-1 py-3 rounded-lg active:opacity-80 flex-row items-center justify-center"
                    style={{
                      backgroundColor: state.isOptimizing
                        ? 'rgba(255, 105, 180, 0.5)'
                        : COLORS.neonPink,
                    }}
                  >
                    {state.isOptimizing ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Sparkles size={18} color="#FFF" />
                        <Text className="text-white font-bold ml-2">Optimize</Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => handleSave(app.id)}
                    disabled={state.isSaving}
                    className="flex-1 py-3 px-4 rounded-lg active:opacity-80 flex-row items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1.5,
                      borderColor: COLORS.neonPink,
                    }}
                  >
                    {state.isSaving ? (
                      <ActivityIndicator size="small" color={COLORS.neonPink} />
                    ) : (
                      <>
                        <Check size={18} color={COLORS.neonPink} />
                        <Text className="text-white font-bold ml-2">Save</Text>
                      </>
                    )}
                  </Pressable>

                  {hasSaved && (
                    <Pressable
                      onPress={() => setDeleteConfirmAppId(app.id)}
                      className="py-3 px-3 rounded-lg active:opacity-80"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1.5,
                        borderColor: 'rgba(255, 100, 100, 0.6)',
                      }}
                    >
                      <Trash2 size={18} color="rgba(255, 100, 100, 0.8)" />
                    </Pressable>
                  )}
                </View>

                {/* Optimization Results Modal */}
                <Modal
                  visible={state.showOptimizationTips}
                  transparent={true}
                  animationType="slide"
                >
                  <View
                    className="flex-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <View
                      className="mt-auto rounded-t-3xl p-6"
                      style={{ backgroundColor: '#1A0D2E', maxHeight: '80%' }}
                    >
                      <Text className="text-white font-bold text-xl mb-4">
                        Optimization Suggestions
                      </Text>

                      {state.optimizationResult?.error ? (
                        <View className="flex-row items-center mb-4">
                          <AlertCircle size={20} color="#FF6B9D" />
                          <Text className="text-red-400 ml-3">
                            {state.optimizationResult.error}
                          </Text>
                        </View>
                      ) : (
                        <>
                          {/* Improvements */}
                          {state.optimizationResult?.improvements &&
                            state.optimizationResult.improvements.length > 0 && (
                              <View className="mb-6">
                                <Text className="text-white/80 font-semibold mb-3">
                                  How to Improve:
                                </Text>
                                {state.optimizationResult.improvements.map(
                                  (imp: any, idx: number) => (
                                    <View
                                      key={idx}
                                      className="rounded-lg p-3 mb-3"
                                      style={{
                                        backgroundColor:
                                          'rgba(255, 105, 180, 0.1)',
                                      }}
                                    >
                                      <Text className="text-white/80 text-sm font-semibold mb-2">
                                        {imp.field}
                                      </Text>
                                      <Text className="text-white/60 text-xs mb-2">
                                        Before: {imp.before}
                                      </Text>
                                      <Text className="text-white/60 text-xs mb-2">
                                        Suggestion: {imp.suggestion}
                                      </Text>
                                      <Text className="text-white/50 text-xs italic">
                                        {imp.reason}
                                      </Text>
                                    </View>
                                  )
                                )}
                              </View>
                            )}

                          {/* App-specific tips */}
                          {state.optimizationResult?.tips &&
                            state.optimizationResult.tips.length > 0 && (
                              <View className="mb-6">
                                <Text className="text-white/80 font-semibold mb-3">
                                  App-Specific Tips:
                                </Text>
                                {state.optimizationResult.tips.map(
                                  (tip: string, idx: number) => (
                                    <View key={idx} className="flex-row mb-2">
                                      <Text className="text-white/60 mr-2">
                                        •
                                      </Text>
                                      <Text className="text-white/60 text-sm flex-1">
                                        {tip}
                                      </Text>
                                    </View>
                                  )
                                )}
                              </View>
                            )}

                          {/* Apply button */}
                          <Pressable
                            onPress={() => handleApplySuggestions(app.id)}
                            className="py-4 rounded-lg active:opacity-80 flex-row items-center justify-center mb-3"
                            style={{ backgroundColor: COLORS.neonPink }}
                          >
                            <Check size={20} color="#FFF" />
                            <Text className="text-white font-bold ml-2">
                              Apply Suggestions
                            </Text>
                          </Pressable>
                        </>
                      )}

                      <Pressable
                        onPress={() =>
                          setAppStates(prev => ({
                            ...prev,
                            [app.id]: {
                              ...prev[app.id]!,
                              showOptimizationTips: false,
                            },
                          }))
                        }
                        className="py-3 rounded-lg active:opacity-80"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Text className="text-white font-semibold text-center">
                          Close
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                  visible={deleteConfirmAppId === app.id}
                  transparent={true}
                  animationType="fade"
                >
                  <View
                    className="flex-1 items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <View
                      className="rounded-2xl p-6 mx-6"
                      style={{ backgroundColor: '#1A0D2E', minWidth: '80%' }}
                    >
                      <Text className="text-white font-bold text-lg mb-4">
                        Delete Profile?
                      </Text>

                      <Text className="text-white/70 text-sm mb-6">
                        Are you sure you want to delete all text in your {app.label} profile? This action cannot be undone.
                      </Text>

                      <View className="flex-row gap-3">
                        <Pressable
                          onPress={() => setDeleteConfirmAppId(null)}
                          className="flex-1 py-3 rounded-lg active:opacity-80"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1.5,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <Text className="text-white font-semibold text-center">
                            Cancel
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => handleDelete(app.id)}
                          className="flex-1 py-3 rounded-lg active:opacity-80 flex-row items-center justify-center"
                          style={{
                            backgroundColor: 'rgba(255, 100, 100, 0.7)',
                          }}
                        >
                          <Trash2 size={18} color="#FFF" />
                          <Text className="text-white font-bold ml-2">
                            Delete
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

