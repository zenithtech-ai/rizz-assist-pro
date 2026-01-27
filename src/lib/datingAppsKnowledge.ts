// Dating Apps Profile Knowledge Base
// Research-backed best practices for optimizing profiles on popular dating apps

export const DATING_APPS = [
  { id: 'tinder', label: 'Tinder', emoji: '🔥' },
  { id: 'bumble', label: 'Bumble', emoji: '🐝' },
  { id: 'hinge', label: 'Hinge', emoji: '💍' },
  { id: 'facebook-dating', label: 'Facebook Dating', emoji: '👤' },
  { id: 'match', label: 'Match', emoji: '❤️' },
  { id: 'eharmony', label: 'eHarmony', emoji: '💕' },
  { id: 'okCupid', label: 'OkCupid', emoji: '⭐' },
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
] as const;

export type DatingAppId = typeof DATING_APPS[number]['id'];

// Profile field templates for each app
export const APP_PROFILE_FIELDS: Record<DatingAppId, {
  name: string;
  fields: Array<{ key: string; label: string; placeholder: string; type: 'short' | 'long' }>;
  characterLimits: Record<string, number>;
}> = {
  tinder: {
    name: 'Tinder',
    fields: [
      {
        key: 'bio',
        label: 'Bio',
        placeholder: 'Short, witty, memorable bio',
        type: 'short',
      },
      {
        key: 'interests',
        label: 'Interests & Hobbies',
        placeholder: 'What you like to do',
        type: 'short',
      },
    ],
    characterLimits: { bio: 500, interests: 200 },
  },
  bumble: {
    name: 'Bumble',
    fields: [
      {
        key: 'headline',
        label: 'Headline',
        placeholder: 'Catchy first line (40 chars)',
        type: 'short',
      },
      {
        key: 'bio',
        label: 'Full Bio',
        placeholder: 'Tell them about yourself',
        type: 'long',
      },
      {
        key: 'firstDateIdea',
        label: 'First Date Idea',
        placeholder: 'Where would you take them?',
        type: 'short',
      },
    ],
    characterLimits: { headline: 40, bio: 500, firstDateIdea: 100 },
  },
  hinge: {
    name: 'Hinge',
    fields: [
      {
        key: 'aboutMe',
        label: 'About Me',
        placeholder: 'Who are you? (300 chars)',
        type: 'long',
      },
      {
        key: 'ideaForDate',
        label: 'Idea for a Date',
        placeholder: 'Specific date idea',
        type: 'short',
      },
      {
        key: 'mostUnexpectedThing',
        label: 'Most Unexpected Fact',
        placeholder: 'Something surprising about you',
        type: 'short',
      },
      {
        key: 'favoriteTravel',
        label: 'Favorite Travel Experience',
        placeholder: 'A memorable trip',
        type: 'short',
      },
    ],
    characterLimits: {
      aboutMe: 300,
      ideaForDate: 150,
      mostUnexpectedThing: 150,
      favoriteTravel: 150,
    },
  },
  'facebook-dating': {
    name: 'Facebook Dating',
    fields: [
      {
        key: 'about',
        label: 'About',
        placeholder: 'Your personality and interests',
        type: 'long',
      },
      {
        key: 'workEducation',
        label: 'Work & Education',
        placeholder: 'Career and education details',
        type: 'short',
      },
      {
        key: 'fitness',
        label: 'Fitness & Lifestyle',
        placeholder: 'How you stay active',
        type: 'short',
      },
    ],
    characterLimits: { about: 500, workEducation: 150, fitness: 150 },
  },
  match: {
    name: 'Match',
    fields: [
      {
        key: 'aboutMe',
        label: 'About Me',
        placeholder: 'Detailed profile about yourself',
        type: 'long',
      },
      {
        key: 'lookingFor',
        label: 'Looking For',
        placeholder: 'What you want in a partner',
        type: 'long',
      },
      {
        key: 'lifestyle',
        label: 'Lifestyle & Interests',
        placeholder: 'Your daily life and hobbies',
        type: 'short',
      },
    ],
    characterLimits: { aboutMe: 1000, lookingFor: 1000, lifestyle: 250 },
  },
  eharmony: {
    name: 'eHarmony',
    fields: [
      {
        key: 'about',
        label: 'About You (Essay)',
        placeholder: 'Open-ended description of yourself',
        type: 'long',
      },
      {
        key: 'interests',
        label: 'Interests',
        placeholder: 'Things you enjoy',
        type: 'long',
      },
      {
        key: 'lookingFor',
        label: 'Ideal Relationship',
        placeholder: 'What you want from a relationship',
        type: 'long',
      },
    ],
    characterLimits: { about: 1500, interests: 1000, lookingFor: 1000 },
  },
  okCupid: {
    name: 'OkCupid',
    fields: [
      {
        key: 'aboutMe',
        label: 'About Me',
        placeholder: 'Tell them who you are',
        type: 'long',
      },
      {
        key: 'thinkingAbout',
        label: 'What I\'m Thinking About',
        placeholder: 'Current thoughts or projects',
        type: 'short',
      },
      {
        key: 'favoriteThings',
        label: 'Favorite Things',
        placeholder: 'Music, movies, books, etc.',
        type: 'long',
      },
    ],
    characterLimits: { aboutMe: 1000, thinkingAbout: 200, favoriteThings: 500 },
  },
  instagram: {
    name: 'Instagram Bio',
    fields: [
      {
        key: 'bio',
        label: 'Bio',
        placeholder: 'Instagram bio (150 chars max)',
        type: 'short',
      },
      {
        key: 'highlights',
        label: 'About Highlights',
        placeholder: 'What your story highlights say',
        type: 'short',
      },
    ],
    characterLimits: { bio: 150, highlights: 150 },
  },
};

