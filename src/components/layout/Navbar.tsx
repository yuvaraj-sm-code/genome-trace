import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Plus,
  Sparkles,
  Dna,
  CheckCircle2,
  AlertTriangle,
  Info,
  Palette,
  ExternalLink
} from 'lucide-react';
import { useGenome, NavTab } from '../../context/GenomeContext';

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string; category: string }> = {
  dashboard: {
    title: 'Genome Overview',
    subtitle: 'Monitor your DNA sequence analysis and genetic variation insights.',
    category: 'Overview'
  },
  analyzer: {
    title: 'DNA Sequence Analyzer',
    subtitle: 'Upload, validate and analyse your DNA sequences.',
    category: 'Core Analysis'
  },
  comparison: {
    title: 'Sequence Comparison',
    subtitle: 'Structured pairwise alignment and nucleotide divergence inspector.',
    category: 'Alignment'
  },
  mutations: {
    title: 'Mutation Explorer',
    subtitle: 'Explore detected sequence variations and their exact positions.',
    category: 'Variation Analytics'
  },
  statistics: {
    title: 'Sequence Statistics',
    subtitle: 'Quantitative base distribution, GC stoichiometry and thermodynamic stability.',
    category: 'Metrics'
  },
  reports: {
    title: 'Analysis Reports',
    subtitle: 'Exportable scientific summaries, audit trails and peer review documents.',
    category: 'Documentation'
  },
  history: {
    title: 'Analysis History',
    subtitle: 'Timeline ledger of analyzed sequences, comparative audits and replicates.',
    category: 'Repository'
  },
  settings: {
    title: 'Settings & Design System',
    subtitle: 'Laboratory configuration, bioinformatics parameters and custom theme variables.',
    category: 'Preferences'
  }
};

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    currentAnalysis,
    setHelpModalOpen,
    addToast
  } = useGenome();

  const [notificationOpen, setNotificationOpen] = useState(false);

  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  const notifications = [
    {
      id: 'n1',
      title: 'Alignment Complete',
      desc: currentAnalysis ? `Analysis ${currentAnalysis.id} completed with ${currentAnalysis.result.mutations.length} mutations.` : 'New sequence alignment ready.',
      time: 'Just now',
      type: 'success'
    },
    {
      id: 'n2',
      title: 'Algorithm Updated',
      desc: 'Needleman-Wunsch DP alignment scoring engine synced.',
      time: '15m ago',
      type: 'info'
    },
    {
      id: 'n3',
      title: 'Database Sync',
      desc: 'RefSeq & Ensembl nucleotide standard dictionaries loaded.',
      time: '2h ago',
      type: 'info'
    }
  ];

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/70 transition-all duration-300">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title/Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tracking-wide">
              <span>Platform</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400/90 font-medium">{currentTabInfo.category}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 truncate">{currentTabInfo.title}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight truncate">
              {currentTabInfo.title}
            </h1>
          </div>
        </div>

        {/* Center / Right: Global Search, Quick Stats, Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search Box */}
          <div className="relative hidden lg:block w-64 xl:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mutations, positions, genes..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Dynamic Mutation Pill (Shows active mutation types in real-time) */}
          {currentAnalysis && currentAnalysis.result.mutations.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Mutations:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {currentAnalysis.result.substitutions} Sub
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {currentAnalysis.result.insertions} Ins
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {currentAnalysis.result.deletions} Del
              </span>
            </div>
          )}

          {/* Prominent Primary "New Analysis" Button */}
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:via-sky-500 hover:to-teal-400 text-white font-medium text-xs sm:text-sm shadow-md shadow-cyan-600/25 hover:shadow-cyan-500/40 transition-all duration-200 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Analysis</span>
            <span className="sm:hidden">Analyze</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                  <button
                    onClick={() => {
                      setNotificationOpen(false);
                      addToast('info', 'Notifications Cleared', 'All notices marked as read.');
                    }}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-200 mb-0.5">
                        <span className="flex items-center gap-1.5">
                          {n.type === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Button (Opens Bioinformatics Guide Modal) */}
          <button
            onClick={() => setHelpModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Bioinformatics Documentation & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
