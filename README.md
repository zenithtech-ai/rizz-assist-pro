# Rizz Assist Pro

AI-powered dating assistant app that generates contextual reply suggestions based on conversation messages.

## Features

- **11 Tone Options**: Flirty, Seductive, Cheeky/Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Thoughtful Deep, Adventurous Fun, Compliment
- **3 Action Intents**: Roast, Ask Out, Ask for Number (can be combined with any tone)
- **Tone + Action Combinations**: Select both tone and action to generate replies that embody the tone while achieving the action goals
- **9 Persona Presets**: Cheeky Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Edgy Sarcastic, Thoughtful Deep, Adventurous Fun
- **Custom Persona**: Define your own personality/style
- **About Me Profile**: Add personal details (likes, dislikes, quirks) for more personalized replies (Silver & Gold only)
- **Dating App Profile Optimizer** (PRO): Optimize profiles for 8 popular dating apps with AI-powered suggestions:
  - Tinder, Bumble, Hinge, Facebook Dating, Match, eHarmony, OkCupid, Instagram
  - App-specific best practices and character limits
  - AI-generated improvement suggestions
  - Optimized profiles with tips for each app
- **Profile Analysis**: Upload dating profile screenshots to analyze and generate tailored openers
- **Screenshot Analysis**: Upload conversation screenshots for AI to read and respond to (Silver & Gold only)
- **Token System**: Free users get 3 replies/day, Silver gets 1,500/month, Gold gets 3,000/month
- **Subscription Plans**:
  - Free: 3 replies/day, no screenshot analysis, no dating app profiles
  - Silver: $9.95/month, 1,500 replies/month, screenshot analysis + dating app profiles
  - Gold: $17.95/month, 3,000 replies/month, screenshot analysis + dating app profiles
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
│   ├── dating-app-detail.tsx  # Dating app detail screen (focused single app)
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
│   ├── MyVibeScreen.tsx        # Persona & profile editor (list of dating apps)
│   ├── DatingAppsEditor.tsx    # Dating apps profile editor (used on detail screen)
│   ├── TokenCounter.tsx
│   ├── StyleButton.tsx
│   ├── ReplyBubble.tsx
│   └── CollapsibleSection.tsx
└── lib/
    ├── constants.ts                # Colors, tone options, action options, legal text
    ├── datingAppsKnowledge.ts      # Dating apps profiles, fields, best practices
    ├── profileOptimizer.ts         # AI profile optimizer using OpenAI
    ├── knowledgeBase.ts            # AI knowledge base for reply generation
    ├── openai.ts                   # OpenAI GPT-4o API integration with persona injection
    ├── replyGenerator.ts           # Local fallback reply generator
    ├── stylePromptBuilder.ts       # Tone + action instruction builder
    ├── tokenStore.ts               # Zustand store for tokens/subscription
    ├── personaStore.ts             # Zustand store for personas, about me, dating app profiles
    └── cn.ts                       # Tailwind class merger
