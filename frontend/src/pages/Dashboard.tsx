import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { ShipmentMap } from '../components/dashboard/ShipmentMap';
import { AiSummary } from '../components/dashboard/AiSummary';
import { RecentShipments } from '../components/dashboard/RecentShipments';
import { LiveAlerts } from '../components/dashboard/LiveAlerts';
import { QuickActions } from '../components/dashboard/QuickActions';
import { Button } from '../components/ui/Button';
import { Sparkles, AlertOctagon, RefreshCw } from 'lucide-react';
import type {
  DashboardSummary,
  RecentShipmentData,
  LiveAlertData,
  AiSummaryData,
  TabType,
} from '../types';
import {
  getSummary,
  getRecentShipments,
  getLiveAlerts,
  getAiSummary,
} from '../services/dashboardService';

interface DashboardProps {
  setActiveTab: (tab: TabType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentShipments, setRecentShipments] = useState<RecentShipmentData[]>([]);
  const [alerts, setAlerts] = useState<LiveAlertData[]>([]);
  const [aiBrief, setAiBrief] = useState<AiSummaryData | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, recentRes, alertRes, aiRes] = await Promise.all([
        getSummary(),
        getRecentShipments(),
        getLiveAlerts(),
        getAiSummary(),
      ]);

      setSummary(sumRes);
      setRecentShipments(recentRes);
      setAlerts(alertRes);
      setAiBrief(aiRes);
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Unable to load live dashboard metrics from FastAPI backend. Ensure server is running at http://127.0.0.1:8000.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getSummary(),
      getRecentShipments(),
      getLiveAlerts(),
      getAiSummary(),
    ])
      .then(([sumRes, recentRes, alertRes, aiRes]) => {
        if (isMounted) {
          setSummary(sumRes);
          setRecentShipments(recentRes);
          setAlerts(alertRes);
          setAiBrief(aiRes);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            || 'Unable to load live dashboard metrics from FastAPI backend. Ensure server is running at http://127.0.0.1:8000.';
          setError(errorMsg);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      {/* 1. Header */}
      <PageHeader
        badge="Live Telemetry"
        badgeIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
        title="Executive Operations Control"
        description="Connected to live FastAPI CatBoost backend. Real-time visibility into supply chain delay risks, carrier SLA benchmarks, and AI decision support."
        actions={
          <Button
            variant="ai"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => setActiveTab('shipment')}
          >
            ✨ Run AI Analysis
          </Button>
        }
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={fetchDashboardData}
          >
            Retry Loading Dashboard
          </Button>
        </div>
      )}

      {/* 2. KPI Metrics Grid (Feeds from GET /dashboard/summary) */}
      <KpiGrid summary={summary} loading={loading} />

      {/* 3. Global Supply Chain Monitoring Map */}
      <ShipmentMap />

      {/* 4. AI Executive Brief (Feeds from GET /dashboard/ai-summary) */}
      <AiSummary
        data={aiBrief}
        loading={loading}
        onAnalyzeClick={() => setActiveTab('shipment')}
      />

      {/* 5. Watchlist & Live Alerts Grid (Feeds from GET /dashboard/recent-shipments & /dashboard/live-alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentShipments
            shipments={recentShipments}
            loading={loading}
            setActiveTab={setActiveTab}
          />
        </div>
        <div className="lg:col-span-5">
          <LiveAlerts alerts={alerts} loading={loading} />
        </div>
      </div>

      {/* 6. Quick Action Dispatch */}
      <QuickActions setActiveTab={setActiveTab} />
    </div>
  );
};
