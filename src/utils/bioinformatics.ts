import { AlignmentResult, MutationItem, SequenceStats } from '../types/dna';

// Standard Genetic Code codon dictionary
export const GENETIC_CODE: Record<string, { code: string; name: string }> = {
  'TTT': { code: 'F', name: 'Phenylalanine' }, 'TTC': { code: 'F', name: 'Phenylalanine' },
  'TTA': { code: 'L', name: 'Leucine' },       'TTG': { code: 'L', name: 'Leucine' },
  'CTT': { code: 'L', name: 'Leucine' },       'CTC': { code: 'L', name: 'Leucine' },
  'CTA': { code: 'L', name: 'Leucine' },       'CTG': { code: 'L', name: 'Leucine' },
  'ATT': { code: 'I', name: 'Isoleucine' },    'ATC': { code: 'I', name: 'Isoleucine' },
  'ATA': { code: 'I', name: 'Isoleucine' },    'ATG': { code: 'M', name: 'Methionine (Start)' },
  'GTT': { code: 'V', name: 'Valine' },        'GTC': { code: 'V', name: 'Valine' },
  'GTA': { code: 'V', name: 'Valine' },        'GTG': { code: 'V', name: 'Valine' },
  'TCT': { code: 'S', name: 'Serine' },        'TCC': { code: 'S', name: 'Serine' },
  'TCA': { code: 'S', name: 'Serine' },        'TCG': { code: 'S', name: 'Serine' },
  'CCT': { code: 'P', name: 'Proline' },       'CCC': { code: 'P', name: 'Proline' },
  'CCA': { code: 'P', name: 'Proline' },       'CCG': { code: 'P', name: 'Proline' },
  'ACT': { code: 'T', name: 'Threonine' },     'ACC': { code: 'T', name: 'Threonine' },
  'ACA': { code: 'T', name: 'Threonine' },     'ACG': { code: 'T', name: 'Threonine' },
  'GCT': { code: 'A', name: 'Alanine' },       'GCC': { code: 'A', name: 'Alanine' },
  'GCA': { code: 'A', name: 'Alanine' },       'GCG': { code: 'A', name: 'Alanine' },
  'TAT': { code: 'Y', name: 'Tyrosine' },      'TAC': { code: 'Y', name: 'Tyrosine' },
  'TAA': { code: '*', name: 'Stop (Ochre)' },  'TAG': { code: '*', name: 'Stop (Amber)' },
  'CAT': { code: 'H', name: 'Histidine' },     'CAC': { code: 'H', name: 'Histidine' },
  'CAA': { code: 'Q', name: 'Glutamine' },     'CAG': { code: 'Q', name: 'Glutamine' },
  'AAT': { code: 'N', name: 'Asparagine' },    'AAC': { code: 'N', name: 'Asparagine' },
  'AAA': { code: 'K', name: 'Lysine' },        'AAG': { code: 'K', name: 'Lysine' },
  'GAT': { code: 'D', name: 'Aspartic Acid' }, 'GAC': { code: 'D', name: 'Aspartic Acid' },
  'GAA': { code: 'E', name: 'Glutamic Acid' }, 'GAG': { code: 'E', name: 'Glutamic Acid' },
  'TGT': { code: 'C', name: 'Cysteine' },      'TGC': { code: 'C', name: 'Cysteine' },
  'TGA': { code: '*', name: 'Stop (Opal)' },   'TGG': { code: 'W', name: 'Tryptophan' },
  'CGT': { code: 'R', name: 'Arginine' },      'CGC': { code: 'R', name: 'Arginine' },
  'CGA': { code: 'R', name: 'Arginine' },      'CGG': { code: 'R', name: 'Arginine' },
  'AGT': { code: 'S', name: 'Serine' },        'AGC': { code: 'S', name: 'Serine' },
  'AGA': { code: 'R', name: 'Arginine' },      'AGG': { code: 'R', name: 'Arginine' },
  'GGT': { code: 'G', name: 'Glycine' },       'GGC': { code: 'G', name: 'Glycine' },
  'GGA': { code: 'G', name: 'Glycine' },       'GGG': { code: 'G', name: 'Glycine' }
};

