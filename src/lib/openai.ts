// OpenAI API Service for Rizz Assist Pro
import * as FileSystem from 'expo-file-system';
import { CORE_PRINCIPLES, STYLE_GUIDANCE } from './knowledgeBase';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface GenerateRepliesParams {
  conversationText?: string;
  imageUri?: string;
  style: string;
  count?: number;
}

export interface GenerateRepliesResult {
  replies: string[];
  extractedText?: string;
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

function buildVisionPrompt(style: string, count: number): string {
  return `Look at this screenshot of a text/dating conversation.

First, identify the most recent message(s) from the other person that I need to respond to.

Then generate ${count} different ${style} replies I could send next.

Format your response EXACTLY like this:
EXTRACTED_TEXT: [The text from the conversation, especially the last message I need to respond to]
---
[reply 1]
[reply 2]
[reply 3]

Just the reply text after the ---, no numbering or labels. Each reply should be unique and match the ${style} style.`;
}

async function imageToBase64(uri: string): Promise<string> {
  try {
    console.log('Reading image from URI:', uri);

    // Check if file exists and get info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    console.log('File info:', fileInfo);

    if (!fileInfo.exists) {
      // For some URIs (like ph:// on iOS), we need to copy to a local cache first
      const filename = uri.split('/').pop() || 'image.jpg';
      const localUri = FileSystem.cacheDirectory + filename;

      try {
        await FileSystem.copyAsync({
          from: uri,
          to: localUri,
        });
        console.log('Copied to local URI:', localUri);

        const base64 = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
      } catch (copyError) {
        console.error('Error copying file:', copyError);
        throw new Error('Failed to copy image file');
      }
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error reading image:', error);
    throw new Error('Failed to read image');
  }
}

export async function generateReplies({
  conversationText,
  imageUri,
  style,
  count = 3,
}: GenerateRepliesParams): Promise<GenerateRepliesResult> {
  if (!OPENAI_API_KEY) {
    return {
      replies: [],
      error: 'OpenAI API key not configured',
    };
  }

  const hasText = conversationText && conversationText.trim().length > 0;
  const hasImage = imageUri && imageUri.length > 0;

  if (!hasText && !hasImage) {
    return {
      replies: [],
      error: 'No conversation text or image provided',
    };
  }

  try {
    let messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>;

    if (hasImage) {
      // Use vision API for screenshot
      const base64Image = await imageToBase64(imageUri);

      messages = [
        { role: 'system', content: buildSystemPrompt(style) },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: buildVisionPrompt(style, count),
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ];
    } else {
      // Text-only request
      messages = [
        { role: 'system', content: buildSystemPrompt(style) },
        { role: 'user', content: buildUserPrompt(conversationText!, style, count) },
      ];
    }

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
