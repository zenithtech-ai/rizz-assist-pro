// Rizz Assist Pro - Token Management Store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FREE_TOKEN_LIMIT, PRO_WEEKLY_TOKENS } from './constants';

const STORAGE_KEYS = {
  PRO_STATUS: 'rizzassist_pro_status',
  TOKENS: 'rizzassist_tokens',
  WEEKLY_RESET: 'rizzassist_weekly_reset',
  HAS_SEEN_ONBOARDING: 'rizzassist_onboarding',
  HAS_ACCEPTED_DISCLAIMER: 'rizzassist_disclaimer',
  TOTAL_USES: 'rizzassist_total_uses',
} as const;

interface TokenState {
  isProUser: boolean;
  tokens: number;
  weeklyResetDate: string;
  hasSeenOnboarding: boolean;
  hasAcceptedDisclaimer: boolean;
  totalUses: number;
  isLoaded: boolean;

  // Actions
  loadState: () => Promise<void>;
  useToken: () => boolean;
  purchasePro: () => Promise<void>;
  restorePurchase: () => Promise<boolean>;
  acceptDisclaimer: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  checkWeeklyReset: () => Promise<void>;
}

// Get next Sunday date
const getNextSunday = (): string => {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday.toISOString();
};

export const useTokenStore = create<TokenState>((set, get) => ({
  isProUser: false,
  tokens: FREE_TOKEN_LIMIT,
  weeklyResetDate: getNextSunday(),
  hasSeenOnboarding: false,
  hasAcceptedDisclaimer: false,
  totalUses: 0,
  isLoaded: false,

  loadState: async () => {
    try {
      const [proStatus, tokens, weeklyReset, onboarding, disclaimer, totalUses] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PRO_STATUS),
        AsyncStorage.getItem(STORAGE_KEYS.TOKENS),
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_RESET),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_ACCEPTED_DISCLAIMER),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_USES),
      ]);

      set({
        isProUser: proStatus === 'true',
        tokens: tokens ? parseInt(tokens, 10) : FREE_TOKEN_LIMIT,
        weeklyResetDate: weeklyReset || getNextSunday(),
        hasSeenOnboarding: onboarding === 'true',
        hasAcceptedDisclaimer: disclaimer === 'true',
        totalUses: totalUses ? parseInt(totalUses, 10) : 0,
        isLoaded: true,
      });

      // Check for weekly reset after loading
      await get().checkWeeklyReset();
    } catch (error) {
      console.error('Error loading state:', error);
      set({ isLoaded: true });
    }
  },

  useToken: () => {
    const { tokens, isProUser, totalUses } = get();

    if (tokens <= 0) {
      return false;
    }

    const newTokens = tokens - 1;
    const newTotalUses = totalUses + 1;

    set({ tokens: newTokens, totalUses: newTotalUses });

    // Persist to storage
    AsyncStorage.setItem(STORAGE_KEYS.TOKENS, newTokens.toString());
    AsyncStorage.setItem(STORAGE_KEYS.TOTAL_USES, newTotalUses.toString());

    return true;
  },

  purchasePro: async () => {
    // TODO: StoreKit 2 / BillingClient implementation
    console.log('TODO: StoreKit 2 - rizzassist.pro.monthly or rizzassist.pro.yearly');

    set({
      isProUser: true,
      tokens: PRO_WEEKLY_TOKENS,
      weeklyResetDate: getNextSunday(),
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PRO_STATUS, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.TOKENS, PRO_WEEKLY_TOKENS.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, getNextSunday()),
    ]);
  },

  restorePurchase: async () => {
    // TODO: StoreKit 2 / BillingClient restore purchase implementation
    console.log('TODO: StoreKit 2 - Restore purchases');

    // Mock: Always succeed for demo
    set({
      isProUser: true,
      tokens: PRO_WEEKLY_TOKENS,
      weeklyResetDate: getNextSunday(),
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PRO_STATUS, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.TOKENS, PRO_WEEKLY_TOKENS.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, getNextSunday()),
    ]);

    return true;
  },

  acceptDisclaimer: async () => {
    set({ hasAcceptedDisclaimer: true });
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_ACCEPTED_DISCLAIMER, 'true');
  },

  completeOnboarding: async () => {
    set({ hasSeenOnboarding: true });
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
  },

  checkWeeklyReset: async () => {
    const { isProUser, weeklyResetDate } = get();

    if (!isProUser) return;

    const now = new Date();
    const resetDate = new Date(weeklyResetDate);

    if (now >= resetDate) {
      const newResetDate = getNextSunday();
      set({
        tokens: PRO_WEEKLY_TOKENS,
        weeklyResetDate: newResetDate,
      });

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKENS, PRO_WEEKLY_TOKENS.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, newResetDate),
      ]);
    }
  },
}));
