# Rizz Assist Pro

AI-powered dating assistant app that generates contextual reply suggestions based on conversation messages.

## Features

- **10 Reply Styles**: Flirty, Seductive, Funny, Roast, Smooth, Compliment, Ask Out, Get Number, Tease, Bold Move
- **Token System**: 5 free lifetime replies, Pro users get 25 tokens/week
- **Subscription**: Monthly ($10.99) or Yearly ($109.99 - 17% savings)
- **Dark Mode**: Beautiful purple-to-pink gradient design

## App Flow

1. **Splash Screen** (2s) - Animated logo and branding
2. **Disclaimer Modal** - User must accept terms on first launch
3. **Onboarding** (3 screens) - Feature introduction
4. **Home Screen** - Main reply generation interface
5. **Paywall** - Upgrade to Pro modal
6. **Settings** - Account management and legal documents

## Structure

```
src/
├── app/
│   ├── _layout.tsx      # Root layout with app flow
│   ├── paywall.tsx      # Subscription paywall modal
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
│   ├── TokenCounter.tsx
│   ├── StyleButton.tsx
│   ├── ReplyBubble.tsx
│   └── CollapsibleSection.tsx
└── lib/
    ├── constants.ts     # Colors, mock data, legal text
    ├── tokenStore.ts    # Zustand store with AsyncStorage
    └── cn.ts            # Tailwind class merger
```

## Token System

- **Free Users**: 5 lifetime tokens
- **Pro Users**: 25 tokens/week (resets Sunday)
- Each "Generate 5 Replies" costs 1 token
- Local storage only (AsyncStorage)

## Subscription Products (for App Store Connect / Play Console)

- `rizzassist.pro.monthly` - $10.99/month
- `rizzassist.pro.yearly` - $109.99/year

## TODO: Native Purchases

The app includes placeholder code for StoreKit 2 (iOS) and Play Billing (Android):

```typescript
// iOS StoreKit 2
const mockMonthlyPurchase = async () => {
    console.log("TODO: StoreKit 2 - rizzassist.pro.monthly");
    setProStatus(true); setTokens(25);
};

// Android Play Billing
const mockYearlyPurchase = async () => {
    console.log("TODO: BillingClient - rizzassist.pro.yearly");
    setProStatus(true); setTokens(25);
};
```

## Legal

- Terms of Service and Privacy Policy included in Settings
- Disclaimer shown on first launch
- Contact: contact@rizzassist.pro
- Governing Law: New South Wales, Australia
