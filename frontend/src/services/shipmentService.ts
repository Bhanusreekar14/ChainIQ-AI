import api from './api';
import type { ShipmentPayload, RecommendationResponse, PredictionResult } from '../types';

export async function analyzeShipment(payload: ShipmentPayload): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>('/recommend', payload);
  return response.data;
}

export async function predictDelay(payload: ShipmentPayload): Promise<PredictionResult> {
  const response = await api.post<PredictionResult>('/predict', payload);
  return response.data;
}
