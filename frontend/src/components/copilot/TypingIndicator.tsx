import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="ml-2 font-mono text-[10px]">Analyzing CatBoost vectors...</span>
      </div>
    </div>
  );
};
