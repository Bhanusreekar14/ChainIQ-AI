import React from 'react';
import { Card } from '../ui/Card';
import { Globe, MapPin, Activity } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ShipmentMap: React.FC = () => {
  const activeHubs = [
    { region: 'LATAM Hub (São Paulo)', active: 1420, risk: 'High', status: 'high' as const },
    { region: 'Europe Hub (Frankfurt)', active: 2890, risk: 'Medium', status: 'medium' as const },
    { region: 'USCA Hub (Chicago)', active: 4120, risk: 'Low', status: 'low' as const },
    { region: 'Pacific Asia (Singapore)', active: 3100, risk: 'Low', status: 'low' as const },
  ];

  return (
    <Card variant="default" className="space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Global Supply Chain Monitoring</h3>
        </div>
        <Badge variant="indigo">Live Geo-Tracking</Badge>
      </div>

      <div className="relative h-48 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between overflow-hidden">
        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-500 font-semibold text-[11px]">STATUS: ALL ROUTE NODES SYNCED</span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> 4 REGIONAL HUBS LIVE
          </span>
        </div>

        {/* Hub Markers Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeHubs.map((hub) => (
            <div key={hub.region} className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-800 font-semibold truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" /> {hub.region}
                </span>
              </div>
              <p className="text-base font-bold text-slate-900">{hub.active.toLocaleString()}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-medium">Transit Volume</span>
                <Badge variant={hub.status} size="sm">{hub.risk} Risk</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