```

## Dating App Profile Optimizer (PRO Feature)

The app includes a powerful **Dating App Profile Optimizer** that helps users optimize their profiles for 8 popular dating apps using AI-powered suggestions.

### How It Works Now

1. **View Dating Apps List**: In the My Profile tab, paid users see a list of 8 dating apps with navigation
2. **Click an App**: Tap any app to navigate to a dedicated detail screen showing **ONLY that app** (clean, focused view)
3. **Auto-Expanded & Locked**: The selected app is automatically expanded on the detail screen with all fields visible and ready to edit (cannot be collapsed)
4. **Get AI Suggestions**: Click "Optimize" to receive app-specific improvement suggestions
5. **Apply & Save**: Apply suggestions and click Save to store profile locally (app stays expanded)
6. **Delete Profile**: Click the delete button (trash icon) to clear all text in that profile (app stays expanded)
7. **Back Button**: Use the back button in the header to return to the apps list

### AI Optimization Features

- **App-Specific Best Practices**: Each app has research-backed dos and don'ts
- **Character Limit Enforcement**: Respects maximum character counts per field
- **Improvement Suggestions**: 2-3 targeted suggestions with reasoning
- **Personalization**: Uses your "About Me" to make suggestions personal
- **Specific Tips**: App-specific writing style guidance

### Best Practices Knowledge Base

The optimizer is trained on best practices for each app:

**Tinder**: Keep it under 150 chars, lead with personality, include conversation hooks
**Bumble**: Strong headline (40 chars), specific first date idea, warm tone
**Hinge**: Specific details, relationship-focused, answer prompts thoughtfully
**Facebook Dating**: Casual & friendly, mention lifestyle & values, be respectful
**Match**: Tell your story with substance, balance self-description with seeking
**eHarmony**: Reflective & thoughtful, focus on values, show emotional maturity
**OkCupid**: Detailed & specific, show personality & quirks, answer matching questions
**Instagram**: Memorable hook, strategic emoji use, make them want to follow

## Tone + Action System

The app now has a powerful **Tone + Action Combination System** that works in both the Reply Generator and Profile Analyzer:

### How It Works

**Tones** define your overall vibe (single select):
- Flirty, Seductive, Cheeky/Tease, Smooth Charmer, Witty Banter, Bold Direct, Mysterious Intrigue, Cute Wholesome, Thoughtful Deep, Adventurous Fun, Compliment

**Actions** define what you want to accomplish (multi-select):
- Roast (playfully criticize their message)
- Ask Out (suggest plans/date)
- Ask for Number (get their contact info)

### Combined Effect

When both tone and action are selected, the AI applies **BOTH simultaneously**:
- Example: "Flirty + Ask Out" → Playful teasing while suggesting to hang out
- Example: "Bold Direct + Get Number" → Straightforward, confident request for their number
- Example: "Witty Banter + Roast" → Clever humor while making fun of them

The system prompt explicitly instructs the AI to apply both the tone/vibe AND all selected action goals together.

### Implementation Details

- **Style Prompt Builder** (`src/lib/stylePromptBuilder.ts`): Maps tone+action combos to detailed AI instructions
- **Tone Instructions**: Specific guidance on tone/voice (e.g., "Use playful, teasing, light vibe with suggestive language")
- **Action Instructions**: Clear goals (e.g., "Explicitly suggest plans with a specific activity and timeframe")
- **Combined Prompt**: Both TONE and ACTIONS are injected into the system prompt with explicit instruction to apply both
- **User Feedback**: When actions are selected, the UI shows the combined style (e.g., "Flirty + Ask Out") as a badge

### Where It's Used

1. **Reply Generator Tab** - User selects tone + optional actions, then generates replies to a message
2. **Profile Analyzer Tab** - After uploading profile screenshots, user can select tone + actions to customize opener generation

## AI Reply Generation

The app uses **GPT-4o** to generate contextual, style-specific replies:

- **Primary**: OpenAI GPT-4o API (`src/lib/openai.ts`)
- **Fallback**: Local template-based generator (`src/lib/replyGenerator.ts`)
- **Vision**: Screenshot analysis with GPT-4o vision

### Tone + Action Prompt Injection

The AI system prompt now includes:
- **Tone Instructions**: How to sound (vibe, voice, examples)
- **Action Instructions**: What to accomplish (goals, requirements)
- **User's About Me**: Personal details to make replies authentic (Silver & Gold only)
- **Explicit Instruction**: "Apply BOTH the TONE and ALL selected ACTIONS together"
- **Human Texting Rules**: Strict formatting rules to sound natural (contractions, fillers, no emojis, etc.)

### Prompt Caching

The system prompt is structured for OpenAI prompt caching:
- Fixed prefix (texting rules, base instructions) - cacheable
- Dynamic suffix (tone instructions, action instructions, about me) - injected per request

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
