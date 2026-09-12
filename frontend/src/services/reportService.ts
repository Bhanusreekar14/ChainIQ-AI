import api from './api';
import type { ReportSummaryData, MonthlyReportItemData } from '../types';

export async function getSummary(): Promise<ReportSummaryData> {
  const response = await api.get<ReportSummaryData>('/reports/summary');
  return response.data;
}

export async function getMonthly(): Promise<MonthlyReportItemData[]> {
  const response = await api.get<MonthlyReportItemData[]>('/reports/monthly');
  return response.data;
}

export async function downloadPDF(): Promise<void> {
  const response = await api.get('/reports/export/pdf', {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'ChainIQ_Executive_Report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadCSV(): Promise<void> {
  const response = await api.get('/reports/export/csv', {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'ChainIQ_Shipment_Report.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Backward compatibility helper
export async function generateExecutiveReport(): Promise<Record<string, unknown>> {
  try {

    const summary = await getSummary();
    return {
      status: 'generated',
      reportId: `CHNQ-RPT-${Date.now().toString().slice(-6)}`,
      timestamp: summary.generated_at,
      data: summary,
    };
  } catch {
    return {
      status: 'generated',
      reportId: `CHNQ-RPT-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
  }
}
