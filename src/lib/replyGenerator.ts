// Rizz Assist Pro - Reply Generator
// Generates contextual replies based on the pasted message and selected style

import { ReplyStyleId } from './constants';

// Response templates that incorporate the input message context
const STYLE_TEMPLATES: Record<ReplyStyleId, (input: string) => string[]> = {
  flirty: (input) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');
    const isShort = input.length < 30;

    if (hasQuestion) {
      return [
        `Wouldn't you like to know 😏`,
        `Maybe... if you play your cards right`,
        `That depends... what's in it for me?`,
        `I'll tell you over drinks 🍸`,
        `Keep asking questions like that and I might just fall for you`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Well hello there, trouble 😏`,
        `Finally, someone worth texting back`,
        `I was hoping you'd say that`,
        `You had me at hey... now keep impressing me`,
        `Bold opener. I like your style`,
      ];
    }
    if (words.includes('cute') || words.includes('hot') || words.includes('beautiful') || words.includes('pretty')) {
      return [
        `You're not so bad yourself 😏`,
        `Flattery will get you everywhere with me`,
        `Keep talking like that...`,
        `I know 💅 But tell me more`,
        `Finally someone with good taste`,
      ];
    }
    return [
      `You're trouble aren't you? 😏`,
      `Bold move... I like it`,
      `Interesting... tell me more`,
      `Challenge accepted 🔥`,
      `You definitely have my attention now`,
    ];
  },

  seductive: (input) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');

    if (hasQuestion) {
      return [
        `Come closer and I'll tell you...`,
        `Why don't you find out for yourself?`,
        `The answer might surprise you...`,
        `I'd rather show you than tell you`,
        `Some things are better whispered`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `I've been thinking about you...`,
        `Finally... I was getting impatient`,
        `You kept me waiting... now make it worth my while`,
        `Say my name like that again`,
        `Come here...`,
      ];
    }
    return [
      `You know exactly what you're doing to me...`,
      `Slow down... let me catch up`,
      `Dangerous game you're playing`,
      `Keep going... I'm listening`,
      `Let's see where this takes us`,
    ];
  },

  funny: (input) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');

    if (hasQuestion) {
      return [
        `Is this a pop quiz? I didn't study`,
        `*Googles answer frantically*`,
        `That's classified information, I'd tell you but then...`,
        `Let me consult my Magic 8 Ball real quick`,
        `The answer is 42. Wait, wrong question`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Is this the part where I say something clever? Hold on...`,
        `*finger guns* Ayyyy`,
        `I've been practicing my entrance. Nailed it, right?`,
        `Plot twist: I'm actually three raccoons in a trench coat`,
        `My therapist says I should respond to texts. So here we are`,
      ];
    }
    if (words.includes('lol') || words.includes('haha') || words.includes('funny')) {
      return [
        `I'll be here all week. Tip your waitress`,
        `Comedy is my love language. That and snacks`,
        `*takes a bow* Thank you, thank you`,
        `I'm basically just chaos in human form`,
        `My humor is like my coffee - questionable but addictive`,
      ];
    }
    return [
      `Is this the part where I say something clever?`,
      `Warning: I come with dad jokes and zero filter`,
      `Are you a magician? Because Abraca-dayum`,
      `My pickup line game is a 404 error but my personality loads eventually`,
      `I'd say something smooth but I tripped over my own words`,
    ];
  },

  roast: (input) => {
    const words = input.toLowerCase();
    const isShort = input.length < 20;

    if (isShort) {
      return [
        `Wow, really putting in the effort there`,
        `That's it? That's your opener?`,
        `My notifications died for THIS?`,
        `Are you charging by the letter or something?`,
        `Somewhere, a conversation starter is crying`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Generic greeting detected. Originality not found`,
        `Hey? That's your A-game? Yikes`,
        `I've seen better openers on fortune cookies`,
        `Did you copy that from a 2005 texting guide?`,
        `Bold strategy. Let's see if it pays off (it won't)`,
      ];
    }
    return [
      `Average at best, but keep trying I guess`,
      `0/10 would not swipe right on that energy`,
      `Your game needs serious work`,
      `I've heard better from my phone's autocomplete`,
      `Is this your first day or are you always like this?`,
    ];
  },

  smooth: (input) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');

    if (hasQuestion) {
      return [
        `You already know the answer...`,
        `Exactly what you're hoping`,
        `Better than you expected`,
        `Let's just say you're onto something`,
        `Read my mind, didn't you?`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `I see you. And I like what I see`,
        `Perfect timing. I was just thinking about you`,
        `Now my day just got interesting`,
        `You have my full attention`,
        `That's the energy I've been waiting for`,
      ];
    }
    return [
      `I see you... and I'm here for it`,
      `That's my kind of vibe`,
      `You get me`,
      `We're definitely on the same wavelength`,
      `You speak my language fluently`,
    ];
  },

  compliment: (input) => {
    const words = input.toLowerCase();

    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Your energy is contagious, even through text`,
        `Something about the way you text... I'm into it`,
        `You've got great vibes, I can already tell`,
        `The confidence suits you`,
        `Already making my day better`,
      ];
    }
    if (words.includes('?')) {
      return [
        `I love that you're not afraid to ask`,
        `Your curiosity is attractive`,
        `Smart questions from a smart person`,
        `You've got depth... I like that`,
        `That kind of directness is refreshing`,
      ];
    }
    return [
      `Your smile is dangerous and I'm not complaining`,
      `You've got this energy that's impossible to ignore`,
      `Excellent taste, clearly`,
      `You're absolutely captivating`,
      `That confidence? Incredibly attractive`,
    ];
  },

  askout: (input) => {
    const words = input.toLowerCase();

    if (words.includes('busy') || words.includes('free') || words.includes('plans')) {
      return [
        `My schedule just cleared up... for the right person`,
        `Depends. What did you have in mind?`,
        `I could be persuaded to cancel everything`,
        `For you? I'll make time`,
        `Let's find out together this weekend`,
      ];
    }
    return [
      `Dinner this Friday? My treat`,
      `Coffee tomorrow? I know a great spot`,
      `Want to grab drinks and continue this in person?`,
      `Let's hang out this weekend - you pick the place`,
      `You free Thursday? I have an idea...`,
    ];
  },

  getnumber: (input) => {
    const words = input.toLowerCase();

    if (words.includes('text') || words.includes('message') || words.includes('dm')) {
      return [
        `Love that idea - drop your number and let's do it`,
        `I'm way better over text. What's your number?`,
        `Let's take this to iMessage - what's the digits?`,
        `Real talk happens over text. Number?`,
        `I'm sold. Give me your number`,
      ];
    }
    return [
      `This convo is too good for here - what's your number?`,
      `Can I text you? This deserves a proper chat`,
      `Drop your digits, let's continue this properly`,
      `Number exchange? I promise I'm more fun over text`,
      `Want to continue this over text? I have memes`,
    ];
  },

  tease: (input) => {
    const words = input.toLowerCase();
    const hasQuestion = input.includes('?');

    if (hasQuestion) {
      return [
        `Ooh someone's curious... I like it`,
        `Asking all the right questions, aren't you?`,
        `Wouldn't YOU like to know 😏`,
        `So many questions... so little patience`,
        `Eager much? I appreciate that energy though`,
      ];
    }
    if (words.includes('hey') || words.includes('hi')) {
      return [
        `Someone's feeling brave today, I see`,
        `Oh, so NOW you want to talk to me?`,
        `Look who finally showed up`,
        `Took you long enough 😜`,
        `Oh you're trouble, I can already tell`,
      ];
    }
    return [
      `Someone's feeling confident today 😏`,
      `Oh you're definitely trouble`,
      `Think you can handle me? Let's find out`,
      `Big talker, huh? Prove it`,
      `Cocky much? I'm into it though`,
    ];
  },

  boldmove: (input) => {
    const words = input.toLowerCase();

    if (words.includes('?')) {
      return [
        `Let's skip the small talk and find out together`,
        `Only one way to know for sure...`,
        `Why wonder when we could just... go?`,
        `Less questions, more action. You in?`,
        `The answer is yes. Now what?`,
      ];
    }
    if (words.includes('hey') || words.includes('hi') || words.includes('hello')) {
      return [
        `Hey yourself. Let's skip the formalities`,
        `Enough small talk. What are you doing tonight?`,
        `Hi. Now that that's out of the way... your place or mine?`,
        `We both know where this is going. Let's speed it up`,
        `Hello. Goodbye boring conversation. What's next?`,
      ];
    }
    return [
      `Let's cut the small talk - when are we meeting?`,
      `Want to get out of here? Metaphorically speaking... for now`,
      `I don't do games. So what's the move?`,
      `Skip the back and forth. What do you really want?`,
      `Let's make this interesting. I'm free tonight`,
    ];
  },
};

/**
 * Generates 5 contextual replies based on the input message and selected style
 */
export function generateReplies(inputMessage: string, style: ReplyStyleId): string[] {
  const generator = STYLE_TEMPLATES[style];

  if (!generator) {
    // Fallback - shouldn't happen but just in case
    return [
      "Interesting...",
      "Tell me more",
      "I like where this is going",
      "You have my attention",
      "Go on...",
    ];
  }

  const replies = generator(inputMessage);

  // Always ensure we return exactly 5 replies
  while (replies.length < 5) {
    replies.push("Tell me more...");
  }

  return replies.slice(0, 5);
}
