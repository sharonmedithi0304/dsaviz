import { useEffect } from 'react';
import { useStore } from '../store/visualizerStore';

const SPEED_MAP: Record<string, number> = {
  '1': 2000, '2': 1000, '3': 500, '4': 250, '5': 100,
};

export function useKeyboard() {
  const { nextStep, prevStep, reset, isPlaying, setPlaying, setSpeed } = useStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (!isPlaying) nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'r':
        case 'R':
          reset();
          break;
        case 'p':
        case 'P':
          setPlaying(!isPlaying);
          break;
        default:
          if (SPEED_MAP[e.key]) setSpeed(SPEED_MAP[e.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, nextStep, prevStep, reset, setPlaying, setSpeed]);
}
