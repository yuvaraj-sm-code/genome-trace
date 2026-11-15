import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlignmentResult,
  AnalysisRecord,
  MutationItem,
  SequenceStats
} from '../types/dna';
import {
  alignSequences,
  calculateSequenceStats,
  DEMO_DATASETS,
  parseFasta
} from '../utils/bioinformatics';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  setSupabaseConfig,
  saveAnalysisToSupabase,
  fetchAnalysesFromSupabase,
  deleteAnalysisFromSupabase
} from '../utils/supabase';

export type NavTab =
  | 'dashboard'
  | 'analyzer'
  | 'comparison'
  | 'mutations'
  | 'statistics'
  | 'reports'
  | 'history'
  | 'settings';

export type ComparisonViewMode = 'aligned' | 'side-by-side' | 'diff-only';
export type ZoomLevel = 'compact' | 'normal' | 'detailed';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface CustomThemePalette {
  id: string;
  name: string;
  bgBase: string;
  bgSurface: string;
  primary: string;
  mutationSub: string;
  mutationIns: string;
  mutationDel: string;
  mutationMatch: string;
}

export const PRESET_THEMES: CustomThemePalette[] = [
  {
    id: 'cyan-biotech',
    name: 'Cyan Biotech (Default)',
    bgBase: '#060913',
    bgSurface: '#0c1222',
    primary: '#0ea5e9',
    mutationSub: '#f59e0b',
    mutationIns: '#10b981',
    mutationDel: '#f43f5e',
    mutationMatch: '#06b6d4'
  },
  {
    id: 'emerald-genomics',
    name: 'Emerald Genomics',
    bgBase: '#040d0b',
    bgSurface: '#0a1a16',
    primary: '#10b981',
    mutationSub: '#f59e0b',
    mutationIns: '#34d399',
    mutationDel: '#f43f5e',
    mutationMatch: '#059669'
  },
  {
    id: 'biotech-indigo',
    name: 'Biotech Indigo',
    bgBase: '#060818',
    bgSurface: '#0c102c',
    primary: '#6366f1',
    mutationSub: '#fbbf24',
    mutationIns: '#10b981',
    mutationDel: '#f43f5e',
    mutationMatch: '#818cf8'
  },
  {
    id: 'ultraviolet-lab',
    name: 'Ultraviolet Lab',
    bgBase: '#0b0714',
    bgSurface: '#140d24',
    primary: '#a855f7',
    mutationSub: '#f59e0b',
    mutationIns: '#10b981',
    mutationDel: '#f43f5e',
    mutationMatch: '#c084fc'
  },
  {
    id: 'sleek-monochrome',
    name: 'Precision Monochrome',
    bgBase: '#09090b',
    bgSurface: '#141417',
    primary: '#94a3b8',
    mutationSub: '#eab308',
    mutationIns: '#22c55e',
    mutationDel: '#ef4444',
    mutationMatch: '#cbd5e1'
  }
];

interface GenomeContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  referenceInput: string;
  setReferenceInput: (val: string) => void;
  sampleInput: string;
  setSampleInput: (val: string) => void;
  referenceHeader: string;
  setReferenceHeader: (val: string) => void;
  sampleHeader: string;
  setSampleHeader: (val: string) => void;
  isAnalyzing: boolean;
  currentAnalysis: AnalysisRecord | null;
  history: AnalysisRecord[];
  comparisonViewMode: ComparisonViewMode;
  setComparisonViewMode: (mode: ComparisonViewMode) => void;
  zoomLevel: ZoomLevel;
  setZoomLevel: (zoom: ZoomLevel) => void;
  selectedMutation: MutationItem | null;
  setSelectedMutation: (mut: MutationItem | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentTheme: CustomThemePalette;
  setThemeById: (id: string) => void;
  updateThemeColors: (updates: Partial<CustomThemePalette>) => void;
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  toggleThemeMode: () => void;
  isSupabaseConnected: boolean;
  supabaseConfig: { url: string; anonKey: string };
  updateSupabaseCredentials: (url: string, anonKey: string) => Promise<boolean>;
  syncWithSupabase: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  runAnalysis: (overrideRef?: string, overrideSample?: string, customTitle?: string) => Promise<boolean>;
  loadDemo: (demoId: string) => void;
  clearInputs: () => void;
  reopenAnalysis: (id: string) => void;
  deleteAnalysis: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  openReportModalId: string | null;
  setOpenReportModalId: (id: string | null) => void;
  helpModalOpen: boolean;
  setHelpModalOpen: (open: boolean) => void;
}

