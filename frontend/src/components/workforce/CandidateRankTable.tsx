import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Award, Brain, CheckCircle2, Building, Sparkles } from 'lucide-react';
import type { CandidateRankItemData } from '../../types';

interface CandidateRankTableProps {
  candidates: CandidateRankItemData[];
  selectedRoleTitle: string;
}

export const CandidateRankTable: React.FC<CandidateRankTableProps> = ({ candidates, selectedRoleTitle }) => {
  const getBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'Excellent Match':
        return 'success';
      case 'Good Match':
        return 'indigo';
      case 'Average Match':
        return 'amber';
      default:
        return 'danger';
    }
  };

  return (
    <Card variant="default" className="space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            AI Candidate Semantic Ranking Matrix
          </h3>
          <p className="text-xs text-slate-500">Target Role: <strong>{selectedRoleTitle}</strong></p>
        </div>
        <Badge variant="indigo" size="md">
          <Brain className="w-3.5 h-3.5 mr-1" /> NLP Semantic Embedding Search
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-3.5">Rank</th>
              <th className="py-3 px-3.5">Candidate Name</th>
              <th className="py-3 px-3.5">Experience &amp; Edu</th>
              <th className="py-3 px-3.5 text-center">Score</th>
              <th className="py-3 px-3.5">Match Tier</th>
              <th className="py-3 px-3.5">AI Selection Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 bg-white">
            {candidates.map((c) => (
              <tr key={c.candidate.candidate_id} className="hover:bg-blue-50/30 transition-colors">
                {/* Rank */}
                <td className="py-3 px-3.5">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                    c.rank_position === 1
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : c.rank_position === 2
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{c.rank_position}
                  </span>
                </td>

                {/* Candidate */}
                <td className="py-3 px-3.5">
                  <div>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {c.candidate.name}
                      {c.rank_position === 1 && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      {c.candidate.previous_companies.join(', ') || 'Enterprise Logistics'}
                    </p>
                  </div>
                </td>

                {/* Experience & Edu */}
                <td className="py-3 px-3.5 text-slate-600">
                  <p className="font-semibold text-slate-800">{c.candidate.experience_years} Years Experience</p>
                  <p className="text-[11px] text-slate-500">{c.candidate.education}</p>
                </td>

                {/* Compatibility Score */}
                <td className="py-3 px-3.5 text-center">
                  <span className="font-mono text-base font-extrabold text-blue-700">
                    {c.overall_compatibility_score}%
                  </span>
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${c.overall_compatibility_score}%` }}
                    />
                  </div>
                </td>

                {/* Match Tier */}
                <td className="py-3 px-3.5">
                  <Badge variant={getBadgeVariant(c.match_tier)} size="sm">
                    {c.match_tier}
                  </Badge>
                </td>

                {/* AI Rationale */}
                <td className="py-3 px-3.5 text-[11px] text-slate-700 leading-relaxed max-w-xs">
                  <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100/80 text-blue-950 space-y-1">
                    <p className="font-semibold text-blue-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Key Drivers:
                    </p>
                    <p>{c.ai_explanation}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
