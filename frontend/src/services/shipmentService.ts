import api from './api';
import type {
  ShipmentPayload,
  RecommendationResponse,
  PredictionResult,
  BatchPredictionResponseData,
  SimulateRouteItemData,
} from '../types';

export async function analyzeShipment(payload: ShipmentPayload): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>('/recommend', payload);
  return response.data;
}

export async function predictDelay(payload: ShipmentPayload): Promise<PredictionResult> {
  const response = await api.post<PredictionResult>('/predict', payload);
  return response.data;
}

export async function predictBatchApi(file: File): Promise<BatchPredictionResponseData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<BatchPredictionResponseData>('/predict/batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function simulateRoutesApi(payload: ShipmentPayload): Promise<SimulateRouteItemData[]> {
  const response = await api.post<SimulateRouteItemData[]>('/simulate/routes', payload);
  return response.data;
}
