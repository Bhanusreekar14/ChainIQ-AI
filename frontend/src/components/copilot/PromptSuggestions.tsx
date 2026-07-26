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
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Suggested Executive Queries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
