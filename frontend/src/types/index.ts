export interface ShipmentPayload {
  Type: string;
  Market: string;
  Shipping_Mode: string;
  Order_Item_Quantity: number;
  Sales: number;
  profit_margin: number;
  scheduled_shipping_days: number;
  order_is_weekend: number;
  discount_rate: number;
  [key: string]: any;
}

export interface PredictionResult {
  delay_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
}

export interface ActionRecommendation {
  action: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface BusinessImpact {
  estimated_delay_reduction_days: number;
  estimated_cost_saving_usd: number;
  customer_risk: string;
  operational_priority: string;
  recommendations_count: number;
}

export interface RecommendationResponse {
  prediction: PredictionResult;
  possible_causes: string[];
  recommendations: ActionRecommendation[];
  priority: string;
  business_impact: BusinessImpact;
}

export interface SystemHealth {
  status: string;
  model: string;
  engine: string;
}

export interface SystemVersion {
  api_version: string;
  model_version: string;
  framework: string;
  features_count: number;
}

// -----------------------------
// Dashboard API Types
// -----------------------------
export interface DashboardSummary {
  total_shipments: number;
  high_risk_shipments: number;
  average_delay_probability: number;
  estimated_cost_savings: number;
  ai_recommendations: number;
  prediction_accuracy: number;
}

export interface RecentShipmentData {
  order_id: string;
  market: string;
  shipping_mode: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  delay_probability: number;
  sales_usd: number;
}

export interface LiveAlertData {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: string;
}

export interface AiSummaryData {
  headline: string;
  confidence: number;
  top_causes: string[];
  estimated_savings: number;
  prescribed_action: string;
}

// -----------------------------
// Analytics API Types
// -----------------------------
export interface AnalyticsOverview {
  overall_delay_reduction_pct: number;
  sla_fulfillment_pct: number;
  high_risk_reduction_pct: number;
  projected_savings_usd: number;
}

export interface DelayTrendPointData {
  month: string;
  actual: number;
  predicted: number;
  sla_target: number;
}

export interface RiskDistributionData {
  low_pct: number;
  low_count: number;
  medium_pct: number;
  medium_count: number;
  high_pct: number;
  high_count: number;
  critical_pct: number;
  critical_count: number;
}

export interface MarketPerformanceData {
  market: string;
  delay_probability: number;
}

export interface SupplierScorecardData {
  id: string;
  name: string;
  category: string;
  otif_rate: number;
  delay_rate: number;
  quality_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  overall_score: number;
}

export interface ForecastPointData {
  period: string;
  baseline_delay: number;
  predicted_with_ai: number;
}

export type TabType =
  | 'dashboard'
  | 'operations'
  | 'shipment'
  | 'analytics'
  | 'scenario'
  | 'copilot'
  | 'reports'
  | 'settings'
  | 'login';
