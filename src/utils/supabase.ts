import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AnalysisRecord } from '../types/dna';

// LocalStorage keys for optional user-configured Supabase project credentials
const STORAGE_KEY_URL = 'genome_trace_supabase_url';
const STORAGE_KEY_ANON = 'genome_trace_supabase_anon_key';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) || '' : '';

  return {
    url: storedUrl || envUrl,
    anonKey: storedKey || envKey
  };
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  if (typeof localStorage !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_ANON);
  }
  supabaseClientInstance = null; // reset cached client
}

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey) {
    try {
      supabaseClientInstance = createClient(url, anonKey);
      return supabaseClientInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

/**
 * Saves an analysis record to the Supabase "analyses" table if configured
 */
export async function saveAnalysisToSupabase(
  record: AnalysisRecord
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const payload = {
      id: record.id,
      title: record.title,
      reference_name: record.referenceName,
      sample_name: record.sampleName,
      reference_seq: record.referenceSeq,
      sample_seq: record.sampleSeq,
      timestamp: record.timestamp,
      status: record.status,
      mutations_count: record.mutationsCount,
      result: record.result,
      ref_stats: record.refStats,
      sample_stats: record.sampleStats,
      tags: record.tags || []
    };

    const { error } = await client.from('analyses').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase save error:', err);
    return { success: false, error: err?.message || 'Database connection error' };
  }
}

/**
 * Fetches analysis history from Supabase if connected
 */
export async function fetchAnalysesFromSupabase(): Promise<{
  success: boolean;
  data?: AnalysisRecord[];
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await client
      .from('analyses')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) return { success: true, data: [] };

    const records: AnalysisRecord[] = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      referenceName: row.reference_name,
      sampleName: row.sample_name,
      referenceSeq: row.reference_seq,
      sampleSeq: row.sample_seq,
      timestamp: row.timestamp,
      status: row.status,
      mutationsCount: row.mutations_count,
      result: row.result,
      refStats: row.ref_stats,
      sampleStats: row.sample_stats,
      tags: row.tags || []
    }));

    return { success: true, data: records };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch analyses' };
  }
}

/**
 * Deletes an analysis record from Supabase
 */
export async function deleteAnalysisFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await client.from('analyses').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete from database' };
  }
}

/**
 * SQL Schema template for user's Supabase dashboard
 */
export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor to initialize the Genome Trace ledger:
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  reference_name TEXT NOT NULL,
  sample_name TEXT NOT NULL,
  reference_seq TEXT NOT NULL,
  sample_seq TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT DEFAULT 'Completed',
  mutations_count INT DEFAULT 0,
  result JSONB,
  ref_stats JSONB,
  sample_stats JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional / public read-write for lab workstations)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write" ON analyses FOR ALL USING (true);
`;