/**
 * Parses raw text which could be raw nucleotides or FASTA format (>header\nsequence)
 */
export function parseFasta(input: string): { header: string; sequence: string } {
  if (!input) return { header: '', sequence: '' };
  const lines = input.trim().split(/\r?\n/);
  let header = '';
  const seqLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      if (!header) {
        header = trimmed.substring(1).trim();
      }
    } else {
      seqLines.push(trimmed);
    }
  }

  const rawSeq = seqLines.join('').toUpperCase().replace(/\s+/g, '');
  return {
    header: header || 'Sequence_Segment_01',
    sequence: rawSeq
  };
}

/**
 * Validates a nucleotide sequence and extracts character anomalies
 */
export function validateSequence(rawInput: string): {
  isValid: boolean;
  cleanSeq: string;
  invalidChars: string[];
  totalLength: number;
} {
  const { sequence } = parseFasta(rawInput);
  const invalidCharsSet = new Set<string>();
  const cleanChars: string[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const char = sequence[i];
    if (['A', 'T', 'G', 'C', 'N'].includes(char)) {
      cleanChars.push(char);
    } else {
      invalidCharsSet.add(char);
    }
  }

  return {
    isValid: invalidCharsSet.size === 0 && sequence.length > 0,
    cleanSeq: sequence,
    invalidChars: Array.from(invalidCharsSet),
    totalLength: sequence.length
  };
}

/**
 * Calculates comprehensive scientific statistics for a DNA sequence
 */
export function calculateSequenceStats(rawInput: string): SequenceStats {
  const { cleanSeq, invalidChars } = validateSequence(rawInput);
  const length = cleanSeq.length;

  let aCount = 0;
  let tCount = 0;
  let gCount = 0;
  let cCount = 0;
  let nCount = 0;

  for (let i = 0; i < length; i++) {
    const b = cleanSeq[i];
    if (b === 'A') aCount++;
    else if (b === 'T') tCount++;
    else if (b === 'G') gCount++;
    else if (b === 'C') cCount++;
    else if (b === 'N') nCount++;
  }

  const validBases = aCount + tCount + gCount + cCount;
  const gcCount = gCount + cCount;
  const atCount = aCount + tCount;

  const gcContent = validBases > 0 ? Number(((gcCount / validBases) * 100).toFixed(2)) : 0;
  const atContent = validBases > 0 ? Number(((atCount / validBases) * 100).toFixed(2)) : 0;

  // Estimated Tm (Melting temperature in °C)
  // Standard Wallace rule for < 14bp: 2*(A+T) + 4*(G+C)
  // For >= 14bp: Tm = 64.9 + 41 * (G+C - 16.4) / (A+T+G+C)
  let tmEstimated = 0;
  if (validBases > 0) {
    if (validBases < 14) {
      tmEstimated = 2 * atCount + 4 * gcCount;
    } else {
      tmEstimated = Number((64.9 + (41 * (gcCount - 16.4)) / validBases).toFixed(1));
    }
  }

  // Molecular weight estimate: ~330 Da per nucleotide single stranded
  const molecularWeightKDa = Number(((validBases * 330) / 1000).toFixed(2));

  return {
    length,
    validLength: validBases,
    aCount,
    tCount,
    gCount,
    cCount,
    nCount,
    gcContent,
    atContent,
    invalidChars,
    tmEstimated,
    molecularWeightKDa
  };
}

/**
 * Classifies a point substitution into Transition vs Transversion
 */
export function classifySubstitution(ref: string, sample: string): string {
  const purines = ['A', 'G'];
  const pyrimidines = ['C', 'T'];

  const refPurine = purines.includes(ref);
  const samplePurine = purines.includes(sample);
  const refPyrim = pyrimidines.includes(ref);
  const samplePyrim = pyrimidines.includes(sample);

  if ((refPurine && samplePurine) || (refPyrim && samplePyrim)) {
    return 'Transition (Purine ↔ Purine / Pyrim ↔ Pyrim)';
  }
  return 'Transversion (Purine ↔ Pyrimidine)';
}

