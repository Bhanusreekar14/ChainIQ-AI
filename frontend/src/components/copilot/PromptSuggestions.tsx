import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface PromptSuggestionsProps {
  suggestions?: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  suggestions,
  onSelectPrompt,
}) => {
  const defaultSuggestions = [
    "Show today's high-risk shipments.",
    "Which region has the highest delay probability?",
    "Summarize logistics performance.",
    "How many delayed shipments are there?",
    "Generate an executive summary.",
    "Suggest actions to reduce delivery delays.",
  ];

  const list = suggestions && suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Suggested Queries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(q)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-blue-600 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
