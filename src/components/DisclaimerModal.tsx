// Rizz Assist Pro - Disclaimer Modal
import React from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { DISCLAIMER_TEXT, COLORS } from '@/lib/constants';

interface DisclaimerModalProps {
  visible: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ visible, onAccept }: DisclaimerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center px-6">
        <BlurView
          intensity={80}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <View
          className="bg-white rounded-3xl p-6 w-full max-w-md"
          style={{
            shadowColor: COLORS.neonPink,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.gradientStart }}>
            ⚠️ Disclaimer
          </Text>

          <ScrollView className="max-h-64 my-4">
            <Text className="text-gray-700 text-sm leading-5">
              {DISCLAIMER_TEXT}
            </Text>
          </ScrollView>

          <Pressable
            onPress={onAccept}
            className="py-4 rounded-xl items-center active:opacity-80"
            style={{ backgroundColor: COLORS.neonPink }}
          >
            <Text className="text-white font-bold text-lg">
              I Accept
            </Text>
          </Pressable>

          <Text className="text-gray-400 text-xs text-center mt-3">
            By tapping "I Accept", you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </Modal>
  );
}
