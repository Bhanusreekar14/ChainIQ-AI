import React from 'react';
import { Filter } from 'lucide-react';
import { MARKETS, SHIPPING_MODES } from '../../constants';

interface ShipmentFilterProps {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

export const ShipmentFilter: React.FC<ShipmentFilterProps> = ({
  selectedMarket,
  setSelectedMarket,
  selectedMode,
  setSelectedMode,
}) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span>Filter Parameters</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Market:</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Markets</option>
            {MARKETS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Mode:</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Modes</option>
            {SHIPPING_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
