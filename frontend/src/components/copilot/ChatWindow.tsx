import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { TypingIndicator } from './TypingIndicator';
import { Bot, Send } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isTyping = false,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <Card variant="glass" className="flex flex-col h-[520px] p-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">ChainIQ AI Decision Copilot</h3>
            <p className="text-[10px] text-slate-400">Conversational Logistics Intelligence</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
          Online
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar name={msg.sender === 'user' ? 'Bhanu Sreekar' : 'ChainIQ AI'} size="sm" />

            <div
              className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-bold text-[10px] uppercase text-slate-400">
                  {msg.sender === 'user' ? 'You' : 'ChainIQ AI Assistant'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex gap-3">
        <input
          type="text"
          placeholder="Ask ChainIQ Copilot about delay factors, root causes, or interventions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <Button variant="ai" size="md" rightIcon={<Send className="w-4 h-4" />}>
          Send
        </Button>
      </form>
    </Card>
  );
};
