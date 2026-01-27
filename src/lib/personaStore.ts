// Rizz Assist Pro - Persona & Profile Store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatingAppId } from './datingAppsKnowledge';

const STORAGE_KEYS = {
  PERSONA_ID: 'rizzassist_persona_id',
  CUSTOM_PERSONA: 'rizzassist_custom_persona',
  ABOUT_ME: 'rizzassist_about_me',
  DATING_APP_PROFILES: 'rizzassist_dating_app_profiles',
} as const;

// Pre-defined personas with full descriptions
export const PERSONAS = [
  {
    id: 'cheeky-tease',
    name: 'Cheeky Tease',
    emoji: '😏',
    shortDesc: 'Sarcastic, playful banter',
    fullDesc: 'Sarcastic, playful banter, dry humor, light roasting, confident but chill. You tease just enough to keep things interesting without being mean.',
    sampleReply: "oh so you're one of THOSE people... i respect it tbh 😏",
  },
  {
    id: 'smooth-charmer',
    name: 'Smooth Charmer',
    emoji: '🎩',
    shortDesc: 'Confident & charming',
    fullDesc: 'Confident, charming, respectful, builds intrigue with thoughtful compliments. You make them feel special without being over the top.',
    sampleReply: "you know what i noticed about you? you've got this energy that's hard to find",
  },
  {
    id: 'witty-banter',
    name: 'Witty Banter',
    emoji: '⚡',
    shortDesc: 'Fast, clever replies',
    fullDesc: 'Fast, clever replies, ironic humor, meme-like energy, quick comebacks. You match their energy and keep the convo fun.',
    sampleReply: "wait wait wait... are you actually serious rn or is this a bit",
  },
  {
    id: 'bold-direct',
    name: 'Bold Direct',
    emoji: '🎯',
    shortDesc: 'Straightforward, no games',
    fullDesc: 'Straightforward, no games, clear flirty intent, cuts through small talk. You say what you mean and mean what you say.',
    sampleReply: "okay i'm just gonna say it - we should grab drinks this week",
  },
  {
    id: 'mysterious-intrigue',
    name: 'Mysterious Intrigue',
    emoji: '🌙',
    shortDesc: 'Short, enigmatic vibes',
    fullDesc: 'Short, enigmatic, subtle flirt, leaves things open-ended to build curiosity. You keep them wanting more.',
    sampleReply: "hmm... interesting. tell me more",
  },
  {
    id: 'cute-wholesome',
    name: 'Cute Wholesome',
    emoji: '🌸',
    shortDesc: 'Sweet & warm',
    fullDesc: 'Sweet, bubbly, warm, positive, affectionate, light-hearted compliments. You radiate good vibes.',
    sampleReply: "okay that's actually really sweet :) you seem like good people",
  },
  {
    id: 'edgy-sarcastic',
    name: 'Edgy Sarcastic',
    emoji: '🔥',
    shortDesc: 'Sharp wit, playful call-outs',
    fullDesc: "Sharp wit, playful call-outs, enjoys banter battles, a bit bold. You're not afraid to keep them on their toes.",
    sampleReply: "wow bold opener... i'll allow it this time",
  },
  {
    id: 'thoughtful-deep',
    name: 'Thoughtful Deep',
    emoji: '💭',
    shortDesc: 'Meaningful questions',
    fullDesc: 'Intellectual, asks meaningful questions, builds emotional connection. You go beyond surface level.',
    sampleReply: "that's actually a really good point... what made you think of that?",
  },
  {
    id: 'adventurous-fun',
    name: 'Adventurous Fun',
    emoji: '🎢',
    shortDesc: 'High-energy, spontaneous',
    fullDesc: 'Energetic, suggests spontaneous ideas, high-energy flirt, fun vibes. You bring the excitement.',
    sampleReply: "okay new plan - we should totally do something spontaneous this weekend",
  },
] as const;

export type PersonaId = typeof PERSONAS[number]['id'];

// Dating app profile data structure
export interface DatingAppProfile {
  appId: DatingAppId;
  fieldValues: Record<string, string>; // key -> user's text for that field
  lastOptimized?: number; // timestamp of last optimization
}

interface PersonaState {
  selectedPersonaId: PersonaId | 'custom';
  customPersonaText: string;
  aboutMe: string;
  datingAppProfiles: Partial<Record<DatingAppId, DatingAppProfile>>;
  isLoaded: boolean;

