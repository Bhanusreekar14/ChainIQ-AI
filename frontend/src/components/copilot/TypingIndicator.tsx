import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="ml-2 font-mono text-[10px]">Analyzing CatBoost vectors...</span>
      </div>
    </div>
  );
};