const GenomeContext = createContext<GenomeContextType | undefined>(undefined);

export const GenomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [openReportModalId, setOpenReportModalId] = useState<string | null>(null);

  // Sequences
  const [referenceInput, setReferenceInput] = useState<string>(DEMO_DATASETS[0].referenceSeq);
  const [sampleInput, setSampleInput] = useState<string>(DEMO_DATASETS[0].sampleSeq);
  const [referenceHeader, setReferenceHeader] = useState<string>(DEMO_DATASETS[0].referenceHeader);
  const [sampleHeader, setSampleHeader] = useState<string>(DEMO_DATASETS[0].sampleHeader);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  // View state
  const [comparisonViewMode, setComparisonViewMode] = useState<ComparisonViewMode>('aligned');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('normal');
  const [selectedMutation, setSelectedMutation] = useState<MutationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Theme & Dynamic Ambiance
  const [currentTheme, setCurrentTheme] = useState<CustomThemePalette>(PRESET_THEMES[0]);
  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('genome_trace_theme_mode');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supabase Database state
  const [supabaseConfigState, setSupabaseConfigState] = useState(() => getSupabaseConfig());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(() => isSupabaseConfigured());

  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const res = await fetchAnalysesFromSupabase();
      if (res.success && res.data && res.data.length > 0) {
        setHistory((prev) => {
          const merged = [...res.data!, ...prev.filter((p) => !res.data!.some((d) => d.id === p.id))];
          return merged;
        });
        setIsSupabaseConnected(true);
        addToast('success', 'Supabase Synced', `Loaded ${res.data.length} records from database.`);
      } else if (res.error) {
        console.warn('Supabase fetch error:', res.error);
      }
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  };

  const updateSupabaseCredentials = async (url: string, anonKey: string): Promise<boolean> => {
    setSupabaseConfig(url, anonKey);
    setSupabaseConfigState({ url, anonKey });
    const configured = Boolean(url.trim() && anonKey.trim());
    setIsSupabaseConnected(configured);

    if (configured) {
      const res = await fetchAnalysesFromSupabase();
      if (res.success) {
        if (res.data && res.data.length > 0) {
          setHistory(res.data);
        }
        addToast('success', 'Supabase Connected', 'Database connection established successfully.');
        return true;
      } else {
        addToast('warning', 'Supabase Configured', `Connected, note: ${res.error || 'Ensure table exists'}`);
        return false;
      }
    } else {
      addToast('info', 'Database Mode', 'Switched to local session storage.');
      return true;
    }
  };

  // Apply themeMode to document root element
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme-mode', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme-mode', 'dark');
    }
  }, [themeMode]);

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('genome_trace_theme_mode', mode);
    } catch {
      // ignore
    }
  };

  const toggleThemeMode = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    addToast(
      'info',
      'Display Mode Switched',
      next === 'light'
        ? 'Switched to Light Mode (Clinical White Laboratory).'
        : 'Switched to Dark Mode (Deep Bioinformatic Slate).'
    );
  };

  // Initialize initial analysis and sample history
  useEffect(() => {
    // Generate initial default analysis for HBB Sickle Cell
    const initialHbb = DEMO_DATASETS[0];
    const refStats = calculateSequenceStats(initialHbb.referenceSeq);
    const sampleStats = calculateSequenceStats(initialHbb.sampleSeq);
    const result = alignSequences(initialHbb.referenceSeq, initialHbb.sampleSeq);

    const initialRecord: AnalysisRecord = {
      id: 'GT-2026-9041',
      title: 'Human Beta-Globin (HBB) — Sickle Cell HbS Variant',
      referenceName: 'Homo_sapiens_HBB_Wildtype',
      sampleName: 'Homo_sapiens_HBB_HbS_Allele',
      referenceSeq: initialHbb.referenceSeq,
      sampleSeq: initialHbb.sampleSeq,
      timestamp: '2026-11-14 18:30 UTC',
      status: 'Completed',
      mutationsCount: result.mutations.length,
      result,
      refStats,
      sampleStats,
      tags: ['Hematology', 'Exon 1', 'Clinical Reference']
    };

    // Pre-calculate another demo for history richness
    const brca1Demo = DEMO_DATASETS[1];
    const brca1Result = alignSequences(brca1Demo.referenceSeq, brca1Demo.sampleSeq);
    const brca1Record: AnalysisRecord = {
      id: 'GT-2026-8812',
      title: 'BRCA1 Breast Cancer Susceptibility — Exon 11',
      referenceName: 'BRCA1_Chr17_Exon11_Ref',
      sampleName: 'BRCA1_Patient_Sample_185del',
      referenceSeq: brca1Demo.referenceSeq,
      sampleSeq: brca1Demo.sampleSeq,
      timestamp: '2026-11-13 14:15 UTC',
      status: 'Completed',
      mutationsCount: brca1Result.mutations.length,
      result: brca1Result,
      refStats: calculateSequenceStats(brca1Demo.referenceSeq),
      sampleStats: calculateSequenceStats(brca1Demo.sampleSeq),
      tags: ['Oncogenomics', 'Frameshift', 'Screening']
    };

    const sarsDemo = DEMO_DATASETS[2];
    const sarsResult = alignSequences(sarsDemo.referenceSeq, sarsDemo.sampleSeq);
    const sarsRecord: AnalysisRecord = {
      id: 'GT-2026-7904',
      title: 'SARS-CoV-2 Spike RBD — Lineage Surveillance',
      referenceName: 'Wuhan_Hu_1_Spike_RBD',
      sampleName: 'Omicron_Sublineage_RBD',
      referenceSeq: sarsDemo.referenceSeq,
      sampleSeq: sarsDemo.sampleSeq,
      timestamp: '2026-11-11 09:40 UTC',
      status: 'Completed',
      mutationsCount: sarsResult.mutations.length,
      result: sarsResult,
      refStats: calculateSequenceStats(sarsDemo.referenceSeq),
      sampleStats: calculateSequenceStats(sarsDemo.sampleSeq),
      tags: ['Virology', 'Spike Protein', 'Surveillance']
    };

    const crisprDemo = DEMO_DATASETS[3];
    const crisprResult = alignSequences(crisprDemo.referenceSeq, crisprDemo.sampleSeq);
    const crisprRecord: AnalysisRecord = {
      id: 'GT-2026-6520',
      title: 'CRISPR-Cas9 On-Target Edit — Micro-Indel Profile',
      referenceName: 'Target_Locus_PreEdit',
      sampleName: 'Clonal_Isolate_NHEJ',
      referenceSeq: crisprDemo.referenceSeq,
      sampleSeq: crisprDemo.sampleSeq,
      timestamp: '2026-11-09 16:22 UTC',
      status: 'Completed',
      mutationsCount: crisprResult.mutations.length,
      result: crisprResult,
      refStats: calculateSequenceStats(crisprDemo.referenceSeq),
      sampleStats: calculateSequenceStats(crisprDemo.sampleSeq),
      tags: ['Genome Editing', 'NHEJ', 'CRISPR']
    };

    setCurrentAnalysis(initialRecord);
    setHistory([initialRecord, brca1Record, sarsRecord, crisprRecord]);
    if (initialRecord.result.mutations.length > 0) {
      setSelectedMutation(initialRecord.result.mutations[0]);
    }

    // If Supabase is configured, fetch persisted cloud analyses
    if (isSupabaseConfigured()) {
      fetchAnalysesFromSupabase().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setHistory((prev) => {
            const merged = [...res.data!, ...prev.filter((p) => !res.data!.some((d) => d.id === p.id))];
            return merged;
          });
          setIsSupabaseConnected(true);
        }
      });
    }
  }, []);

  // Update dynamic CSS variables whenever currentTheme, themeMode or currentAnalysis mutational profile changes
  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === 'light') {
      root.style.setProperty('--color-bg-base', '#f0f4f9');
      root.style.setProperty('--color-bg-surface', '#ffffff');
      root.style.setProperty('--color-bg-surface-elevated', '#f8fafc');
      root.style.setProperty('--color-bg-surface-hover', '#e8eef5');
      root.style.setProperty('--color-border', '#e2e8f0');
      root.style.setProperty('--color-primary', currentTheme.primary || '#0284c7');
      root.style.setProperty('--color-mutation-sub', currentTheme.mutationSub || '#f59e0b');
      root.style.setProperty('--color-mutation-ins', currentTheme.mutationIns || '#10b981');
      root.style.setProperty('--color-mutation-del', currentTheme.mutationDel || '#f43f5e');
      root.style.setProperty('--color-mutation-match', currentTheme.mutationMatch || '#0284c7');

      // Vibrant and colorful light ambiance
      root.style.setProperty('--dynamic-ambient-glow-1', 'rgba(14, 165, 233, 0.16)');
      root.style.setProperty('--dynamic-ambient-glow-2', 'rgba(245, 158, 11, 0.14)');
      root.style.setProperty('--dynamic-ambient-glow-3', 'rgba(244, 63, 94, 0.14)');
    } else {
      root.style.setProperty('--color-bg-base', currentTheme.bgBase);
      root.style.setProperty('--color-bg-surface', currentTheme.bgSurface);
      root.style.setProperty('--color-primary', currentTheme.primary);
      root.style.setProperty('--color-mutation-sub', currentTheme.mutationSub);
      root.style.setProperty('--color-mutation-ins', currentTheme.mutationIns);
      root.style.setProperty('--color-mutation-del', currentTheme.mutationDel);
      root.style.setProperty('--color-mutation-match', currentTheme.mutationMatch);

      // Dynamic Reactive Background Glow based on mutation composition
      if (currentAnalysis && currentAnalysis.result) {
        const { substitutions, insertions, deletions, matches, totalPositions } = currentAnalysis.result;
        const totalMutations = substitutions + insertions + deletions;

        if (totalMutations === 0) {
          root.style.setProperty('--dynamic-ambient-glow-1', 'rgba(14, 165, 233, 0.12)');
          root.style.setProperty('--dynamic-ambient-glow-2', 'rgba(6, 182, 212, 0.08)');
          root.style.setProperty('--dynamic-ambient-glow-3', 'rgba(16, 185, 129, 0.05)');
        } else {
          const subRatio = substitutions / totalMutations;
          const insRatio = insertions / totalMutations;
          const delRatio = deletions / totalMutations;

          const glow1 = `rgba(245, 158, 11, ${Math.max(0.04, Math.min(0.24, subRatio * 0.22))})`;
          const glow2 = `rgba(16, 185, 129, ${Math.max(0.04, Math.min(0.24, insRatio * 0.22))})`;
          const glow3 = `rgba(244, 63, 94, ${Math.max(0.04, Math.min(0.24, delRatio * 0.22))})`;

          root.style.setProperty('--dynamic-ambient-glow-1', glow1);
          root.style.setProperty('--dynamic-ambient-glow-2', glow2);
          root.style.setProperty('--dynamic-ambient-glow-3', glow3);
        }
      }
    }
  }, [currentTheme, themeMode, currentAnalysis]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setThemeById = (id: string) => {
    const found = PRESET_THEMES.find((t) => t.id === id);
    if (found) {
      setCurrentTheme(found);
      addToast('info', 'Theme Updated', `Active theme changed to ${found.name}.`);
    }
  };

  const updateThemeColors = (updates: Partial<CustomThemePalette>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      ...updates
    }));
    addToast('success', 'Custom Theme Saved', 'Dynamic theme variables applied.');
  };

  const clearInputs = () => {
    setReferenceInput('');
    setSampleInput('');
    setReferenceHeader('');
    setSampleHeader('');
    addToast('info', 'Inputs Cleared', 'Sequence editor fields have been reset.');
  };

  const loadDemo = (demoId: string) => {
    const found = DEMO_DATASETS.find((d) => d.id === demoId);
    if (!found) return;

    setReferenceInput(found.referenceSeq);
    setSampleInput(found.sampleSeq);
    setReferenceHeader(found.referenceHeader);
    setSampleHeader(found.sampleHeader);

    addToast('info', 'Demonstration Loaded', `Loaded dataset: ${found.name}`);
  };

  const runAnalysis = async (
    overrideRef?: string,
    overrideSample?: string,
    customTitle?: string
  ): Promise<boolean> => {
    const refToUse = overrideRef !== undefined ? overrideRef : referenceInput;
    const sampleToUse = overrideSample !== undefined ? overrideSample : sampleInput;

    const parsedRef = parseFasta(refToUse);
    const parsedSample = parseFasta(sampleToUse);

    if (!parsedRef.sequence || !parsedSample.sequence) {
      addToast('error', 'Incomplete Sequence', 'Both Reference and Sample sequences are required to perform analysis.');
      return false;
    }

    setIsAnalyzing(true);

    // Simulate realistic computation time with smooth scientific loading micro-interaction
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const refStats = calculateSequenceStats(refToUse);
          const sampleStats = calculateSequenceStats(sampleToUse);
          const result = alignSequences(
            refToUse,
            sampleToUse,
            parsedRef.header || 'Reference_Sequence',
            parsedSample.header || 'Sample_Sequence'
          );

          const analysisId = `GT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const title =
            customTitle ||
            (parsedRef.header && parsedRef.header !== 'Sequence_Segment_01'
              ? parsedRef.header.replace(/_/g, ' ')
              : `Comparative Analysis ${analysisId}`);

          const newRecord: AnalysisRecord = {
            id: analysisId,
            title,
            referenceName: parsedRef.header || 'Reference_Locus',
            sampleName: parsedSample.header || 'Sample_Isolate',
            referenceSeq: parsedRef.sequence,
            sampleSeq: parsedSample.sequence,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            status: 'Completed',
            mutationsCount: result.mutations.length,
            result,
            refStats,
            sampleStats,
            tags: ['Genomic Comparison', `${result.mutations.length} Variants Detected`]
          };

          setCurrentAnalysis(newRecord);
          setHistory((prev) => [newRecord, ...prev.filter((item) => item.id !== newRecord.id)]);
          if (result.mutations.length > 0) {
            setSelectedMutation(result.mutations[0]);
          } else {
            setSelectedMutation(null);
          }

          // Asynchronously sync to Supabase database if connected
          if (isSupabaseConfigured()) {
            saveAnalysisToSupabase(newRecord).then((dbRes) => {
              if (dbRes.success) {
                addToast('success', 'Database Synced', `Analysis ${newRecord.id} saved to Supabase.`);
              } else {
                console.warn('Supabase auto-save note:', dbRes.error);
              }
            });
          }

          setIsAnalyzing(false);
          addToast(
            'success',
            'Analysis Complete',
            `Alignment finished. Found ${result.mutations.length} variations (${result.identityPercentage}% identity).`
          );
          resolve(true);
        } catch (err) {
          setIsAnalyzing(false);
          addToast('error', 'Analysis Error', 'An error occurred during sequence alignment.');
          console.error(err);
          resolve(false);
        }
      }, 750);
    });
  };

  const reopenAnalysis = (id: string) => {
    const record = history.find((h) => h.id === id);
    if (record) {
      setCurrentAnalysis(record);
      setReferenceInput(record.referenceSeq);
      setSampleInput(record.sampleSeq);
      setReferenceHeader(`>${record.referenceName}`);
      setSampleHeader(`>${record.sampleName}`);
      if (record.result.mutations.length > 0) {
        setSelectedMutation(record.result.mutations[0]);
      }
      setActiveTab('comparison');
      addToast('info', 'Analysis Loaded', `Loaded results for ${record.title}`);
    }
  };

  const deleteAnalysis = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (isSupabaseConfigured()) {
      deleteAnalysisFromSupabase(id);
    }
    addToast('warning', 'Analysis Removed', `Record ${id} removed from session history.`);
  };

  return (
    <GenomeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        referenceInput,
        setReferenceInput,
        sampleInput,
        setSampleInput,
        referenceHeader,
        setReferenceHeader,
        sampleHeader,
        setSampleHeader,
        isAnalyzing,
        currentAnalysis,
        history,
        comparisonViewMode,
        setComparisonViewMode,
        zoomLevel,
        setZoomLevel,
        selectedMutation,
        setSelectedMutation,
        searchQuery,
        setSearchQuery,
        currentTheme,
        setThemeById,
        updateThemeColors,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        isSupabaseConnected,
        supabaseConfig: supabaseConfigState,
        updateSupabaseCredentials,
        syncWithSupabase,
        toasts,
        addToast,
        removeToast,
        runAnalysis,
        loadDemo,
        clearInputs,
        reopenAnalysis,
        deleteAnalysis,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        openReportModalId,
        setOpenReportModalId,
        helpModalOpen,
        setHelpModalOpen
      }}
    >
      {children}
    </GenomeContext.Provider>
  );
};

export function useGenome(): GenomeContextType {
  const context = useContext(GenomeContext);
  if (!context) {
    throw new Error('useGenome must be used within a GenomeProvider');
  }
  return context;
}

