import { useEffect, useRef } from 'react';
import { useStore } from '../store/visualizerStore';

export function useAutoPlay() {
  const { isPlaying, speed, nextStep, currentStep, steps } = useStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(nextStep, speed);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, speed, currentStep, steps.length, nextStep]);
}
