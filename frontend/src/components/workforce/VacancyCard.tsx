import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Briefcase, MapPin, UserCheck, Calendar } from 'lucide-react';
import type { VacancyData } from '../../types';

interface VacancyCardProps {
  vacancy: VacancyData;
  isSelected: boolean;
  onSelect: (vacancyId: string) => void;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, isSelected, onSelect }) => {
  return (
    <Card
      variant={isSelected ? 'cyan' : 'default'}
      className={`space-y-3 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-md bg-blue-50/40' : 'hover:border-slate-300'
      }`}
      onClick={() => onSelect(vacancy.vacancy_id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{vacancy.role_title}</h4>
            <p className="text-xs text-slate-500">{vacancy.department} • Vacancy ID: {vacancy.vacancy_id}</p>
          </div>
        </div>
        <Badge variant={vacancy.cause === 'Underperformance' ? 'danger' : 'amber'} size="sm">
          Cause: {vacancy.cause}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Vacated by: <strong>{vacancy.previous_employee_name}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{vacancy.location} ({vacancy.salary_grade})</span>
        </div>
      </div>

      {/* Required Skills Badges */}
      <div className="space-y-1 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Skills Profile</span>
        <div className="flex flex-wrap gap-1">
          {vacancy.required_skills.map((skill, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Created: {vacancy.created_at}
        </span>
        <Button variant={isSelected ? 'ai' : 'outline'} size="sm">
          {isSelected ? 'Viewing AI Matches' : 'Match Candidates'}
        </Button>
      </div>
    </Card>
  );
};
