# Rizz Assist Pro

AI-powered dating assistant app that generates contextual reply suggestions based on conversation messages.

## Features

- **11 Tone Options**: Flirty, Seductive, Cheeky/Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Thoughtful Deep, Adventurous Fun, Compliment
- **3 Action Intents**: Roast, Ask Out, Ask for Number (can be combined with any tone)
- **9 Persona Presets**: Cheeky Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Edgy Sarcastic, Thoughtful Deep, Adventurous Fun
- **Custom Persona**: Define your own personality/style
- **About Me Profile**: Add personal details (likes, dislikes, quirks) for more personalized replies (Silver & Gold only)
- **Profile Analysis**: Upload dating profile screenshots to analyze and generate tailored openers
- **Screenshot Analysis**: Upload conversation screenshots for AI to read and respond to (Silver & Gold only)
- **Token System**: Free users get 3 replies/day, Silver gets 1,500/month, Gold gets 3,000/month
- **Subscription Plans**:
  - Free: 3 replies/day, no screenshot analysis
  - Silver: $9.95/month, 1,500 replies/month, screenshot analysis enabled
  - Gold: $17.95/month, 3,000 replies/month, screenshot analysis enabled
- **Dark Mode**: Beautiful purple-to-pink gradient design

## App Flow

1. **Splash Screen** (2s) - Animated logo and branding
2. **Disclaimer Modal** - User must accept terms on first launch
3. **Onboarding** (3 screens) - Feature introduction
4. **Home Tab** - Beautiful hero welcome screen with profile setup link
5. **Replies Tab** - Main reply generation interface with tone/action selectors
6. **Analyze Tab** - Upload dating profiles for analysis and opener suggestions
7. **Account Tab** - View plan status, My Vibe, and About Me
8. **Settings Tab** - Account management and legal documents
9. **My Vibe Modal** - Persona selection and personal details
10. **Paywall Modal** - Upgrade to Pro

## Structure

```
src/
├── app/
│   ├── _layout.tsx      # Root layout with app flow
│   ├── paywall.tsx      # Subscription paywall modal
│   ├── my-vibe.tsx      # My Vibe & Profile screen
│   └── (tabs)/
│       ├── _layout.tsx         # Tab navigation (5 tabs)
│       ├── index.tsx           # Home tab (hero welcome screen)
│       ├── reply-generator.tsx # Replies tab (reply generation interface)
│       ├── profile-analysis.tsx # Analyze tab
│       ├── account.tsx         # Account tab
│       └── settings.tsx        # Settings tab
├── components/
│   ├── SplashScreen.tsx
│   ├── DisclaimerModal.tsx
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx          # Hero welcome screen
│   ├── ProfileAnalysisScreen.tsx
│   ├── AccountScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── MyVibeScreen.tsx        # Persona & profile editor
│   ├── TokenCounter.tsx
│   ├── StyleButton.tsx
│   ├── ReplyBubble.tsx
│   └── CollapsibleSection.tsx
└── lib/
    ├── constants.ts     # Colors, tone options, action options, legal text
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

- **Free Plan**: 3 replies per day (resets at midnight), screenshot analysis disabled
- **Silver Plan**: 1,500 replies per month ($9.95/mo), screenshot analysis enabled
- **Gold Plan**: 3,000 replies per month ($17.95/mo), screenshot analysis enabled
- Each "Generate Replies" costs 1 token
- Local storage only (AsyncStorage)

## Subscription Products (for App Store Connect / Play Console)

- `rizzassist.silver.monthly` - $9.95/month (1,500 replies)
- `rizzassist.gold.monthly` - $17.95/month (3,000 replies)

## Legal

- Terms of Service and Privacy Policy included in Settings
- Disclaimer shown on first launch
- Contact: contact@rizzassist.pro
- Governing Law: New South Wales, Australia
