# Rizz Assist Pro

AI-powered dating assistant app that generates contextual reply suggestions based on conversation messages.

## Features

- **10 Reply Styles**: Flirty, Seductive, Funny, Roast, Smooth, Compliment, Ask Out, Get Number, Tease, Bold Move
- **9 Persona Presets**: Cheeky Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Edgy Sarcastic, Thoughtful Deep, Adventurous Fun
- **Custom Persona**: Define your own personality/style
- **About Me Profile**: Add personal details (likes, dislikes, quirks) for more personalized replies
- **Screenshot Analysis**: Upload conversation screenshots for AI to read and respond to
- **Token System**: 5 free lifetime replies, Pro users get 25 tokens/week
- **Subscription**: Monthly ($10.99) or Yearly ($109.99 - 17% savings)
- **Dark Mode**: Beautiful purple-to-pink gradient design

## App Flow

1. **Splash Screen** (2s) - Animated logo and branding
2. **Disclaimer Modal** - User must accept terms on first launch
3. **Onboarding** (3 screens) - Feature introduction
4. **Home Screen** - Main reply generation interface
5. **My Vibe & Profile** - Persona selection and personal details
6. **Paywall** - Upgrade to Pro modal
7. **Settings** - Account management and legal documents

## Structure

```
src/
├── app/
│   ├── _layout.tsx      # Root layout with app flow
│   ├── paywall.tsx      # Subscription paywall modal
│   ├── my-vibe.tsx      # My Vibe & Profile screen
│   └── (tabs)/
│       ├── _layout.tsx  # Tab navigation
│       ├── index.tsx    # Home tab
│       └── settings.tsx # Settings tab
├── components/
│   ├── SplashScreen.tsx
│   ├── DisclaimerModal.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── MyVibeScreen.tsx    # Persona & profile editor
│   ├── TokenCounter.tsx
│   ├── StyleButton.tsx
│   ├── ReplyBubble.tsx
│   └── CollapsibleSection.tsx
└── lib/
    ├── constants.ts     # Colors, mock data, legal text
    ├── knowledgeBase.ts # AI knowledge base for reply generation
    ├── openai.ts        # OpenAI GPT-4o API integration with persona injection
    ├── replyGenerator.ts # Local fallback reply generator
    ├── tokenStore.ts    # Zustand store for tokens/subscription
    ├── personaStore.ts  # Zustand store for personas and about me
    └── cn.ts            # Tailwind class merger
```

## AI Reply Generation

The app uses **GPT-4o** to generate contextual, style-specific replies:

- **Primary**: OpenAI GPT-4o API (`src/lib/openai.ts`)
- **Fallback**: Local template-based generator (`src/lib/replyGenerator.ts`)
- **Vision**: Screenshot analysis with GPT-4o vision

### Persona System

The AI system prompt now includes:
- **User's Chosen Persona**: One of 9 pre-defined personas or custom text
- **User's About Me**: Personal details to make replies more personalized
- **Human Texting Rules**: Strict formatting rules to sound natural (contractions, fillers, emojis, etc.)

### Prompt Caching

The system prompt is structured for OpenAI prompt caching:
- Fixed prefix (persona descriptions, texting rules) - cacheable
- Dynamic suffix (user's persona, about me) - injected per request

## Persona Presets

| Persona | Description |
|---------|-------------|
| Cheeky Tease | Sarcastic, playful banter, dry humor, light roasting |
| Smooth Charmer | Confident, charming, respectful, thoughtful compliments |
| Witty Banter | Fast, clever replies, ironic humor, meme-like energy |
| Bold Direct | Straightforward, no games, clear flirty intent |
| Mysterious Intrigue | Short, enigmatic, subtle flirt, builds curiosity |
| Cute Wholesome | Sweet, bubbly, warm, positive, affectionate |
| Edgy Sarcastic | Sharp wit, playful call-outs, enjoys banter battles |
| Thoughtful Deep | Intellectual, meaningful questions, emotional connection |
| Adventurous Fun | Energetic, spontaneous ideas, high-energy flirt |

## Token System

- **Free Users**: 5 lifetime tokens
- **Pro Users**: 25 tokens/week (resets Sunday)
- Each "Generate Replies" costs 1 token
- Local storage only (AsyncStorage)

## Subscription Products (for App Store Connect / Play Console)

- `rizzassist.pro.monthly` - $10.99/month
- `rizzassist.pro.yearly` - $109.99/year

## Legal

- Terms of Service and Privacy Policy included in Settings
- Disclaimer shown on first launch
- Contact: contact@rizzassist.pro
- Governing Law: New South Wales, Australia
