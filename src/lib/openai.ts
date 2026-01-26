// OpenAI API Service for Rizz Assist Pro
import { getStylePrompt, CORE_PRINCIPLES, STYLE_GUIDANCE } from './knowledgeBase';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface GenerateRepliesParams {
  conversationText: string;
  style: string;
  count?: number;
}

export interface GenerateRepliesResult {
  replies: string[];
  error?: string;
}

function buildSystemPrompt(style: string): string {
  const styleGuidance = STYLE_GUIDANCE[style];

  const basePrompt = `You are Rizz Assist Pro, an AI dating assistant that generates contextual reply suggestions for text conversations. Your job is to create witty, engaging, and effective replies.

CORE PRINCIPLES:
${CORE_PRINCIPLES.map(p => `- ${p}`).join('\n')}

CURRENT STYLE: ${style.toUpperCase()}
${styleGuidance ? `
Style Principles:
${styleGuidance.principles.map(p => `- ${p}`).join('\n')}

Example messages in this style:
${styleGuidance.techniques.flatMap(t => t.examples.slice(0, 2).map(e => `- "${e.text}"`)).join('\n')}

Things to AVOID:
${styleGuidance.doNots.map(d => `- ${d}`).join('\n')}
` : ''}

IMPORTANT RULES:
1. Generate replies that directly respond to the conversation context
2. Keep replies concise (1-2 sentences max)
3. Match the requested style while staying contextual
4. Don't use generic pickup lines - be specific to what they said
5. Use emoticons sparingly (:p ;) :) etc.) when appropriate for the style
6. Never be crude, disrespectful, or inappropriate
7. Each reply should be different - vary the approach
8. Read the conversation carefully and respond to what was actually said`;

  return basePrompt;
}

function buildUserPrompt(conversationText: string, style: string, count: number): string {
  return `Based on this conversation, generate ${count} different ${style} replies I could send next.

CONVERSATION:
${conversationText}

Generate exactly ${count} replies, one per line. Just the reply text, no numbering or labels. Each reply should be unique and match the ${style} style while being relevant to what they said.`;
}

export async function generateReplies({
  conversationText,
  style,
  count = 5,
}: GenerateRepliesParams): Promise<GenerateRepliesResult> {
  if (!OPENAI_API_KEY) {
    return {
      replies: [],
      error: 'OpenAI API key not configured',
    };
  }

  if (!conversationText.trim()) {
    return {
      replies: [],
      error: 'No conversation text provided',
    };
  }

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: buildSystemPrompt(style) },
          { role: 'user', content: buildUserPrompt(conversationText, style, count) },
        ],
        max_completion_tokens: 500,
        temperature: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return {
        replies: [],
        error: `API request failed: ${response.status}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse replies - split by newlines and clean up
    const replies = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => {
        // Remove any numbering like "1." or "1)" or "- "
        return line.replace(/^[\d]+[.)\-]\s*/, '').replace(/^[-•]\s*/, '').trim();
      })
      .filter((line: string) => line.length > 0)
      .slice(0, count);

    if (replies.length === 0) {
      return {
        replies: [],
        error: 'No replies generated',
      };
    }

    return { replies };
  } catch (error) {
    console.error('Error generating replies:', error);
    return {
      replies: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
