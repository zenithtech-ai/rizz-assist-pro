import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/lib/authStore';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuthStore();

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing info', 'Please enter your email and password');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Google OAuth once credentials are set up
    Alert.alert('Coming Soon', 'Google sign-in will be available once OAuth is configured');
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Missing email', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Check your email',
        'We sent you a password reset link. Check your inbox!',
        [{ text: 'OK', onPress: () => setMode('login') }]
      );
    } catch (error: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password screen
  if (mode === 'forgot') {
    return (
      <View className="flex-1 bg-black">
        <LinearGradient
          colors={['#0f0f0f', '#1a1a2e', '#16213e', '#0f0f0f']}
          locations={[0, 0.3, 0.6, 1]}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
        <View
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(236, 72, 153, 0.15)',
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + 60,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMode('login');
              }}
              className="flex-row items-center mb-8"
            >
              <ArrowLeft size={20} color="#9ca3af" />
              <Text
                style={{ fontFamily: 'Inter_500Medium' }}
                className="text-gray-400 ml-2"
              >
                Back to login
              </Text>
            </Pressable>

            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text
                style={{ fontFamily: 'Outfit_700Bold' }}
                className="text-white text-3xl mb-2"
              >
                Reset Password
              </Text>
              <Text
                style={{ fontFamily: 'Inter_400Regular' }}
                className="text-gray-400 text-base mb-10"
              >
                Enter your email and we'll send you a reset link
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).springify()}>
              <BlurView
                intensity={40}
                tint="dark"
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <View className="p-6">
                  <View className="mb-6">
                    <Text
                      style={{ fontFamily: 'Inter_500Medium' }}
                      className="text-gray-300 text-sm mb-2"
                    >
                      Email
                    </Text>
                    <View className="flex-row items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <Mail size={20} color="#9ca3af" />
                      <TextInput
                        className="flex-1 text-white text-base ml-3"
                        style={{ fontFamily: 'Inter_400Regular' }}
                        placeholder="your@email.com"
                        placeholderTextColor="#6b7280"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                  </View>

                  <Animated.View style={animatedButtonStyle}>
                    <Pressable
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      onPress={handleForgotPassword}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#ec4899', '#8b5cf6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: 14,
                          paddingVertical: 16,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text
                            style={{ fontFamily: 'Outfit_600SemiBold' }}
                            className="text-white text-lg"
                          >
                            Send Reset Link
                          </Text>
                        )}
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Background gradient */}
      <LinearGradient
        colors={['#0f0f0f', '#1a1a2e', '#16213e', '#0f0f0f']}
        locations={[0, 0.3, 0.6, 1]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      {/* Decorative elements */}
      <View
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: 'rgba(236, 72, 153, 0.15)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View className="flex-row items-center mb-2">
              <Sparkles size={28} color="#ec4899" strokeWidth={2.5} />
              <Text
                style={{ fontFamily: 'Outfit_700Bold' }}
                className="text-white text-3xl ml-2"
              >
                Rizz Assist
              </Text>
            </View>
            <Text
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-gray-400 text-base mb-10"
            >
              {mode === 'login' ? 'Welcome back! Ready to charm?' : 'Create your account'}
            </Text>
          </Animated.View>

          {/* Auth Card */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <BlurView
              intensity={40}
              tint="dark"
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <View className="p-6">
                {/* Email Input */}
                <View className="mb-4">
                  <Text
                    style={{ fontFamily: 'Inter_500Medium' }}
                    className="text-gray-300 text-sm mb-2"
                  >
                    Email
                  </Text>
                  <View className="flex-row items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <Mail size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 text-white text-base ml-3"
                      style={{ fontFamily: 'Inter_400Regular' }}
                      placeholder="your@email.com"
                      placeholderTextColor="#6b7280"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="mb-6">
                  <Text
                    style={{ fontFamily: 'Inter_500Medium' }}
                    className="text-gray-300 text-sm mb-2"
                  >
                    Password
                  </Text>
                  <View className="flex-row items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <Lock size={20} color="#9ca3af" />
                    <TextInput
                      className="flex-1 text-white text-base ml-3"
                      style={{ fontFamily: 'Inter_400Regular' }}
                      placeholder="••••••••"
                      placeholderTextColor="#6b7280"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Forgot Password */}
                {mode === 'login' && (
                  <Pressable
                    className="mb-6"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setMode('forgot');
                    }}
                  >
                    <Text
                      style={{ fontFamily: 'Inter_500Medium' }}
                      className="text-pink-400 text-sm text-right"
                    >
                      Forgot password?
                    </Text>
                  </Pressable>
                )}

                {/* Submit Button */}
                <Animated.View style={animatedButtonStyle}>
                  <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleAuth}
                    disabled={isLoading}
                  >
                    <LinearGradient
                      colors={['#ec4899', '#8b5cf6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        borderRadius: 14,
                        paddingVertical: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <>
                          <Text
                            style={{ fontFamily: 'Outfit_600SemiBold' }}
                            className="text-white text-lg mr-2"
                          >
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                          </Text>
                          <ArrowRight size={20} color="white" />
                        </>
                      )}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-white/10" />
                  <Text
                    style={{ fontFamily: 'Inter_400Regular' }}
                    className="text-gray-500 mx-4"
                  >
                    or
                  </Text>
                  <View className="flex-1 h-px bg-white/10" />
                </View>

                {/* Google Button */}
                <Pressable
                  onPress={handleGoogleAuth}
                  className="bg-white/5 border border-white/10 rounded-xl py-4 flex-row items-center justify-center"
                >
                  <View className="w-5 h-5 mr-3">
                    <GoogleIcon />
                  </View>
                  <Text
                    style={{ fontFamily: 'Inter_500Medium' }}
                    className="text-white text-base"
                  >
                    Continue with Google
                  </Text>
                </Pressable>
              </View>
            </BlurView>
          </Animated.View>

          {/* Toggle Mode */}
          <Animated.View
            entering={FadeInUp.delay(300).springify()}
            className="mt-6 flex-row justify-center"
          >
            <Text
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-gray-400"
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Pressable onPress={toggleMode}>
              <Text
                style={{ fontFamily: 'Inter_600SemiBold' }}
                className="text-pink-400"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Terms */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            className="mt-8"
          >
            <Text
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-gray-500 text-xs text-center leading-5"
            >
              By continuing, you agree to our{' '}
              <Text className="text-gray-400 underline">Terms of Service</Text>
              {' '}and{' '}
              <Text className="text-gray-400 underline">Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function GoogleIcon() {
  return (
    <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>G</Text>
    </View>
  );
}
