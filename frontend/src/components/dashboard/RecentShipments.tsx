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
    <Card variant="default" className="space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent High-Risk Watchlist</h3>
            <p className="text-[10px] text-slate-500 font-medium">Live CatBoost Delay Risk Scoring</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('shipment')}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
              <th className="pb-3 font-semibold">Order ID</th>
              <th className="pb-3 font-semibold">Market</th>
              <th className="pb-3 font-semibold">Mode</th>
              <th className="pb-3 font-semibold">Delay Prob</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 text-right font-semibold">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="py-3 bg-slate-50 rounded" />
                </tr>
              ))
            ) : (
              shipments.map((s) => (
                <tr key={s.order_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900">{s.order_id}</td>
                  <td className="py-3 text-slate-700 font-medium">{s.market}</td>
                  <td className="py-3 text-slate-500">{s.shipping_mode}</td>
                  <td className="py-3 font-bold text-slate-900">
                    {formatPercent(s.delay_probability / 100)}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        s.risk === 'High'
                          ? 'high'
                          : s.risk === 'Critical'
                          ? 'critical'
                          : s.risk === 'Medium'
                          ? 'medium'
                          : 'low'
                      }
                      size="sm"
                    >
                      {s.risk}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
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