  // Actions
  loadState: () => Promise<void>;
  setPersona: (id: PersonaId | 'custom') => Promise<void>;
  setCustomPersona: (text: string) => Promise<void>;
  setAboutMe: (text: string) => Promise<void>;
  saveAll: (personaId: PersonaId | 'custom', customText: string, aboutMe: string) => Promise<void>;
  getActivePersonaDescription: () => string;
  setDatingAppProfile: (appId: DatingAppId, fieldValues: Record<string, string>) => Promise<void>;
  getDatingAppProfile: (appId: DatingAppId) => DatingAppProfile | undefined;
  loadDatingAppProfiles: () => Promise<void>;
  deleteDatingAppProfile: (appId: DatingAppId) => Promise<void>;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  selectedPersonaId: 'cheeky-tease',
  customPersonaText: '',
  aboutMe: '',
  datingAppProfiles: {},
  isLoaded: false,

  loadState: async () => {
    try {
      const [personaId, customPersona, aboutMe, profilesJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PERSONA_ID),
        AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_PERSONA),
        AsyncStorage.getItem(STORAGE_KEYS.ABOUT_ME),
        AsyncStorage.getItem(STORAGE_KEYS.DATING_APP_PROFILES),
      ]);

      set({
        selectedPersonaId: (personaId as PersonaId | 'custom') || 'cheeky-tease',
        customPersonaText: customPersona || '',
        aboutMe: aboutMe || '',
        datingAppProfiles: profilesJson ? JSON.parse(profilesJson) : {},
        isLoaded: true,
      });
    } catch (error) {
      console.error('Error loading persona state:', error);
      set({ isLoaded: true });
    }
  },

  setPersona: async (id: PersonaId | 'custom') => {
    set({ selectedPersonaId: id });
    await AsyncStorage.setItem(STORAGE_KEYS.PERSONA_ID, id);
  },

  setCustomPersona: async (text: string) => {
    set({ customPersonaText: text });
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PERSONA, text);
  },

  setAboutMe: async (text: string) => {
    set({ aboutMe: text });
    await AsyncStorage.setItem(STORAGE_KEYS.ABOUT_ME, text);
  },

  saveAll: async (personaId: PersonaId | 'custom', customText: string, aboutMe: string) => {
    set({
      selectedPersonaId: personaId,
      customPersonaText: customText,
      aboutMe: aboutMe,
    });

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.PERSONA_ID, personaId),
      AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PERSONA, customText),
      AsyncStorage.setItem(STORAGE_KEYS.ABOUT_ME, aboutMe),
    ]);
  },

  setDatingAppProfile: async (appId: DatingAppId, fieldValues: Record<string, string>) => {
    set((state) => ({
      datingAppProfiles: {
        ...state.datingAppProfiles,
        [appId]: {
          appId,
          fieldValues,
          lastOptimized: Date.now(),
        },
      },
    }));

    // Save to storage
    const state = get();
    await AsyncStorage.setItem(
      STORAGE_KEYS.DATING_APP_PROFILES,
      JSON.stringify(state.datingAppProfiles)
    );
  },

  getDatingAppProfile: (appId: DatingAppId) => {
    const { datingAppProfiles } = get();
    return datingAppProfiles[appId];
  },

  loadDatingAppProfiles: async () => {
    try {
      const profilesJson = await AsyncStorage.getItem(STORAGE_KEYS.DATING_APP_PROFILES);
      if (profilesJson) {
        set({ datingAppProfiles: JSON.parse(profilesJson) });
      }
    } catch (error) {
      console.error('Error loading dating app profiles:', error);
    }
  },

  deleteDatingAppProfile: async (appId: DatingAppId) => {
    set((state) => {
      const { [appId]: _, ...remaining } = state.datingAppProfiles;
      return {
        datingAppProfiles: remaining,
      };
    });

    // Save to storage
    const state = get();
    await AsyncStorage.setItem(
      STORAGE_KEYS.DATING_APP_PROFILES,
      JSON.stringify(state.datingAppProfiles)
    );
  },

  getActivePersonaDescription: () => {
    const { selectedPersonaId, customPersonaText } = get();

    if (selectedPersonaId === 'custom') {
      return customPersonaText || 'Cheeky, playful personality';
    }

    const persona = PERSONAS.find(p => p.id === selectedPersonaId);
    return persona?.fullDesc || PERSONAS[0].fullDesc;
  },
}));