// Best practices for each app
export const APP_BEST_PRACTICES: Record<DatingAppId, {
  name: string;
  tips: string[];
  dosDontsList: { dos: string[]; donts: string[] };
  bioStyle: string;
  sampleGood: string[];
}> = {
  tinder: {
    name: 'Tinder',
    bioStyle: 'Short, punchy, witty - make them swipe right',
    tips: [
      'Keep it under 150 characters for maximum impact',
      'Lead with your personality/humor, not just interests',
      'Include a specific, non-generic conversation starter',
      'Use emojis strategically (1-3 max)',
      'Avoid group photos - use clear, recent single photos',
      'Avoid bragging or listing accomplishments',
      'Create intrigue or tell a memorable hook',
    ],
    dosDontsList: {
      dos: [
        'Be genuine and authentic to your vibe',
        'Show personality immediately',
        'Include a laugh or memorable moment',
        'Use humor or wit',
        'Reference something specific about your life',
        'Make it easy for matches to start conversation',
      ],
      donts: [
        'Don\'t use clichés ("Let\'s see what happens")',
        'Don\'t list random facts',
        'Don\'t ask for followers/socials',
        'Don\'t be negative or complain',
        'Don\'t try too hard to be funny',
        'Don\'t mention exes or dating preferences',
      ],
    },
    sampleGood: [
      'not a vegetable but i\'m here to turnip the dating scene',
      'just here to prove my mom wrong - dating apps are great',
      'looking for someone to share terrible movie opinions with',
    ],
  },
  bumble: {
    name: 'Bumble',
    bioStyle: 'Confident, clear intention - women make the first move so stand out',
    tips: [
      'Headline should grab attention in 40 characters or less',
      'Be specific about what you\'re looking for',
      'Show confidence (this is about women initiating)',
      'Include a clear, actionable first date idea',
      'Be warm and approachable in tone',
      'Mention something about yourself that\'s genuine',
      'Avoid anything that sounds cocky or dismissive',
    ],
    dosDontsList: {
      dos: [
        'Have a strong, confident headline',
        'Be specific about your first date idea',
        'Show you\'re looking for something real',
        'Be warm and welcoming',
        'Display sense of humor',
        'Mention shared interests women might have',
      ],
      donts: [
        'Don\'t minimize women or make assumptions',
        'Don\'t be too cutesy or try-hard',
        'Don\'t mention your dating history',
        'Don\'t ask what they\'re looking for',
        'Don\'t be vague about intentions',
        'Don\'t complain or be negative',
      ],
    },
    sampleGood: [
      'Adventure buddy wanted - coffee then hiking?',
      'Dog lover, travel planner, competitive at board games',
      'Let\'s grab coffee and see where the conversation goes',
    ],
  },
  hinge: {
    name: 'Hinge',
    bioStyle: 'Thoughtful, specific, relationship-focused - "The Dating App Designed to Be Deleted"',
    tips: [
      'Be genuine and thoughtful - people here want real connections',
      'Specific details beat generic statements',
      'Answer the prompts with personality AND vulnerability',
      'Mention something unique about yourself',
      'Include a concrete, interesting first date idea',
      'Show emotional intelligence and self-awareness',
      'Avoid pickup lines or trying to be overly clever',
    ],
    dosDontsList: {
      dos: [
        'Be authentic and genuine',
        'Share specific details about your life',
        'Show what you\'re passionate about',
        'Include a concrete date idea',
        'Display self-awareness',
        'Be warm and approachable',
        'Use prompts to show personality',
      ],
      donts: [
        'Don\'t be generic or vague',
        'Don\'t try pickup lines',
        'Don\'t focus only on dating preferences',
        'Don\'t be negative or jaded',
        'Don\'t use clichés',
        'Don\'t try to seem cool - be real',
      ],
    },
    sampleGood: [
      'I once biked 50 miles just to try a pizza place. That\'s the kind of commitment you can expect.',
      'Looking for someone to cook elaborate Sunday breakfasts with and debate whether we\'re doing it right',
      'Fitness is my therapy, cooking is my love language, great conversation is oxygen',
    ],
  },
  'facebook-dating': {
    name: 'Facebook Dating',
    bioStyle: 'Casual, friendly, accessible - leverages your existing Facebook data',
    tips: [
      'Keep a casual, friendly tone',
      'Your existing FB info will show, so be thoughtful about what\'s public',
      'Be genuine but not overly formal',
      'Include both interests and what you\'re looking for',
      'Mention lifestyle/values to attract compatible matches',
      'Be specific but approachable',
      'Show your personality beyond surface level',
    ],
    dosDontsList: {
      dos: [
        'Be casual and friendly',
        'Mention your genuine interests',
        'Show your lifestyle',
        'Be clear about what you want',
        'Display personality',
        'Be respectful and authentic',
      ],
      donts: [
        'Don\'t be too formal',
        'Don\'t post controversial content',
        'Don\'t be overly focused on looks',
        'Don\'t share personal info like address',
        'Don\'t be negative',
        'Don\'t assume anything',
      ],
    },
    sampleGood: [
      'Coffee addict, weekend hiker, dog parent looking for genuine connection',
      'Work hard, play harder - looking for someone with real interests and ambition',
      'Foodie, traveler, dog lover - ready to find someone to explore the city with',
    ],
  },
  match: {
    name: 'Match',
    bioStyle: 'Detailed and thoughtful - more room to show substance and depth',
    tips: [
      'Use the full space to tell your story authentically',
      'Balance describing yourself with what you want',
      'Be specific about your goals and values',
      'Show depth and emotional intelligence',
      'Mention both big interests and small quirks',
      'Be honest about what you\'re looking for',
      'Avoid being too reserved or too aggressive',
    ],
    dosDontsList: {
      dos: [
        'Tell your story with substance',
        'Be specific and detailed',
        'Show your values and goals',
        'Display emotional maturity',
        'Mention what matters to you',
        'Be honest about intentions',
        'Show personality and depth',
      ],
      donts: [
        'Don\'t be overly formal',
        'Don\'t write a novel',
        'Don\'t focus only on past relationships',
        'Don\'t be negative',
        'Don\'t list demands',
        'Don\'t try too hard',
      ],
    },
    sampleGood: [
      'Marketing manager who\'d rather be traveling. Passionate about good food, better conversation, and finding someone to share adventures with. Looking for someone genuine.',
      'Creative, thoughtful, and looking for depth. My ideal weekend involves new restaurants, hiking trails, or a good book. Seeking someone who values growth.',
      'Family-oriented professional who believes in kindness and growth. Love trying new experiences and honest conversations. Ready for something real.',
    ],
  },
  eharmony: {
    name: 'eHarmony',
    bioStyle: 'Reflective, thoughtful, values-driven - compatibility-focused platform',
    tips: [
      'Focus on values and what matters most to you',
      'Be thoughtful and introspective',
      'Show emotional maturity and self-awareness',
      'Mention both who you are and what you\'re seeking',
      'Be specific about interests and lifestyle',
      'Show you\'re serious about finding connection',
      'Be authentic about your goals and values',
    ],
    dosDontsList: {
      dos: [
        'Be thoughtful and reflective',
        'Share your values and what matters',
        'Show emotional intelligence',
        'Be specific and detailed',
        'Display self-awareness',
        'Be genuine about seeking partnership',
        'Show depth and substance',
      ],
      donts: [
        'Don\'t be vague or generic',
        'Don\'t focus only on looks',
        'Don\'t be negative about past relationships',
        'Don\'t seem desperate',
        'Don\'t be dishonest',
        'Don\'t try to be something you\'re not',
      ],
    },
    sampleGood: [
      'Driven professional who values depth in both career and relationships. I\'m looking for someone who appreciates meaningful conversation, shared values, and genuine connection. My ideal partner is kind, ambitious, and ready for something real.',
      'I believe the best relationships are built on honesty and shared values. Creative, compassionate, and ready for partnership. Seeking someone genuine who wants to build something meaningful.',
      'Looking for genuine connection with someone who values growth, kindness, and authenticity. I\'m passionate about my work, my family, and finding someone to share life\'s adventures with.',
    ],
  },
  okCupid: {
    name: 'OkCupid',
    bioStyle: 'Fun, quirky, detailed - algorithm-based matching so be specific',
    tips: [
      'The algorithm loves details - be specific about preferences and interests',
      'Show personality and humor',
      'Answer "About Me" and "Favorite Things" thoroughly',
      'Include both serious and playful elements',
      'Mention what makes you unique or different',
      'Be honest about what you\'re looking for',
      'Show self-awareness and wit',
    ],
    dosDontsList: {
      dos: [
        'Be detailed and specific',
        'Show your personality',
        'Mention unique interests',
        'Include both serious and fun elements',
        'Be honest and authentic',
        'Display humor and wit',
        'Mention your passions',
      ],
      donts: [
        'Don\'t be generic',
        'Don\'t be too serious',
        'Don\'t avoid being yourself',
        'Don\'t ignore the matching questions',
        'Don\'t be negative',
        'Don\'t try too hard',
      ],
    },
    sampleGood: [
      'Favorite things: hiking, cooking, indie films, board games with friends. I\'m that person who needs an obscure coffee order. Looking for intelligent conversation and genuine connection.',
      'Creative type who loves trying new restaurants, traveling on weekends, and deep conversations. Passionate about [your interests]. Seeking someone real who values growth.',
      'Bookworm, music nerd, adventure seeker. I believe the best dates involve discovering new places and good conversation. Looking for genuine connection with someone interesting.',
    ],
  },
  instagram: {
    name: 'Instagram Bio',
    bioStyle: 'Ultra-short, punchy, clever - make them want to follow and DM',
    tips: [
      'Extremely limited space (150 chars) - make every character count',
      'Be clever, punchy, and memorable',
      'Include a hook or conversation starter',
      'Use emojis strategically to add personality',
      'Show your main interest or vibe',
      'Make it easy to take you seriously as a dating option',
      'Stand out from typical Instagram bios',
    ],
    dosDontsList: {
      dos: [
        'Be memorable and unique',
        'Use humor or wit',
        'Include a hook',
        'Use emojis wisely',
        'Show personality',
        'Be creative',
        'Make it fun',
      ],
      donts: [
        'Don\'t be boring or generic',
        'Don\'t overstuff with emojis',
        'Don\'t make it too long',
        'Don\'t be serious',
        'Don\'t try too hard',
        'Don\'t use clichés',
      ],
    },
    sampleGood: [
      '📸 Adventure seeker | 🍕 Pizza connoisseur | 🎬 Movie nerd → let\'s grab coffee?',
      'Sarcasm is my love language 💬 | Dog parent 🐕 | DM me your favorite meme',
      'Hiking, cooking, terrible jokes 📍 Always up for an adventure',
    ],
  },
};

