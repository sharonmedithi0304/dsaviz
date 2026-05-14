import { create } from 'zustand';
import type { TopicId, Language, VisualizerState } from '../types';
import { generateSteps } from '../engine/stepEngine';

interface Actions {
  setTopic: (topic: TopicId) => void;
  setLanguage: (lang: Language) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setPlaying: (val: boolean) => void;
  setSpeed: (ms: number) => void;
  setCustomInput: (vals: number[]) => void;
  goToStep: (n: number) => void;
}

const DEFAULT_INPUT = [64, 34, 25, 12, 22, 11, 90];

export const useStore = create<VisualizerState & Actions>((set, get) => ({
  topic: 'bubble-sort',
  language: 'cpp',
  steps: generateSteps('bubble-sort', DEFAULT_INPUT),
  currentStep: 0,
  isPlaying: false,
  speed: 1000,
  customInput: DEFAULT_INPUT,
  showQuiz: false,

  setTopic: (topic) => {
    const { customInput } = get();
    set({ topic, steps: generateSteps(topic, customInput), currentStep: 0, isPlaying: false });
  },
  setLanguage: (language) => set({ language }),
  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 });
    else set({ isPlaying: false });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  reset: () => {
    const { topic, customInput } = get();
    set({ steps: generateSteps(topic, customInput), currentStep: 0, isPlaying: false });
  },
  setPlaying: (val) => set({ isPlaying: val }),
  setSpeed: (ms) => set({ speed: ms }),
  setCustomInput: (vals) => {
    const { topic } = get();
    set({ customInput: vals, steps: generateSteps(topic, vals), currentStep: 0, isPlaying: false });
  },
  goToStep: (n) => set({ currentStep: n }),
}));
