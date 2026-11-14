export type Nucleotide = 'A' | 'T' | 'G' | 'C' | 'N' | '-';

export type MutationType = 'substitution' | 'insertion' | 'deletion';

export interface MutationItem {
  id: string;
  position: number; // 1-based alignment coordinate
  refPosition?: number; // 1-based in reference
  samplePosition?: number; // 1-based in sample
  type: MutationType;
  refBase: string;
  sampleBase: string;
  region: string;
  codonIndex?: number;
  codonRef?: string;
  codonSample?: string;
  aminoAcidRef?: string;
  aminoAcidSample?: string;
  classification: string; // e.g. "Transition (Purine ↔ Purine)", "Transversion", "Frameshift Indel", "In-frame Indel"
  details: string;
  impactNote?: string;
}

export interface SequenceStats {
  length: number;
  validLength: number;
  aCount: number;
  tCount: number;
  gCount: number;
  cCount: number;
  nCount: number;
  gcContent: number; // percentage (0-100)
  atContent: number; // percentage (0-100)
  invalidChars: string[];
  tmEstimated: number; // melting temp in Celsius
  molecularWeightKDa: number;
}

export interface AlignmentResult {
  alignedRef: string;
  alignedSample: string;
  totalPositions: number;
  matches: number;
  substitutions: number;
  insertions: number;
  deletions: number;
  identityPercentage: number;
  mutations: MutationItem[];
  similarityScore: number;
}

export interface AnalysisRecord {
  id: string;
  title: string;
  referenceName: string;
  sampleName: string;
  referenceSeq: string;
  sampleSeq: string;
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Flagged' | 'Archived';
  mutationsCount: number;
  result: AlignmentResult;
  refStats: SequenceStats;
  sampleStats: SequenceStats;
  tags?: string[];
  notes?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  organism: string;
  date: string;
  mutationsCount: number;
  status: 'Completed' | 'Analyzing' | 'Draft';
  description: string;
  tag: string;
  identity: number;
}

