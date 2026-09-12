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
  [key: string]: string | number | boolean | undefined;
}

export interface ShapAttributionData {
  feature: string;
  impact: number;
  direction: 'increases_risk' | 'reduces_risk';
}

export interface PredictionResult {
  delay_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  shap_attributions?: ShapAttributionData[];
}

export interface BatchOrderItemData {
  row_index: number;
  order_id: string;
  type: string;
  market: string;
  shipping_mode: string;
  sales_usd: number;
  delay_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  top_root_cause: string;
  shap_attributions?: ShapAttributionData[];
}

export interface BatchPredictionResponseData {
  total_orders: number;
  high_risk_orders: number;
  average_delay_probability: number;
  orders: BatchOrderItemData[];
}

export interface SimulateRouteItemData {
  mode_key: string;
  name: string;
  delay_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  est_transit_days: number;
  est_freight_cost_usd: number;
  co2_emissions_kg: number;
  tagline: string;
  recommended: boolean;
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

// -----------------------------
// Reports API Types
// -----------------------------
export interface ReportSummaryData {
  total_shipments: number;
  high_risk_shipments: number;
  on_time_delivery_pct: number;
  delay_trend_avg: number;
  revenue_summary_usd: number;
  period: string;
  confidence_score: number;
  generated_at: string;
}

export interface MonthlyReportItemData {
  month: string;
  total_shipments: number;
  delayed_shipments: number;
  on_time_pct: number;
  revenue_usd: number;
}

// -----------------------------
// Copilot API Types
// -----------------------------
export type CopilotCardType =
  | 'high_risk_table'
  | 'region_risk'
  | 'kpi_summary'
  | 'risk_distribution'
  | 'executive_summary'
  | 'action_recommendations'
  | null;

export interface CopilotChatMessagePayload {
  sender: 'user' | 'assistant';
  text: string;
}

export interface CopilotChatResponseData {
  answer: string;
  card_type?: CopilotCardType;
  card_data?: unknown;
  confidence: number;
  sources: string[];
  timestamp: string;
}

export interface CopilotChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  card_type?: CopilotCardType;
  card_data?: unknown;
  confidence?: number;
  sources?: string[];
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
  | 'workforce'
  | 'login';

// -----------------------------
// Workforce Intelligence Types (v2.0)
// -----------------------------
export interface EmployeeData {
  employee_id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  attendance_pct: number;
  productivity_score: number;
  kpi_score: number;
  delivery_performance_pct: number;
  error_rate_pct: number;
  location: string;
  salary_grade: string;
  is_underperforming: boolean;
}

export interface VacancyData {
  vacancy_id: string;
  role_id: string;
  role_title: string;
  department: string;
  cause: string;
  previous_employee_name: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number;
  location: string;
  salary_grade: string;
  created_at: string;
}

export interface CandidateProfileData {
  candidate_id: string;
  name: string;
  email: string;
  skills: string[];
  experience_years: number;
  education: string;
  certifications: string[];
  projects: string[];
  previous_companies: string[];
  languages: string[];
  current_location: string;
}

export interface CandidateRankItemData {
  rank_position: number;
  candidate: CandidateProfileData;
  vacancy_id: string;
  role_title: string;
  overall_compatibility_score: number;
  match_tier: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Not Recommended';
  skill_match_pct: number;
  experience_match_pct: number;
  education_match_pct: number;
  certification_match_pct: number;
  project_match_pct: number;
  matched_skills: string[];
  missing_skills: string[];
  ai_explanation: string;
}

export interface DepartmentVacancyData {
  department: string;
  count: number;
}

export interface WorkforceDashboardData {
  total_employees: number;
  vacant_positions: number;
  candidates_screened: number;
  average_match_pct: number;
  replacement_time_days: number;
  underperforming_alerts: EmployeeData[];
  department_vacancies: DepartmentVacancyData[];
  top_vacancies: VacancyData[];
}

export interface ResumeUploadResponseData {
  message: string;
  parsed_candidate: CandidateProfileData;
}

export interface CopilotWorkforceResponseData {
  reply: string;
  top_candidate: string;
  match_score: number;
  active_vacancies_count: number;
}
