import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertOctagon, UserX, TrendingDown, ArrowRight } from 'lucide-react';
import type { EmployeeData } from '../../types';

interface PerformanceAlertListProps {
  alerts: EmployeeData[];
  onInitiateVacancy: (emp: EmployeeData) => void;
}

export const PerformanceAlertList: React.FC<PerformanceAlertListProps> = ({ alerts, onInitiateVacancy }) => {
  return (
    <Card variant="default" className="space-y-4 bg-white border border-rose-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <h4 className="text-sm font-bold text-slate-900">HR Performance Threshold Alerts</h4>
        </div>
        <Badge variant="danger" size="sm">
          {alerts.length} Action Required
        </Badge>
      </div>

      <div className="space-y-3">
        {alerts.map((emp) => (
          <div key={emp.employee_id} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                <p className="text-[11px] text-slate-500">{emp.role} • {emp.department}</p>
              </div>
              <Badge variant="danger" size="sm">
                KPI: {emp.kpi_score}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-rose-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Attendance</span>
                <span className="font-semibold text-slate-800">{emp.attendance_pct}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Delivery Rate</span>
                <span className="font-semibold text-slate-800">{emp.delivery_performance_pct}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Error Rate</span>
                <span className="font-semibold text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" /> {emp.error_rate_pct}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-rose-700 font-medium">Performance continuously below 70% threshold</span>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<UserX className="w-3.5 h-3.5" />}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                onClick={() => onInitiateVacancy(emp)}
              >
                Trigger AI Vacancy &amp; Replace
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
