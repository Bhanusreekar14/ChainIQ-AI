import React from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Filter, RotateCcw } from 'lucide-react';
import { MARKETS, SHIPPING_MODES } from '../../constants';

export interface FilterState {
  dateRange: string;
  region: string;
  market: string;
  shippingMode: string;
  riskLevel: string;
  supplier: string;
}

interface AnalyticsFilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  setFilters,
  onReset,
}) => {
  const handleChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card variant="glass" className="p-4 space-y-3 border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Executive Interactive Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Select
          label="Date Range"
          value={filters.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          options={[
            { value: '30d', label: 'Last 30 Days' },
            { value: '90d', label: 'Last Quarter (90d)' },
            { value: '1y', label: 'Past Year (2025-2026)' },
            { value: 'ytd', label: 'Year To Date' },
          ]}
        />

        <Select
          label="Region"
          value={filters.region}
          onChange={(e) => handleChange('region', e.target.value)}
          options={[
            { value: 'ALL', label: 'All Regions' },
            { value: 'Americas', label: 'Americas (LATAM/USCA)' },
            { value: 'EMEA', label: 'EMEA (Europe/Africa)' },
            { value: 'APAC', label: 'APAC (Pacific Asia)' },
          ]}
        />

        <Select
          label="Market"
          value={filters.market}
          onChange={(e) => handleChange('market', e.target.value)}
          options={[
            { value: 'ALL', label: 'All Markets' },
            ...MARKETS.map((m) => ({ value: m, label: m })),
          ]}
        />

        <Select
          label="Shipping Mode"
          value={filters.shippingMode}
          onChange={(e) => handleChange('shippingMode', e.target.value)}
          options={[
            { value: 'ALL', label: 'All Shipping Modes' },
            ...SHIPPING_MODES.map((mode) => ({ value: mode, label: mode })),
          ]}
        />

        <Select
          label="Risk Level"
          value={filters.riskLevel}
          onChange={(e) => handleChange('riskLevel', e.target.value)}
          options={[
            { value: 'ALL', label: 'All Risk Levels' },
            { value: 'Low', label: '🟢 Low Risk' },
            { value: 'Medium', label: '🟡 Medium Risk' },
            { value: 'High', label: '🟠 High Risk' },
            { value: 'Critical', label: '🔴 Critical Risk' },
          ]}
        />

        <Select
          label="Supplier"
          value={filters.supplier}
          onChange={(e) => handleChange('supplier', e.target.value)}
          options={[
            { value: 'ALL', label: 'All Suppliers' },
            { value: 'DHL', label: 'DHL Global Supply' },
            { value: 'FedEx', label: 'FedEx Trade Networks' },
            { value: 'Maersk', label: 'Maersk Line Air' },
            { value: 'DB Schenker', label: 'DB Schenker' },
          ]}
        />
      </div>
    </Card>
  );
};
