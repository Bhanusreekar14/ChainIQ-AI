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
  Search,
  TrendingUp,
  CheckCircle2,
  Users,
  Activity,
  Menu,
  X,
} from 'lucide-react';
import logoHorizontal from '../assets/logo-horizontal.svg';
import logoFull from '../assets/logo-full.svg';

interface LandingPageProps {
  initialLoginModalOpen?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ initialLoginModalOpen = false }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(initialLoginModalOpen);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignInClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleCopilotClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate('/dashboard/copilot');
    } else {
      setIsLoginOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <img src={logoHorizontal} alt="ChainIQ AI" className="h-8 sm:h-10 text-slate-900 object-contain" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600">
            <button onClick={() => navigate('/intro')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 3D Intro Showcase
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Capabilities
            </button>
            <button onClick={() => scrollToSection('kpis')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Statistics
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 transition-colors cursor-pointer">
              How It Works
            </button>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
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
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleSignInClick}
                >
                  Explore Platform
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            {!isAuthenticated && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSignInClick}
                className="text-xs py-1.5 px-3"
              >
                Explore
              </Button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg bg-slate-100 border border-slate-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg animate-fadeIn">
            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/intro'); }}
              className="w-full text-left font-semibold text-blue-600 py-2 border-b border-slate-100 flex items-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" /> 3D Intro Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left font-medium text-slate-700 py-2 border-b border-slate-100 text-xs"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left font-medium text-slate-700 py-2 border-b border-slate-100 text-xs"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('kpis')}
              className="w-full text-left font-medium text-slate-700 py-2 border-b border-slate-100 text-xs"
            >
              Statistics
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left font-medium text-slate-700 py-2 border-b border-slate-100 text-xs"
            >
              How It Works
            </button>
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={handleSignInClick}
                  >
                    Explore Platform
                  </Button>
                  <button
                    onClick={handleSignInClick}
                    className="w-full text-center text-xs font-semibold text-slate-700 py-2.5 rounded-lg border border-slate-200"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-6 sm:pt-7 pb-10 sm:pb-11 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-4 sm:space-y-5">
        {/* Main Logo */}
        <div className="flex justify-center -mb-1 sm:-mb-2">
          <img
            src={logoFull}
            alt="ChainIQ AI"
            className="h-28 sm:h-52 lg:h-64 max-h-[25vh] object-contain text-slate-900 transition-all duration-300 animate-logo-pulse max-w-[85vw]"
          />
        </div>

        {/* Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold tracking-wide max-w-[90vw]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">AI-Powered Supply Chain Decision Intelligence</span>
          </div>
        </div>

        {/* Hero Heading & Description */}
        <div className="space-y-2.5 max-w-4xl mx-auto">
          <h1 className="text-[15px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight px-2 sm:px-0 sm:whitespace-nowrap">
            Smarter Supply Chain Better Decisions
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Transform supply-chain data into predictive insights, root-cause analysis, and actionable AI recommendations for faster and smarter operational decisions.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-1 w-full max-w-xs sm:max-w-none mx-auto px-4 sm:px-0">
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Bot className="w-4 h-4 text-blue-600 shrink-0" />}
            onClick={handleCopilotClick}
            className="w-full sm:w-auto py-3.5 sm:py-3 px-6 text-sm sm:text-base font-semibold justify-center min-h-[48px]"
          >
            Try AI Copilot
          </Button>

          <Button
            variant="primary"
            size="lg"
            leftIcon={<Sparkles className="w-4 h-4 text-cyan-200 shrink-0" />}
            onClick={() => navigate('/intro')}
            className="w-full sm:w-auto py-3.5 sm:py-3 px-6 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md shadow-blue-500/20 justify-center min-h-[48px]"
          >
            Launch 3D Intro Showcase
          </Button>

          <Button
            variant="outline"
            size="lg"
            leftIcon={<Zap className="w-4 h-4 text-amber-500 shrink-0" />}
            onClick={() => scrollToSection('about')}
            className="w-full sm:w-auto py-3.5 sm:py-3 px-6 text-sm sm:text-base font-semibold justify-center min-h-[48px]"
          >
            View Technical Architecture
          </Button>
        </div>

        {/* Hero Telemetry & Platform Preview Card */}
        <div className="pt-4 max-w-5xl mx-auto px-1 sm:px-0">
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm space-y-4 sm:space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">Supply Chain Intelligence Telemetry</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">CatBoost ML Model &bull; 180,519 Supply Chain Records</p>
                </div>
              </div>
              <Badge variant="indigo" size="md" className="self-start sm:self-auto">ROC-AUC: 0.7724</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Supply Chain Records</span>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">180,519</p>
                <span className="text-[10px] text-blue-600 font-medium">53 Attributes Evaluated</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Late-Delivery Risk</span>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">54.83%</p>
                <span className="text-[10px] text-slate-500 font-medium">Target: Late_delivery_risk</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Risk Levels</span>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">4 Tiers</p>
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-700">Low</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-700">Med</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-orange-100 text-orange-700">High</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-100 text-rose-700">Critical</span>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Decision Support</span>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">AI-Powered</p>
                <span className="text-[10px] text-blue-600 font-medium">Root Causes &amp; Actions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10 border-t border-slate-100">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="slate" size="md">About ChainIQ AI</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Supply Chain Decision Intelligence Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2 sm:px-0">
            ChainIQ turns complex operational dataset signals into precise risk predictions, root cause breakdowns, and actionable operational interventions across your supply chain network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">CatBoost Predictive Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained on 180,519 supply chain records and 53 attributes to accurately predict delay risk probability across order profiles and logistics routes.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4-Tier Risk Classification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Categorizes shipment operational risk into Low, Medium, High, and Critical tiers with transparent probability thresholds and diagnostic indicators.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Actionable Interventions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recommends specific, actionable operational remedies such as shipping mode upgrades, carrier reassignment, and schedule adjustments.
            </p>
          </div>
        </div>
      </section>

      {/* 4. KEY PLATFORM CAPABILITIES SECTION */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10 border-t border-slate-100">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="indigo" size="md">Platform Capabilities</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Complete Control Suite For Supply Chain Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2 sm:px-0">
            Integrated tools designed for operations managers, logistics analysts, and executive teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Supply Chain Dashboard</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operational KPI metrics, risk watchlist tables, live route alerts, and executive ML summary insights.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Global Operations Map</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive regional operational map across LATAM, Europe, Pacific Asia, USCA, and Africa corridors.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <PackageSearch className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Shipment Risk Predictor</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Single-shipment CatBoost risk evaluation, delay probability score, root cause breakdown, and prescribed action.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Copilot Assistant</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational decision assistant rendering embedded rich UI cards for high-risk shipments, regional risks, and mitigation steps.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">What-if Scenario Simulator</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive sensitivity analysis sliders to evaluate shipping mode changes, discount rates, and trade-offs.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Analytics &amp; Scorecards</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive delay trend monitoring, risk distribution breakdowns, market performance, and supplier scorecards.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Workforce Intelligence</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operations team management, regional workforce allocation, and workload balancing across high-risk corridors.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Executive Reporting</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Downloadable executive PDF briefs and CSV performance breakdowns for operations review.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3D Intro Showcase</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive 3D visual walkthrough explaining the core architectural components and intelligence flow of ChainIQ AI.
            </p>
          </div>
        </div>
      </section>

      {/* 5. STATISTICS SECTION */}
      <section id="kpis" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-50 border-y border-slate-200/80">
        <div className="text-center mb-6 sm:mb-8 space-y-2">
          <Badge variant="slate" size="md">Platform Telemetry &amp; Model Accuracy</Badge>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verified Dataset &amp; Model Statistics</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">180,519</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Supply Chain Records</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">53 attributes evaluated</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">54.83%</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Late-Delivery Risk</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Historical delay baseline</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">4</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Risk Levels</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Low &bull; Med &bull; High &bull; Critical</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">ROC-AUC 0.7724</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">CatBoost Model</p>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Accuracy 71.21% | Precision 82.57%</p>
          </div>
        </div>
      </section>

      {/* 6. WORKFLOW: HOW IT WORKS */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="indigo" size="md">Platform Workflow</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            End-to-End Decision Intelligence Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 px-2 sm:px-0">
            From raw supply chain signals to confident operational decisions.
          </p>
        </div>

        {/* Workflow steps diagram / cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">01</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Monitor</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Ingests supply chain order vectors, shipping modes, and route status.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">02</span>
              <Cpu className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Predict</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              CatBoost ML evaluates risk probability across 4 risk levels.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">03</span>
              <Search className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Analyze</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Pinpoints root causes including lead times, carrier mode, and region.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">04</span>
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Simulate</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Sensitivity analysis models shipping mode and cost trade-offs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">05</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Recommend</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              AI engine generates tailored operational mitigation actions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">06</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Decide</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Empowers logistics leaders with interactive copilot support.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl bg-slate-900 text-white text-center space-y-4 sm:space-y-5 shadow-sm">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            Ready to Transform Your Supply Chain Decisions?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
            Experience predictive risk analysis, root-cause diagnostics, scenario simulation, and AI Copilot assistance in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-1 w-full max-w-xs sm:max-w-none mx-auto">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleSignInClick}
              className="w-full sm:w-auto py-3 px-6 text-sm font-semibold justify-center min-h-[44px]"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Explore Platform'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Bot className="w-4 h-4 text-blue-400" />}
              onClick={handleCopilotClick}
              className="w-full sm:w-auto py-3 px-6 text-sm font-semibold border-slate-700 text-slate-200 hover:bg-slate-800 justify-center min-h-[44px]"
            >
              Try AI Copilot
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="p-1.5 bg-blue-600 rounded text-white shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">ChainIQ AI Decision Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600">
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors cursor-pointer">Capabilities</button>
            <button onClick={() => navigate('/intro')} className="hover:text-blue-600 transition-colors cursor-pointer">3D Intro</button>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> Operational
            </span>
          </div>

          <p>&copy; 2026 ChainIQ AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Modern Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};
