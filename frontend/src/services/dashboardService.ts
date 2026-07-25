import api from './api';
import type {
  SystemHealth,
  SystemVersion,
  DashboardSummary,
  RecentShipmentData,
  LiveAlertData,
  AiSummaryData,
} from '../types';

export async function getHealthStatus(): Promise<SystemHealth> {
  const response = await api.get<SystemHealth>('/health');
  return response.data;
}

export async function getVersionInfo(): Promise<SystemVersion> {
  const response = await api.get<SystemVersion>('/version');
  return response.data;
}

export async function getSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>('/dashboard/summary');
  return response.data;
}

export async function getRecentShipments(): Promise<RecentShipmentData[]> {
  const response = await api.get<RecentShipmentData[]>('/dashboard/recent-shipments');
  return response.data;
}

export async function getLiveAlerts(): Promise<LiveAlertData[]> {
  const response = await api.get<LiveAlertData[]>('/dashboard/live-alerts');
  return response.data;
}

export async function getAiSummary(): Promise<AiSummaryData> {
  const response = await api.get<AiSummaryData>('/dashboard/ai-summary');
  return response.data;
}
