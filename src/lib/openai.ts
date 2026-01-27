// OpenAI API Service for Rizz Assist Pro
// With persona injection and prompt caching optimization

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface GenerateRepliesParams {
  conversationText?: string;
  imageBase64?: string;
  style: string;
  count?: number;
  userPersona?: string;
  userAboutMe?: string;
}

export interface GenerateRepliesResult {
  replies: string[];
  extractedText?: string;
  error?: string;
}

// Cached system prompt - this is the fixed part that can be cached by OpenAI
// The persona descriptions and texting rules are static
const CACHED_SYSTEM_PROMPT_PREFIX = `You are a real, confident guy texting a girl. Write replies that sound 100% human and natural — NEVER use emojis, NEVER use em dashes (—), NEVER use semicolons (;). Use casual language, contractions (you're, I'm, don't), short punchy sentences, ... for natural pauses. No perfect grammar or punctuation. No robot vibes. No generic safe lines. Be playful, teasing, cocky-funny, or bold based on selected tone and action. Always pull from rizz-knowledge-base techniques (cocky funny, push-pull, teasing nicknames, qualification, role-playing, etc.).

Output ONLY the raw message text they would copy-paste and send — no explanations, no suggestions, no extra text, no formatting.`;

function buildDynamicSystemPrompt(style: string, userAboutMe: string): string {
  const aboutMeSection = userAboutMe.trim()
    ? `

ABOUT YOU:
${userAboutMe}

Use these details to make replies feel more personal and authentic.`
    : '';

  return `${CACHED_SYSTEM_PROMPT_PREFIX}

TONE/STYLE FOR THIS REPLY:
Apply the following tone/style to your reply: ${style}${aboutMeSection}`;
}

function buildUserPrompt(conversationText: string, count: number): string {
  return `Full chat history / Her last message:
${conversationText}

Generate exactly ${count} different replies I could send next, one per line. Just the reply text, no numbering or labels. Each reply should be unique while matching my persona and being relevant to what they said.

Output ONLY the next reply texts — make them feel like a real person texting back right now.`;
}

function buildVisionPrompt(count: number): string {
  return `Look at this screenshot of a text/dating conversation.

First, identify the most recent message(s) from the other person that I need to respond to.

Then generate ${count} different replies I could send next that match my persona.

Format your response EXACTLY like this:
EXTRACTED_TEXT: [The text from the conversation, especially the last message I need to respond to]
---
[reply 1]
[reply 2]
[reply 3]

Just the reply text after the ---, no numbering or labels. Each reply should be unique and match my persona while being relevant to what they said.

Output ONLY the replies — make them feel like a real person texting back right now.`;
}

export async function generateReplies({
  conversationText,
  imageBase64,
  style,
  count = 3,
  userPersona = 'Flirty',
  userAboutMe = '',
}: GenerateRepliesParams): Promise<GenerateRepliesResult> {
  if (!OPENAI_API_KEY) {
    return {
      replies: [],
      error: 'OpenAI API key not configured',
    };
  }

  const hasText = conversationText && conversationText.trim().length > 0;
  const hasImage = imageBase64 && imageBase64.length > 0;

  if (!hasText && !hasImage) {
    return {
      replies: [],
      error: 'No conversation text or image provided',
    };
  }

  try {
    // Build the system prompt with style and about me
    const systemPrompt = buildDynamicSystemPrompt(style, userAboutMe);

    let messages: Array<{
      role: string;
      content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
    }>;

    if (hasImage) {
      // Use vision API for screenshot - base64 is already provided
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: buildVisionPrompt(count),
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ];
    } else {
      // Text-only request
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(conversationText!, count) },
      ];
    }

    console.log('Sending to OpenAI with style:', style);

    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_completion_tokens: 800,
        temperature: 1.1, // Slightly higher for more variety
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

    let extractedText: string | undefined;
    let repliesContent = content;

    // Parse vision response format
    if (hasImage && content.includes('EXTRACTED_TEXT:')) {
      const parts = content.split('---');
      if (parts.length >= 2) {
        const textPart = parts[0];
        const extractMatch = textPart.match(/EXTRACTED_TEXT:\s*(.+)/s);
        if (extractMatch) {
          extractedText = extractMatch[1].trim();
        }
        repliesContent = parts.slice(1).join('---');
      }
    }

    // Parse replies - split by newlines and clean up
    const replies = repliesContent
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => {
        // Remove any numbering like "1." or "1)" or "- "
        return line.replace(/^[\d]+[.)\-]\s*/, '').replace(/^[-•]\s*/, '').trim();
      })
      .filter((line: string) => line.length > 0 && !line.startsWith('EXTRACTED_TEXT'))
      .slice(0, count);

    if (replies.length === 0) {
      return {
        replies: [],
        error: 'No replies generated',
      };
    }

    return { replies, extractedText };
  } catch (error) {
    console.error('Error generating replies:', error);
    return {
      replies: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
