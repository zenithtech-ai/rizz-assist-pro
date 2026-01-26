// Rizz Assist Pro - Constants and Mock Data

export const COLORS = {
  // Gradient colors
  gradientStart: '#1A0D2E',
  gradientEnd: '#FF6B9D',

  // UI Colors
  neonPink: '#FF69B4',
  tokenFree: '#FF4444',
  tokenPro: '#44FF44',
  cardBg: '#FFFFFF',
  cardShadow: 'rgba(138, 43, 226, 0.3)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDark: '#1A0D2E',
};

export const REPLY_STYLES = [
  { id: 'flirty', label: 'Flirty', emoji: '😏' },
  { id: 'seductive', label: 'Seductive', emoji: '🔥' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'roast', label: 'Roast', emoji: '💥' },
  { id: 'smooth', label: 'Smooth', emoji: '🕶️' },
  { id: 'compliment', label: 'Compliment', emoji: '✨' },
  { id: 'askout', label: 'Ask Out', emoji: '💌' },
  { id: 'getnumber', label: 'Get Number', emoji: '📱' },
  { id: 'tease', label: 'Tease', emoji: '😜' },
  { id: 'boldmove', label: 'Bold Move', emoji: '⚡' },
] as const;

export type ReplyStyleId = typeof REPLY_STYLES[number]['id'];

export const MOCK_REPLIES: Record<ReplyStyleId, string[]> = {
  flirty: [
    "You're trouble aren't you? 😏",
    "Bold move... I like it",
    "Smooth talker huh?",
    "Challenge accepted 🔥",
    "You know what you do to me"
  ],
  seductive: [
    "Come closer...",
    "You know what I like about you",
    "Slow down, let me catch up",
    "Dangerous game you're playing",
    "Let's see where this goes"
  ],
  funny: [
    "Is this the part where I say something clever?",
    "I'm contractually obligated to ask your sign",
    "Warning: I come with dad jokes",
    "Are you a magician? Because Abraca-dayum",
    "My pickup line game is 404 error"
  ],
  roast: [
    "Average at best",
    "0/10 would not swipe right",
    "Your pickup line needs work",
    "I've heard better from my grandma",
    "Is this your first day?"
  ],
  smooth: [
    "I see you",
    "That's my kind of vibe",
    "You get me",
    "We're on the same wavelength",
    "You speak my language"
  ],
  compliment: [
    "Your smile is dangerous",
    "You've got great energy",
    "You have excellent taste",
    "You're absolutely stunning",
    "That confidence suits you"
  ],
  askout: [
    "Dinner this Friday?",
    "Coffee tomorrow?",
    "Want to grab drinks?",
    "Let's hang out this weekend",
    "You free Thursday?"
  ],
  getnumber: [
    "What's your number?",
    "Can I text you?",
    "Drop your digits",
    "Number exchange?",
    "Want to continue this over text?"
  ],
  tease: [
    "Someone's feeling brave today",
    "Oh you're trouble",
    "Think you can handle me?",
    "Big talker huh?",
    "Cocky much?"
  ],
  boldmove: [
    "Let's cut the small talk",
    "Want to get out of here?",
    "Your place or mine?",
    "Skip the games",
    "Let's make this interesting"
  ],
};

export const SUBSCRIPTION_PRODUCTS = {
  silver: {
    id: 'rizzassist.silver.monthly',
    name: 'Silver',
    price: '$9.95/mo',
    monthlyReplies: 1500,
    screenshotEnabled: true,
  },
  gold: {
    id: 'rizzassist.gold.monthly',
    name: 'Gold',
    price: '$17.95/mo',
    monthlyReplies: 3000,
    screenshotEnabled: true,
  },
};

export const FREE_DAILY_LIMIT = 3;
export const FREE_TOKEN_LIMIT = 3; // Daily limit for free users
export const SILVER_MONTHLY_TOKENS = 1500;
export const GOLD_MONTHLY_TOKENS = 3000;
export const PRO_WEEKLY_TOKENS = 25; // Legacy - keeping for compatibility

export const DISCLAIMER_TEXT = `Rizz Assist Pro is not tested on all devices. It's provided as-is without any warranties and for education purposes only. Rizz Assist Pro is not affiliated with any other apps/dating/social media apps that it supports. Please read terms. You agree to use this app at your own risk. Please contact us via email for feedback/feature requests and if you find any glitches/bugs.`;

export const TERMS_OF_SERVICE = `Rizz Assist Pro Terms of Service
Effective: January 26, 2026

1. Service: AI-generated dating reply suggestions. No guaranteed dating success.

2. Subscriptions:
• Monthly: $10.99 USD (local currency equivalent)
• Yearly: $109.99 USD (local currency equivalent)
• Processed via Apple App Store/Google Play Store
• Auto-renews until cancelled 24hrs before period ends
• Cancel anytime in App Store/Play Store settings

3. Free Tier: 5 lifetime replies total

4. Pro Benefits: 25 tokens/week (1 token = 1 reply generation)

5. User Content: You grant us license to process pasted chat text solely for reply generation. No permanent storage.

6. Prohibited: Not for harassment, spam, illegal activities. Age 17+ only.

7. Data Storage: Local device only (encrypted). No cloud sync.

8. Limitation of Liability: Provided "as-is". No warranties.

9. Contact: contact@rizzassist.pro

Governing Law: New South Wales, Australia`;

export const PRIVACY_POLICY = `Rizz Assist Pro Privacy Policy
Effective: January 26, 2026

1. Information Collected:
• Chat text (processed in memory only, never stored)
• Token balance and app settings (local encrypted storage)
• Purchase/transaction data (via App Store/Play Store)

2. How We Use Data:
• Generate AI reply suggestions
• Track token usage locally
• App functionality and crash reporting

3. Data Storage:
• 100% local device storage only
• No cloud servers, no cross-device sync
• Chat text auto-deleted after processing

4. Third Parties:
• Apple Inc./Google LLC (billing and app distribution)
• No analytics services, no ad networks

5. Your Rights: Email contact@rizzassist.pro for support/data questions. Local data deletion via app reinstall.

6. Children: Not intended for under 17. No COPPA compliance.

7. Changes: We'll notify via app update for material changes.`;
