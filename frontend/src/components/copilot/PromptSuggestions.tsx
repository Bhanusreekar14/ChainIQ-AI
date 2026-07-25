import React from 'react';
import { HelpCircle } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    'Why is Standard Shipping to LATAM high risk?',
    'What intervention gives the highest cost savings?',
    'How does the CatBoost 42-feature model calculate confidence?',
    'How do I lower delay risks for weekend orders?',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(q)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{q}</span>
        </button>
      ))}
    </div>
  );
};
