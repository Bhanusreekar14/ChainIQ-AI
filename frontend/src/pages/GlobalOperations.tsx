import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Globe,
  MapPin,
  CloudRain,
  Anchor,
  Activity,
  Sparkles,
  Radio,
  Truck,
} from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export const GlobalOperations: React.FC = () => {
  const { liveEvents, healthScore, isDemoMode } = useDemo();

  const nodes = [
    { id: '1', name: 'India Hub (Mumbai)', type: 'Supplier', lat: '45%', lng: '68%', status: 'healthy', risk: 'Low' },
    { id: '2', name: 'Singapore Port', type: 'Port', lat: '55%', lng: '78%', status: 'weather', risk: 'Medium', alert: '🌧 Heavy Rain (+12h)' },
    { id: '3', name: 'Germany Hub (Frankfurt)', type: 'Warehouse', lat: '32%', lng: '52%', status: 'healthy', risk: 'Low' },
    { id: '4', name: 'Rotterdam Port', type: 'Port', lat: '28%', lng: '48%', status: 'congestion', risk: 'High', alert: '82% Congestion' },
    { id: '5', name: 'USA Hub (Chicago)', type: 'Customer', lat: '35%', lng: '25%', status: 'healthy', risk: 'Low' },
    { id: '6', name: 'Brazil Hub (São Paulo)', type: 'Supplier', lat: '70%', lng: '38%', status: 'critical', risk: 'Critical', alert: '🔴 LATAM Bottleneck' },
    { id: '7', name: 'UAE Hub (Dubai)', type: 'Warehouse', lat: '42%', lng: '62%', status: 'healthy', risk: 'Low' },
  ];

  const routes = [
    { from: 'India Hub', to: 'UAE Hub', color: 'border-emerald-400', risk: '🟢 Healthy Route' },
    { from: 'Singapore Port', to: 'USA Hub', color: 'border-amber-400', risk: '🟡 Weather Alert' },
    { from: 'Germany Hub', to: 'Rotterdam Port', color: 'border-orange-400', risk: '🟠 Port Congestion' },
    { from: 'Brazil Hub', to: 'USA Hub', color: 'border-rose-500', risk: '🔴 High Delay Risk' },
  ];

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      <PageHeader
        badge="Signature Operations Command"
        badgeIcon={<Globe className="w-4 h-4 text-cyan-400" />}
        title="Global Supply Chain Operations Centre"
        description="Real-time geo-visualization, animated intercontinental trade routes, live port congestion meters, and weather overlay alerts."
      />

      {/* Main Operations Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card variant="glass" className="p-6 space-y-4 border-indigo-500/40 relative min-h-[520px] flex flex-col justify-between overflow-hidden">
            {/* Top Toolbar overlay */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-20 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">Interactive Global Route Telemetry</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy</span>
                <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Medium</span>
                <span className="flex items-center gap-1 text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-400" /> High</span>
                <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400" /> Critical</span>
              </div>
            </div>

            {/* Interactive Simulated Map World Graphic */}
            <div className="relative flex-1 rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden min-h-[380px]">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

              {/* Animated Radar Scanning Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent w-32 h-full animate-pulse pointer-events-none" />

              {/* Geo Node Markers */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  style={{ top: node.lat, left: node.lng }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute w-7 h-7 rounded-full opacity-40 animate-ping ${
                        node.status === 'critical'
                          ? 'bg-rose-500'
                          : node.status === 'congestion'
                          ? 'bg-orange-500'
                          : node.status === 'weather'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <div
                      className={`p-2 rounded-full border shadow-lg text-white font-bold transition-transform group-hover:scale-125 ${
                        node.status === 'critical'
                          ? 'bg-rose-600 border-rose-400'
                          : node.status === 'congestion'
                          ? 'bg-orange-600 border-orange-400'
                          : node.status === 'weather'
                          ? 'bg-amber-600 border-amber-400'
                          : 'bg-indigo-600 border-indigo-400'
                      }`}
                    >
                      {node.type === 'Port' ? (
                        <Anchor className="w-3.5 h-3.5" />
                      ) : node.type === 'Supplier' ? (
                        <Truck className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  {/* Node Tooltip Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 rounded-xl bg-slate-900/95 border border-slate-700 text-xs shadow-2xl z-40">
                    <p className="font-extrabold text-white">{node.name}</p>
                    <p className="text-[10px] text-slate-400">Node Type: {node.type}</p>
                    {node.alert && (
                      <p className="text-[10px] font-bold text-amber-300 mt-1">{node.alert}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Bottom Telemetry Ticker Overlay */}
              <div className="relative z-20 flex items-center justify-between text-xs pt-4 border-t border-slate-800/80">
                <span className="font-mono text-slate-400 text-[11px]">
                  LIVE ROUTE NODES: 7 ACTIVE | 4 INTERNATIONAL CORRIDORS
                </span>
                <span className="text-cyan-400 font-semibold text-[11px] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> SIMULATION ENGINE ONLINE
                </span>
              </div>
            </div>

            {/* Active Route Corridor Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-20 pt-2 text-xs">
              {routes.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono">CORRIDOR #{i + 1}</span>
                  <p className="font-bold text-white text-[11px] truncate">{r.from} ➔ {r.to}</p>
                  <p className="text-[10px] font-semibold text-slate-300">{r.risk}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Info Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Supply Chain Health Score Gauge Card */}
          <Card variant="indigo" className="p-6 text-center space-y-4 border-indigo-500/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Overall Network Health</span>
              <Badge variant="low">Real-time Index</Badge>
            </div>

            <div className="relative inline-flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-emerald-400 border-t-transparent animate-spin" style={{ animationDuration: '12s' }} />
                <div className="absolute text-center">
                  <span className="text-4xl font-extrabold text-emerald-400">{healthScore}%</span>
                  <p className="text-[10px] font-bold uppercase text-slate-300 mt-0.5">Excellent</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Global supply chain resilience score based on CatBoost predictive delay margins across 7 regional hubs.
            </p>
          </Card>

          {/* Environmental & Congestion Overlays */}
          <Card variant="glass" className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Live Weather &amp; Port Congestion Overlays
            </h4>

            <div className="space-y-3 text-xs">
              {/* Weather Alert */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CloudRain className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Singapore Port Weather Alert</p>
                    <p className="text-[10px] text-slate-400">Heavy Rain &amp; Monsoon Surge</p>
                  </div>
                </div>
                <Badge variant="medium" size="sm">+12h Delay</Badge>
              </div>

              {/* Port Congestion */}
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Anchor className="w-5 h-5 text-orange-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Rotterdam Port Congestion</p>
                    <p className="text-[10px] text-slate-400">Berth Queue Utilization</p>
                  </div>
                </div>
                <Badge variant="high" size="sm">82% Congested</Badge>
              </div>
            </div>
          </Card>

          {/* Live AI Event Stream Ticker */}
          <Card variant="glass" className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Live AI Event Ticker</h4>
              </div>
              {isDemoMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
              {liveEvents.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white">{evt.title}</span>
                    <span className="text-slate-500 font-mono">{evt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{evt.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
