import React from 'react';
import { RiskGauge } from '../ui/RiskGauge';
import type { PredictionResult } from '../../types';

interface InferenceCardProps {
  prediction: PredictionResult;
}

export const InferenceCard: React.FC<InferenceCardProps> = ({ prediction }) => {
  return (
    <RiskGauge
      probability={prediction.delay_probability}
      riskLevel={prediction.risk_level}
      confidence={prediction.confidence}
    />
  );
};
