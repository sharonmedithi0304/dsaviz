import React from 'react';
import { useStore } from '../../store/visualizerStore';
import { ArrayVisualizer } from './ArrayVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

export function VizPanel() {
  const { steps, currentStep, topic } = useStore();
  const step = steps[currentStep];

  const isArrayTopic = [
    'bubble-sort', 'selection-sort', 'insertion-sort',
    'merge-sort', 'quick-sort', 'linear-search', 'binary-search', 'kmp'
  ].includes(topic);

  return (
    <div className="flex flex-col h-full bg-[#0D1117] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2235]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="text-xs text-[#475569] font-mono uppercase tracking-wider">Visualization</span>
        </div>
        <div className="flex items-center gap-2">
          {step?.animationType && step.animationType !== 'idle' && (
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border
              ${step.animationType === 'swap' ? 'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10' :
                step.animationType === 'compare' ? 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10' :
                step.animationType === 'sorted' ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10' :
                step.animationType === 'pivot' ? 'text-[#A855F7] border-[#A855F7]/30 bg-[#A855F7]/10' :
                'text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10'}`}>
              {step.animationType.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isArrayTopic && step?.visualState ? (
            <motion.div
              key="array-viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <ArrayVisualizer
                state={step.visualState}
                animationType={step.animationType}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center text-[#374151]">
                <div className="text-5xl mb-4">⚡</div>
                <p className="font-mono text-sm">Select a topic to begin</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
