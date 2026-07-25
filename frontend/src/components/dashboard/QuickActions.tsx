import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, SlidersHorizontal, Bot, Zap } from 'lucide-react';
import type { TabType } from '../../types';

interface QuickActionsProps {
  setActiveTab?: (tab: TabType) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setActiveTab }) => {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-white">Quick Intelligence Actions</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="ai"
          size="md"
          leftIcon={<Search className="w-4 h-4" />}
          onClick={() => setActiveTab && setActiveTab('shipment')}
          className="w-full justify-start"
        >
          Analyze New Order
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setActiveTab && setActiveTab('scenario')}
          className="w-full justify-start"
        >
          Run What-If Simulator
        </Button>

        <Button
          variant="outline"
          size="md"
          leftIcon={<Bot className="w-4 h-4 text-cyan-400" />}
          onClick={() => setActiveTab && setActiveTab('copilot')}
          className="w-full justify-start"
        >
          Query AI Copilot
        </Button>
      </div>
    </Card>
  );
};
