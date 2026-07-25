import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';
import type { TabType } from '../types';

interface NotFoundProps {
  setActiveTab: (tab: TabType) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ setActiveTab }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Card variant="glass" className="max-w-md p-8 space-y-4 flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">404 — Page Not Found</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The requested logistics route or application view does not exist or has been relocated.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => setActiveTab('dashboard')}
          className="mt-2"
        >
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};
