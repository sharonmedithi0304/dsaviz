import React from 'react';
import { BookOpen, Clock, Database } from 'lucide-react';
import { useStore } from '../../store/visualizerStore';
import { TOPICS } from '../../topics/registry';
import { motion, AnimatePresence } from 'framer-motion';

export function PurposeBox() {
  const { steps, currentStep, topic } = useStore();
  const step = steps[currentStep];
  const topicMeta = TOPICS.find(t => t.id === topic);
  const complexity = step?.complexity ?? topicMeta?.complexity;

  return (
    <div className="bg-[#111827] border-t border-l-4 border-[#1E40AF] border-r-0 border-b-0 p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-[#60A5FA]" />
        <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider">What's happening</span>
      </div>

      {/* Purpose Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-[#CBD5E1] leading-relaxed"
        >
          {step?.purposeText ?? 'Select a topic and press Play or → to begin stepping through the code.'}
        </motion.p>
      </AnimatePresence>

      {/* Complexity */}
      {complexity && (
        <div className="flex items-center gap-4 pt-1 border-t border-[#1E2235]">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#F59E0B]" />
            <span className="text-xs text-[#64748B]">Time:</span>
            <span className="text-xs font-mono text-[#F59E0B] font-semibold">{complexity.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database size={12} className="text-[#A855F7]" />
            <span className="text-xs text-[#64748B]">Space:</span>
            <span className="text-xs font-mono text-[#A855F7] font-semibold">{complexity.space}</span>
          </div>
        </div>
      )}
    </div>
  );
}
