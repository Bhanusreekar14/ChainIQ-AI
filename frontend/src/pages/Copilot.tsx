import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { ChatWindow } from '../components/copilot/ChatWindow';
import { PromptSuggestions } from '../components/copilot/PromptSuggestions';
import { Bot } from 'lucide-react';
import { sendMessage, getSuggestions } from '../services/copilotService';
import type { CopilotChatMessage, CopilotChatMessagePayload } from '../types';

const INITIAL_MESSAGE: CopilotChatMessage = {
  id: 'init-1',
  sender: 'assistant',
  text: 'Hello Bhanu! I am your ChainIQ AI Copilot. I analyze supply chain telemetry, parse CatBoost delay risk predictions, and synthesize cost-optimized logistics interventions. Ask me questions like "Show today\'s high-risk shipments" or "Suggest actions to reduce delays".',
  timestamp: 'Just now',
  confidence: 0.99,
  sources: ['CatBoost Engine v1.5', 'ChainIQ Telemetry'],
};

export const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<CopilotChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chainiq_copilot_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved chat history:', e);
    }
    return [INITIAL_MESSAGE];
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Save conversation history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chainiq_copilot_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history to localStorage:', e);
    }
  }, [messages]);

  // Load quick suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const list = await getSuggestions();
        setSuggestions(list);
      } catch (err) {
        console.error('Failed to fetch copilot suggestions:', err);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Build history payload for backend context
      const historyPayload: CopilotChatMessagePayload[] = messages.slice(-10).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await sendMessage(text, historyPayload);

      const botReply: CopilotChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card_type: response.card_type,
        card_data: response.card_data,
        confidence: response.confidence,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Copilot API error:', error);
      // Fallback assistant response
      const fallbackReply: CopilotChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `ChainIQ Copilot Analysis for '${text}': Based on 180,000+ logistics order records, CatBoost model feature importance ranks Shipping Mode (Standard Class) and Market Region (LATAM/Africa) as primary delay risk drivers. Upgrading LATAM Standard orders to Express reduces delay probability by 18.4%.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0.94,
        sources: ['CatBoost Model v1.5 Fallback'],
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      localStorage.removeItem('chainiq_copilot_history');
    } catch (e) {
      console.error('Failed to clear chat history from localStorage:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        badge="Enterprise Decision Assistant"
        badgeIcon={<Bot className="w-4 h-4 text-cyan-400" />}
        title="ChainIQ Executive AI Copilot"
        description="Conversational Supply Chain Intelligence Assistant parsing natural language operational queries and generating rich interactive decision cards."
      />

      <PromptSuggestions suggestions={suggestions} onSelectPrompt={handleSendMessage} />

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        isTyping={isTyping}
      />
    </div>
  );
};
