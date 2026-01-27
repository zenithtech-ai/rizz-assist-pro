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

export interface OpenersResult {
  openers: string[];
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
    console.log('Starting profile analysis with', base64Images.length, 'images');

    // Build image content blocks for OpenAI
    const imageContent = base64Images.map(base64 => ({
      type: 'image_url' as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
        detail: 'low' as const, // Lower detail for faster processing
      },
    }));

    console.log('Making OpenAI API request...');
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

    console.log('OpenAI API response received:', response.status);

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

export async function generateProfileOpeners(
  base64Images: string[],
  analysis: AnalysisResult
): Promise<OpenersResult> {
  if (!OPENAI_API_KEY) {
    return {
      openers: [],
      error: 'OpenAI API key not configured',
    };
  }

  if (base64Images.length === 0) {
    return {
      openers: [],
      error: 'No images provided',
    };
  }

  try {
    console.log('Generating openers with', base64Images.length, 'images');

    // Build image content blocks for OpenAI
    const imageContent = base64Images.map(base64 => ({
      type: 'image_url' as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
        detail: 'low' as const, // Lower detail for faster processing
      },
    }));

    const analysisContext = `
Based on this dating profile analysis:
- Personality: ${analysis.personality}
- Interests: ${analysis.interests.join(', ')}
- Conversation Style: ${analysis.conversationStyle}
- Suggested Approach: ${analysis.suggestedApproach}

Generate 5 unique, personalized dating openers that:
1. Reference specific details from the profile photos
2. Match their conversation style
3. Sound natural and genuine (never robotic)
4. Are short, punchy, and memorable
5. Show you actually looked at their profile

Format your response as a numbered list (1-5), one opener per line.
Just the openers, no explanations.`;

    console.log('Making OpenAI API request for openers...');
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: [
              ...imageContent,
              {
                type: 'text',
                text: analysisContext,
              },
            ],
          },
        ],
      }),
    });

    console.log('OpenAI API openers response received:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return {
        openers: [],
        error: `API request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse numbered list format
    const openers = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => {
        // Remove numbering like "1.", "1)", "- ", etc
        return line.replace(/^[\d]+[.)\-]\s*/, '').replace(/^[-•]\s*/, '').trim();
      })
      .filter((line: string) => line.length > 0)
      .slice(0, 5);

    if (openers.length === 0) {
      return {
        openers: [],
        error: 'No openers generated',
      };
    }

    return { openers };
  } catch (error) {
    console.error('Error generating openers:', error);
    return {
      openers: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

