import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ShipmentPayload } from '../../types';
import { MARKETS, SHIPPING_MODES, ORDER_TYPES } from '../../constants';

interface ShipmentFormProps {
  onAnalyze: (payload: ShipmentPayload) => void;
  loading: boolean;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({ onAnalyze, loading }) => {
  const [formData, setFormData] = useState<ShipmentPayload>({
    Type: 'DEBIT',
    Market: 'LATAM',
    Shipping_Mode: 'Standard Class',
    Order_Item_Quantity: 4,
    Sales: 450.0,
    profit_margin: 0.15,
    scheduled_shipping_days: 4,
    order_is_weekend: 0,
    discount_rate: 0.05,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <Card variant="glass" className="space-y-5 border-slate-800">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-white">Shipment Order Details Input</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Order Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            options={ORDER_TYPES.map((t) => ({ value: t, label: t }))}
          />
          <Select
            label="Market / Region"
            name="Market"
            value={formData.Market}
            onChange={handleChange}
            options={MARKETS.map((m) => ({ value: m, label: m }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Shipping Mode"
            name="Shipping_Mode"
            value={formData.Shipping_Mode}
            onChange={handleChange}
            options={SHIPPING_MODES.map((mode) => ({ value: mode, label: mode }))}
          />

          <Input
            label="Order Quantity"
            type="number"
            name="Order_Item_Quantity"
            value={formData.Order_Item_Quantity}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Sales ($)"
            type="number"
            name="Sales"
            step="0.1"
            value={formData.Sales}
            onChange={handleChange}
          />

          <Input
            label="Profit Margin (0 - 1)"
            type="number"
            name="profit_margin"
            step="0.01"
            value={formData.profit_margin}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Scheduled Days"
            type="number"
            name="scheduled_shipping_days"
            value={formData.scheduled_shipping_days}
            onChange={handleChange}
          />

          <Input
            label="Discount Rate (0 - 1)"
            type="number"
            name="discount_rate"
            step="0.01"
            value={formData.discount_rate}
            onChange={handleChange}
          />
        </div>

        <Select
          label="Weekend Order?"
          name="order_is_weekend"
          value={formData.order_is_weekend}
          onChange={handleChange}
          options={[
            { value: 0, label: 'No (Weekday Processing)' },
            { value: 1, label: 'Yes (Weekend Dispatch)' },
          ]}
        />

        <Button
          type="submit"
          variant="ai"
          size="lg"
          isLoading={loading}
          leftIcon={<Sparkles className="w-4 h-4" />}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-3 py-3.5 text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-cyan-500/20"
        >
          {loading ? 'Executing AI Inference...' : '✨ Run AI Analysis'}
        </Button>
      </form>
    </Card>
  );
};
