import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ArrayVisualState } from '../../types';

interface Props {
  state: ArrayVisualState;
  animationType: string;
}

function getBarColor(
  idx: number,
  state: ArrayVisualState,
  animationType: string
): { bg: string; shadow: string; border: string } {
  if (state.sortedIndices.includes(idx))
    return { bg: '#22C55E', shadow: '0 0 16px rgba(34,197,94,0.5)', border: '#16A34A' };
  if (state.swapIndices.includes(idx))
    return { bg: '#EF4444', shadow: '0 0 20px rgba(239,68,68,0.6)', border: '#DC2626' };
  if (state.compareIndices.includes(idx))
    return { bg: '#F59E0B', shadow: '0 0 16px rgba(245,158,11,0.5)', border: '#D97706' };
  if (state.pivotIndex === idx)
    return { bg: '#A855F7', shadow: '0 0 20px rgba(168,85,247,0.6)', border: '#9333EA' };
  if (state.highlightIndices.includes(idx))
    return { bg: '#3B82F6', shadow: '0 0 16px rgba(59,130,246,0.5)', border: '#2563EB' };
  return { bg: '#1E2235', shadow: 'none', border: '#2D3748' };
}

export function ArrayVisualizer({ state, animationType }: Props) {
  const { values } = state;
  if (!values || values.length === 0) return null;

  const maxVal = Math.max(...values, 1);

  return (
    <div className="flex flex-col h-full items-center justify-center gap-6 p-6 select-none">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { color: '#1E2235', border: '#2D3748', label: 'Unsorted' },
          { color: '#3B82F6', border: '#2563EB', label: 'Active' },
          { color: '#F59E0B', border: '#D97706', label: 'Comparing' },
          { color: '#EF4444', border: '#DC2626', label: 'Swapping' },
          { color: '#22C55E', border: '#16A34A', label: 'Sorted' },
          { color: '#A855F7', border: '#9333EA', label: 'Pivot' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border" style={{ background: item.color, borderColor: item.border }} />
            <span className="text-xs text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-center gap-1.5 w-full" style={{ height: '240px' }}>
        <AnimatePresence mode="popLayout">
          {values.map((val, idx) => {
            const { bg, shadow, border } = getBarColor(idx, state, animationType);
            const heightPct = Math.max((val / maxVal) * 220, 20);
            const isSwapping = state.swapIndices.includes(idx);
            const isComparing = state.compareIndices.includes(idx);

            return (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: 1,
                  opacity: 1,
                  y: isSwapping ? -20 : isComparing ? -8 : 0,
                }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{
                  layout: { type: 'spring', stiffness: 300, damping: 30 },
                  y: { type: 'spring', stiffness: 400, damping: 25 },
                  scaleY: { duration: 0.2 },
                }}
                style={{ originY: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Value label on top */}
                <motion.span
                  animate={{ opacity: 1 }}
                  className="text-xs font-mono font-bold mb-1 transition-colors duration-200"
                  style={{ color: bg === '#1E2235' ? '#64748B' : bg }}
                >
                  {val}
                </motion.span>

                {/* Bar */}
                <motion.div
                  animate={{ backgroundColor: bg, boxShadow: shadow, borderColor: border }}
                  transition={{ duration: 0.25 }}
                  className="rounded-t-md border-t border-x transition-all"
                  style={{
                    width: `${Math.max(280 / values.length - 4, 20)}px`,
                    height: `${heightPct}px`,
                    minWidth: '20px',
                    maxWidth: '64px',
                  }}
                />

                {/* Index label below */}
                <span className="text-xs text-[#374151] font-mono mt-1">{idx}</span>

                {/* Pointer label */}
                {state.pointers?.map(p =>
                  p.index === idx ? (
                    <div key={p.label} className="absolute -top-8 flex flex-col items-center">
                      <span className="text-xs font-bold font-mono" style={{ color: p.color }}>{p.label}</span>
                      <div className="w-0.5 h-4" style={{ background: p.color }} />
                    </div>
                  ) : null
                )}

                {/* Pivot crown */}
                {state.pivotIndex === idx && (
                  <div className="absolute -top-10 text-lg">👑</div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Array values row */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <span className="text-xs text-[#475569] font-mono mr-2">arr[]</span>
        {values.map((val, idx) => {
          const { bg, border } = getBarColor(idx, state, animationType);
          return (
            <motion.div
              key={idx}
              animate={{ backgroundColor: bg, borderColor: border }}
              transition={{ duration: 0.25 }}
              className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-bold font-mono text-white"
              style={{ background: bg, borderColor: border }}
            >
              {val}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
