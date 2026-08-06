import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Settings as SettingsIcon, User, Bell, Server, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications' | 'api' | 'model' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-[1280px] mx-auto">
      <PageHeader
        badge="Enterprise Platform Administration"
        badgeIcon={<SettingsIcon className="w-4 h-4 text-blue-600" />}
        title="Platform Settings & Configuration"
        description="Manage user credentials, API endpoints, CatBoost model hyperparameter thresholds, notification rules, and SAML/MFA security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sub-Tab Navigation (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <Card variant="default" className="p-3 space-y-1 bg-white border border-slate-200/80 shadow-xs">
            {[
              { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'api', label: 'API Connections', icon: <Server className="w-4 h-4" /> },
              { id: 'model', label: 'Model Settings', icon: <Cpu className="w-4 h-4" /> },
              { id: 'security', label: 'Security & SSO', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={activeSubTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Right Settings Form Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <Card variant="default" className="p-8 space-y-6 border-slate-200/80 bg-white shadow-xs">
            {saved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configuration changes saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {activeSubTab === 'profile' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">User Profile Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue="Bhanu Sreekar" />
                    <Input label="Corporate Email" defaultValue="bhanu.sreekar@chainiq.ai" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Role" defaultValue="Executive Logistics Admin" readOnly />
                    <Select label="Timezone" defaultValue="UTC" options={[{ value: 'UTC', label: 'UTC (GMT+0)' }, { value: 'EST', label: 'EST (GMT-5)' }]} />
                  </div>
                </div>
              )}

              {activeSubTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">Alert Notification Rules</h3>
                  <div className="space-y-3 text-xs">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium cursor-pointer">
                      <span>Email alerts for Critical Risk (&gt;75% delay prob)</span>
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 border-slate-300" />
                    </label>
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium cursor-pointer">
                      <span>Weekly Executive Summary Digest (PDF)</span>
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 border-slate-300" />
                    </label>
                  </div>
                </div>
              )}

              {activeSubTab === 'api' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">FastAPI Backend Connection</h3>
                  <Input label="FastAPI Server Base URL" defaultValue="http://localhost:8000" />
                  <Input label="API Timeout (ms)" defaultValue="10000" type="number" />
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Connection Status: Connected to FastAPI CatBoost Backend</span>
                  </div>
                </div>
              )}

              {activeSubTab === 'model' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">CatBoost Model Hyperparameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Model Version" defaultValue="v1.5 Enterprise" readOnly />
                    <Input label="Feature Vector Length" defaultValue="42 Features" readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="High Risk Threshold (%)" defaultValue="60" type="number" />
                    <Input label="Critical Risk Threshold (%)" defaultValue="75" type="number" />
                  </div>
                </div>
              )}

              {activeSubTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200">Security &amp; Enterprise SSO</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">SAML 2.0 Single Sign-On</span>
                      <Badge variant="low">Active</Badge>
                    </div>
                    <p className="text-slate-600">Okta / Azure AD Identity Provider configured for workspace domain.</p>
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" size="md">
                Save Settings
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
