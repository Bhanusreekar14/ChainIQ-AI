import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { TypingIndicator } from './TypingIndicator';
import {
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { CopilotChatMessage, CopilotCardType } from '../../types';

interface ChatWindowProps {
  messages: CopilotChatMessage[];
  onSendMessage: (text: string) => void;
  onClearChat?: () => void;
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isTyping = false,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderRichCard = (type: CopilotCardType, data: any) => {
    if (!type || !data) return null;

    switch (type) {
      case 'high_risk_table':
        return (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Today's High-Risk Watchlist Orders</span>
            </div>
            <table className="w-full text-left text-[11px] text-slate-300">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-1.5 font-semibold">Order ID</th>
                  <th className="pb-1.5 font-semibold">Market</th>
                  <th className="pb-1.5 font-semibold">Shipping</th>
                  <th className="pb-1.5 font-semibold text-right">Delay Risk</th>
                  <th className="pb-1.5 font-semibold text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {Array.isArray(data) &&
                  data.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-1.5 font-semibold text-white">{item.order_id}</td>
                      <td className="py-1.5 text-slate-300">{item.market}</td>
                      <td className="py-1.5 text-slate-400">{item.shipping_mode}</td>
                      <td className="py-1.5 text-right font-bold text-rose-400">
                        {item.delay_probability}%
                      </td>
                      <td className="py-1.5 text-right font-mono text-amber-300">
                        {formatCurrency(item.sales_usd)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case 'region_risk':
        return (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Regional Market Delay Vulnerability Ranking</span>
            </div>
            <div className="space-y-2 pt-1">
              {Array.isArray(data) &&
                data.map((m: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-200">{m.market}</span>
                      <span className="font-bold text-cyan-300">{m.delay_probability}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                        style={{ width: `${m.delay_probability}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'kpi_summary':
        return (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400">Total Orders</span>
              <p className="font-bold text-white text-sm">
                {data.total_shipments ? data.total_shipments.toLocaleString() : '180,519'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400">High Risk Count</span>
              <p className="font-bold text-rose-400 text-sm">
                {data.high_risk_shipments ? data.high_risk_shipments.toLocaleString() : '256'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400">Avg Delay Prob</span>
              <p className="font-bold text-cyan-400 text-sm">
                {data.average_delay_probability}%
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400">Net Cost Savings</span>
              <p className="font-bold text-emerald-400 text-sm">
                {formatCurrency(data.estimated_cost_savings || 412850)}
              </p>
            </div>
          </div>
        );

      case 'risk_distribution':
        return (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Total Order Breakdown Across 4 Risk Tiers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex justify-between items-center">
                <span className="text-slate-300">Low Risk ({data.low_pct}%)</span>
                <span className="font-bold text-emerald-400">{data.low_count?.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 flex justify-between items-center">
                <span className="text-slate-300">Medium ({data.medium_pct}%)</span>
                <span className="font-bold text-amber-400">{data.medium_count?.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-950/30 border border-orange-500/20 flex justify-between items-center">
                <span className="text-slate-300">High Risk ({data.high_pct}%)</span>
                <span className="font-bold text-orange-400">{data.high_count?.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 flex justify-between items-center">
                <span className="text-slate-300">Critical ({data.critical_pct}%)</span>
                <span className="font-bold text-rose-400">{data.critical_count?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'executive_summary':
        return (
          <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-2">
            <div className="font-bold text-indigo-300 flex items-center justify-between">
              <span>{data.title || 'Executive Intelligence Brief'}</span>
              <Badge variant="indigo" size="sm">Confidential</Badge>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Processed <strong className="text-white">{data.total_shipments?.toLocaleString()}</strong> order vectors.
              Achieved <strong className="text-emerald-400">{data.on_time_fulfillment_pct}%</strong> on-time fulfillment rate, generating{' '}
              <strong className="text-emerald-400">{formatCurrency(data.total_savings_usd || 412850)}</strong> in financial SLA savings.
            </p>
          </div>
        );

      case 'action_recommendations':
        return (
          <div className="mt-3 space-y-2 text-xs">
            {Array.isArray(data) &&
              data.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center gap-3"
                >
                  <span className="font-semibold text-slate-200 text-[11px] flex-1">
                    {act.action}
                  </span>
                  <Badge variant="low" size="sm">{act.impact}</Badge>
                </div>
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card variant="glass" className="flex flex-col h-[580px] p-0 overflow-hidden shadow-2xl border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              ChainIQ Enterprise Supply Chain Copilot
            </h3>
            <p className="text-[10px] text-slate-400">
              CatBoost ML Telemetry Engine • v1.5 Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            Online
          </span>
          {onClearChat && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
              onClick={onClearChat}
              title="Clear conversation history"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar
              name={msg.sender === 'user' ? 'Bhanu Sreekar' : 'ChainIQ Copilot'}
              size="sm"
            />

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed space-y-1 relative group ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/95 text-slate-200 border border-slate-800/90 rounded-tl-none shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 border-b border-slate-800/50 pb-1">
                <span className="font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  {msg.sender === 'user' ? (
                    'You'
                  ) : (
                    <>
                      <span>ChainIQ Copilot</span>
                      {msg.confidence && (
                        <span className="text-[9px] text-cyan-400 font-mono">
                          ({(msg.confidence * 100).toFixed(0)}% conf)
                        </span>
                      )}
                    </>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer p-0.5"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Render Embedded Rich UI Card if available */}
              {msg.sender === 'assistant' &&
                msg.card_type &&
                renderRichCard(msg.card_type, msg.card_data)}

              {/* Source tags */}
              {msg.sender === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1">
                  {msg.sources.map((src, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-950 text-slate-400 rounded border border-slate-800"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex gap-3"
      >
        <input
          type="text"
          placeholder="Ask ChainIQ Copilot: 'Show high-risk shipments', 'Which region has highest delay?', etc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <Button
          variant="ai"
          size="md"
          rightIcon={<Send className="w-4 h-4" />}
          disabled={!input.trim() || isTyping}
        >
          Send
        </Button>
      </form>
    </Card>
  );
};
