import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SlidersHorizontal, ArrowRight, Sparkles, TrendingDown } from 'lucide-react';
import type { RecommendationResponse, ShipmentPayload } from '../types';
import { analyzeShipment } from '../services/shipmentService';
import { MARKETS, SHIPPING_MODES } from '../constants';
import { formatCurrency, formatPercent } from '../lib/utils';

export const Scenario: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [baseline, setBaseline] = useState<RecommendationResponse | null>(null);
  const [simulated, setSimulated] = useState<RecommendationResponse | null>(null);

  const [baseInput, setBaseInput] = useState<ShipmentPayload>({
    Type: 'DEBIT',
    Market: 'LATAM',
    Shipping_Mode: 'Standard Class',
    Order_Item_Quantity: 6,
    Sales: 1200.0,
    profit_margin: 0.05,
    scheduled_shipping_days: 4,
    order_is_weekend: 1,
    discount_rate: 0.25,
  });

  const [simInput, setSimInput] = useState<ShipmentPayload>({
    Type: 'DEBIT',
    Market: 'LATAM',
    Shipping_Mode: 'First Class',
    Order_Item_Quantity: 6,
    Sales: 1200.0,
    profit_margin: 0.05,
    scheduled_shipping_days: 2,
    order_is_weekend: 0,
    discount_rate: 0.05,
  });

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const [baseRes, simRes] = await Promise.all([
        analyzeShipment(baseInput),
        analyzeShipment(simInput),
      ]);
      setBaseline(baseRes);
      setSimulated(simRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Comparative Decision Engine"
        badgeIcon={<SlidersHorizontal className="w-4 h-4 text-cyan-400" />}
        title="What-If Scenario Simulator"
        description="Test operational changes (e.g. upgrading shipping modes or adjusting order windows) to see instant risk probability drops and financial savings before committing decisions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline Input */}
        <Card variant="default" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-slate-200">1. Original Baseline Scenario</span>
            <Badge variant="slate">Current</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Shipping Mode"
              value={baseInput.Shipping_Mode}
              onChange={(e) => setBaseInput({ ...baseInput, Shipping_Mode: e.target.value })}
              options={SHIPPING_MODES.map((m) => ({ value: m, label: m }))}
            />
            <Select
              label="Market Region"
              value={baseInput.Market}
              onChange={(e) => setBaseInput({ ...baseInput, Market: e.target.value })}
              options={MARKETS.map((m) => ({ value: m, label: m }))}
            />
            <Input
              label="Scheduled Days"
              type="number"
              value={baseInput.scheduled_shipping_days}
              onChange={(e) => setBaseInput({ ...baseInput, scheduled_shipping_days: parseInt(e.target.value) || 0 })}
            />
            <Select
              label="Weekend Order?"
              value={baseInput.order_is_weekend}
              onChange={(e) => setBaseInput({ ...baseInput, order_is_weekend: parseInt(e.target.value) || 0 })}
              options={[
                { value: 1, label: 'Yes (Weekend)' },
                { value: 0, label: 'No (Weekday)' },
              ]}
            />
          </div>
        </Card>

        {/* Simulated Input */}
        <Card variant="cyan" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-cyan-300">2. Simulated Intervention Scenario</span>
            <Badge variant="ai">What-If</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Shipping Mode"
              value={simInput.Shipping_Mode}
              onChange={(e) => setSimInput({ ...simInput, Shipping_Mode: e.target.value })}
              options={SHIPPING_MODES.map((m) => ({ value: m, label: m }))}
            />
            <Select
              label="Market Region"
              value={simInput.Market}
              onChange={(e) => setSimInput({ ...simInput, Market: e.target.value })}
              options={MARKETS.map((m) => ({ value: m, label: m }))}
            />
            <Input
              label="Scheduled Days"
              type="number"
              value={simInput.scheduled_shipping_days}
              onChange={(e) => setSimInput({ ...simInput, scheduled_shipping_days: parseInt(e.target.value) || 0 })}
            />
            <Select
              label="Weekend Order?"
              value={simInput.order_is_weekend}
              onChange={(e) => setSimInput({ ...simInput, order_is_weekend: parseInt(e.target.value) || 0 })}
              options={[
                { value: 1, label: 'Yes (Weekend)' },
                { value: 0, label: 'No (Weekday)' },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          variant="ai"
          size="lg"
          isLoading={loading}
          leftIcon={<Sparkles className="w-4 h-4" />}
          onClick={handleSimulate}
        >
          {loading ? 'Simulating Pathways...' : 'Run Comparative What-If Simulation'}
        </Button>
      </div>

      {/* Simulation Results */}
      {baseline && simulated && (
        <div className="space-y-6">
          <Card variant="indigo" className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  Delay Risk Reduced by{' '}
                  <span className="text-emerald-400">
                    {Math.max(
                      0,
                      Math.round((baseline.prediction.delay_probability - simulated.prediction.delay_probability) * 100)
                    )}
                    %
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Risk level dropped from{' '}
                  <strong className="text-rose-400 uppercase">{baseline.prediction.risk_level}</strong> to{' '}
                  <strong className="text-emerald-400 uppercase">{simulated.prediction.risk_level}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-semibold">
              <div className="text-center">
                <span className="block text-slate-400">Original Risk</span>
                <span className="text-2xl font-bold text-rose-400">
                  {formatPercent(baseline.prediction.delay_probability)}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <div className="text-center">
                <span className="block text-cyan-400">Simulated Risk</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatPercent(simulated.prediction.delay_probability)}
                </span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="default" className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800">Original Baseline Outcome</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Delay Probability</span>
                  <span className="font-bold text-white">{formatPercent(baseline.prediction.delay_probability)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Causes</span>
                  <span className="font-medium text-amber-300">{baseline.possible_causes.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Projected Savings</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(baseline.business_impact.estimated_cost_saving_usd)}</span>
                </div>
              </div>
            </Card>

            <Card variant="cyan" className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 pb-2 border-b border-slate-800">Simulated Outcome</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Delay Probability</span>
                  <span className="font-bold text-emerald-400">{formatPercent(simulated.prediction.delay_probability)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Causes</span>
                  <span className="font-medium text-emerald-300">{simulated.possible_causes.join(', ') || 'None (Cleared)'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Projected Savings</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(simulated.business_impact.estimated_cost_saving_usd)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
