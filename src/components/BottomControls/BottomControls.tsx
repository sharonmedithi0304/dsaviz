import React from 'react';
import { SkipBack, ChevronLeft, Play, Pause, ChevronRight, SkipForward, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/visualizerStore';
import { CustomInput } from './CustomInput';

export function BottomControls() {
  const { currentStep, steps, isPlaying, setPlaying, nextStep, prevStep, reset, goToStep } = useStore();
  const total = steps.length;
  const progress = total > 1 ? (currentStep / (total - 1)) * 100 : 0;
  const atEnd = currentStep >= total - 1;

  return (
    <div className="h-16 bg-[#0A0C10] border-t border-[#1E2235] flex items-center px-4 gap-3">
      <div className="flex items-center gap-1.5">
        <button onClick={() => goToStep(0)} disabled={currentStep === 0}
          className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E2235] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <SkipBack size={14} />
        </button>
        <button onClick={prevStep} disabled={currentStep === 0}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2235] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft size={17} />
        </button>
        <button
          onClick={() => { if (atEnd) reset(); else setPlaying(!isPlaying); }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${atEnd ? 'bg-[#374151] hover:bg-[#4B5563]' : isPlaying ? 'bg-[#F59E0B] hover:bg-[#D97706] shadow-amber-500/20' : 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-blue-500/20'}`}>
          {atEnd ? <RotateCcw size={15} className="text-white" /> : isPlaying ? <Pause size={17} className="text-white" /> : <Play size={17} className="text-white ml-0.5" />}
        </button>
        <button onClick={nextStep} disabled={atEnd}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2235] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronRight size={17} />
        </button>
        <button onClick={() => goToStep(total - 1)} disabled={atEnd}
          className="p-2 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E2235] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <SkipForward size={14} />
        </button>
        <button onClick={reset} className="p-2 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#1E2235] transition-all ml-0.5">
          <RotateCcw size={13} />
        </button>
      </div>
      <div className="flex-1 flex items-center gap-2.5">
        <span className="text-xs font-mono text-[#475569] whitespace-nowrap hidden sm:block">
          <span className="text-[#60A5FA]">{currentStep + 1}</span><span className="text-[#374151]"> / {total}</span>
        </span>
        <div className="flex-1 h-1.5 bg-[#1E2235] rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            goToStep(Math.round(pct * (total - 1)));
          }}>
          <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A855F7] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <CustomInput />
    </div>
  );
}
