import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoginModal } from '../components/auth/LoginModal';
import { useAuth } from '../auth/AuthContext';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Globe,
  Bot,
  FileText,
  SlidersHorizontal,
  PackageSearch,
  Sparkles,
} from 'lucide-react';
import logoHorizontal from '../assets/logo-horizontal.svg';
import logoFull from '../assets/logo-full.svg';
import { formatCurrency } from '../lib/utils';

interface LandingPageProps {
  initialLoginModalOpen?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ initialLoginModalOpen = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(initialLoginModalOpen);

  const handleSignInClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoHorizontal} alt="ChainIQ AI" className="h-10 text-slate-900" />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <button onClick={() => navigate('/intro')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 3D Intro Showcase
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('kpis')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Statistics
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 transition-colors cursor-pointer">
              How It Works
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <button
                  onClick={handleSignInClick}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleSignInClick}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-2">
          <img src={logoFull} alt="ChainIQ AI" className="h-28 text-slate-900" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Supply Chain Intelligence &amp; Delay Mitigation Platform</span>
        </div>

        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Predict &amp; Prevent Delivery Delays With Machine Learning
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            ChainIQ uses CatBoost machine learning trained on 42 operational parameters to predict delivery risks, estimate financial SLA impacts, and prescribe cost-effective express rerouting.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Sparkles className="w-4 h-4 text-cyan-200" />}
            onClick={() => navigate('/intro')}
            className="py-3 px-6 text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md shadow-blue-500/20"
          >
            Launch 3D Intro Showcase
          </Button>

          <Button
            variant="outline"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleSignInClick}
            className="py-3 px-6 text-sm font-semibold"
          >
            {isAuthenticated ? 'Launch Platform Dashboard' : 'Explore Platform Now'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            leftIcon={<Zap className="w-4 h-4 text-amber-500" />}
            onClick={() => scrollToSection('about')}
            className="py-3 px-6 text-sm font-semibold"
          >
            View Technical Architecture
          </Button>
        </div>

        {/* Hero Live Telemetry Preview Card */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Global Operational Telemetry</h3>
                  <p className="text-[11px] text-slate-500">Monitoring 180,519 order vectors across 5 regional hubs</p>
                </div>
              </div>
              <Badge variant="indigo" size="md">ROC AUC: 0.842</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Analyzed Orders</span>
                <p className="text-2xl font-bold text-slate-900">180,519</p>
                <span className="text-[10px] text-emerald-600 font-medium">↑ +12.4% vs baseline</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">On-Time Fulfillment</span>
                <p className="text-2xl font-bold text-emerald-600">96.2%</p>
                <span className="text-[10px] text-emerald-600 font-medium">↑ +4.2% SLA gain</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">High Risk Orders</span>
                <p className="text-2xl font-bold text-rose-600">256 orders</p>
                <span className="text-[10px] text-rose-600 font-medium">↓ -23.0% risk drop</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Net Financial ROI</span>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(412850)}</p>
                <span className="text-[10px] text-blue-600 font-medium">Prescribed AI Savings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-16 px-6 max-w-7xl mx-auto space-y-10 border-t border-slate-100">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="slate" size="md">About ChainIQ AI</Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Enterprise Decision Intelligence Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ChainIQ turns complex operational telemetry into precise delay probabilities and actionable financial savings recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">42-Feature Vector Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates order quantities, freight sales, discount rates, shipping modes, weekend dispatch multipliers, and carrier quality scores simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Calibrated Risk Classification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Categorizes order risk into Low, Medium, High, and Critical tiers with clear statistical model confidence metrics.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">High-ROI Action Prescriptions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prescribes exact logistics interventions (Express rerouting, Sunday shifts, OTIF penalty enforcement) alongside projected USD savings.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID SECTION */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto space-y-10 border-t border-slate-100">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="indigo" size="md">Platform Features</Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Complete Control Suite For Logistics Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Executive Dashboard</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time operational KPI cards, high-risk order watchlist, live environmental route alerts, and CatBoost briefs.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Global Operations Map</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive regional telemetry across LATAM, Europe, Pacific Asia, USCA, and Africa shipping corridors.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <PackageSearch className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Single Order Predictor</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant single-order ML delay probability score, confidence rating, and decision support recommendations.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Enterprise AI Copilot</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational assistant rendering interactive embedded rich UI cards for high-risk tables, regional risk bars, and action cards.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scenario Simulator</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive sensitivity analysis sliders to model shipping mode upgrades, discount rates, and profit margin trade-offs.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Executive Reports</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Downloadable executive PDF briefs and CSV performance breakdowns with digital SHA256 verification stamps.
            </p>
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section id="kpis" className="py-16 px-6 max-w-7xl mx-auto bg-slate-50 border-y border-slate-200/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">180,519+</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Analyzed Orders</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-emerald-600 tracking-tight">96.2%</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">On-Time Fulfillment</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-blue-600 tracking-tight">$412,850</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Net Financial ROI</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">0.842</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">CatBoost ROC AUC</p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="indigo" size="md">How It Works</Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Four Steps To Autonomous Logistics Optimization
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="text-xl font-bold text-blue-600">01</span>
            <h4 className="text-sm font-bold text-slate-900">Telemetry Ingestion</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Collects real-time order payloads, shipping modes, carrier OTIF rates, and hub status.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="text-xl font-bold text-blue-600">02</span>
            <h4 className="text-sm font-bold text-slate-900">CatBoost Scoring</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Processes the 42-feature vector through gradient boosting trees to generate calibrated delay risk scores.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="text-xl font-bold text-blue-600">03</span>
            <h4 className="text-sm font-bold text-slate-900">Action Prescriptions</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates prioritized rerouting recommendations ranked by financial SLA savings and risk urgency.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2">
            <span className="text-xl font-bold text-blue-600">04</span>
            <h4 className="text-sm font-bold text-slate-900">Automated Savings</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Triggers express upgrades and origin dispatch shifts, capturing proven financial ROI.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white text-center space-y-5 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to Optimize Your Enterprise Supply Chain?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience real-time CatBoost delay prediction, interactive scenario simulation, and executive decision reports.
          </p>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleSignInClick}
            className="py-3 px-6 text-sm font-semibold"
          >
            {isAuthenticated ? 'Go to Executive Dashboard' : 'Sign In & Launch Demo'}
          </Button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded text-white">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">ChainIQ.AI Decision Engine v1.5</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <span>Documentation</span>
            <span>API Specification</span>
            <span>Privacy</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
            </span>
          </div>

          <p>© 2026 ChainIQ.AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Modern Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};
