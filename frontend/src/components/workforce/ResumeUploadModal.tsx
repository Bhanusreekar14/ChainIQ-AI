import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, UploadCloud, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { uploadResumeApi } from '../../services/workforceService';
import type { CandidateProfileData } from '../../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (candidate: CandidateProfileData) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedCandidate, setParsedCandidate] = useState<CandidateProfileData | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadResumeApi(file);
      setParsedCandidate(res.parsed_candidate);
      onSuccess(res.parsed_candidate);
    } catch (err: unknown) {
      console.error(err);
      setError('Failed to parse resume file. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleResume = () => {
    const sampleText =
      "Vikram Malhotra\n" +
      "Email: vikram.m@supplychainai.org\n" +
      "7+ years of experience in Supply Chain Optimization, WMS, Logistics Management, Python, SQL, SAP S/4HANA.\n" +
      "Certifications: Certified Supply Chain Professional (CSCP), Six Sigma Black Belt\n" +
      "Previous Companies: Amazon Logistics, DHL Express\n";

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Vikram_Malhotra_Resume.txt', { type: 'text/plain' });
    handleFileUpload(sampleFile);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xl text-slate-900 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Resume Parser &amp; Skill Extractor</h3>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, and TXT resume files for semantic indexing.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!parsedCandidate && (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50/50 text-center space-y-3 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-10 h-10 text-blue-600 mx-auto animate-bounce" />
              <div>
                <p className="text-sm font-bold text-slate-900">Drop candidate resume here, or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">Accepts .PDF, .DOCX, and .TXT resume formats</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Need a sample resume?</span>
              <Button variant="outline" size="sm" onClick={handleSampleResume} disabled={loading}>
                {loading ? 'Parsing Sample...' : 'Load Sample Candidate Resume'}
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center space-y-2">
            <RefreshCw className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-900">Extracting Skills &amp; Parsing Candidate Entity Metadata...</p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        {/* Parsed Result */}
        {parsedCandidate && !loading && (
          <div className="space-y-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">{parsedCandidate.name}</h4>
              </div>
              <Badge variant="success" size="sm">Indexed</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <p>Experience: <strong>{parsedCandidate.experience_years} Years</strong></p>
              <p>Education: <strong>{parsedCandidate.education}</strong></p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracted Skills</span>
              <div className="flex flex-wrap gap-1">
                {parsedCandidate.skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-blue-200 text-[10px] font-semibold text-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setParsedCandidate(null)}>Upload Another</Button>
              <Button variant="ai" size="sm" onClick={onClose}>Done &amp; View Matches</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
