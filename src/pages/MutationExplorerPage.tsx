import React, { useState, useMemo } from 'react';
import {
  Flame,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Dna,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';
import { MutationItem } from '../types/dna';

export const MutationExplorerPage: React.FC = () => {
  const {
    currentAnalysis,
    selectedMutation,
    setSelectedMutation,
    setActiveTab,
    searchQuery,
    setSearchQuery
  } = useGenome();

  const [typeFilter, setTypeFilter] = useState<'all' | 'substitution' | 'insertion' | 'deletion'>('all');
  const [sortField, setSortField] = useState<'position' | 'type' | 'id'>('position');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (!currentAnalysis) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80">
        <Flame className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Sequence Analysis Active</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Run an alignment in the DNA Analyzer to inspect detected genetic variations.
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

  const { mutations, substitutions, insertions, deletions } = currentAnalysis.result;
  const { alignedRef, alignedSample } = currentAnalysis.result;

  // Filter and sort mutations
  const filteredMutations = useMemo(() => {
    return mutations
      .filter((m) => {
        if (typeFilter !== 'all' && m.type !== typeFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            m.id.toLowerCase().includes(q) ||
            m.region.toLowerCase().includes(q) ||
            m.classification.toLowerCase().includes(q) ||
            m.position.toString().includes(q) ||
            m.refBase.toLowerCase().includes(q) ||
            m.sampleBase.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'position') comp = a.position - b.position;
        else if (sortField === 'type') comp = a.type.localeCompare(b.type);
        else if (sortField === 'id') comp = a.id.localeCompare(b.id);
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [mutations, typeFilter, searchQuery, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredMutations.length / itemsPerPage) || 1;
  const paginatedMutations = filteredMutations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeMutation = selectedMutation || (mutations.length > 0 ? mutations[0] : null);

  // Extract nearby 10bp sequence context window
  const getContextWindow = (pos: number) => {
    const idx = pos - 1;
    const start = Math.max(0, idx - 6);
    const end = Math.min(alignedRef.length, idx + 7);
    const refSub = alignedRef.substring(start, end);
    const sampleSub = alignedSample.substring(start, end);
    const relativePos = idx - start;
    return { refSub, sampleSub, relativePos, startPos: start + 1 };
  };

  const context = activeMutation ? getContextWindow(activeMutation.position) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Mutation Explorer
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
              Variant Registry
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explore detected sequence variations, transitions, transversions and their exact genomic coordinates.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Analysis ID: <span className="text-cyan-400 font-semibold">{currentAnalysis.id}</span>
        </div>
      </div>

      {/* TOP STATISTICS (Total Mutations, Substitutions, Insertions, Deletions) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total Mutations
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-white font-mono">
            {mutations.length}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            in {currentAnalysis.result.totalPositions} aligned positions
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Substitutions
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-300 font-mono">
            {substitutions}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Single Nucleotide Variants (SNVs)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Insertions
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-300 font-mono">
            {insertions}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Extra base pairs added
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Deletions
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-rose-300 font-mono">
            {deletions}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Reference nucleotides omitted
          </span>
        </div>
      </div>

      {/* MAIN CONTENT: MUTATION TABLE & DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MUTATION TABLE (7 Cols: Left) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md overflow-hidden">
          {/* Table Filters & Search Bar */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ID, position or base..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto text-[11px]">
              {(['all', 'substitution', 'insertion', 'deletion'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTypeFilter(t);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    typeFilter === t
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th
                    onClick={() => {
                      setSortField('id');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="py-3 px-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Mutation ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      setSortField('position');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="py-3 px-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Position</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-600" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-center">Ref</th>
                  <th className="py-3 px-3 text-center">Sample</th>
                  <th className="py-3 px-3">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {paginatedMutations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No matching variations found for the active filter.
                    </td>
                  </tr>
                ) : (
                  paginatedMutations.map((m) => {
                    const isSelected = activeMutation?.id === m.id;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMutation(m)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 text-cyan-200'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-medium text-cyan-400 whitespace-nowrap">
                          {m.id}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-200 font-bold whitespace-nowrap">
                          bp {m.position}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              m.type === 'substitution'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : m.type === 'insertion'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            {m.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-300">
                          {m.refBase}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-300">
                          {m.sampleBase}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 truncate max-w-[120px]">
                          {m.region}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {filteredMutations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredMutations.length)} of {filteredMutations.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono px-2 text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* MUTATION DETAILS PANEL (5 Cols: Right) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Mutation Detail Inspector
              </h3>
            </div>
            {activeMutation && (
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {activeMutation.id}
              </span>
            )}
          </div>

          {activeMutation ? (
            <div className="space-y-4 text-xs">
              {/* Primary Coordinates & Classification */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    Position
                  </span>
                  <span className="text-base font-bold font-mono text-white">
                    bp {activeMutation.position}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    Mutation Type
                  </span>
                  <span className="text-base font-bold capitalize text-amber-400">
                    {activeMutation.type}
                  </span>
                </div>
              </div>

              {/* VISUAL REPRESENTATION OF THE CHANGE */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
                  Nucleotide Transition State
                </span>
                <div className="flex items-center justify-center gap-4">
                  {/* Reference Base Box */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-1">Original (Ref)</span>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-mono font-bold text-lg text-slate-200 shadow-md">
                      {activeMutation.refBase}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-amber-400/80 mt-1">mutate</span>
                  </div>

                  {/* Sample Base Box */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-cyan-400 mb-1">Variant (Sample)</span>
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border-2 border-cyan-500 flex items-center justify-center font-mono font-bold text-lg text-cyan-300 shadow-md shadow-cyan-500/20">
                      {activeMutation.sampleBase}
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification & Details */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold text-slate-200">
                    {activeMutation.classification}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Genomic Region:</span>
                  <span className="font-semibold text-slate-200">
                    {activeMutation.region}
                  </span>
                </div>
                {activeMutation.codonRef && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Codon Context:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {activeMutation.codonRef} ({activeMutation.aminoAcidRef})
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {activeMutation.details}
                </div>
              </div>

              {/* NEARBY FLANKING SEQUENCE CONTEXT */}
              {context && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium">Flanking Context Window (±6 bp)</span>
                    <span className="font-mono text-slate-500">
                      bp {context.startPos} → {context.startPos + context.refSub.length - 1}
                    </span>
                  </div>

                  {/* Ref Flank */}
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="w-10 text-[10px] text-slate-500">REF:</span>
                    <div className="flex items-center gap-0.5">
                      {context.refSub.split('').map((char, i) => {
                        const isFocal = i === context.relativePos;
                        return (
                          <span
                            key={i}
                            className={`w-5 h-6 rounded flex items-center justify-center font-bold ${
                              isFocal
                                ? 'bg-amber-500/30 border border-amber-500 text-amber-300'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sample Flank */}
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="w-10 text-[10px] text-slate-500">SMP:</span>
                    <div className="flex items-center gap-0.5">
                      {context.sampleSub.split('').map((char, i) => {
                        const isFocal = i === context.relativePos;
                        return (
                          <span
                            key={i}
                            className={`w-5 h-6 rounded flex items-center justify-center font-bold ${
                              isFocal
                                ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-300'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Scientific Notice */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>
                  Scientific bioinformatic characterization only. No clinical or disease interpretations provided.
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select a mutation from the table on the left to inspect its parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