/**
 * Needleman-Wunsch Global Alignment Algorithm
 * Computes optimal global sequence alignment and identifies exact mutations
 */
export function alignSequences(
  refRaw: string,
  sampleRaw: string,
  refGeneName = 'Reference',
  sampleGeneName = 'Sample'
): AlignmentResult {
  const { sequence: seqA } = parseFasta(refRaw);
  const { sequence: seqB } = parseFasta(sampleRaw);

  const n = seqA.length;
  const m = seqB.length;

  if (n === 0 && m === 0) {
    return {
      alignedRef: '',
      alignedSample: '',
      totalPositions: 0,
      matches: 0,
      substitutions: 0,
      insertions: 0,
      deletions: 0,
      identityPercentage: 100,
      mutations: [],
      similarityScore: 0
    };
  }

  // Scoring matrix parameters
  const MATCH = 2;
  const MISMATCH = -1;
  const GAP = -2;

  // Initialize DP Matrix
  // Using 1D typed arrays or row buffers for optimal performance and safety against large sequences
  const dp: number[][] = [];
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(m + 1);
  }

  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) dp[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) dp[0][j] = j * GAP;

  for (let i = 1; i <= n; i++) {
    const charA = seqA[i - 1];
    for (let j = 1; j <= m; j++) {
      const charB = seqB[j - 1];
      const scoreDiag = dp[i - 1][j - 1] + (charA === charB ? MATCH : MISMATCH);
      const scoreUp = dp[i - 1][j] + GAP;
      const scoreLeft = dp[i][j - 1] + GAP;
      dp[i][j] = Math.max(scoreDiag, scoreUp, scoreLeft);
    }
  }

  // Traceback
  const alignedAChars: string[] = [];
  const alignedBChars: string[] = [];

  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (seqA[i - 1] === seqB[j - 1] ? MATCH : MISMATCH)) {
      alignedAChars.push(seqA[i - 1]);
      alignedBChars.push(seqB[j - 1]);
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + GAP) {
      alignedAChars.push(seqA[i - 1]);
      alignedBChars.push('-');
      i--;
    } else {
      alignedAChars.push('-');
      alignedBChars.push(seqB[j - 1]);
      j--;
    }
  }

  alignedAChars.reverse();
  alignedBChars.reverse();

  const alignedRef = alignedAChars.join('');
  const alignedSample = alignedBChars.join('');
  const totalPositions = alignedRef.length;

  let matches = 0;
  let substitutions = 0;
  let insertions = 0;
  let deletions = 0;

  const mutations: MutationItem[] = [];

  let refCoordinate = 0;
  let sampleCoordinate = 0;

  for (let pos = 0; pos < totalPositions; pos++) {
    const rBase = alignedRef[pos];
    const sBase = alignedSample[pos];

    if (rBase !== '-') refCoordinate++;
    if (sBase !== '-') sampleCoordinate++;

    const alignPos = pos + 1; // 1-based coordinate in alignment

    if (rBase === sBase) {
      matches++;
    } else if (rBase !== '-' && sBase !== '-') {
      // Substitution
      substitutions++;
      const classification = classifySubstitution(rBase, sBase);

      // Codon calculation if inside reading frame
      const codonIdx = Math.floor((refCoordinate - 1) / 3) + 1;
      const codonStart = Math.max(0, (codonIdx - 1) * 3);
      const refCodonStr = seqA.substring(codonStart, codonStart + 3);
      const aaRef = GENETIC_CODE[refCodonStr]?.name || 'Unknown';

      mutations.push({
        id: `MUT-SUB-${alignPos}`,
        position: alignPos,
        refPosition: refCoordinate,
        samplePosition: sampleCoordinate,
        type: 'substitution',
        refBase: rBase,
        sampleBase: sBase,
        region: `Exon / Codon ${codonIdx}`,
        codonIndex: codonIdx,
        codonRef: refCodonStr,
        aminoAcidRef: aaRef,
        classification,
        details: `Nucleotide substitution ${rBase} → ${sBase} at position ${alignPos}.`,
        impactNote: 'Potential missense or synonymous alteration.'
      });
    } else if (rBase === '-' && sBase !== '-') {
      // Insertion
      insertions++;
      mutations.push({
        id: `MUT-INS-${alignPos}`,
        position: alignPos,
        samplePosition: sampleCoordinate,
        type: 'insertion',
        refBase: '-',
        sampleBase: sBase,
        region: `Inter-nucleotide ${refCoordinate}`,
        classification: 'Nucleotide Insertion (InDel)',
        details: `Insertion of extra base '${sBase}' in sample sequence.`,
        impactNote: 'May disrupt reading frame unless a multiple of 3.'
      });
    } else if (rBase !== '-' && sBase === '-') {
      // Deletion
      deletions++;
      mutations.push({
        id: `MUT-DEL-${alignPos}`,
        position: alignPos,
        refPosition: refCoordinate,
        type: 'deletion',
        refBase: rBase,
        sampleBase: '-',
        region: `Reference Pos ${refCoordinate}`,
        classification: 'Nucleotide Deletion (InDel)',
        details: `Deletion of reference base '${rBase}' in sample sequence.`,
        impactNote: 'Deletion introduces gap in alignment; frameshift risk.'
      });
    }
  }

  const identityPercentage = totalPositions > 0
    ? Number(((matches / totalPositions) * 100).toFixed(2))
    : 100;

  const similarityScore = dp[n][m];

  return {
    alignedRef,
    alignedSample,
    totalPositions,
    matches,
    substitutions,
    insertions,
    deletions,
    identityPercentage,
    mutations,
    similarityScore
  };
}

