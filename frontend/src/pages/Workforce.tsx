import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VacancyCard } from '../components/workforce/VacancyCard';
import { CandidateRankTable } from '../components/workforce/CandidateRankTable';
import { PerformanceAlertList } from '../components/workforce/PerformanceAlertList';
import { ResumeUploadModal } from '../components/workforce/ResumeUploadModal';
import {
  Users,
  Briefcase,
  UserCheck,
  Award,
  Clock,
  UploadCloud,
  Download,
  Bot,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  getWorkforceDashboardApi,
  rankCandidatesApi,
  downloadCandidateReportPdfApi,
  queryWorkforceCopilotApi,
} from '../services/workforceService';
import type {
  WorkforceDashboardData,
  CandidateRankItemData,
  EmployeeData,
} from '../types';

export const Workforce: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<WorkforceDashboardData | null>(null);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('VAC-201');
  const [candidates, setCandidates] = useState<CandidateRankItemData[]>([]);

  // Modals & Copilot
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotReply, setCopilotReply] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getWorkforceDashboardApi(),
      rankCandidatesApi('VAC-201'),
    ]).then(([dash, ranked]) => {
      if (isMounted) {
        setDashboardData(dash);
        setCandidates(ranked);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to load workforce intelligence data:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadData = async () => {
    try {
      const [dash, ranked] = await Promise.all([
        getWorkforceDashboardApi(),
        rankCandidatesApi(selectedVacancyId),
      ]);
      setDashboardData(dash);
      setCandidates(ranked);
    } catch (err) {
      console.error('Failed to reload workforce intelligence data:', err);
    }
  };

  const handleSelectVacancy = async (vacancyId: string) => {
    setSelectedVacancyId(vacancyId);
    try {
      const ranked = await rankCandidatesApi(vacancyId);
      setCandidates(ranked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitiateVacancy = async (emp: EmployeeData) => {
    alert(`AI Vacancy triggered for ${emp.name} (${emp.role}). Vacancy VAC-203 created.`);
    await loadData();
  };

  const handleCopilotQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    setCopilotLoading(true);
    try {
      const res = await queryWorkforceCopilotApi(copilotQuery);
      setCopilotReply(res.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const selectedVacancy = dashboardData?.top_vacancies.find((v) => v.vacancy_id === selectedVacancyId) || dashboardData?.top_vacancies[0];

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      <PageHeader
        badge="Enterprise Edition v2.0"
        badgeIcon={<UserCheck className="w-4 h-4 text-blue-600" />}
        title="AI Workforce Intelligence & Talent Replacement Engine"
        description="Automated vacancy detection, NLP resume parsing, multi-dimensional semantic skill matching, and instant executive replacement recommendations."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<UploadCloud className="w-4 h-4 text-blue-600" />}
              onClick={() => setIsResumeModalOpen(true)}
            >
              Parse Resume
            </Button>
            <Button
              variant="ai"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => downloadCandidateReportPdfApi()}
            >
              Download Talent Report
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-900">Loading Workforce Telemetry &amp; Candidate Embeddings...</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card variant="default" className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Active Employees</span>
              <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {dashboardData.total_employees} Active
              </p>
            </Card>
            <Card variant="default" className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vacant Supply Chain Roles</span>
              <p className="text-2xl font-extrabold text-amber-600 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-500" />
                {dashboardData.vacant_positions} Positions
              </p>
            </Card>
            <Card variant="default" className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidates Screened</span>
              <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-600" />
                {dashboardData.candidates_screened}+ Profiles
              </p>
            </Card>
            <Card variant="default" className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Match %</span>
              <p className="text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                {dashboardData.average_match_pct}% Match
              </p>
            </Card>
            <Card variant="default" className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Replacement SLA Time</span>
              <p className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                {dashboardData.replacement_time_days} Days
              </p>
            </Card>
          </div>

          {/* AI Workforce Copilot Assistant Banner */}
          <Card variant="cyan" className="space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">AI Talent Intelligence Copilot Q&amp;A</h4>
            </div>
            <form onSubmit={handleCopilotQuerySubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Who is the best replacement for Warehouse Manager?' or 'Show underperforming employees'"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="ai" size="sm" type="submit" isLoading={copilotLoading} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Ask Copilot
              </Button>
            </form>
            {copilotReply && (
              <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs text-slate-800 leading-relaxed animate-fadeIn">
                <strong>AI Workforce Copilot Response:</strong> {copilotReply}
              </div>
            )}
          </Card>

          {/* Main Grid: Active Vacancies vs Candidate Ranking Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Feed: Vacancies & Performance Alerts (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <PerformanceAlertList
                alerts={dashboardData.underperforming_alerts}
                onInitiateVacancy={handleInitiateVacancy}
              />

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Active Vacant Role Watchlist
                </h4>
                <div className="space-y-3">
                  {dashboardData.top_vacancies.map((v) => (
                    <VacancyCard
                      key={v.vacancy_id}
                      vacancy={v}
                      isSelected={v.vacancy_id === selectedVacancyId}
                      onSelect={handleSelectVacancy}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Feed: Candidate Ranking Matrix (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <CandidateRankTable
                candidates={candidates}
                selectedRoleTitle={selectedVacancy?.role_title || 'Senior Warehouse Manager'}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
