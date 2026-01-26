// Rizz Assist Pro - Reply Generator
// Generates 3 contextual replies based on the pasted message and selected style

import { ReplyStyleId } from './constants';

export type ResponseLength = 'short' | 'long';

// Response templates that incorporate the input message context
const STYLE_TEMPLATES: Record<ReplyStyleId, (input: string, length: ResponseLength) => string[]> = {
  flirty: (input, length) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const longSuffix = length === 'long' ? ' What about you?' : '';
    const shortSuffix = length === 'short' ? '' : ' Tell me more...';

    if (hasQuestion) {
      return [
        `Wouldn't you like to know 😏${longSuffix}`,
        `Maybe... if you play your cards right${shortSuffix}`,
        `That depends... what's in it for me?${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Well hello there, trouble 😏${longSuffix}`,
        `Finally, someone worth texting back${shortSuffix}`,
        `You had me at hey... now keep impressing me${longSuffix}`,
      ];
    }
    if (words.includes('cute') || words.includes('hot') || words.includes('beautiful') || words.includes('pretty')) {
      return [
        `You're not so bad yourself 😏${longSuffix}`,
        `Flattery will get you everywhere${shortSuffix}`,
        `Keep talking like that...${longSuffix}`,
      ];
    }
    return [
      `You're trouble aren't you? 😏${longSuffix}`,
      `Bold move... I like it${shortSuffix}`,
      `You definitely have my attention now${longSuffix}`,
    ];
  },

  seductive: (input, length) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const longSuffix = length === 'long' ? ' Come find out.' : '';
    const shortSuffix = length === 'short' ? '' : ' I am waiting...';

    if (hasQuestion) {
      return [
        `Come closer and I will tell you...${longSuffix}`,
        `Why don't you find out for yourself?${shortSuffix}`,
        `Some things are better whispered${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `I have been thinking about you...${longSuffix}`,
        `Finally... I was getting impatient${shortSuffix}`,
        `You kept me waiting... now make it worth my while${longSuffix}`,
      ];
    }
    return [
      `You know exactly what you are doing to me...${longSuffix}`,
      `Slow down... let me catch up${shortSuffix}`,
      `Dangerous game you are playing${longSuffix}`,
    ];
  },

  funny: (input, length) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const longSuffix = length === 'long' ? ' Just kidding... maybe.' : '';
    const shortSuffix = length === 'short' ? '' : ' Want to see my comedy routine?';

    if (hasQuestion) {
      return [
        `Is this a pop quiz? I didn't study${longSuffix}`,
        `*Googles answer frantically*${shortSuffix}`,
        `The answer is 42. Wait, wrong question${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Is this the part where I say something clever?${longSuffix}`,
        `*finger guns* Ayyyy${shortSuffix}`,
        `I have been practicing my entrance. Nailed it, right?${longSuffix}`,
      ];
    }
    return [
      `Warning: I come with dad jokes and zero filter${longSuffix}`,
      `My humor is confusing but my vibes are immaculate${shortSuffix}`,
      `Are you a magician? Because Abraca-dayum${longSuffix}`,
    ];
  },

  roast: (input, length) => {
    const words = input.toLowerCase();
    const isShort = input.length < 20;
    const longSuffix = length === 'long' ? ' But I am into the effort.' : '';
    const shortSuffix = length === 'short' ? '' : ' Try harder next time.';

    if (isShort) {
      return [
        `Wow, really putting in the effort there${longSuffix}`,
        `That is it? That is your opener?${shortSuffix}`,
        `My notifications died for THIS?${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Generic greeting detected. Originality not found${longSuffix}`,
        `Hey? That is your A-game?${shortSuffix}`,
        `I have seen better openers on fortune cookies${longSuffix}`,
      ];
    }
    return [
      `Average at best, but keep trying${longSuffix}`,
      `0/10 would not swipe right${shortSuffix}`,
      `Your game needs serious work${longSuffix}`,
    ];
  },

  smooth: (input, length) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const longSuffix = length === 'long' ? ' I am impressed.' : '';
    const shortSuffix = length === 'short' ? '' : ' Keep going...';

    if (hasQuestion) {
      return [
        `You already know the answer...${longSuffix}`,
        `Exactly what you are hoping${shortSuffix}`,
        `Better than you expected${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `I see you. And I like what I see${longSuffix}`,
        `Perfect timing. I was just thinking about you${shortSuffix}`,
        `Now my day just got interesting${longSuffix}`,
      ];
    }
    return [
      `I see you... and I am here for it${longSuffix}`,
      `That is my kind of vibe${shortSuffix}`,
      `We are definitely on the same wavelength${longSuffix}`,
    ];
  },

  compliment: (input, length) => {
    const words = input.toLowerCase();
    const longSuffix = length === 'long' ? ' I could get used to this.' : '';
    const shortSuffix = length === 'short' ? '' : ' Tell me more about yourself?';

    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Your energy is contagious${longSuffix}`,
        `Something about the way you text... I am into it${shortSuffix}`,
        `You have got great vibes, I can already tell${longSuffix}`,
      ];
    }
    if (words.includes('?')) {
      return [
        `I love that you are not afraid to ask${longSuffix}`,
        `Your curiosity is attractive${shortSuffix}`,
        `That kind of directness is refreshing${longSuffix}`,
      ];
    }
    return [
      `Your smile is dangerous and I am not complaining${longSuffix}`,
      `You have got this energy that is impossible to ignore${shortSuffix}`,
      `That confidence? Incredibly attractive${longSuffix}`,
    ];
  },

  askout: (input, length) => {
    const words = input.toLowerCase();
    const longSuffix = length === 'long' ? ' I know this great place.' : '';
    const shortSuffix = length === 'short' ? '' : ' Your choice where.';

    if (words.includes('busy') || words.includes('free') || words.includes('plans')) {
      return [
        `My schedule just cleared up... for the right person${longSuffix}`,
        `Depends. What did you have in mind?${shortSuffix}`,
        `I could be persuaded to cancel everything${longSuffix}`,
      ];
    }
    return [
      `Dinner this Friday? My treat${longSuffix}`,
      `Coffee tomorrow? I know a great spot${shortSuffix}`,
      `Want to grab drinks this weekend?${longSuffix}`,
    ];
  },

  getnumber: (input, length) => {
    const words = input.toLowerCase();
    const longSuffix = length === 'long' ? ' I promise I text back.' : '';
    const shortSuffix = length === 'short' ? '' : ' Let us keep talking.';

    if (words.includes('text') || words.includes('message') || words.includes('dm')) {
      return [
        `Love that idea - what is your number?${longSuffix}`,
        `I am way better over text${shortSuffix}`,
        `Drop your digits, let us do this${longSuffix}`,
      ];
    }
    return [
      `This convo is too good for here - what is your number?${longSuffix}`,
      `Can I text you?${shortSuffix}`,
      `Want to continue this over text?${longSuffix}`,
    ];
  },

  tease: (input, length) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const longSuffix = length === 'long' ? ' I like it though.' : '';
    const shortSuffix = length === 'short' ? '' : ' Keep it up.';

    if (hasQuestion) {
      return [
        `Ooh someone is curious... I like it${longSuffix}`,
        `Asking all the right questions${shortSuffix}`,
        `Wouldn't YOU like to know 😏${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi')) {
      return [
        `Someone is feeling brave today${longSuffix}`,
        `Oh, so NOW you want to talk to me?${shortSuffix}`,
        `Look who finally showed up${longSuffix}`,
      ];
    }
    return [
      `Someone is feeling confident today 😏${longSuffix}`,
      `Oh you are definitely trouble${shortSuffix}`,
      `Think you can handle me?${longSuffix}`,
    ];
  },

  boldmove: (input, length) => {
    const words = input.toLowerCase();
    const longSuffix = length === 'long' ? ' I like where this is going.' : '';
    const shortSuffix = length === 'short' ? '' : ' What is next?';

    if (words.includes('?')) {
      return [
        `Let us skip the small talk${longSuffix}`,
        `Only one way to know for sure...${shortSuffix}`,
        `Why wonder when we could just... go?${longSuffix}`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Hey yourself. Let us skip the formalities${longSuffix}`,
        `Enough small talk. What are you doing tonight?${shortSuffix}`,
        `Let us speed this up${longSuffix}`,
      ];
    }
    return [
      `Let us cut the small talk${longSuffix}`,
      `Skip the games${shortSuffix}`,
      `Let us make this interesting${longSuffix}`,
    ];
  },
};

/**
 * Generates 3 contextual replies based on the input message, selected style, and response length
 */
export function generateReplies(inputMessage: string, style: ReplyStyleId, length: ResponseLength): string[] {
  const generator = STYLE_TEMPLATES[style];

  if (!generator) {
    return [
      "Interesting...",
      "Tell me more",
      "I like where this is going",
    ];
  }

  const replies = generator(inputMessage, length);

  // Always ensure we return exactly 3 replies
  while (replies.length < 3) {
    replies.push("Tell me more...");
  }

  return replies.slice(0, 3);
}