/**
 * High-fidelity demonstration datasets with real biological context
 */
export interface DemoDataset {
  id: string;
  name: string;
  organism: string;
  category: string;
  description: string;
  referenceHeader: string;
  referenceSeq: string;
  sampleHeader: string;
  sampleSeq: string;
  mutationHighlight: string;
}

export const DEMO_DATASETS: DemoDataset[] = [
  {
    id: 'hbb-sickle-cell',
    name: 'Human Beta-Globin (HBB) — Sickle Cell HbS Variant',
    organism: 'Homo sapiens',
    category: 'Monogenic Pathology',
    description: 'Human hemoglobin subunit beta (HBB) Exon 1 fragment. The canonical A→T transversion at codon 6 (GAG → GTG) substitutes Glutamic Acid with Valine (E6V), responsible for sickle-cell anemia.',
    referenceHeader: '>Homo_sapiens_HBB_Exon1_Reference_Wildtype',
    referenceSeq: 'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTC',
    sampleHeader: '>Homo_sapiens_HBB_HbS_Sickle_Allele_Exon1',
    sampleSeq: 'ATGGTGCACCTGACTCCTGTGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGGCTGCTGGTGGTCTACCCTTGGACCCAGAGGTTCTTTGAGTCCTTTGGGGATCTGTCCACTCCTGATGCTGTTATGGGCAACCCTAAGGTGAAGGCTCATGGCAAGAAAGTGCTCGGTGCCTTTAGTGATGGCCTGGCTCACCTGGACAACCTCAAGGGCACCTTTGCCACACTGAGTGAGCTGCACTGTGACAAGCTGCACGTGGATCCTGAGAACTTCAGGCTC',
    mutationHighlight: 'Point Transversion (A→T) at Position 20 (GAG→GTG)'
  },
  {
    id: 'brca1-exon11',
    name: 'BRCA1 Breast Cancer Susceptibility Gene — Exon 11',
    organism: 'Homo sapiens',
    category: 'Oncogenomics',
    description: 'Segment of BRCA1 Exon 11 harboring the high-frequency 185delAG frameshift deletion alongside a benign synonymous substitution polymorphism.',
    referenceHeader: '>BRCA1_Exon11_Reference_Sequence_Chr17',
    referenceSeq: 'AGATAGTTCCACCAGCTGTACCAGTGAAATTTCCCAAACTTTTTCTACTCTGTTTTAGTGACTTCATTGAAACCAAAAATGTTTTTTATGGATTTCTTGTACTAAATTTTTAGAAAAGTTTTATATGTCGCTAAAGACTCACAGG',
    sampleHeader: '>BRCA1_Patient_Sample_Exon11_Variant_185del',
    sampleSeq: 'AGATAGTTCCACCAGCTGTACCAGTGAAATTTCCCAAACTTTTTCTACTCTGTTTTAGTGACTTCATTGAAACCAAAAATGTTTTTTATGGATTTCTTTACTAAATTTTTAGAAAAGTTTTATATGTCGCTAAAGACTCACAGG',
    mutationHighlight: 'InDel Deletion + Single Nucleotide Variation'
  },
  {
    id: 'sars-cov-2-rbd',
    name: 'SARS-CoV-2 Spike RBD — Lineage Comparison',
    organism: 'SARS-CoV-2 (Coronaviridae)',
    category: 'Viral Phylodynamics',
    description: 'Receptor Binding Domain (RBD) encoding key antigenic mutations: N501Y substitution facilitating human ACE2 receptor affinity and secondary immune escape mutations.',
    referenceHeader: '>SARS_CoV_2_Wuhan_Hu_1_Spike_RBD_Reference',
    referenceSeq: 'AACTTTACTAATTTAGTGTTAGTCTCTAACAATCTTGATTCTAAGGTTGGTGGTAATTATAATTACCGGTATAGATTGTTTAGGAAGTCTAATCTCAAACCTTTTGAGAGAGATATTTCAACTGAAATCTATCAGGCCGGTAGCACACCTTGTAATGGTGTTGAAGGTTTTAATTGTTACTTTCCTTTACAATCATATGGTTTCCAACCCACTAATGGTGTTGGTTACCAACCATACAGAGTAGTAGTACTTTCTTTTGAACTTCTA',
    sampleHeader: '>SARS_CoV_2_Variant_Lineage_Mutated_RBD',
    sampleSeq: 'AACTTTACTAATTTAGTGTTAGTCTCTAACAATCTTGATTCTAAGGTTGGTGGTAATTATTACTACCGGTATAGATTGTTTAGGAAGTCTAATCTCAAACCTTTTGAGAGAGATATTTCAACTGAAATCTATCAGGCCGGTAGTACACCTTGTAATGGTGTTGAAGGTTTTAATTGTTACTTTCCTTTACAATCATATGGTTTCCAACCCACTTATGGTGTTGGTTACCAACCATACAGAGTAGTAGTACTTTCTTTTGAACTTCTA',
    mutationHighlight: 'Multiple Antigenic Substitutions (N501Y, D614G cluster)'
  },
  {
    id: 'crispr-cas9-edit',
    name: 'CRISPR-Cas9 On-Target Edit — Micro-Indel Profile',
    organism: 'Engineered Cell Line',
    category: 'Genome Editing Validation',
    description: 'Validation of CRISPR-Cas9 targeted double-strand break repair via non-homologous end joining (NHEJ), showing a 2bp micro-insertion and single nucleotide repair.',
    referenceHeader: '>Target_Locus_Wildtype_Pre_Edit',
    referenceSeq: 'CCAGTCGTAGCTAGCTAGCTAGCTGATCGATCGATCGATCGATCGATCGATCGATCGATCGTAGCTAGCTAGCTAGCTGA',
    sampleHeader: '>Post_Edit_Clonal_Isolate_NHEJ',
    sampleSeq: 'CCAGTCGTAGCTAGCTAGCTAGCTGATCGATCGATCGTTATCGATCGATCGATCGATCGATCGTAGCTAGCTAGCTAGCTGA',
    mutationHighlight: '2-bp Insertion (+TT) via NHEJ DNA Repair'
  }
];
