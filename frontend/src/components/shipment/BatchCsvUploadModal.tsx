import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertOctagon,
  RefreshCw,
  Package,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { predictBatchApi } from '../../services/shipmentService';
import type { BatchPredictionResponseData } from '../../types';

interface BatchCsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchCsvUploadModal: React.FC<BatchCsvUploadModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BatchPredictionResponseData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    try {
      const res = await predictBatchApi(file);
      setData(res);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.detail ||
        (err as { response?: { data?: { detail?: string; message?: string } } })?.response?.data?.message ||
        'Failed to process CSV file. Ensure FastAPI backend is running and CSV format is valid.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleLoad = () => {
    const sampleCsv =
      "Order Id,Type,Market,Shipping Mode,Sales,Order Item Quantity,profit_margin,scheduled_shipping_days\n" +
      "ORD-8101,DEBIT,LATAM,Standard Class,450.0,3,0.15,4\n" +
      "ORD-8102,PAYMENT,Europe,First Class,1250.0,5,0.25,2\n" +
      "ORD-8103,DEBIT,Pacific,Second Class,310.0,2,0.18,3\n" +
      "ORD-8104,CASH,Africa,Standard Class,890.0,6,0.08,5\n" +
      "ORD-8105,TRANSFER,USCA,Same Day,1500.0,1,0.30,1\n";

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const sampleFile = new File([blob], 'sample_shipments_batch.csv', { type: 'text/csv' });
    handleFileUpload(sampleFile);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ['row_index', 'order_id', 'type', 'market', 'shipping_mode', 'sales_usd', 'delay_probability', 'risk_level', 'top_root_cause'];
    const rows = data.orders.map((o) => [
      o.row_index,
      o.order_id,
      o.type,
      o.market,
      o.shipping_mode,
      o.sales_usd,
      o.delay_probability,
      o.risk_level,
      `"${o.top_root_cause}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ChainIQ_Batch_Predictions_${Date.now().toString().slice(-6)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-7 space-y-6 shadow-2xl text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Batch CSV Prediction &amp; Bulk Intelligence</h2>
              <p className="text-xs text-slate-400">Upload bulk order vectors to execute parallel CatBoost delay risk predictions.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!data && (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-slate-950/60 text-center space-y-3 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-10 h-10 text-blue-400 mx-auto animate-bounce" />
              <div>
                <p className="text-sm font-bold text-white">Drop your CSV order file here, or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">Supports standard CSV headers: Type, Market, Shipping Mode, Sales, Quantity, profit_margin</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Don't have a CSV handy?</span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                onClick={handleSampleLoad}
                disabled={loading}
              >
                {loading ? 'Processing Sample...' : 'Load Sample Batch CSV'}
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-white">Executing CatBoost Bulk Inference Engine...</p>
            <p className="text-xs text-slate-400">Evaluating 42-feature vectors per row</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSampleLoad}>Retry</Button>
          </div>
        )}

        {/* Results Area */}
        {data && !loading && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase">Total Evaluated Orders</span>
                <p className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  {data.total_orders} Orders
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase">High / Critical Risk</span>
                <p className="text-2xl font-extrabold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  {data.high_risk_orders} Orders
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase">Avg Batch Delay Probability</span>
                <p className="text-2xl font-extrabold text-cyan-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  {Math.round(data.average_delay_probability * 100)}%
                </p>
              </div>
            </div>

            {/* Batch Shipment Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Annotated Batch Prediction Watchlist</span>
                <span>Source: {selectedFile ? selectedFile.name : 'batch_shipments.csv'}</span>
              </div>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 sticky top-0 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Market</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3 text-right">Value</th>
                      <th className="py-2.5 px-3 text-right">Delay Prob</th>
                      <th className="py-2.5 px-3">Risk Tier</th>
                      <th className="py-2.5 px-3">Top Root Cause</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.orders.map((o) => (
                      <tr key={o.row_index} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-500">{o.row_index}</td>
                        <td className="py-2 px-3 font-bold text-white">{o.order_id}</td>
                        <td className="py-2 px-3 text-slate-400">{o.market}</td>
                        <td className="py-2 px-3 text-slate-400">{o.shipping_mode}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-300">{formatCurrency(o.sales_usd)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-cyan-400">{Math.round(o.delay_probability * 100)}%</td>
                        <td className="py-2 px-3">
                          <Badge variant={o.risk_level === 'Critical' || o.risk_level === 'High' ? 'danger' : 'success'} size="sm">
                            {o.risk_level}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-amber-400 font-medium text-[11px]">{o.top_root_cause}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setData(null)}>Upload Another File</Button>
              <Button variant="ai" size="md" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportCsv}>
                Export Annotated CSV
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
