// Rizz Assist Pro - Token Management Store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FREE_TOKEN_LIMIT, PRO_WEEKLY_TOKENS, SILVER_MONTHLY_TOKENS, GOLD_MONTHLY_TOKENS, FREE_DAILY_LIMIT } from './constants';

const STORAGE_KEYS = {
  PRO_STATUS: 'rizzassist_pro_status',
  PLAN_TYPE: 'rizzassist_plan_type',
  TOKENS: 'rizzassist_tokens',
  WEEKLY_RESET: 'rizzassist_weekly_reset',
  DAILY_RESET: 'rizzassist_daily_reset',
  HAS_SEEN_ONBOARDING: 'rizzassist_onboarding',
  HAS_ACCEPTED_DISCLAIMER: 'rizzassist_disclaimer',
  TOTAL_USES: 'rizzassist_total_uses',
} as const;

export type PlanType = 'free' | 'silver' | 'gold';

interface TokenState {
  isProUser: boolean;
  planType: PlanType;
  tokens: number;
  weeklyResetDate: string;
  dailyResetDate: string;
  hasSeenOnboarding: boolean;
  hasAcceptedDisclaimer: boolean;
  totalUses: number;
  isLoaded: boolean;

  // Actions
  loadState: () => Promise<void>;
  useToken: () => boolean;
  purchasePro: (plan?: PlanType) => Promise<void>;
  restorePurchase: () => Promise<boolean>;
  acceptDisclaimer: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  checkWeeklyReset: () => Promise<void>;
  checkDailyReset: () => Promise<void>;
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

// Get tomorrow midnight
const getTomorrowMidnight = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

// Get next month date
const getNextMonth = (): string => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth.toISOString();
};

const getMaxTokensForPlan = (plan: PlanType): number => {
  switch (plan) {
    case 'gold': return GOLD_MONTHLY_TOKENS;
    case 'silver': return SILVER_MONTHLY_TOKENS;
    default: return FREE_DAILY_LIMIT;
  }
};

export const useTokenStore = create<TokenState>((set, get) => ({
  isProUser: false,
  planType: 'free' as PlanType,
  tokens: FREE_DAILY_LIMIT,
  weeklyResetDate: getNextSunday(),
  dailyResetDate: getTomorrowMidnight(),
  hasSeenOnboarding: false,
  hasAcceptedDisclaimer: false,
  totalUses: 0,
  isLoaded: false,

  loadState: async () => {
    try {
      const [proStatus, planType, tokens, weeklyReset, dailyReset, onboarding, disclaimer, totalUses] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PRO_STATUS),
        AsyncStorage.getItem(STORAGE_KEYS.PLAN_TYPE),
        AsyncStorage.getItem(STORAGE_KEYS.TOKENS),
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_RESET),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_RESET),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_ACCEPTED_DISCLAIMER),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_USES),
      ]);

      const loadedPlanType = (planType as PlanType) || 'free';

      // For free users, cap tokens at daily limit (handles migration from old limits)
      let loadedTokens = tokens ? parseInt(tokens, 10) : FREE_DAILY_LIMIT;
      if (loadedPlanType === 'free' && loadedTokens > FREE_DAILY_LIMIT) {
        loadedTokens = FREE_DAILY_LIMIT;
      }

      set({
        isProUser: proStatus === 'true',
        planType: loadedPlanType,
        tokens: loadedTokens,
        weeklyResetDate: weeklyReset || getNextSunday(),
        dailyResetDate: dailyReset || getTomorrowMidnight(),
        hasSeenOnboarding: onboarding === 'true',
        hasAcceptedDisclaimer: disclaimer === 'true',
        totalUses: totalUses ? parseInt(totalUses, 10) : 0,
        isLoaded: true,
      });

      // Check for resets after loading
      await get().checkDailyReset();
      await get().checkWeeklyReset();
    } catch (error) {
      console.error('Error loading state:', error);
      set({ isLoaded: true });
    }
  },

  useToken: () => {
    const { tokens, totalUses } = get();

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

  purchasePro: async (plan: PlanType = 'gold') => {
    console.log(`TODO: StoreKit 2 - rizzassist.${plan}.monthly`);

    const maxTokens = getMaxTokensForPlan(plan);

    set({
      isProUser: true,
      planType: plan,
      tokens: maxTokens,
      weeklyResetDate: getNextMonth(),
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PRO_STATUS, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.PLAN_TYPE, plan),
      AsyncStorage.setItem(STORAGE_KEYS.TOKENS, maxTokens.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, getNextMonth()),
    ]);
  },

  restorePurchase: async () => {
    console.log('TODO: StoreKit 2 - Restore purchases');

    // Mock: Always succeed for demo with gold plan
    const plan: PlanType = 'gold';
    const maxTokens = getMaxTokensForPlan(plan);

    set({
      isProUser: true,
      planType: plan,
      tokens: maxTokens,
      weeklyResetDate: getNextMonth(),
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PRO_STATUS, 'true'),
      AsyncStorage.setItem(STORAGE_KEYS.PLAN_TYPE, plan),
      AsyncStorage.setItem(STORAGE_KEYS.TOKENS, maxTokens.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, getNextMonth()),
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

  checkDailyReset: async () => {
    const { planType, dailyResetDate } = get();

    // Only free users get daily resets
    if (planType !== 'free') return;

    const now = new Date();
    const resetDate = new Date(dailyResetDate);

    if (now >= resetDate) {
      const newResetDate = getTomorrowMidnight();
      set({
        tokens: FREE_DAILY_LIMIT,
        dailyResetDate: newResetDate,
      });

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKENS, FREE_DAILY_LIMIT.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.DAILY_RESET, newResetDate),
      ]);
    }
  },

  checkWeeklyReset: async () => {
    const { isProUser, planType, weeklyResetDate } = get();

    if (!isProUser) return;

    const now = new Date();
    const resetDate = new Date(weeklyResetDate);

    if (now >= resetDate) {
      const newResetDate = getNextMonth();
      const maxTokens = getMaxTokensForPlan(planType);

      set({
        tokens: maxTokens,
        weeklyResetDate: newResetDate,
      });

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKENS, maxTokens.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_RESET, newResetDate),
      ]);
    }
  },
}));
