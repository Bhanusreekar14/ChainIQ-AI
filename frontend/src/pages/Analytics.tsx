import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { AiAnalyticsBrief } from '../components/analytics/AiAnalyticsBrief';
import { AnalyticsFilterBar, type FilterState } from '../components/analytics/AnalyticsFilterBar';
import { ExecutiveExportBar } from '../components/analytics/ExecutiveExportBar';
import { DelayTrendChart } from '../components/analytics/DelayTrendChart';
import { RiskDistribution } from '../components/analytics/RiskDistribution';
import { SupplierScorecard } from '../components/analytics/SupplierScorecard';
import { MarketPerformance } from '../components/analytics/MarketPerformance';
import { AiForecastChart } from '../components/analytics/AiForecastChart';
import { SavingsChart } from '../components/analytics/SavingsChart';
import { Button } from '../components/ui/Button';
import { BarChart3, AlertOctagon, RefreshCw } from 'lucide-react';
import type {
  AnalyticsOverview,
  DelayTrendPointData,
  RiskDistributionData,
  MarketPerformanceData,
  SupplierScorecardData,
  ForecastPointData,
} from '../types';
import {
  getOverview,
  getDelayTrend,
  getRiskDistribution,
  getMarketPerformance,
  getSupplierScorecard,
  getForecast,
} from '../services/analyticsService';

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [delayTrend, setDelayTrend] = useState<DelayTrendPointData[]>([]);
  const [riskDist, setRiskDist] = useState<RiskDistributionData | null>(null);
  const [markets, setMarkets] = useState<MarketPerformanceData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierScorecardData[]>([]);
  const [forecast, setForecast] = useState<ForecastPointData[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30d',
    region: 'ALL',
    market: 'ALL',
    shippingMode: 'ALL',
    riskLevel: 'ALL',
    supplier: 'ALL',
  });

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, dtRes, rdRes, mpRes, ssRes, fcRes] = await Promise.all([
        getOverview(),
        getDelayTrend(),
        getRiskDistribution(),
        getMarketPerformance(),
        getSupplierScorecard(),
        getForecast(),
      ]);

      setOverview(ovRes);
      setDelayTrend(dtRes);
      setRiskDist(rdRes);
      setMarkets(mpRes);
      setSuppliers(ssRes);
      setForecast(fcRes);
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Unable to load live analytics data from FastAPI backend. Ensure server is running at http://127.0.0.1:8000.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getOverview(),
      getDelayTrend(),
      getRiskDistribution(),
      getMarketPerformance(),
      getSupplierScorecard(),
      getForecast(),
    ])
      .then(([ovRes, dtRes, rdRes, mpRes, ssRes, fcRes]) => {
        if (isMounted) {
          setOverview(ovRes);
          setDelayTrend(dtRes);
          setRiskDist(rdRes);
          setMarkets(mpRes);
          setSuppliers(ssRes);
          setForecast(fcRes);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            || 'Unable to load live analytics data from FastAPI backend. Ensure server is running at http://127.0.0.1:8000.';
          setError(errorMsg);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      dateRange: '30d',
      region: 'ALL',
      market: 'ALL',
      shippingMode: 'ALL',
      riskLevel: 'ALL',
      supplier: 'ALL',
    });
  };

  return (
    <div className="space-y-6 max-w-[1280px] mx-auto">
      {/* Executive Page Title Header */}
      <PageHeader
        badge="Enterprise Decision Center"
        badgeIcon={<BarChart3 className="w-4 h-4 text-indigo-400" />}
        title="Executive Analytics Center"
        description="Connected to live FastAPI analytics service. Tracks SLA delay trends, risk category distributions, carrier scorecards, and 30-day CatBoost forecasts."
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
            onClick={fetchAnalyticsData}
          >
            Retry Loading Analytics
          </Button>
        </div>
      )}

      {/* Top AI Intelligence Brief */}
      <AiAnalyticsBrief data={overview} loading={loading} />

      {/* Interactive Executive Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Executive Export Actions */}
      <ExecutiveExportBar />

      {/* Grid 1: Delay Trend vs SLA Target & Risk Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DelayTrendChart data={delayTrend} loading={loading} />
        <RiskDistribution data={riskDist} loading={loading} />
      </div>

      {/* Enterprise Supplier Scorecard Table ⭐ */}
      <SupplierScorecard suppliers={suppliers} loading={loading} />

      {/* Grid 2: Regional Market Vulnerability & AI 30-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketPerformance markets={markets} loading={loading} />
        <AiForecastChart forecast={forecast} loading={loading} />
      </div>

      {/* Cumulative Savings Trend */}
      <SavingsChart savingsUSD={overview?.projected_savings_usd} loading={loading} />
    </div>
  );
};
