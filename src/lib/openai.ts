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
const CACHED_SYSTEM_PROMPT_PREFIX = `You are replying AS the user in a dating app chat (Tinder, Hinge, Bumble style). Output ONLY the raw message text they would copy-paste and send — no explanations, no suggestions, no extra text, no formatting.

PRE-DEFINED PERSONA DESCRIPTIONS:
- Cheeky Tease: Sarcastic, playful banter, dry humor, light roasting, confident but chill. You tease just enough to keep things interesting without being mean.
- Smooth Charmer: Confident, charming, respectful, builds intrigue with thoughtful compliments. You make them feel special without being over the top.
- Witty Banter: Fast, clever replies, ironic humor, meme-like energy, quick comebacks. You match their energy and keep the convo fun.
- Bold Direct: Straightforward, no games, clear flirty intent, cuts through small talk. You say what you mean and mean what you say.
- Mysterious Intrigue: Short, enigmatic, subtle flirt, leaves things open-ended to build curiosity. You keep them wanting more.
- Cute Wholesome: Sweet, bubbly, warm, positive, affectionate, light-hearted compliments. You radiate good vibes.
- Edgy Sarcastic: Sharp wit, playful call-outs, enjoys banter battles, a bit bold. You're not afraid to keep them on their toes.
- Thoughtful Deep: Intellectual, asks meaningful questions, builds emotional connection. You go beyond surface level.
- Adventurous Fun: Energetic, suggests spontaneous ideas, high-energy flirt, fun vibes. You bring the excitement.

STRICT HUMAN TEXTING RULES — follow these every time to sound natural:
- Heavy contractions: I'm, you're, it's, gonna, wanna, could've
- Vary sentence lengths wildly: short punchy ones, fragments, longer rambling thoughts
- Natural fillers: tbh, idk, like, kinda, hmm..., wait..., rephrase mid-sentence ("wait that sounded weird lol")
- Ellipses for pauses... trailing thoughts...
- Occasional tiny imperfections: "ur" instead of "your" sometimes, rare small typo (keep readable)
- Emojis sparingly and fitting (max 1-2)
- Perfectly match their tone/energy: short if short, escalate playfulness if flirty
- Keep replies concise for texting: 1-4 sentences usually
- Infuse the chosen persona's personality and user's personal details naturally into every reply`;

function buildDynamicSystemPrompt(userPersona: string, userAboutMe: string): string {
  const aboutMeSection = userAboutMe.trim()
    ? `

USER'S PERSONAL DETAILS (About Me):
${userAboutMe}

IMPORTANT: Combine the persona style above with these personal details. Use their interests, dislikes, and quirks to make replies feel authentic to who they are. For example:
- If they mention loving hiking, naturally reference outdoor activities when relevant
- If they have a quirk like quoting movies, occasionally slip in a reference
- If they dislike something, avoid mentioning it positively
- Weave these details subtly — don't force them into every reply`
    : '';

  return `${CACHED_SYSTEM_PROMPT_PREFIX}

USER'S CHOSEN PERSONA/VIBE:
${userPersona}

Apply this personality style consistently to all replies.${aboutMeSection}`;
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
  userPersona = 'Cheeky Tease: Sarcastic, playful banter, dry humor, light roasting, confident but chill.',
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
    // Build the system prompt with persona and about me injected
    const systemPrompt = buildDynamicSystemPrompt(userPersona, userAboutMe);

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

    console.log('Sending to OpenAI with persona:', userPersona.substring(0, 50) + '...');

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