// Profile optimization tips
export const PROFILE_OPTIMIZATION_TIPS = {
  photos: [
    'Use clear, well-lit photos - recent ones within last 6 months',
    'First photo should be a clear headshot/face photo',
    'Include variety - headshot, full body, activity photo',
    'Avoid group photos (people can\'t tell who you are)',
    'Avoid mirror selfies (low quality/effort)',
    'Show genuine smile and natural look',
    'Avoid filters or heavy editing',
    'Use natural lighting when possible',
  ],
  universalBioTips: [
    'Hook them in first sentence - make them want to read more',
    'Show personality immediately - not just facts',
    'Be specific - "I love coffee" vs "I love trying new coffee shops on weekends"',
    'Avoid clichés - "Here for a good time" or "Ask me"',
    'Make it easy to start a conversation',
    'Show what makes you different/unique',
    'Be genuine - authenticity attracts real matches',
    'Proofread - typos signal low effort',
    'Avoid being negative or complaining',
    'Show humor if it\'s your style, but don\'t force it',
  ],
  conversationStarters: [
    'Reference something specific they might ask about',
    'Ask a question that\'s easy to answer',
    'Make a statement that shows personality',
    'Include an interest that\'s easy to relate to',
    'Give them multiple angles to start a conversation',
  ],
};
