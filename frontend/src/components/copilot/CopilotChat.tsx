import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export const CopilotChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your ChainIQ Decision Copilot. Ask me any question about delay risk mitigations, optimal carrier routing, or order intervention strategies.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on current CatBoost predictions for "${userMsg}", standard class LATAM shipments show the highest delay risk (78%). Upgrading shipping mode to First Class reduces risk by 42%.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">AI Decision Copilot</h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
          Online
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-xl leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600/90 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot a question..."
          className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
