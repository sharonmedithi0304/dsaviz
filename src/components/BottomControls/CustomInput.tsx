import React, { useState } from 'react';
import { Sliders, Check, X } from 'lucide-react';
import { useStore } from '../../store/visualizerStore';

export function CustomInput() {
  const { customInput, setCustomInput } = useStore();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(customInput.join(', '));
  const [error, setError] = useState('');

  const apply = () => {
    const nums = val.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0);
    if (nums.length < 2) { setError('Enter at least 2 numbers'); return; }
    if (nums.length > 12) { setError('Max 12 numbers'); return; }
    setCustomInput(nums);
    setError('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F1117] border border-[#1E2235] rounded-lg text-xs text-[#94A3B8] hover:border-[#3B82F6] hover:text-white transition-colors"
      >
        <Sliders size={12} />
        Custom Input
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 w-72 bg-[#0F1117] border border-[#1E2235] rounded-xl p-4 shadow-2xl z-50">
          <p className="text-xs text-[#64748B] mb-2">Enter numbers separated by commas (2–12 values):</p>
          <input
            type="text"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apply()}
            className="w-full bg-[#0A0C10] border border-[#1E2235] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder="64, 34, 25, 12, 22, 11, 90"
          />
          {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button onClick={apply} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-xs font-semibold transition-colors">
              <Check size={12} /> Apply
            </button>
            <button onClick={() => setOpen(false)} className="px-3 py-1.5 bg-[#1E2235] hover:bg-[#374151] text-[#94A3B8] rounded-lg text-xs transition-colors">
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
