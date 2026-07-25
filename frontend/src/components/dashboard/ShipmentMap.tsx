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
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Global Supply Chain Monitoring</h3>
        </div>
        <Badge variant="indigo">Live Geo-Tracking</Badge>
      </div>

      <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
        {/* Animated Background Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400">STATUS: ALL ROUTE NODES SYNCED</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> 4 REGIONAL HUBS LIVE
          </span>
        </div>

        {/* Hub Markers Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeHubs.map((hub) => (
            <div key={hub.region} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> {hub.region}
                </span>
              </div>
              <p className="text-base font-extrabold text-white">{hub.active.toLocaleString()}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Transit Volume</span>
                <Badge variant={hub.status} size="sm">{hub.risk} Risk</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
