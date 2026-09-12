import api from './api';
import type {
  WorkforceDashboardData,
  VacancyData,
  CandidateRankItemData,
  ResumeUploadResponseData,
  CopilotWorkforceResponseData,
} from '../types';

export async function getWorkforceDashboardApi(): Promise<WorkforceDashboardData> {
  const response = await api.get<WorkforceDashboardData>('/workforce/dashboard');
  return response.data;
}

export async function getVacanciesApi(): Promise<VacancyData[]> {
  const response = await api.get<VacancyData[]>('/vacancies');
  return response.data;
}

export async function uploadResumeApi(file: File): Promise<ResumeUploadResponseData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ResumeUploadResponseData>('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function rankCandidatesApi(vacancyId: string): Promise<CandidateRankItemData[]> {
  const response = await api.post<CandidateRankItemData[]>('/candidate/rank', { vacancy_id: vacancyId });
  return response.data;
}

export async function getTopCandidatesApi(vacancyId = 'VAC-201'): Promise<CandidateRankItemData[]> {
  const response = await api.get<CandidateRankItemData[]>('/candidate/top', {
    params: { vacancy_id: vacancyId },
  });
  return response.data;
}

export async function queryWorkforceCopilotApi(query: string): Promise<CopilotWorkforceResponseData> {
  const response = await api.post<CopilotWorkforceResponseData>('/copilot/workforce', { query });
  return response.data;
}

export async function downloadCandidateReportPdfApi(): Promise<void> {
  const response = await api.get('/candidate/report', {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ChainIQ_Talent_Evaluation_Report_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
