// Profile Analysis Service for Dating Profile Screenshots
// Uses OpenAI API for AI-powered analysis

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

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
  if (!OPENAI_API_KEY) {
    return {
      personality: '',
      interests: [],
      conversationStyle: '',
      suggestedApproach: '',
      error: 'OpenAI API key not configured',
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
    // Build image content blocks for OpenAI
    const imageContent = base64Images.map(base64 => ({
      type: 'image_url' as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
      },
    }));

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
      console.error('OpenAI API error:', errorData);
      return {
        personality: '',
        interests: [],
        conversationStyle: '',
        suggestedApproach: '',
        error: `API request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

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

