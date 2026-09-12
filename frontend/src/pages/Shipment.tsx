import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { ShipmentForm } from '../components/shipment/ShipmentForm';
import { InferenceCard } from '../components/shipment/InferenceCard';
import { RootCauseCard } from '../components/shipment/RootCauseCard';
import { ExplainableAiCard } from '../components/shipment/ExplainableAiCard';
import { InterventionTimeline } from '../components/shipment/InterventionTimeline';
import { BusinessImpactCard } from '../components/shipment/BusinessImpact';
import { AiThinkingLoader } from '../components/shipment/AiThinkingLoader';
import { ScenarioCompareModal } from '../components/shipment/ScenarioCompareModal';
import { ReportModal } from '../components/shipment/ReportModal';
import { BatchCsvUploadModal } from '../components/shipment/BatchCsvUploadModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Sparkles, SlidersHorizontal, Download, AlertOctagon, RefreshCw, FileSpreadsheet } from 'lucide-react';
import type { RecommendationResponse, ShipmentPayload } from '../types';
import { analyzeShipment } from '../services/shipmentService';

export const Shipment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingResult, setPendingResult] = useState<RecommendationResponse | null>(null);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const [lastPayload, setLastPayload] = useState<ShipmentPayload>({
    Type: 'DEBIT',
    Market: 'LATAM',
    Shipping_Mode: 'Standard Class',
    Order_Item_Quantity: 4,
    Sales: 450.0,
    profit_margin: 0.15,
    scheduled_shipping_days: 4,
    order_is_weekend: 0,
    discount_rate: 0.05,
  });

  // Modal Controls
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  const handleAnalyze = async (payload: ShipmentPayload) => {
    setLastPayload(payload);
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeShipment(payload);
      setPendingResult(res);
      setIsThinking(true);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: Array<{ msg?: string }>; message?: string } } };
      const msg =
        errorObj.response?.data?.detail?.[0]?.msg ||
        errorObj.response?.data?.message ||
        'Unable to contact ChainIQ AI Engine. Ensure FastAPI server is running on http://127.0.0.1:8000.';
      setError(msg);
      setLoading(false);
    }
  };

  const handleThinkingComplete = () => {
    setResult(pendingResult);
    setIsThinking(false);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      <PageHeader
        badge="AI Decision Workspace"
        badgeIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
        title="AI Shipment Analysis & Risk Engine"
        description="Connected to live FastAPI CatBoost backend. Evaluates order vectors for delay probability, feature attributions, and ROI interventions."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-blue-600" />}
              onClick={() => setIsBatchOpen(true)}
            >
              Batch CSV Upload
            </Button>
            {result && (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                  onClick={() => setIsCompareOpen(true)}
                >
                  Compare Scenario
                </Button>
                <Button
                  variant="ai"
                  size="md"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => setIsReportOpen(true)}
                >
                  Download AI Report
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ShipmentForm onAnalyze={handleAnalyze} loading={loading} />

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
                onClick={() => handleAnalyze(lastPayload)}
              >
                Retry Analysis
              </Button>
            </div>
          )}
        </div>

        {/* Right Output Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {isThinking ? (
            <AiThinkingLoader onComplete={handleThinkingComplete} />
          ) : result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Row: Probability Gauge & Impact Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InferenceCard prediction={result.prediction} />
                <BusinessImpactCard impact={result.business_impact} />
              </div>

              {/* Explainable AI Card */}
              <ExplainableAiCard prediction={result.prediction} causes={result.possible_causes} />

              {/* Root Cause Indicators */}
              <RootCauseCard causes={result.possible_causes} />

              {/* Intervention Sequence Timeline */}
              <InterventionTimeline recommendations={result.recommendations} />
            </div>
          ) : (
            <EmptyState
              title="Awaiting Shipment Input"
              description="Fill in the order parameters on the left and click ✨ Run AI Analysis to trigger the CatBoost inference pipeline and Explainable AI attributions."
            />
          )}
        </div>
      </div>

      {/* Batch Prediction CSV Modal */}
      <BatchCsvUploadModal isOpen={isBatchOpen} onClose={() => setIsBatchOpen(false)} />

      {/* Scenario Compare Modal */}
      {result && (
        <ScenarioCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          result={result}
        />
      )}

      {/* Report Modal */}
      {result && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          result={result}
          payload={lastPayload}
        />
      )}
    </div>
  );
};
