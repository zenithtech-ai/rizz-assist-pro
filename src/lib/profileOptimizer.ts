// Profile Optimizer - Uses OpenAI to improve dating app profiles
import { DatingAppId, APP_PROFILE_FIELDS, APP_BEST_PRACTICES } from './datingAppsKnowledge';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface ProfileOptimizationResult {
  optimizedFields: Record<string, string>;
  tips: string[];
  improvements: Array<{
    field: string;
    before: string;
    suggestion: string;
    reason: string;
  }>;
  error?: string;
}

/**
 * Optimizes a dating profile for a specific app using AI
 * Provides suggestions for improvement based on app-specific best practices
 */
export async function optimizeProfile(
  appId: DatingAppId,
  currentFields: Record<string, string>,
  aboutMe: string = ''
): Promise<ProfileOptimizationResult> {
  if (!OPENAI_API_KEY) {
    return {
      optimizedFields: {},
      tips: [],
      improvements: [],
      error: 'OpenAI API key not configured',
    };
  }

  if (!currentFields || Object.keys(currentFields).length === 0) {
    return {
      optimizedFields: {},
      tips: [],
      improvements: [],
      error: 'No profile fields provided',
    };
  }

  try {
    const appConfig = APP_PROFILE_FIELDS[appId];
    const bestPractices = APP_BEST_PRACTICES[appId];

    if (!appConfig || !bestPractices) {
      return {
        optimizedFields: {},
        tips: [],
        improvements: [],
        error: `Unknown app: ${appId}`,
      };
    }

    // Build field descriptions
    const fieldDescriptions = appConfig.fields
      .map(f => `- ${f.label} (max ${appConfig.characterLimits[f.key]} chars): "${currentFields[f.key] || ''}"`)
      .join('\n');

    const prompt = `You are an expert dating profile optimizer. Your job is to improve dating profiles for ${appConfig.name}.

CURRENT PROFILE:
${fieldDescriptions}

${aboutMe ? `USER'S ABOUT ME (for context):\n${aboutMe}\n` : ''}

${appConfig.name.toUpperCase()} BEST PRACTICES:
- Style: ${bestPractices.bioStyle}
- Tips: ${bestPractices.tips.join('; ')}
- DO's: ${bestPractices.dosDontsList.dos.join('; ')}
- DON'Ts: ${bestPractices.dosDontsList.donts.join('; ')}

YOUR TASK:
1. Analyze each field and provide an improved version
2. Keep within character limits (very important!)
3. Make each field specific, engaging, and personality-driven
4. Ensure the overall profile feels cohesive
5. Provide 2-3 specific improvement suggestions explaining WHY each change helps

RESPOND WITH JSON ONLY (no other text):
{
  "optimizedFields": {
    "fieldKey": "improved text (MUST be under character limit)"
  },
  "improvements": [
    {
      "field": "Field Name",
      "before": "original text",
      "suggestion": "improved text",
      "reason": "Why this is better for ${appConfig.name}"
    }
  ],
  "tips": ["app-specific tip 1", "app-specific tip 2", "app-specific tip 3"]
}`;

    console.log('Starting profile optimization for', appId);

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('OpenAI API error details:', errorData);
        errorMessage = errorData?.error?.message || errorMessage;
      } catch (e) {
        console.error('Could not parse error response:', e);
      }
      return {
        optimizedFields: {},
        tips: [],
        improvements: [],
        error: errorMessage,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        optimizedFields: {},
        tips: [],
        improvements: [],
        error: 'Could not parse optimization response',
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate character limits
    const validatedFields: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed.optimizedFields || {})) {
      const limit = appConfig.characterLimits[key];
      const textValue = String(value);
      if (limit && textValue.length > limit) {
        validatedFields[key] = textValue.substring(0, limit - 3) + '...';
      } else {
        validatedFields[key] = textValue;
      }
    }

    return {
      optimizedFields: validatedFields,
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    };
  } catch (error) {
    console.error('Error optimizing profile:', error);
    return {
      optimizedFields: {},
      tips: [],
      improvements: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Gets app-specific tips for profile writing
 */
export function getAppTips(appId: DatingAppId): string[] {
  const bestPractices = APP_BEST_PRACTICES[appId];
  if (!bestPractices) return [];

  return [
    `Bio Style: ${bestPractices.bioStyle}`,
    ...bestPractices.tips.slice(0, 3),
    `Sample good openers: ${bestPractices.sampleGood[0]}`,
  ];
}

/**
 * Gets character limit for a specific field on an app
 */
export function getFieldCharacterLimit(appId: DatingAppId, fieldKey: string): number | null {
  const appConfig = APP_PROFILE_FIELDS[appId];
  if (!appConfig) return null;
  return appConfig.characterLimits[fieldKey] || null;
}

/**
 * Validates profile fields against app requirements
 */
export function validateProfileFields(
  appId: DatingAppId,
  fields: Record<string, string>
): { isValid: boolean; errors: string[] } {
  const appConfig = APP_PROFILE_FIELDS[appId];
  if (!appConfig) {
    return { isValid: false, errors: [`Unknown app: ${appId}`] };
  }

  const errors: string[] = [];

  for (const field of appConfig.fields) {
    const value = fields[field.key] || '';
    const limit = appConfig.characterLimits[field.key];

    if (value.length > limit) {
      errors.push(`${field.label} exceeds character limit (${value.length}/${limit})`);
    }
  }

  return { isValid: errors.length === 0, errors };
}
