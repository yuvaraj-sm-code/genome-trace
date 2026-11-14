import React, { useState, useRef, useEffect } from 'react';
import {
  GitCompare,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Flame,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Sliders,
  Download,
  Copy
} from 'lucide-react';
import { useGenome, ComparisonViewMode, ZoomLevel } from '../context/GenomeContext';

export const SequenceComparisonPage: React.FC = () => {
  const {
    currentAnalysis,
    comparisonViewMode,
    setComparisonViewMode,
    zoomLevel,
    setZoomLevel,
    setSelectedMutation,
    setActiveTab,
    addToast
  } = useGenome();

  const [activeWindowStart, setActiveWindowStart] = useState<number>(0);
  const [filterType, setFilterType] = useState<'all' | 'substitution' | 'insertion' | 'deletion'>('all');
  const sequenceContainerRef = useRef<HTMLDivElement>(null);

  if (!currentAnalysis) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80">
        <GitCompare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Sequence Analysis Active</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Please run an alignment or load a benchmark genome in the DNA Analyzer to view sequence comparisons.
        </p>
        <button
          onClick={() => setActiveTab('analyzer')}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
        >
          Go to DNA Analyzer
        </button>
      </div>
    );
  }

  const {
    alignedRef,
    alignedSample,
    totalPositions,
    matches,
    substitutions,
    insertions,
    deletions,
    identityPercentage,
    mutations
  } = currentAnalysis.result;

  const totalDifferences = substitutions + insertions + deletions;

  // Window slicing for long sequences (e.g. 50bp chunks per block or horizontal scroll)
  const windowSize = zoomLevel === 'compact' ? 80 : zoomLevel === 'normal' ? 50 : 30;

  // Mutation map by alignment position (1-based index)
  const mutationMap = new Map<number, (typeof mutations)[0]>();
  mutations.forEach((m) => mutationMap.set(m.position, m));

  // Determine nucleotide base styles
  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
      case 'T': return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
      case 'G': return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
      case 'C': return 'text-sky-400 bg-sky-950/40 border-sky-800/60';
      case '-': return 'text-slate-500 bg-slate-900 border-slate-800';
      default: return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  // Difference-only filter indices
  const displayIndices: number[] = [];
  for (let idx = 0; idx < totalPositions; idx++) {
    const pos = idx + 1;
    const mut = mutationMap.get(pos);
    if (comparisonViewMode === 'diff-only') {
      if (mut) {
        if (filterType === 'all' || mut.type === filterType) {
          // Include context around difference (±2 bases)
          for (let c = Math.max(0, idx - 2); c <= Math.min(totalPositions - 1, idx + 2); c++) {
            if (!displayIndices.includes(c)) displayIndices.push(c);
          }
        }
      }
    } else {
      displayIndices.push(idx);
    }
  }

  // Chunks of length 50 for organized visual blocks
  const blockSize = 50;
  const numBlocks = Math.ceil(totalPositions / blockSize);

  const handleMutationSelect = (pos: number) => {
    const m = mutationMap.get(pos);
    if (m) {
      setSelectedMutation(m);
      setActiveTab('mutations');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Sequence Comparison
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Alignment Matrix
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Displaying <span className="text-cyan-300 font-mono font-medium">{currentAnalysis.referenceName}</span> vs{' '}
            <span className="text-teal-300 font-mono font-medium">{currentAnalysis.sampleName}</span>
          </p>
        </div>

        {/* View Mode & Zoom Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['aligned', 'side-by-side', 'diff-only'] as ComparisonViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setComparisonViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  comparisonViewMode === mode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'aligned'
                  ? 'Aligned View'
                  : mode === 'side-by-side'
                  ? 'Side-by-Side'
                  : 'Differences Only'}
              </button>
            ))}
          </div>

          {/* Zoom Control */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['compact', 'normal', 'detailed'] as ZoomLevel[]).map((z) => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`px-2.5 py-1.5 rounded-lg font-medium capitalize transition-all ${
                  zoomLevel === z
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUMMARY PANEL (Total Aligned, Matches, Differences, Sequence Identity %, Total Mutations) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Aligned
          </span>
          <span className="text-xl sm:text-2xl font-heading font-bold text-white font-mono">
            {totalPositions} bp
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">paired coordinates</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-center">
          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Matching Bases
          </span>
          <span className="text-xl sm:text-2xl font-heading font-bold text-cyan-300 font-mono">
            {matches}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">homologous nucleotides</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-center">
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Different Bases
          </span>
          <span className="text-xl sm:text-2xl font-heading font-bold text-amber-300 font-mono">
            {totalDifferences}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">divergent positions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-center">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Sequence Identity
          </span>
          <span className="text-xl sm:text-2xl font-heading font-bold text-emerald-300 font-mono">
            {identityPercentage}%
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Needleman-Wunsch</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
            Total Mutations
          </span>
          <span className="text-xl sm:text-2xl font-heading font-bold text-rose-300 font-mono">
            {mutations.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {substitutions}S · {insertions}I · {deletions}D
          </span>
        </div>
      </div>

      {/* MUTATION LEGEND */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-medium">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/60" />
            <span className="text-slate-300 font-medium">Substitution ({substitutions})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/60" />
            <span className="text-slate-300 font-medium">Insertion ({insertions})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/60" />
            <span className="text-slate-300 font-medium">Deletion ({deletions})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500/10 border border-cyan-500/30" />
            <span className="text-slate-400">Match ({matches})</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Click any mutation badge to inspect in Mutation Explorer
        </div>
      </div>

      {/* STRUCTURED ALIGNMENT VIEW (Reference Row, Connector/Match Row, Sample Row, Position Track) */}
      <div
        ref={sequenceContainerRef}
        className="rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl overflow-hidden"
      >
        <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {comparisonViewMode === 'aligned'
                ? 'Structured Pairwise Alignment'
                : comparisonViewMode === 'side-by-side'
                ? 'Dual Coordinate Side-by-Side Track'
                : 'Difference Cluster View'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            1 → {totalPositions} bp
          </span>
        </div>

        {/* Sequence Blocks (Chunks of 50bp for optimal readability) */}
        <div className="p-5 space-y-8 overflow-x-auto">
          {Array.from({ length: numBlocks }).map((_, blockIdx) => {
            const start = blockIdx * blockSize;
            const end = Math.min(totalPositions, start + blockSize);
            const chunkPositions: number[] = [];
            for (let i = start; i < end; i++) chunkPositions.push(i);

            return (
              <div
                key={blockIdx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2 hover:border-slate-700/80 transition-colors"
              >
                {/* Block Coordinate Header */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-1 border-b border-slate-800/40">
                  <span className="text-cyan-400 font-medium">Position {start + 1}</span>
                  <span>Position {end}</span>
                </div>

                {/* Nucleotide Position Rulers (Every 10bp ticks) */}
                <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500 pl-16">
                  {chunkPositions.map((idx) => {
                    const pos = idx + 1;
                    const isDecade = pos % 10 === 0 || pos === 1;
                    return (
                      <div
                        key={idx}
                        className={`w-6 text-center select-none ${
                          isDecade ? 'text-slate-400 font-bold' : 'text-transparent'
                        }`}
                      >
                        {isDecade ? pos : '·'}
                      </div>
                    );
                  })}
                </div>

                {/* ROW 1: REFERENCE SEQUENCE */}
                <div className="flex items-center gap-1">
                  <span className="w-16 text-[10px] font-mono font-semibold text-cyan-400 uppercase shrink-0">
                    REF 5'→
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                    {chunkPositions.map((idx) => {
                      const pos = idx + 1;
                      const base = alignedRef[idx];
                      const sBase = alignedSample[idx];
                      const mut = mutationMap.get(pos);

                      let cellBg = 'bg-slate-900 border-slate-800 text-slate-300';
                      if (mut?.type === 'substitution') cellBg = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
                      else if (mut?.type === 'deletion') cellBg = 'bg-rose-500/20 border-rose-500/50 text-rose-300';
                      else if (base !== '-') cellBg = 'bg-slate-900/90 border-slate-800 text-slate-200';

                      return (
                        <div
                          key={`ref-${idx}`}
                          onClick={() => mut && handleMutationSelect(pos)}
                          title={`Ref Pos: ${pos} Base: ${base} ${mut ? `(${mut.classification})` : ''}`}
                          className={`w-6 h-7 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            mut ? 'cursor-pointer hover:scale-110 shadow-sm' : ''
                          } ${cellBg}`}
                        >
                          {base}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ROW 2: HOMOLOGY / CONNECTOR LINE */}
                <div className="flex items-center gap-1">
                  <span className="w-16 text-[9px] font-mono text-slate-600 uppercase shrink-0">
                    MATCH
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {chunkPositions.map((idx) => {
                      const pos = idx + 1;
                      const rBase = alignedRef[idx];
                      const sBase = alignedSample[idx];
                      const mut = mutationMap.get(pos);

                      let symbol = '|';
                      let color = 'text-cyan-500/50';

                      if (mut?.type === 'substitution') {
                        symbol = '•';
                        color = 'text-amber-400 font-bold';
                      } else if (mut?.type === 'insertion') {
                        symbol = '+';
                        color = 'text-emerald-400 font-bold';
                      } else if (mut?.type === 'deletion') {
                        symbol = '×';
                        color = 'text-rose-400 font-bold';
                      }

                      return (
                        <div
                          key={`con-${idx}`}
                          className={`w-6 h-3 flex items-center justify-center font-mono text-[10px] select-none ${color}`}
                        >
                          {symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ROW 3: SAMPLE SEQUENCE */}
                <div className="flex items-center gap-1">
                  <span className="w-16 text-[10px] font-mono font-semibold text-teal-400 uppercase shrink-0">
                    SMP 5'→
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                    {chunkPositions.map((idx) => {
                      const pos = idx + 1;
                      const rBase = alignedRef[idx];
                      const sBase = alignedSample[idx];
                      const mut = mutationMap.get(pos);

                      let cellBg = 'bg-slate-900 border-slate-800 text-slate-300';
                      if (mut?.type === 'substitution') cellBg = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
                      else if (mut?.type === 'insertion') cellBg = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
                      else if (sBase !== '-') cellBg = 'bg-slate-900/90 border-slate-800 text-slate-200';

                      return (
                        <div
                          key={`smp-${idx}`}
                          onClick={() => mut && handleMutationSelect(pos)}
                          title={`Sample Pos: ${pos} Base: ${sBase} ${mut ? `(${mut.classification})` : ''}`}
                          className={`w-6 h-7 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            mut ? 'cursor-pointer hover:scale-110 shadow-sm' : ''
                          } ${cellBg}`}
                        >
                          {sBase}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

