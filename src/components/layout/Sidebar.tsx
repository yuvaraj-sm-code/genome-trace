import React from 'react';
import {
  LayoutDashboard,
  Dna,
  GitCompare,
  Flame,
  BarChart3,
  FileSpreadsheet,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FlaskConical,
  X,
  User,
  ShieldCheck,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { useGenome, NavTab } from '../../context/GenomeContext';

interface NavItem {
  id: NavTab | 'documentation';
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentAnalysis,
    setHelpModalOpen,
    themeMode,
    toggleThemeMode
  } = useGenome();

  const mutationCount = currentAnalysis?.result?.mutations.length || 0;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'DNA Analyzer', icon: Dna },
    {
      id: 'comparison',
      label: 'Sequence Comparison',
      icon: GitCompare,
      badge: currentAnalysis ? `${currentAnalysis.result.identityPercentage}%` : undefined
    },
    {
      id: 'mutations',
      label: 'Mutation Explorer',
      icon: Flame,
      badge: mutationCount > 0 ? mutationCount : undefined
    },
    { id: 'statistics', label: 'Sequence Statistics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'documentation' as any, label: 'Documentation', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (tab: NavTab | 'documentation') => {
    if (tab === 'documentation') {
      setHelpModalOpen(true);
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(tab as NavTab);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#090e1a]/95 backdrop-blur-xl border-r border-slate-800/80 text-slate-300">
      {/* Brand Header */}
      <div className={`p-4 border-b border-slate-800/60 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Dna className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg text-white tracking-wider">
                  GENOME<span className="text-cyan-400">TRACE</span>
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold tracking-wider">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate tracking-tight">
                Every Mutation Tells a Story
              </p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className={`px-2 mb-2 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Modules
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive
                    ? 'text-cyan-400 scale-105'
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                }`}
              />

              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Lab Platform Status & Quick Summary Banner */}
      {!sidebarCollapsed && (
        <div className="mx-3 my-2 p-3 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">
              Biotech Engine Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pairwise DP alignment matrix ready for comparative genetics.
          </p>
        </div>
      )}

      {/* Bottom Sidebar: Researcher Profile & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/70 bg-slate-950/60">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          onClick={() => handleNavClick('settings')}
          title="Researcher Profile & Account Settings"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1.5px]">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-xs text-cyan-300">
                DR
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  Dr. Yuvaraj
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Principal Bioinformatician
              </p>
            </div>
          )}
        </div>

        {/* Quick Theme Mode Toggle */}
        <button
          onClick={toggleThemeMode}
          className="mt-2 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all text-xs flex items-center gap-2 w-full justify-center border border-transparent hover:border-slate-800"
          title={themeMode === 'dark' ? 'Switch to Light Mode (Clinical White)' : 'Switch to Dark Mode (Lab Slate)'}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
          {!sidebarCollapsed && (
            <span className="text-[11px] font-medium text-slate-400">
              {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Sidebar Collapse Toggle Button (Desktop only) */}
        <div className="hidden md:flex justify-end mt-1 pt-2 border-t border-slate-800/40">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs flex items-center gap-1.5 w-full justify-center"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] text-slate-400 font-medium">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
