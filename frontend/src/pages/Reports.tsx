import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Printer, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

export const Reports: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      <PageHeader
        badge="Executive Document Suite"
        badgeIcon={<FileText className="w-4 h-4 text-indigo-400" />}
        title="Executive AI Decision Reports"
        description="Comprehensive C-suite logistics brief combining CatBoost ML risk modeling, financial SLA impact statements, and strategic supply chain recommendations."
        actions={
          <Button variant="ai" size="md" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print / Save Executive PDF
          </Button>
        }
      />

      {/* Main Printable Document Card */}
      <Card variant="glass" className="p-8 space-y-8 border-slate-800 bg-slate-900/90 shadow-2xl">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              ChainIQ Enterprise Supply Chain Performance Report
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Reporting Period: Q2 2026 • Published: July 25, 2026 • Model: CatBoost Classifier v1.5
            </p>
          </div>
          <Badge variant="indigo" size="md">Confidential Executive Document</Badge>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            During the evaluated period, ChainIQ ML Decision Engine processed <strong className="text-white">180,519 order vectors</strong> across 5 major destination markets (LATAM, Europe, Pacific Asia, USCA, Africa). CatBoost classifier inference identified <strong className="text-amber-300">Standard Class shipping to LATAM</strong> as the single largest vulnerability contributing to SLA delivery delays. Implementing prescribed express routing interventions reduced overall delay probability by <strong className="text-emerald-400">18.4%</strong>, generating <strong className="text-emerald-400">{formatCurrency(412850)}</strong> in net financial SLA savings.
          </p>
        </div>

        {/* 2. Key Performance Metric Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider">
            2. Key Performance Metric Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Total Analyzed Orders</span>
              <p className="text-xl font-extrabold text-white">180,519</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Baseline Delay Rate</span>
              <p className="text-xl font-extrabold text-rose-400">14.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">On-Time Fulfillment</span>
              <p className="text-xl font-extrabold text-emerald-400">96.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">CatBoost Model Accuracy</span>
              <p className="text-xl font-extrabold text-cyan-400">0.842 AUC</p>
            </div>
          </div>
        </div>

        {/* 3. CatBoost AI Findings & Feature Weights */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider">
            3. AI Decision Attribution &amp; Root Cause Analysis
          </h3>
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              Feature attribution analysis reveals that <strong className="text-white">Shipping Mode (+38% weight)</strong> and <strong className="text-white">Market Location (+24% weight)</strong> dominate the CatBoost decision tree. Weekend order placement adds a <strong className="text-amber-300">1.4x delay multiplier</strong> due to Monday morning dispatch queue congestion.
            </p>
          </div>
        </div>

        {/* 4. Strategic Recommendations & Financial Impact */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider">
            4. Prescribed Strategic Actions &amp; Net ROI
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-slate-200">1. Automate Express Freight Upgrades for LATAM Orders &gt; $1,000 Sales</span>
              <span className="font-bold text-emerald-400">+$245,000 Net Savings</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-slate-200">2. Enable Early Sunday Dispatch Shift at Origin Warehouses</span>
              <span className="font-bold text-emerald-400">+$112,500 Net Savings</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-slate-200">3. Enforce Carrier OTIF Penalty Clause for Non-Compliant Suppliers</span>
              <span className="font-bold text-emerald-400">+$55,350 Net Savings</span>
            </div>
          </div>
        </div>

        {/* Footer Authentication Stamp */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Digitally Signed by ChainIQ Decision Intelligence Engine</span>
          <span>Doc Hash: SHA256-CHNQ-9842</span>
        </div>
      </Card>
    </div>
  );
};
