import React, { useState } from 'react';
import { ChevronDown, Zap, Code2 } from 'lucide-react';
import { useStore } from '../../store/visualizerStore';
import { TOPICS, TOPIC_CATEGORIES } from '../../topics/registry';
import type { TopicId, Language } from '../../types';

const SPEEDS = [
  { label: '0.25×', ms: 4000 },
  { label: '0.5×', ms: 2000 },
  { label: '1×', ms: 1000 },
  { label: '2×', ms: 500 },
  { label: '4×', ms: 250 },
];

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'cpp', label: 'C++' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
];

export function TopNav() {
  const { topic, language, speed, setTopic, setLanguage, setSpeed } = useStore();
  const [topicOpen, setTopicOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentTopic = TOPICS.find(t => t.id === topic);

  return (
    <nav className="h-14 bg-[#060810] border-b border-[#1E2235] flex items-center px-4 gap-4 z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Code2 size={16} className="text-white" />
        </div>
        <span className="font-poppins font-bold text-white text-lg tracking-tight">DSAViz</span>
        <span className="text-[#3B82F6] text-xs font-mono hidden sm:block">// See the code. Understand it forever.</span>
      </div>

      <div className="flex items-center gap-3 flex-1">
        {/* Topic Selector */}
        <div className="relative">
          <button
            onClick={() => { setTopicOpen(!topicOpen); setLangOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1117] border border-[#1E2235] rounded-lg text-sm text-white hover:border-[#3B82F6] transition-colors"
          >
            <span className="hidden sm:block text-[#94A3B8]">Topic:</span>
            <span className="text-[#60A5FA] font-medium">{currentTopic?.label ?? 'Select'}</span>
            <ChevronDown size={14} className={`text-[#94A3B8] transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
          </button>

          {topicOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-[#0F1117] border border-[#1E2235] rounded-xl shadow-2xl overflow-hidden z-50">
              {TOPIC_CATEGORIES.map(cat => (
                <div key={cat}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-[#60A5FA] bg-[#0A0C10] uppercase tracking-wider">{cat}</div>
                  {TOPICS.filter(t => t.category === cat).map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTopic(t.id as TopicId); setTopicOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#1E2235] transition-colors flex items-center justify-between
                        ${topic === t.id ? 'text-[#3B82F6] bg-[#1C3A5E]/40' : 'text-[#CBD5E1]'}`}
                    >
                      <span>{t.label}</span>
                      <span className="text-xs text-[#64748B] font-mono">{t.complexity.time}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(!langOpen); setTopicOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1117] border border-[#1E2235] rounded-lg text-sm text-white hover:border-[#3B82F6] transition-colors"
          >
            <Code2 size={13} className="text-[#94A3B8]" />
            <span className="text-[#60A5FA] font-medium">{LANGUAGES.find(l => l.id === language)?.label}</span>
            <ChevronDown size={14} className={`text-[#94A3B8] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-[#0F1117] border border-[#1E2235] rounded-xl shadow-2xl overflow-hidden z-50">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => { setLanguage(l.id); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#1E2235] transition-colors
                    ${language === l.id ? 'text-[#3B82F6] bg-[#1C3A5E]/40' : 'text-[#CBD5E1]'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-1.5 ml-2">
          <Zap size={13} className="text-[#F59E0B]" />
          <div className="flex gap-1">
            {SPEEDS.map(s => (
              <button
                key={s.ms}
                onClick={() => setSpeed(s.ms)}
                className={`px-2 py-1 rounded text-xs font-mono transition-all
                  ${speed === s.ms
                    ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#0F1117] text-[#64748B] border border-[#1E2235] hover:border-[#3B82F6] hover:text-white'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-[#475569]">
        <span><kbd className="bg-[#1E2235] px-1.5 py-0.5 rounded text-[#94A3B8]">→</kbd> Next</span>
        <span><kbd className="bg-[#1E2235] px-1.5 py-0.5 rounded text-[#94A3B8]">←</kbd> Prev</span>
        <span><kbd className="bg-[#1E2235] px-1.5 py-0.5 rounded text-[#94A3B8]">P</kbd> Play</span>
        <span><kbd className="bg-[#1E2235] px-1.5 py-0.5 rounded text-[#94A3B8]">R</kbd> Reset</span>
      </div>

      {/* Close dropdowns on outside click */}
      {(topicOpen || langOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setTopicOpen(false); setLangOpen(false); }} />
      )}
    </nav>
  );
}
