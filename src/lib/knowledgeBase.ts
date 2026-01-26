// Rizz Assist Pro - Knowledge Base for AI Reply Generation
// This file contains texting strategies, techniques, and examples
// to help generate contextual, effective replies

export interface TechniqueExample {
  text: string;
  note?: string;
}

export interface TextingTechnique {
  name: string;
  description: string;
  examples: TechniqueExample[];
}

export interface StyleGuidance {
  principles: string[];
  techniques: TextingTechnique[];
  doNots: string[];
}

// Core texting principles that apply across all styles
export const CORE_PRINCIPLES = [
  "Be playful and non-needy - avoid desperation",
  "Use emoticons and 'lol'/'haha' to soften cocky messages",
  "Mix humor with confidence - being too cocky alone seems arrogant",
  "Keep messages concise and easy to respond to",
  "Use nicknames to create familiarity (brat, trouble, nerd, etc.)",
  "Push-pull balance: show interest while being a challenge",
  "Role reversals work well - flip the script on who's chasing whom",
  "Qualification shows high value - test her playfully",
  "Be unpredictable and random - avoid boring and predictable",
  "Never double-text when upset - stay unaffected",
];

// Style-specific guidance for AI reply generation
export const STYLE_GUIDANCE: Record<string, StyleGuidance> = {
  flirty: {
    principles: [
      "Show interest in a fun, light way",
      "Create playful tension without being too forward",
      "Use push-pull dynamics",
      "Make her smile while feeling desired",
    ],
    techniques: [
      {
        name: "Push-Pull",
        description: "Balance showing interest with being a challenge",
        examples: [
          { text: "Out of all the [name]s I know... I think you're my favorite ;)", note: "Shows interest while implying options" },
          { text: "You just popped into my head so Hi...now please stay out of there", note: "Shows thinking of her while being playful" },
          { text: "Something about you always makes me smile... don't let it go to your head though :p" },
        ],
      },
      {
        name: "Compliment with Tease",
        description: "Give a compliment but add playful element",
        examples: [
          { text: "You're kinda cute... but don't get any ideas :)" },
          { text: "You kind of impressed me today... and I don't impress easily ;)" },
          { text: "I have a confession... you're actually pretty cool. There I said it." },
        ],
      },
    ],
    doNots: [
      "Don't be too eager or available",
      "Don't overload with compliments",
      "Don't seem desperate for a response",
    ],
  },

  seductive: {
    principles: [
      "Build tension and intrigue",
      "Be suggestive without being crude",
      "Create anticipation",
      "Let imagination do the work",
    ],
    techniques: [
      {
        name: "Suggestive Playfulness",
        description: "Hint at attraction without being explicit",
        examples: [
          { text: "Thinking of you... (and taking cold showers) :p" },
          { text: "You must be using some weird magic on me... I'm onto you ;)" },
          { text: "Dangerous game you're playing... I like it" },
        ],
      },
      {
        name: "Role Reversal Seduction",
        description: "Frame her as the one pursuing you",
        examples: [
          { text: "Stop thinking about me... I can feel your thoughts all over me :p" },
          { text: "Promise you won't try to take advantage of me when we hang out" },
          { text: "I just don't think we should do this anymore... sometimes you make me feel like just a piece of meat :p" },
        ],
      },
    ],
    doNots: [
      "Don't be vulgar or explicit too early",
      "Don't seem like a creep",
      "Don't push if she's not reciprocating",
    ],
  },

  funny: {
    principles: [
      "Be random and unpredictable",
      "Self-deprecating humor works well",
      "Absurdist humor stands out",
      "Callback humor from previous conversations",
    ],
    techniques: [
      {
        name: "Random Humor",
        description: "Send unexpected, absurd messages",
        examples: [
          { text: "You know what I hate? When you're minding your own business then... BAM! Flying monkeys." },
          { text: "Did you know a blue whale's tongue weighs as much as an elephant? Gotta love animal planet ;)" },
          { text: "I've got a problem I need your help with... why was the energizer bunny arrested?" },
        ],
      },
      {
        name: "Bait and Switch",
        description: "Set up an expectation then flip it",
        examples: [
          { text: "Maybe it's the booze talking, but I want you to know... I love... booze." },
          { text: "Those innocent eyes, those juicy lips, a great smile, so hot! But enough about me, what are you up to?" },
          { text: "I really miss you and want to see you badly BUT this security guard won't let me in the zoo. Can you escape?" },
        ],
      },
      {
        name: "Games",
        description: "Interactive fun that shows playful side",
        examples: [
          { text: "Tag you're it! No tag backs" },
          { text: "I'm bored, let's play a game - ask me a question" },
          { text: "I'm winning! (attach random picture)" },
        ],
      },
    ],
    doNots: [
      "Don't be mean-spirited",
      "Don't make jokes that require too much context",
      "Don't overdo it - mix in genuine moments",
    ],
  },

  roast: {
    principles: [
      "Tease playfully, never be cruel",
      "Always use emoticons to show it's playful",
      "Only use if rapport is already established",
      "Be ready to receive it back",
    ],
    techniques: [
      {
        name: "Cocky-Funny Teasing",
        description: "Mix confidence with humor for teasing",
        examples: [
          { text: "Two billion years of evolution and that's the best you can come up with? :p" },
          { text: "That's minus 2 cool points :p" },
          { text: "I just made you open your phone for no reason... looks like I got you in check :p" },
        ],
      },
      {
        name: "Playful Nicknames",
        description: "Use teasing nicknames",
        examples: [
          { text: "How's my favorite little brat doing?" },
          { text: "Hey troublemaker, what kind of mischief are you causing?" },
          { text: "What's up goofball?" },
        ],
      },
    ],
    doNots: [
      "Don't be actually mean or hurtful",
      "Don't attack insecurities",
      "Don't use without softening with emoticons",
    ],
  },

  smooth: {
    principles: [
      "Be confident without being cocky",
      "Show genuine interest smoothly",
      "Be effortlessly cool",
      "Quality over quantity in words",
    ],
    techniques: [
      {
        name: "Effortless Connection",
        description: "Show you're on the same wavelength",
        examples: [
          { text: "I see you... and I like what I see" },
          { text: "That's my kind of energy" },
          { text: "You get it. Most people don't." },
        ],
      },
      {
        name: "Confident Interest",
        description: "Show interest without seeking validation",
        examples: [
          { text: "I've decided to make you my new texting buddy... congrats ;)" },
          { text: "You know what, you're alright. I think I'll keep you around." },
          { text: "Something tells me you're exactly the kind of trouble I've been looking for" },
        ],
      },
    ],
    doNots: [
      "Don't try too hard",
      "Don't use cheesy pickup lines",
      "Don't be robotic or scripted",
    ],
  },

  compliment: {
    principles: [
      "Be specific rather than generic",
      "Compliment personality/energy over just looks",
      "Don't overdo it - one good compliment beats many weak ones",
      "Make it feel genuine and earned",
    ],
    techniques: [
      {
        name: "Personality Compliments",
        description: "Focus on who they are, not just looks",
        examples: [
          { text: "You've got this energy about you... can't quite put my finger on it but I dig it" },
          { text: "Your vibe is different. Good different." },
          { text: "You know what I like about you? You don't try to be anyone else." },
        ],
      },
      {
        name: "Qualified Compliments",
        description: "Compliment with a playful qualifier",
        examples: [
          { text: "I gotta admit, you kinda impressed me... and that's not easy to do" },
          { text: "Okay fine, you're pretty cool. I'll give you that." },
          { text: "Out of all the people I've talked to today, you're definitely top 3 ;)" },
        ],
      },
    ],
    doNots: [
      "Don't be generic ('you're beautiful')",
      "Don't compliment excessively",
      "Don't make it seem like you're trying too hard",
    ],
  },

  askout: {
    principles: [
      "Be direct but casual",
      "Assume compliance - don't ask permission",
      "Make specific plans, not vague suggestions",
      "Add a playful qualifier or restriction",
    ],
    techniques: [
      {
        name: "Direct Invitation",
        description: "Confident, specific invite",
        examples: [
          { text: "I'm checking out this cool spot on Friday. You should come with." },
          { text: "Drinks this week. When are you free?" },
          { text: "Let's grab coffee. What's your schedule like?" },
        ],
      },
      {
        name: "Playful Date Request",
        description: "Ask out with humor attached",
        examples: [
          { text: "If we don't hang out soon I'm gonna start cheating on you ;)" },
          { text: "Tomorrow's gonna be the best night of your life. Why? Because I'm gonna let you hang out with me :p" },
          { text: "I've thought about it long and hard... I've decided to give you a chance. Drinks Friday?" },
        ],
      },
      {
        name: "Role-play Date",
        description: "Use fun scenario to suggest meeting",
        examples: [
          { text: "I'm bored... let's go to Vegas and get married by the fattest Elvis impersonator we can find!" },
          { text: "Hey I've been thinking... wanna rob a bank with me?" },
          { text: "Brr it's cold here... think it's warm in the Bahamas? Pack your bags :p" },
        ],
      },
    ],
    doNots: [
      "Don't ask permission ('would it be okay if...')",
      "Don't be vague ('we should hang sometime')",
      "Don't beg or pressure",
    ],
  },

  getnumber: {
    principles: [
      "Be confident and direct",
      "Frame it as natural next step",
      "Don't ask - tell",
      "Add playful element",
    ],
    techniques: [
      {
        name: "Confident Number Request",
        description: "Direct, assuming compliance",
        examples: [
          { text: "Let's take this off here. What's your number?" },
          { text: "I'd rather text you properly. Drop your number." },
          { text: "This app is annoying. Let's exchange numbers, and if you're cool on the phone, maybe we'll hang out ;)" },
        ],
      },
      {
        name: "Playful Number Request",
        description: "Add humor to the ask",
        examples: [
          { text: "Quick, give me your number before I think of something clever to say" },
          { text: "I'm gonna text you something naughty... so you have my number ;)" },
          { text: "Are you textually active? I'm thinking about making you my new text partner" },
        ],
      },
    ],
    doNots: [
      "Don't beg for the number",
      "Don't explain why you want it",
      "Don't ask multiple times if rejected",
    ],
  },

  tease: {
    principles: [
      "Keep it playful, never mean",
      "Use emoticons to show you're joking",
      "Tease like you would a friend",
      "Accept teasing back gracefully",
    ],
    techniques: [
      {
        name: "Playful Accusations",
        description: "Accuse her of things playfully",
        examples: [
          { text: "Someone's feeling brave today ;)" },
          { text: "Oh you're trouble aren't you? I can tell" },
          { text: "Big talker huh? Let's see if you can back it up :p" },
        ],
      },
      {
        name: "Ranking/Competition",
        description: "Playfully rank or compete",
        examples: [
          { text: "You're my 3rd favorite person I've talked to today... keep it up and you might crack top 2 :p" },
          { text: "Hmm you're in the running for text buddy of the week" },
          { text: "Not bad... I'd give that a solid 7/10. Room for improvement ;)" },
        ],
      },
    ],
    doNots: [
      "Don't hit insecurities",
      "Don't be actually mean",
      "Don't tease without warmth",
    ],
  },

  boldmove: {
    principles: [
      "Be direct and confident",
      "Cut through the typical back-and-forth",
      "Only use when there's clear mutual interest",
      "Own it completely",
    ],
    techniques: [
      {
        name: "Direct Intent",
        description: "Skip the games, be upfront",
        examples: [
          { text: "Let's skip the small talk. I'm into you. You free this weekend?" },
          { text: "I'll be honest - I find you really attractive. Let's do something about it." },
          { text: "Look, I don't do the whole texting forever thing. Let's meet." },
        ],
      },
      {
        name: "Confident Escalation",
        description: "Move things forward confidently",
        examples: [
          { text: "Come over. I'll make it worth your while." },
          { text: "I need some company tonight. You in?" },
          { text: "Want to make tonight interesting?" },
        ],
      },
    ],
    doNots: [
      "Don't use without clear signals of interest",
      "Don't be crude or disrespectful",
      "Don't push if she's not receptive",
    ],
  },
};

