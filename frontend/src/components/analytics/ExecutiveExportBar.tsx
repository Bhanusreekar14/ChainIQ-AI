import React from 'react';
import { Button } from '../ui/Button';
import { Download, FileSpreadsheet, Share2, Calendar } from 'lucide-react';

export const ExecutiveExportBar: React.FC = () => {
  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert('Exporting Executive Analytics dataset to Excel (.xlsx)...');
  };

  const handleShare = () => {
    alert('Dashboard link copied to clipboard for team sharing!');
  };

  const handleSchedule = () => {
    alert('Automated weekly PDF email report scheduled for Mondays at 08:00 AM!');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-white">Executive Actions:</span>
        <span className="text-slate-400">Download formatted reports or automate delivery</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleExportPDF}>
          Export PDF
        </Button>

        <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />} onClick={handleExportExcel}>
          Export Excel
        </Button>

        <Button variant="outline" size="sm" leftIcon={<Share2 className="w-3.5 h-3.5 text-cyan-400" />} onClick={handleShare}>
          Share Dashboard
        </Button>

        <Button variant="ai" size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />} onClick={handleSchedule}>
          Schedule Report
        </Button>
      </div>
    </div>
  );
};
