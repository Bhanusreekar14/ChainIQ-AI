import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Package, ArrowUpRight } from 'lucide-react';
import type { RecentShipmentData, TabType } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface RecentShipmentsProps {
  shipments: RecentShipmentData[];
  loading: boolean;
  setActiveTab: (tab: TabType) => void;
}

export const RecentShipments: React.FC<RecentShipmentsProps> = ({
  shipments,
  loading,
  setActiveTab,
}) => {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Recent High-Risk Watchlist</h3>
            <p className="text-[10px] text-slate-400">Live CatBoost Delay Risk Scoring</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('shipment')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Market</th>
              <th className="pb-3">Mode</th>
              <th className="pb-3">Delay Prob</th>
              <th className="pb-3">Risk Level</th>
              <th className="pb-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="py-3 bg-slate-900/40 rounded" />
                </tr>
              ))
            ) : (
              shipments.map((s) => (
                <tr key={s.order_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-white">{s.order_id}</td>
                  <td className="py-3 text-slate-300">{s.market}</td>
                  <td className="py-3 text-slate-400">{s.shipping_mode}</td>
                  <td className="py-3 font-mono font-semibold text-rose-400">
                    {formatPercent(s.delay_probability / 100)}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        s.risk === 'High' || s.risk === 'Critical'
                          ? 'critical'
                          : s.risk === 'Medium'
                          ? 'medium'
                          : 'low'
                      }
                      size="sm"
                    >
                      {s.risk.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-white">
                    {formatCurrency(s.sales_usd)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
