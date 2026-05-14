import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/visualizerStore';
import { TOPIC_CODES } from '../../topics/registry';

// Minimal syntax highlighter for C++
function highlight(line: string): string {
  const keywords = /\b(int|void|return|if|else|while|for|new|delete|class|struct|nullptr|true|false|cout|cin|endl|using|namespace|std|include|bool|char|float|double|string|auto|const)\b/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const comments = /(\/\/.*$)/g;
  const numbers = /\b(\d+)\b/g;
  const preprocessor = /^(#\w+)/;

  let h = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (preprocessor.test(h.trim())) {
    return `<span style="color:#C792EA">${h}</span>`;
  }

  h = h.replace(comments, '<span style="color:#546E7A;font-style:italic">$1</span>');
  h = h.replace(strings, '<span style="color:#C3E88D">$&</span>');
  h = h.replace(keywords, '<span style="color:#82AAFF;font-weight:600">$1</span>');
  h = h.replace(numbers, '<span style="color:#F78C6C">$1</span>');

  return h;
}

export function CodePanel() {
  const { topic, steps, currentStep } = useStore();
  const code = TOPIC_CODES[topic] ?? '';
  const lines = code.split('\n');
  const activeLine = steps[currentStep]?.lineNumber ?? 0;
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = lineRefs.current[activeLine - 1];
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeLine]);

  return (
    <div className="flex flex-col h-full bg-[#0F1117]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1E2235]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]/70" />
        </div>
        <span className="text-xs text-[#475569] font-mono ml-2">main.cpp</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[#475569]">Line</span>
          <span className="text-xs font-mono text-[#60A5FA] bg-[#1C3A5E]/40 px-2 py-0.5 rounded">{activeLine}</span>
        </div>
      </div>

      {/* Code Lines */}
      <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-sm">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;
          return (
            <div
              key={idx}
              ref={el => { lineRefs.current[idx] = el; }}
              className={`flex group transition-colors duration-150 ${isActive ? 'bg-[#1C3A5E]' : 'hover:bg-[#1E2235]/40'}`}
            >
              {/* Line number */}
              <div className={`select-none w-10 text-right pr-3 py-0.5 text-xs shrink-0
                ${isActive ? 'text-[#60A5FA]' : 'text-[#374151] group-hover:text-[#475569]'}`}>
                {lineNum}
              </div>
              {/* Active indicator */}
              <div className={`w-1 shrink-0 ${isActive ? 'bg-[#3B82F6]' : 'bg-transparent'}`} />
              {/* Code */}
              <pre
                className={`px-3 py-0.5 flex-1 whitespace-pre overflow-x-auto text-xs leading-6
                  ${isActive ? 'text-white' : 'text-[#8892A4]'}`}
                dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
