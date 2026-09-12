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

  const renderRichCard = (type: CopilotCardType, data: unknown) => {
    if (!type || !data) return null;

    switch (type) {
      case 'high_risk_table':
        return (
          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 overflow-x-auto text-slate-900">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Today's High-Risk Watchlist Orders</span>
            </div>
            <table className="w-full text-left text-[11px] text-slate-700">
              <thead className="text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-1.5 font-semibold">Order ID</th>
                  <th className="pb-1.5 font-semibold">Market</th>
                  <th className="pb-1.5 font-semibold">Shipping</th>
                  <th className="pb-1.5 font-semibold text-right">Delay Risk</th>
                  <th className="pb-1.5 font-semibold text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array.isArray(data) &&
                  data.map((item: Record<string, unknown>, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 font-bold text-slate-900">{String(item.order_id || '')}</td>
                      <td className="py-1.5 text-slate-600">{String(item.market || '')}</td>
                      <td className="py-1.5 text-slate-500">{String(item.shipping_mode || '')}</td>
                      <td className="py-1.5 text-right font-bold text-rose-600">
                        {String(item.delay_probability || 0)}%
                      </td>
                      <td className="py-1.5 text-right font-mono text-slate-800">
                        {formatCurrency(Number(item.sales_usd || 0))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case 'region_risk':
        return (
          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-slate-900">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Regional Market Delay Vulnerability Ranking</span>
            </div>
            <div className="space-y-2 pt-1">
              {Array.isArray(data) &&
                data.map((m: Record<string, unknown>, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{String(m.market || '')}</span>
                      <span className="font-bold text-blue-600">{String(m.delay_probability || 0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Number(m.delay_probability || 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'kpi_summary': {
        const kpi = data as Record<string, unknown>;
        return (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold">Total Orders</span>
              <p className="font-bold text-slate-900 text-sm">
                {kpi.total_shipments ? Number(kpi.total_shipments).toLocaleString() : '180,519'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold">High Risk Count</span>
              <p className="font-bold text-rose-600 text-sm">
                {kpi.high_risk_shipments ? Number(kpi.high_risk_shipments).toLocaleString() : '256'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold">Avg Delay Prob</span>
              <p className="font-bold text-blue-600 text-sm">
                {String(kpi.average_delay_probability || 0)}%
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-semibold">Net Cost Savings</span>
              <p className="font-bold text-emerald-600 text-sm">
                {formatCurrency(Number(kpi.estimated_cost_savings || 412850))}
              </p>
            </div>
          </div>
        );
      }

      case 'risk_distribution': {
        const rd = data as Record<string, unknown>;
        return (
          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-slate-900">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Total Order Breakdown Across 4 Risk Tiers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex justify-between items-center">
                <span className="text-slate-700 font-medium">Low Risk ({String(rd.low_pct || 0)}%)</span>
                <span className="font-bold text-emerald-700">{Number(rd.low_count || 0).toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 flex justify-between items-center">
                <span className="text-slate-700 font-medium">Medium ({String(rd.medium_pct || 0)}%)</span>
                <span className="font-bold text-amber-700">{Number(rd.medium_count || 0).toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 flex justify-between items-center">
                <span className="text-slate-700 font-medium">High Risk ({String(rd.high_pct || 0)}%)</span>
                <span className="font-bold text-orange-700">{Number(rd.high_count || 0).toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 flex justify-between items-center">
                <span className="text-slate-700 font-medium">Critical ({String(rd.critical_pct || 0)}%)</span>
                <span className="font-bold text-rose-700">{Number(rd.critical_count || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      }

      case 'executive_summary': {
        const es = data as Record<string, unknown>;
        return (
          <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-2 text-slate-900">
            <div className="font-bold text-blue-900 flex items-center justify-between">
              <span>{String(es.title || 'Executive Intelligence Brief')}</span>
              <Badge variant="indigo" size="sm">Confidential</Badge>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Processed <strong className="text-slate-900">{Number(es.total_shipments || 0).toLocaleString()}</strong> order vectors.
              Achieved <strong className="text-emerald-700">{String(es.on_time_fulfillment_pct || 0)}%</strong> on-time fulfillment rate, generating{' '}
              <strong className="text-emerald-700">{formatCurrency(Number(es.total_savings_usd || 412850))}</strong> in financial SLA savings.
            </p>
          </div>
        );
      }

      case 'action_recommendations':
        return (
          <div className="mt-3 space-y-2 text-xs">
            {Array.isArray(data) &&
              data.map((act: Record<string, unknown>, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center gap-3 shadow-2xs"
                >
                  <span className="font-semibold text-slate-800 text-[11px] flex-1">
                    {String(act.action || '')}
                  </span>
                  <Badge variant="low" size="sm">{String(act.impact || '')}</Badge>
                </div>
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card variant="glass" className="flex flex-col h-[580px] p-0 overflow-hidden shadow-xs border-slate-200 bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              ChainIQ Enterprise Supply Chain Copilot
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              CatBoost ML Telemetry Engine • v1.5 Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
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
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
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
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl text-xs leading-relaxed space-y-1 relative group ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 border-b border-slate-100 pb-1">
                <span className="font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                  {msg.sender === 'user' ? (
                    'You'
                  ) : (
                    <>
                      <span className="text-slate-600">ChainIQ Copilot</span>
                      {msg.confidence && (
                        <span className="text-[9px] text-blue-600 font-mono">
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
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
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
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-100 text-slate-600 rounded border border-slate-200"
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
        className="p-4 border-t border-slate-200 bg-white flex gap-3"
      >
        <input
          type="text"
          placeholder="Ask ChainIQ Copilot: 'Show high-risk shipments', 'Which region has highest delay?', etc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
        />
        <Button
          variant="primary"
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
