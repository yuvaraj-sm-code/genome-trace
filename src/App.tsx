import React from 'react';
import { GenomeProvider, useGenome } from './context/GenomeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { AmbientGlow } from './components/layout/AmbientGlow';
import { ToastContainer } from './components/common/ToastContainer';
import { HelpGuideModal } from './components/common/HelpGuideModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { DnaAnalyzerPage } from './pages/DnaAnalyzerPage';
import { SequenceComparisonPage } from './pages/SequenceComparisonPage';
import { MutationExplorerPage } from './pages/MutationExplorerPage';
import { SequenceStatisticsPage } from './pages/SequenceStatisticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalysisHistoryPage } from './pages/AnalysisHistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { activeTab, sidebarCollapsed } = useGenome();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'analyzer':
        return <DnaAnalyzerPage />;
      case 'comparison':
        return <SequenceComparisonPage />;
      case 'mutations':
        return <MutationExplorerPage />;
      case 'statistics':
        return <SequenceStatisticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'history':
        return <AnalysisHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Dynamic Background Reactive to Mutation Changes */}
      <AmbientGlow />

      {/* Global Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Content Canvas */}
        <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Professional Biotechnology Footer */}
        <footer className="relative z-10 border-t border-slate-900 bg-slate-950/40 py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">GENOME TRACE</span>
              <span>—</span>
              <span className="italic">Every Mutation Tells a Story.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
              <span>Dynamic Matrix Alignment Engine</span>
              <span>•</span>
              <span>Standard IUPAC Validation</span>
              <span>•</span>
              <span>Build 2.4-Production</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Feedback Toast Alerts & Modals */}
      <ToastContainer />
      <HelpGuideModal />
    </div>
  );
};

export function App() {
  return (
    <GenomeProvider>
      <MainLayout />
    </GenomeProvider>
  );
}

export default App;

