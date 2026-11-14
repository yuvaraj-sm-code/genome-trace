import React from 'react';
import {
  X,
  Dna,
  BookOpen,
  GitCompare,
  Flame,
  CheckCircle2,
  FileCode,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useGenome } from '../../context/GenomeContext';

export const HelpGuideModal: React.FC = () => {
  const { helpModalOpen, setHelpModalOpen } = useGenome();

  if (!helpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-white">
                Genome Trace Documentation & Guide
              </h2>
              <p className="text-xs text-slate-400">
                Scientific principles, algorithms, and sequence comparison standards.
              </p>
            </div>
          </div>
          <button
            onClick={() => setHelpModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              1. What DNA Sequence Comparison Does
            </h3>
            <p className="text-slate-400">
              DNA sequence comparison is a foundational bioinformatic methodology used to quantify nucleotide divergence between a standard reference sequence and an experimental sample isolate. It identifies genomic variations such as Single Nucleotide Variants (SNVs), micro-insertions, and micro-deletions (InDels).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              2. Mutation Classification Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 block mb-1">Substitution</span>
                <p className="text-[11px] text-slate-400">
                  Replacement of one nucleotide base with another. Classified into Transitions (Purine ↔ Purine, Pyrimidine ↔ Pyrimidine) and Transversions (Purine ↔ Pyrimidine).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 block mb-1">Insertion</span>
                <p className="text-[11px] text-slate-400">
                  Addition of one or more extra nucleotide bases into the sequence. Indels that are not multiples of three cause frameshift mutations in coding regions.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30">
                <span className="text-xs font-bold text-rose-400 block mb-1">Deletion</span>
                <p className="text-[11px] text-slate-400">
                  Loss or omission of one or more nucleotide bases from the reference coordinate system, represented by gap characters (<code className="text-rose-300">-</code>).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-teal-400" />
              3. Dynamic Programming Alignment Matrix
            </h3>
            <p className="text-slate-400">
              Genome Trace employs the Needleman-Wunsch algorithm for global pairwise sequence alignment. By optimizing scoring matrices (Match: +2, Mismatch: -1, Gap: -2), it guarantees optimal alignment of homologous segments and accurate gap placement.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-400" />
              4. FASTA Format Guidelines
            </h3>
            <p className="text-slate-400">
              FASTA sequences begin with a single header line starting with the <code className="text-cyan-300">&gt;</code> symbol followed by the identifier (e.g., <code className="text-slate-300">&gt;Homo_sapiens_HBB_Ref</code>), followed by nucleotide lines (A, T, G, C, N). Non-nucleotide symbols are filtered with real-time validation warnings.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-300/90 leading-relaxed">
              <strong>Scientific & Educational Compliance Notice:</strong> Genome Trace is intended for molecular biology research, computational bioinformatics, and educational sequence exploration. This platform does not provide diagnostic genetic interpretations or clinical medical evaluations.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end bg-slate-950/40">
          <button
            onClick={() => setHelpModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
