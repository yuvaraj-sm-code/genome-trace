import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Flame,
  Dna,
  ArrowRight,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';

export const AnalysisHistoryPage: React.FC = () => {
  const { history, reopenAnalysis, deleteAnalysis, setActiveTab, loadDemo, addToast } = useGenome();

  const [search, setSearch] = useState('');
  const [filterMutationRange, setFilterMutationRange] = useState<'all' | 'zero' | 'some' | 'many'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredHistory = history
    .filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.referenceName.toLowerCase().includes(q) ||
          item.sampleName.toLowerCase().includes(q);
        if (!match) return false;
      }

      const mutCount = item.result.mutations.length;
      if (filterMutationRange === 'zero' && mutCount !== 0) return false;
      if (filterMutationRange === 'some' && (mutCount < 1 || mutCount > 5)) return false;
      if (filterMutationRange === 'many' && mutCount <= 5) return false;

      return true;
    })
    .sort((a, b) => {
      return sortOrder === 'newest'
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Analysis History
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Audit Timeline
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Chronological ledger of previously uploaded and computed sequence alignments.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('analyzer')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all self-start sm:self-auto"
        >
          <Dna className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history by title, ID or locus..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Mutation count & Sort filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 hidden sm:inline">Mutations:</span>
          {(['all', 'zero', 'some', 'many'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterMutationRange(r)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                filterMutationRange === r
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r === 'all' ? 'All Counts' : r === 'zero' ? '0 Mutations' : r === 'some' ? '1–5 Muts' : '>5 Muts'}
            </button>
          ))}

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs">
            No analysis records match your search query.
          </div>
        ) : (
          filteredHistory.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold">
                      {item.result.identityPercentage}% Identity
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>
                      Ref: <span className="font-mono text-slate-300">{item.referenceName}</span> ({item.refStats.length}bp)
                    </span>
                    <span>•</span>
                    <span>
                      Sample: <span className="font-mono text-slate-300">{item.sampleName}</span> ({item.sampleStats.length}bp)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Stats & Actions */}
              <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {item.result.mutations.length} Variations
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                    {item.result.substitutions}S · {item.result.insertions}I · {item.result.deletions}D
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => reopenAnalysis(item.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all active:scale-95"
                  >
                    <span>Reopen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteAnalysis(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