// Responses to common situations
export const SITUATIONAL_RESPONSES = {
  sheDoesntRespond: [
    "Wait a day, text again. No response? Wait two days. Still nothing? Wait three.",
    "Don't double-text with 'hello?' or '???' - seems desperate",
    "Try: 'Sorry forgot to get back to you, I was [something fun/high value]'",
    "Or: 'You failed the text message reflex test :p'",
  ],

  sheFlakes: [
    "Stay unaffected - you have other options",
    "Try: 'No biggie, thanks for letting me know. I can take someone else.'",
    "Or: 'That's minus 5 cool points :p'",
    "Don't get mad or guilt trip",
  ],

  shitTests: [
    "Stay positive and playful - don't be butthurt",
    "Try: 'lol... you're cracking me up right now'",
    "Or: 'You are too adorable... what are we gonna do with you?'",
    "Never take the bait seriously",
  ],
};

// How to answer common questions she might ask
export const QUESTION_RESPONSES = {
  whatAreYouDoing: [
    "Tonight's my weekly melted haagen-dazs bath!",
    "Well... I'm moonlighting as an exotic dancer ;)",
    "Oh just busy fighting evil terrorists and rescuing orphans, ya know the usual",
    "Thinking of you... (and taking cold showers) :p",
  ],

  whoIsThis: [
    "[Your name]... you know... Prince Charming... here to sweep you off your feet",
    "[Your name]... the man of your dreams... duh",
  ],

  howAreYou: [
    "What in bed?... jeez you're forward! :p",
    "Better now that you texted ;)",
    "Living the dream... mostly",
  ],
};

// Generate style-specific prompts for AI
export function getStylePrompt(styleId: string): string {
  const guidance = STYLE_GUIDANCE[styleId];
  if (!guidance) return "";

  const principles = guidance.principles.join("\n- ");
  const doNots = guidance.doNots.join("\n- ");

  const exampleTexts = guidance.techniques
    .flatMap(t => t.examples.map(e => e.text))
    .slice(0, 5)
    .join("\n- ");

  return `
Style: ${styleId.toUpperCase()}

Principles:
- ${principles}

Example messages in this style:
- ${exampleTexts}

Do NOT:
- ${doNots}

Core texting principles to always follow:
- ${CORE_PRINCIPLES.slice(0, 5).join("\n- ")}
`;
}
