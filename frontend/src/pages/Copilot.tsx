import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { ChatWindow, type ChatMessage } from '../components/copilot/ChatWindow';
import { PromptSuggestions } from '../components/copilot/PromptSuggestions';
import { Bot } from 'lucide-react';

export const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello Bhanu! I am your ChainIQ AI Copilot. I analyze supply chain parameters, explain CatBoost delay predictions, and suggest optimal cost intervention strategies. How can I assist you today?',
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText =
        'ChainIQ AI Decision Engine evaluated your request. Based on 180,000+ logistics order records, CatBoost model feature importance ranks Shipping Mode (Standard Class) and Market Region (LATAM/Africa) as top delay factors.';

      const lower = text.toLowerCase();
      if (lower.includes('latam') || lower.includes('standard shipping')) {
        replyText =
          'Standard Class shipping to LATAM carries a 62% baseline delay risk. Primary root cause is long transit windows combined with regional warehouse clearance backlogs. Upgrading to Express or First Class reduces delay probability to 22%, saving an estimated $450 per order in SLA penalties.';
      } else if (lower.includes('savings') || lower.includes('cost')) {
        replyText =
          'The intervention with the highest ROI is "Upgrading Standard Shipping to Express" ($450 avg cost saving per high-risk shipment) followed by "Allocating Additional Origin Warehouse Staff" ($320 avg saving by preventing processing backlogs).';
      } else if (lower.includes('catboost') || lower.includes('confidence') || lower.includes('42')) {
        replyText =
          'Our CatBoost model evaluates 42 safe features including order metrics, temporal signals (is_weekend, month), and financial metrics. The confidence score represents the model’s calibrated probability margin against historical test validations (ROC AUC: 0.842).';
      } else if (lower.includes('weekend')) {
        replyText =
          'Orders placed on weekends suffer from a 1.4x delay multiplier due to Monday morning dispatch backlogs. Recommended action: Enable "Early Sunday Dispatch Scheduling" at origin hubs.';
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        badge="Conversational Decision Assistant"
        badgeIcon={<Bot className="w-4 h-4 text-cyan-400" />}
        title="ChainIQ Executive AI Copilot"
        description="Ask natural language questions about ML delay risk factors, root causes, or supply chain optimization strategies."
      />

      <PromptSuggestions onSelectPrompt={handleSendMessage} />

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
};
