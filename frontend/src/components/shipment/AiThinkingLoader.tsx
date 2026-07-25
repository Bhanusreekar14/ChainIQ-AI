import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AiThinkingLoaderProps {
  onComplete: () => void;
}

export const AiThinkingLoader: React.FC<AiThinkingLoaderProps> = ({ onComplete }) => {
  const steps = [
    'Loading CatBoost Classifier Model (v1.5)...',
    'Extracting 42 Feature Vectors & Temporal Signals...',
    'Calculating Delay Risk Probability & Confidence...',
    'Synthesizing Prescribed Interventions & ROI Savings...',
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(doneTimer);
    }
  }, [currentStep, onComplete, steps.length]);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / (steps.length + 1)) * 100));

  return (
    <Card variant="indigo" className="p-8 border-cyan-500/40 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
            <Cpu className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              ChainIQ AI Decision Engine Processing <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400">Executing CatBoost inference on order feature vector</p>
          </div>
        </div>
        <span className="font-mono text-sm font-extrabold text-cyan-400">{progressPercent}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps Checklist */}
      <div className="space-y-2.5 pt-2 text-xs font-mono">
        {steps.map((stepText, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isDone
                  ? 'bg-slate-900/80 text-emerald-400 border border-emerald-500/20'
                  : isCurrent
                  ? 'bg-indigo-950/60 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="font-medium text-xs">{stepText}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
