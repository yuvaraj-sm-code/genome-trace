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
  Sliders,
  Database,
  Copy,
  Check,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';
import { SUPABASE_SQL_SCHEMA } from '../utils/supabase';

export const AnalysisHistoryPage: React.FC = () => {
  const {
    history,
    reopenAnalysis,
    deleteAnalysis,
    setActiveTab,
    loadDemo,
    addToast,
    isSupabaseConnected,
    supabaseConfig,
    updateSupabaseCredentials,
    syncWithSupabase
  } = useGenome();

  const [search, setSearch] = useState('');
  const [filterMutationRange, setFilterMutationRange] = useState<'all' | 'zero' | 'some' | 'many'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Supabase Database modal & sync state
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [dbUrl, setDbUrl] = useState(supabaseConfig.url || '');
  const [dbAnonKey, setDbAnonKey] = useState(supabaseConfig.anonKey || '');
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithSupabase();
    setIsSyncing(false);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDb(true);
    try {
      const ok = await updateSupabaseCredentials(dbUrl, dbAnonKey);
      if (ok) {
        setDbModalOpen(false);
      }
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleDisconnect = async () => {
    await updateSupabaseCredentials('', '');
    setDbUrl('');
    setDbAnonKey('');
    setDbModalOpen(false);
    addToast('info', 'Supabase Disconnected', 'Switched back to local browser session memory.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    addToast('success', 'SQL Copied', 'SQL schema copied to clipboard for Supabase query editor.');
    setTimeout(() => setCopiedSql(false), 2500);
  };

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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Dna className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* CLOUD DATABASE (SUPABASE) PERSISTENCE BAR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isSupabaseConnected
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-white">
                Data Persistence: {isSupabaseConnected ? 'Supabase PostgreSQL Cloud' : 'Local Browser Session Memory'}
              </h4>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  isSupabaseConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {isSupabaseConnected ? 'Live Cloud Sync' : 'Cloud Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isSupabaseConnected
                ? 'Every sequence comparison is automatically versioned and stored in your Supabase database.'
                : 'Currently running in fast local memory. Connect your Supabase project to permanently preserve history across devices.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {isSupabaseConnected && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sync latest records from Supabase database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Sync Cloud DB</span>
            </button>
          )}
          <button
            onClick={() => setDbModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600/25 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isSupabaseConnected ? 'Database Config' : 'Connect Supabase'}</span>
          </button>
        </div>
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

      {/* DATABASE CONFIGURATION MODAL */}
      {dbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Supabase Cloud Database
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connect PostgreSQL to store and sync your sequence analysis history.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDbModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Setup Instructions */}
            <form onSubmit={handleSaveCredentials} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Anon / Public API Key
                </label>
                <input
                  type="password"
                  value={dbAnonKey}
                  onChange={(e) => setDbAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Found in your Supabase Project Settings &gt; API &gt; Project API keys (anon public).
                </p>
              </div>

              {/* SQL Schema Preview */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-300">
                    Database Schema (analyses table)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL Schema'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 max-h-32 overflow-y-auto leading-relaxed select-all">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {isSupabaseConnected ? (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium transition-colors cursor-pointer"
                  >
                    Disconnect Database
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-500">
                    Works offline automatically if credentials are empty.
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDbModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDb}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold shadow-md shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSavingDb && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    <span>Save & Connect</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

