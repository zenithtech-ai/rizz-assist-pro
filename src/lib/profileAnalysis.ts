// Profile Analysis Service for Dating Profile Screenshots
// Uses Claude API for AI-powered analysis

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY;
const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';

export interface AnalysisResult {
  personality: string;
  interests: string[];
  conversationStyle: string;
  suggestedApproach: string;
  error?: string;
}

export async function analyzeProfileScreenshots(
  base64Images: string[]
): Promise<AnalysisResult> {
  if (!ANTHROPIC_API_KEY) {
    return {
      personality: '',
      interests: [],
      conversationStyle: '',
      suggestedApproach: '',
      error: 'Anthropic API key not configured',
    };
  }

  if (base64Images.length === 0) {
    return {
      personality: '',
      interests: [],
      conversationStyle: '',
      suggestedApproach: '',
      error: 'No images provided for analysis',
    };
  }

  try {
    // Build image content blocks
    const imageContent = base64Images.map(base64 => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: 'image/jpeg' as const,
        data: base64,
      },
    }));

    const response = await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              ...imageContent,
              {
                type: 'text',
                text: `Analyze this dating profile screenshot and provide insights about the person. Format your response as JSON with these exact fields:
{
  "personality": "A concise description of their personality and vibe based on their photos, bio, and overall profile",
  "interests": ["interest1", "interest2", "interest3", "interest4"],
  "conversationStyle": "The conversational tone and style that would resonate with them",
  "suggestedApproach": "A specific strategic approach for starting conversations with them"
}

Be specific and based only on what you see in the profile. Make the suggestions actionable and authentic.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', errorData);
      return {
        personality: '',
        interests: [],
        conversationStyle: '',
        suggestedApproach: '',
        error: `API request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        personality: '',
        interests: [],
        conversationStyle: '',
        suggestedApproach: '',
        error: 'Could not parse analysis response',
      };
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      personality: analysis.personality || '',
      interests: Array.isArray(analysis.interests) ? analysis.interests : [],
      conversationStyle: analysis.conversationStyle || '',
      suggestedApproach: analysis.suggestedApproach || '',
    };
  } catch (error) {
    console.error('Error analyzing profile:', error);
    return {
      personality: '',
      interests: [],
      conversationStyle: '',
      suggestedApproach: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
