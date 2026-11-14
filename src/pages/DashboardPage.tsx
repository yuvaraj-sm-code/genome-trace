import React, { useState } from 'react';
import {
  Activity,
  Dna,
  Flame,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';

export const DashboardPage: React.FC = () => {
  const {
    setActiveTab,
    history,
    currentAnalysis,
    reopenAnalysis,
    setOpenReportModalId,
    loadDemo,
    searchQuery
  } = useGenome();

  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);
  const [activityTimeframe, setActivityTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  // Mutation metrics summary calculation across history
  const totalAnalyses = 1482 + history.length;
  const totalSequencesProcessed = 3840 + history.length * 2;
  const totalMutationsDetected = 24918 + (currentAnalysis?.result?.mutations.length || 0);
  const averageGcContent = 51.8;

  // Mutation distribution breakdown from active analysis or default aggregate
  const activeSubs = currentAnalysis?.result?.substitutions ?? 14;
  const activeIns = currentAnalysis?.result?.insertions ?? 6;
  const activeDels = currentAnalysis?.result?.deletions ?? 4;
  const totalActiveMutations = activeSubs + activeIns + activeDels || 1;

  const subPercent = Math.round((activeSubs / totalActiveMutations) * 100);
  const insPercent = Math.round((activeIns / totalActiveMutations) * 100);
  const delPercent = 100 - subPercent - insPercent;

  // Donut chart stroke dash calculations (Circumference = 2 * PI * 40 = 251.2)
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const subDash = (subPercent / 100) * circ;
  const insDash = (insPercent / 100) * circ;
  const delDash = (delPercent / 100) * circ;

  const subOffset = 0;
  const insOffset = -subDash;
  const delOffset = -(subDash + insDash);

  // Activity timeline sample points for SVG line chart
  const activityData = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 68 },
    { day: 'Wed', count: 54 },
    { day: 'Thu', count: 91 },
    { day: 'Fri', count: 124 },
    { day: 'Sat', count: 85 },
    { day: 'Sun', count: 110 }
  ];

  const maxActivity = Math.max(...activityData.map((d) => d.count));
  const chartHeight = 120;
  const chartWidth = 380;
  const points = activityData
    .map((d, index) => {
      const x = (index / (activityData.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - (d.count / maxActivity) * (chartHeight - 30) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const recentProjects = [
    {
      id: 'proj-1',
      title: 'HBB Hemoglobin Subunit Beta',
      organism: 'Homo sapiens (GRCh38.p14)',
      mutations: '1 Transversion (E6V)',
      identity: '99.7%',
      date: 'Today, 18:30 UTC',
      status: 'Verified',
      tag: 'Hematology',
      demoId: 'hbb-sickle-cell'
    },
    {
      id: 'proj-2',
      title: 'BRCA1 Susceptibility Exon 11',
      organism: 'Homo sapiens (Chr17)',
      mutations: '2 InDels + 1 Sub',
      identity: '97.9%',
      date: 'Nov 13, 2026',
      status: 'Reviewed',
      tag: 'Oncogenomics',
      demoId: 'brca1-exon11'
    },
    {
      id: 'proj-3',
      title: 'SARS-CoV-2 Spike RBD Phylogeny',
      organism: 'SARS-CoV-2 Lineage BA.2.86',
      mutations: '4 Substitutions',
      identity: '98.5%',
      date: 'Nov 11, 2026',
      status: 'Published',
      tag: 'Virology',
      demoId: 'sars-cov-2-rbd'
    },
    {
      id: 'proj-4',
      title: 'CRISPR Cas9 Target Locus NHEJ',
      organism: 'Human Embryonic Kidney (HEK293)',
      mutations: '2-bp Insertion',
      identity: '97.6%',
      date: 'Nov 09, 2026',
      status: 'Clonal',
      tag: 'Gene Editing',
      demoId: 'crispr-cas9-edit'
    }
  ];

  // Filter history based on global search query if present
  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.referenceName.toLowerCase().includes(q) ||
      item.sampleName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Genome Overview
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-800/60">
              Live Feed
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Monitor your DNA sequence analysis, comparative metrics and genetic variation insights.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('analyzer')}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-500 hover:from-cyan-500 hover:via-sky-500 hover:to-teal-400 text-white font-medium text-sm shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/40 transition-all duration-200 active:scale-95"
        >
          <Dna className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* STATISTICS CARDS (4 Metric Cards with icons, trends, values) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md hover:border-cyan-500/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Analyses
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {totalAnalyses.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md hover:border-cyan-500/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sequences Processed
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Dna className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {totalSequencesProcessed.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8.7%
            </span>
            <span className="text-slate-400">nucleotide strands</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md hover:border-amber-500/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mutations Detected
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {totalMutationsDetected.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center text-amber-400 font-semibold gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +15.3%
            </span>
            <span className="text-slate-400">identified variations</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md hover:border-sky-500/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average GC Content
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {averageGcContent}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center text-slate-400 font-semibold gap-0.5">
              <TrendingDown className="w-3.5 h-3.5 text-slate-400" /> -0.2%
            </span>
            <span className="text-slate-400">optimal melting zone</span>
          </div>
        </div>
      </div>

      {/* CHARTS ROW: Mutation Distribution (Donut) & Analysis Activity (Line Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mutation Distribution Donut Chart */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  Mutation Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proportion of substitutions, insertions, and deletions.
                </p>
              </div>
              <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 font-mono">
                {currentAnalysis?.id || 'Active Sample'}
              </span>
            </div>

            {/* SVG Donut */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="11"
                  fill="transparent"
                />

                {/* Substitution Segment (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="var(--color-mutation-sub)"
                  strokeWidth="11"
                  fill="transparent"
                  strokeDasharray={`${subDash} ${circ - subDash}`}
                  strokeDashoffset={subOffset}
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredDonutSegment('Substitution')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />

                {/* Insertion Segment (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="var(--color-mutation-ins)"
                  strokeWidth="11"
                  fill="transparent"
                  strokeDasharray={`${insDash} ${circ - insDash}`}
                  strokeDashoffset={insOffset}
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredDonutSegment('Insertion')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />

                {/* Deletion Segment (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="var(--color-mutation-del)"
                  strokeWidth="11"
                  fill="transparent"
                  strokeDasharray={`${delDash} ${circ - delDash}`}
                  strokeDashoffset={delOffset}
                  className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredDonutSegment('Deletion')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-heading font-bold text-white">
                  {hoveredDonutSegment ? (
                    hoveredDonutSegment === 'Substitution' ? `${subPercent}%` :
                    hoveredDonutSegment === 'Insertion' ? `${insPercent}%` : `${delPercent}%`
                  ) : (
                    totalActiveMutations
                  )}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  {hoveredDonutSegment || 'Total Variations'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Legend with Badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center">
            <div
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                hoveredDonutSegment === 'Substitution' ? 'bg-amber-500/20' : 'bg-slate-950/60'
              } border border-amber-500/30`}
              onMouseEnter={() => setHoveredDonutSegment('Substitution')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] font-semibold text-slate-200">Sub</span>
              </div>
              <span className="text-xs font-bold text-amber-400">{subPercent}%</span>
              <span className="text-[10px] text-slate-400 block">({activeSubs})</span>
            </div>

            <div
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                hoveredDonutSegment === 'Insertion' ? 'bg-emerald-500/20' : 'bg-slate-950/60'
              } border border-emerald-500/30`}
              onMouseEnter={() => setHoveredDonutSegment('Insertion')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold text-slate-200">Ins</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">{insPercent}%</span>
              <span className="text-[10px] text-slate-400 block">({activeIns})</span>
            </div>

            <div
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                hoveredDonutSegment === 'Deletion' ? 'bg-rose-500/20' : 'bg-slate-950/60'
              } border border-rose-500/30`}
              onMouseEnter={() => setHoveredDonutSegment('Deletion')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-[11px] font-semibold text-slate-200">Del</span>
              </div>
              <span className="text-xs font-bold text-rose-400">{delPercent}%</span>
              <span className="text-[10px] text-slate-400 block">({activeDels})</span>
            </div>
          </div>
        </div>

        {/* Analysis Activity Line Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Analysis Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekly sequence comparison throughput and computational batch volume.
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              {(['30d', '90d', '1y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActivityTimeframe(t)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activityTimeframe === t
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="py-2">
            <svg
              className="w-full h-36 overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2="360" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="360" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="20" y1="105" x2="360" y2="105" stroke="#1e293b" />

              {/* Area fill */}
              <polygon
                points={`20,105 ${points} 360,105`}
                fill="url(#activityGradient)"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data points */}
              {activityData.map((d, index) => {
                const x = (index / (activityData.length - 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - (d.count / maxActivity) * (chartHeight - 30) - 10;
                return (
                  <g key={d.day} className="group cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-slate-950 stroke-cyan-400 stroke-2 hover:r-6 transition-all"
                    />
                    <text
                      x={x}
                      y={chartHeight - 2}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Metrics Bar below line chart */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Peak Day</span>
              <span className="font-semibold text-slate-200">Friday (124 runs)</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Mean Velocity</span>
              <span className="font-semibold text-slate-200">82.1 / day</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Alignment Latency</span>
              <span className="font-semibold text-emerald-400">&lt; 12ms (DP Matrix)</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & RECENT PROJECTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quick Actions (4 Buttons) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Dna className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    Start DNA Analysis
                  </div>
                  <div className="text-[11px] text-slate-400">Launch two-panel sequence validator</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                    Compare Sequences
                  </div>
                  <div className="text-[11px] text-slate-400">Inspect structured pairwise alignment</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    View Mutation Reports
                  </div>
                  <div className="text-[11px] text-slate-400">Generate PDF audit & CSV datasets</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </button>

            <button
              onClick={() => {
                loadDemo('hbb-sickle-cell');
                setActiveTab('analyzer');
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                    Upload FASTA File
                  </div>
                  <div className="text-[11px] text-slate-400">Load reference & test isolate genomes</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Recent Projects (Compact Cards) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Recent Projects
              </h3>
              <p className="text-xs text-slate-400">
                Recently analysed benchmark genomes and CRISPR experimental runs.
              </p>
            </div>
            <span className="text-[11px] text-cyan-400 font-medium">
              4 Active Studies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  loadDemo(p.demoId);
                  setActiveTab('comparison');
                }}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    {p.tag}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    {p.identity} ID
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 italic line-clamp-1">
                  {p.organism}
                </p>
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <span className="text-amber-400/90 font-medium">{p.mutations}</span>
                  <span className="flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                    Inspect <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ANALYSIS DATA TABLE */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Recent Analysis Records
            </h3>
            <p className="text-xs text-slate-400">
              Comparative records from the active session. Click "View Details" to load alignment.
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Showing {filteredHistory.length} recorded analyses
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Analysis ID</th>
                <th className="py-3 px-4">Reference Sequence</th>
                <th className="py-3 px-4">Sample Sequence</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Mutations Found</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400 whitespace-nowrap">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 max-w-[140px] truncate" title={item.referenceName}>
                    {item.referenceName}
                  </td>
                  <td className="py-3 px-4 max-w-[140px] truncate" title={item.sampleName}>
                    {item.sampleName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {item.refStats.length} bp
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {item.result.mutations.length} Variants
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => reopenAnalysis(item.id)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600/30 text-slate-200 hover:text-cyan-300 border border-slate-700/80 transition-all font-medium text-[11px]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
