import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import type { TabType } from './types';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { DemoProvider } from './context/DemoContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Dashboard } from './pages/Dashboard';
import { GlobalOperations } from './pages/GlobalOperations';
import { Shipment } from './pages/Shipment';
import { Analytics } from './pages/Analytics';
import { Scenario } from './pages/Scenario';
import { Copilot } from './pages/Copilot';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Workforce } from './pages/Workforce';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { IntroPage } from './pages/IntroPage';
import { NotFound } from './pages/NotFound';

const ProtectedLayoutWrapper: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): TabType => {
    const path = location.pathname.replace('/dashboard', '').replace('/', '');
    if (!path || path === 'dashboard') return 'dashboard';
    if (path === 'operations') return 'operations';
    if (path === 'shipment') return 'shipment';
    if (path === 'analytics') return 'analytics';
    if (path === 'simulator') return 'scenario';
    if (path === 'copilot') return 'copilot';
    if (path === 'workforce') return 'workforce';
    if (path === 'reports') return 'reports';
    if (path === 'settings') return 'settings';
    return 'dashboard';
  };

  const handleSetActiveTab = (tab: TabType) => {
    if (tab === 'login') {
      navigate('/login');
      return;
    }
    if (tab === 'dashboard') navigate('/dashboard');
    else if (tab === 'scenario') navigate('/dashboard/simulator');
    else navigate(`/dashboard/${tab}`);
  };

  return (
    <DemoProvider>
      <DashboardLayout activeTab={getActiveTab()} setActiveTab={handleSetActiveTab}>
        <Routes>
          <Route index element={<Dashboard setActiveTab={handleSetActiveTab} />} />
          <Route path="operations" element={<GlobalOperations />} />
          <Route path="shipment" element={<Shipment />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="simulator" element={<Scenario />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="workforce" element={<Workforce />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound setActiveTab={handleSetActiveTab} />} />
        </Routes>
      </DashboardLayout>
    </DemoProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Marketing Landing Page & 3D Intro */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Enterprise Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<ProtectedLayoutWrapper />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound setActiveTab={() => {}} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
