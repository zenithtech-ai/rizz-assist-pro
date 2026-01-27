// Style Prompt Builder - Creates detailed, enforceable prompts from tone + action combinations
// This ensures AI consistently applies both tone AND actions to generated replies

import { ToneId, ActionId, TONE_OPTIONS, ACTION_OPTIONS } from './constants';

interface StyleInstructions {
  toneInstruction: string;
  actionInstructions: string[];
  combinedInstruction: string;
  summary: string; // User-friendly summary like "Flirty + Ask Out"
}

// Detailed tone descriptions that guide the AI on HOW to write
const TONE_INSTRUCTIONS: Record<ToneId, string> = {
  flirty: `Apply a playful, teasing, light vibe. Use suggestive language, light innuendos, and cocky-funny humor. Show confidence without being aggressive. Examples: "You're trouble aren't you?", "Wouldn't you like to know 😏", "Maybe... if you play your cards right"`,

  seductive: `Use slow-burn, sensual language. Be mysterious and alluring without explicit content. Create tension and anticipation. Examples: "Come closer and I will tell you...", "You know exactly what you're doing to me...", "Some things are better whispered"`,

  cheeky: `Be mischievous, playful, and slightly sarcastic. Use teasing nicknames and light roasts. Keep it fun and irreverent. Examples: "Oh you're feeling brave today", "Look who finally showed up", "Think you can handle me?"`,

  smooth: `Be confident, suave, and collected. Use smooth compliments and sophisticated language. Sound like you've got your life figured out. Examples: "I see you. And I like what I see", "We're definitely on the same wavelength", "That's my kind of vibe"`,

  witty: `Use clever wordplay, puns, and intelligent humor. Be quick-witted and entertaining. Show you can match their mental energy. Examples: "Are you a magician? Because Abraca-dayum", "Warning: I come with dad jokes and zero filter"`,

  bold: `Be direct, confident, and unafraid. Say what you want without apology. Cut through the small talk. Examples: "Let's cut the small talk", "I'm interested, what about you?", "You're exactly my type"`,

  mysterious: `Be enigmatic, keep some cards close to your chest. Create curiosity about who you are. Use vagueness strategically. Examples: "That depends... on a few things", "I could tell you, but where's the fun?", "You'll have to find out for yourself"`,

  cute: `Be wholesome, genuine, and endearing. Show vulnerability and authenticity. Be sincere without being boring. Examples: "Your energy is contagious", "Something about the way you text... I'm into it", "You've got great vibes, I can already tell"`,

  thoughtful: `Be introspective, genuine, and emotionally intelligent. Ask meaningful questions. Show depth. Examples: "I love that you're not afraid to ask", "Your curiosity is attractive", "That kind of directness is refreshing"`,

  adventurous: `Be enthusiastic, spontaneous, and exciting. Suggest activities and experiences. Show you're up for anything. Examples: "That sounds like an adventure I'm in for", "When are we doing this?", "I'm game if you are"`,

  compliment: `Lead with genuine, specific compliments. Make them feel seen and appreciated. Be authentic, not generic. Examples: "Your smile is dangerous and I'm not complaining", "You've got this energy that's impossible to ignore", "That confidence? Incredibly attractive"`,
};

// Detailed action descriptions that define WHAT the reply should accomplish
const ACTION_INSTRUCTIONS: Record<ActionId, string> = {
  roast: `Roast their message playfully. Point out something funny or absurd about what they said. Use light humor, not mean-spirited criticism. Make them laugh at themselves. Keep it flirty, not cruel.`,

  askout: `Explicitly suggest plans or a date. Mention a specific activity (dinner, coffee, drinks, etc) and ideally a timeframe (this Friday, tomorrow, this weekend). Make it clear you want to hang out in person.`,

  getnumber: `Make getting their phone number the goal of this reply. Ask directly for it, or create a reason to exchange numbers (continue on text, easier to chat, etc). Be confident about it.`,
};

/**
 * Builds detailed style instructions from tone and actions
 * Returns structured instructions plus a user-friendly summary
 */
export function buildStyleInstructions(toneId: ToneId, actionIds: ActionId[]): StyleInstructions {
  const toneInstruction = TONE_INSTRUCTIONS[toneId];
  const actionInstructions = actionIds.map(id => ACTION_INSTRUCTIONS[id]);

  // Build human-readable summary
  const toneName = TONE_OPTIONS.find(t => t.id === toneId)?.label || toneId;
  const actionNames = actionIds
    .map(id => ACTION_OPTIONS.find(a => a.id === id)?.label || id)
    .join(' + ');

  const summary = actionNames ? `${toneName} + ${actionNames}` : toneName;

  // Build combined instruction that emphasizes BOTH should be applied
  let combinedInstruction = `You will apply the following style to your reply:

TONE: Apply this tone/vibe to everything you write:
${toneInstruction}`;

  if (actionInstructions.length > 0) {
    combinedInstruction += `

ACTIONS: Also accomplish these goals in your reply:`;
    actionInstructions.forEach((instruction, i) => {
      combinedInstruction += `\n${i + 1}. ${instruction}`;
    });
    combinedInstruction += `

IMPORTANT: Apply BOTH the TONE and ALL selected ACTIONS together. The reply should embody the tone while achieving the action goals.`;
  }

  return {
    toneInstruction,
    actionInstructions,
    combinedInstruction,
    summary,
  };
}

/**
 * Builds a complete system prompt injection for the API
 * Use this in the system prompt when calling the AI
 */
export function buildStyleSystemPromptSection(toneId: ToneId, actionIds: ActionId[], userAboutMe?: string): string {
  const instructions = buildStyleInstructions(toneId, actionIds);

  let section = `\n\n${instructions.combinedInstruction}`;

  if (userAboutMe?.trim()) {
    section += `\n\nABOUT YOU (the person sending):
${userAboutMe}

Reference these details to make replies feel personal and authentic to who you are.`;
  }

  return section;
}

/**
 * Returns just the summary string (e.g., "Flirty + Ask Out")
 * Use this for displaying to the user
 */
export function getStyleSummary(toneId: ToneId, actionIds: ActionId[]): string {
  return buildStyleInstructions(toneId, actionIds).summary;
}
