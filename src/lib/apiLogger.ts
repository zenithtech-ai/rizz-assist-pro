import { supabase } from './supabase';
import { useAuthStore } from './authStore';

export type FeatureType = 'reply_generation' | 'profile_analysis' | 'opener_generation' | 'profile_optimization' | 'screenshot_reply';

// Estimated costs per feature (in USD) and tokens
const FEATURE_COSTS: Record<FeatureType, { cost: number; tokens: number }> = {
  reply_generation: { cost: 0.008, tokens: 1 },
  screenshot_reply: { cost: 0.015, tokens: 2 },
  profile_analysis: { cost: 0.04, tokens: 3 },
  opener_generation: { cost: 0.008, tokens: 1 },
  profile_optimization: { cost: 0.015, tokens: 2 },
};

/**
 * Log an API call to Supabase for analytics and cost tracking
 * Only logs if user is authenticated
 */
export async function logApiCall(
  featureType: FeatureType,
  inputTokens?: number,
  outputTokens?: number,
  success: boolean = true,
  errorMessage?: string
) {
  try {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn('No authenticated user, skipping API log');
      return;
    }

    const { cost, tokens } = FEATURE_COSTS[featureType];

    const { error } = await supabase.from('api_logs').insert({
      user_id: userId,
      feature_type: featureType,
      tokens_consumed: tokens,
      estimated_cost: cost,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      model: 'gpt-4o',
      success,
      error_message: errorMessage,
    });

    if (error) {
      console.error('Failed to log API call:', error);
    }
  } catch (err) {
    console.error('Error logging API call:', err);
  }
}

/**
 * Get the cost and token amount for a feature
 */
export function getFeatureCost(featureType: FeatureType): { cost: number; tokens: number } {
  return FEATURE_COSTS[featureType];
}
