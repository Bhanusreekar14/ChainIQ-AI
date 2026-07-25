import api from './api';
import type {
  AnalyticsOverview,
  DelayTrendPointData,
  RiskDistributionData,
  MarketPerformanceData,
  SupplierScorecardData,
  ForecastPointData,
} from '../types';

export async function getOverview(): Promise<AnalyticsOverview> {
  const response = await api.get<AnalyticsOverview>('/analytics/overview');
  return response.data;
}

export async function getDelayTrend(): Promise<DelayTrendPointData[]> {
  const response = await api.get<DelayTrendPointData[]>('/analytics/delay-trend');
  return response.data;
}

export async function getRiskDistribution(): Promise<RiskDistributionData> {
  const response = await api.get<RiskDistributionData>('/analytics/risk-distribution');
  return response.data;
}

export async function getMarketPerformance(): Promise<MarketPerformanceData[]> {
  const response = await api.get<MarketPerformanceData[]>('/analytics/market-performance');
  return response.data;
}

export async function getSupplierScorecard(): Promise<SupplierScorecardData[]> {
  const response = await api.get<SupplierScorecardData[]>('/analytics/supplier-scorecard');
  return response.data;
}

export async function getForecast(): Promise<ForecastPointData[]> {
  const response = await api.get<ForecastPointData[]>('/analytics/forecast');
  return response.data;
}
