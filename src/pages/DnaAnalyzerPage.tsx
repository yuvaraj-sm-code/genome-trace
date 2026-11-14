import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCode,
  Dna,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  BookOpen,
  FileText,
  Copy,
  Check,
  Flame,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';
import {
  validateSequence,
  calculateSequenceStats,
  DEMO_DATASETS,
  parseFasta
} from '../utils/bioinformatics';

export const DnaAnalyzerPage: React.FC = () => {
  const {
    referenceInput,
    setReferenceInput,
    sampleInput,
    setSampleInput,
    referenceHeader,
    setReferenceHeader,
    sampleHeader,
    setSampleHeader,
    runAnalysis,
    isAnalyzing,
    loadDemo,
    clearInputs,
    setActiveTab,
    addToast
  } = useGenome();

  const [dragOverRef, setDragOverRef] = useState(false);
  const [dragOverSample, setDragOverSample] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const refFileInputRef = useRef<HTMLInputElement>(null);
  const sampleFileInputRef = useRef<HTMLInputElement>(null);

  // Validation calculations
  const refValidation = validateSequence(referenceInput);
  const sampleValidation = validateSequence(sampleInput);

  const refStats = calculateSequenceStats(referenceInput);
  const sampleStats = calculateSequenceStats(sampleInput);

  // File upload handlers
  const handleFileUpload = (
    file: File,
    setSeq: (val: string) => void,
    setHeader: (val: string) => void,
    targetName: string
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const { header, sequence } = parseFasta(content);
        if (header) setHeader(`>${header}`);
        setSeq(sequence || content);
        addToast('success', 'File Uploaded', `${targetName} loaded from ${file.name}`);
      }
    };
    reader.onerror = () => {
      addToast('error', 'Read Error', `Could not read file ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setSeq: (val: string) => void,
    setHeader: (val: string) => void,
    targetName: string
  ) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], setSeq, setHeader, targetName);
    }
  };

  const copyToClipboard = (text: string, isRef: boolean) => {
    navigator.clipboard.writeText(text);
    if (isRef) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedSample(true);
      setTimeout(() => setCopiedSample(false), 2000);
    }
    addToast('info', 'Copied to Clipboard', 'Sequence nucleotides copied.');
  };

  const handleAnalyzeClick = async () => {
    const success = await runAnalysis();
    if (success) {
      setActiveTab('comparison');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              DNA Sequence Analyzer
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Biotech Studio
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Upload, validate and analyse your DNA sequences with pairwise dynamic alignment.
          </p>
        </div>

        {/* Demo Selector Quick Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden lg:inline">Quick Benchmark:</span>
          <select
            onChange={(e) => {
              if (e.target.value) loadDemo(e.target.value);
            }}
            defaultValue=""
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="" disabled>
              Load Example Genome...
            </option>
            {DEMO_DATASETS.map((demo) => (
              <option key={demo.id} value={demo.id}>
                {demo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TWO-PANEL INPUT LAYOUT (Reference DNA vs Sample DNA) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL — REFERENCE DNA */}
        <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg overflow-hidden transition-all focus-within:border-cyan-500/50">
          {/* Panel Header */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                REF
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Reference DNA Sequence
                </h3>
                <p className="text-[11px] text-slate-400">
                  Target wildtype or baseline consensus sequence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(referenceInput, true)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Copy Reference"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setReferenceInput('')}
                className="text-[11px] px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* FASTA Drag-and-Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverRef(true);
            }}
            onDragLeave={() => setDragOverRef(false)}
            onDrop={(e) => {
              setDragOverRef(false);
              handleDrop(e, setReferenceInput, setReferenceHeader, 'Reference Sequence');
            }}
            onClick={() => refFileInputRef.current?.click()}
            className={`mx-4 mt-4 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
              dragOverRef
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input
              type="file"
              ref={refFileInputRef}
              accept=".fasta,.fa,.txt,.fna,.seq"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], setReferenceInput, setReferenceHeader, 'Reference Sequence');
                }
              }}
            />
            <Upload className="w-6 h-6 text-cyan-400/80 mb-1.5" />
            <div className="text-xs font-medium text-slate-200">
              Drag & Drop Reference FASTA here, or <span className="text-cyan-400 underline">Browse File</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Supports .fasta, .fa, .txt files (Single or multi-line FASTA)
            </div>
          </div>

          {/* FASTA Header Input */}
          <div className="px-4 pt-3">
            <input
              type="text"
              value={referenceHeader}
              onChange={(e) => setReferenceHeader(e.target.value)}
              placeholder=">Reference_Sequence_Identifier (Optional)"
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Sequence Editor Box */}
          <div className="p-4 flex-1 flex flex-col">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Sequence Nucleotides (A, T, G, C)</span>
              <span className="font-mono text-cyan-400 font-bold">{refValidation.totalLength} bp</span>
            </label>
            <textarea
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
              placeholder="Paste raw nucleotide sequence or FASTA text (e.g. ATGGTCGATCG...)..."
              rows={9}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 resize-none font-mono-sequence"
              spellCheck={false}
            />

            {/* Invalid Characters Warning Banner if any */}
            {refValidation.invalidChars.length > 0 && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Detected non-canonical characters:{' '}
                  <span className="font-mono font-bold bg-rose-900/60 px-1 py-0.5 rounded">
                    {refValidation.invalidChars.join(', ')}
                  </span>
                </span>
              </div>
            )}

            {/* Validation & Base Counts Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Status</span>
                <span className={`font-semibold flex items-center justify-center gap-1 ${refValidation.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {refValidation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {refValidation.isValid ? 'Valid' : 'Verify'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-emerald-400 block font-bold">A (Ade)</span>
                <span className="font-mono text-slate-200 font-semibold">{refStats.aCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-rose-400 block font-bold">T (Thy)</span>
                <span className="font-mono text-slate-200 font-semibold">{refStats.tCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-amber-400 block font-bold">G (Gua)</span>
                <span className="font-mono text-slate-200 font-semibold">{refStats.gCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-sky-400 block font-bold">C (Cyt)</span>
                <span className="font-mono text-slate-200 font-semibold">{refStats.cCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — SAMPLE DNA */}
        <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg overflow-hidden transition-all focus-within:border-teal-500/50">
          {/* Panel Header */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs">
                SMP
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Sample DNA Sequence
                </h3>
                <p className="text-[11px] text-slate-400">
                  Experimental isolate, patient allele or edited variant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard(sampleInput, false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Copy Sample"
              >
                {copiedSample ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSampleInput('')}
                className="text-[11px] px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* FASTA Drag-and-Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverSample(true);
            }}
            onDragLeave={() => setDragOverSample(false)}
            onDrop={(e) => {
              setDragOverSample(false);
              handleDrop(e, setSampleInput, setSampleHeader, 'Sample Sequence');
            }}
            onClick={() => sampleFileInputRef.current?.click()}
            className={`mx-4 mt-4 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
              dragOverSample
                ? 'border-teal-400 bg-teal-950/20'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input
              type="file"
              ref={sampleFileInputRef}
              accept=".fasta,.fa,.txt,.fna,.seq"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0], setSampleInput, setSampleHeader, 'Sample Sequence');
                }
              }}
            />
            <Upload className="w-6 h-6 text-teal-400/80 mb-1.5" />
            <div className="text-xs font-medium text-slate-200">
              Drag & Drop Sample FASTA here, or <span className="text-teal-400 underline">Browse File</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Supports .fasta, .fa, .txt files (Single or multi-line FASTA)
            </div>
          </div>

          {/* FASTA Header Input */}
          <div className="px-4 pt-3">
            <input
              type="text"
              value={sampleHeader}
              onChange={(e) => setSampleHeader(e.target.value)}
              placeholder=">Sample_Sequence_Identifier (Optional)"
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs font-mono text-teal-300 placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Sequence Editor Box */}
          <div className="p-4 flex-1 flex flex-col">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Sequence Nucleotides (A, T, G, C)</span>
              <span className="font-mono text-teal-400 font-bold">{sampleValidation.totalLength} bp</span>
            </label>
            <textarea
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value.toUpperCase())}
              placeholder="Paste raw nucleotide sequence or FASTA text (e.g. ATGGTCGATCG...)..."
              rows={9}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 resize-none font-mono-sequence"
              spellCheck={false}
            />

            {/* Invalid Characters Warning Banner if any */}
            {sampleValidation.invalidChars.length > 0 && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Detected non-canonical characters:{' '}
                  <span className="font-mono font-bold bg-rose-900/60 px-1 py-0.5 rounded">
                    {sampleValidation.invalidChars.join(', ')}
                  </span>
                </span>
              </div>
            )}

            {/* Validation & Base Counts Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Status</span>
                <span className={`font-semibold flex items-center justify-center gap-1 ${sampleValidation.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {sampleValidation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {sampleValidation.isValid ? 'Valid' : 'Verify'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-emerald-400 block font-bold">A (Ade)</span>
                <span className="font-mono text-slate-200 font-semibold">{sampleStats.aCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-rose-400 block font-bold">T (Thy)</span>
                <span className="font-mono text-slate-200 font-semibold">{sampleStats.tCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-amber-400 block font-bold">G (Gua)</span>
                <span className="font-mono text-slate-200 font-semibold">{sampleStats.gCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-sky-400 block font-bold">C (Cyt)</span>
                <span className="font-mono text-slate-200 font-semibold">{sampleStats.cCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR: Prominent "ANALYZE DNA" + "Clear All" + Preset Loaders */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing || !referenceInput.trim() || !sampleInput.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:via-sky-400 hover:to-teal-300 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>COMPUTING ALIGNMENT...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>ANALYZE DNA</span>
              </>
            )}
          </button>

          <button
            onClick={clearInputs}
            className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700/60 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Quick Example Sequence Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Load Preset:</span>
          {DEMO_DATASETS.slice(0, 3).map((demo) => (
            <button
              key={demo.id}
              onClick={() => loadDemo(demo.id)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-700/60 transition-all text-[11px]"
            >
              {demo.id === 'hbb-sickle-cell' ? 'HBB HbS (E6V)' : demo.id === 'brca1-exon11' ? 'BRCA1 Exon 11' : 'SARS-CoV-2 RBD'}
            </button>
          ))}
        </div>
      </div>

      {/* SCIENTIFIC INFORMATION PANEL */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex flex-col md:flex-row items-start gap-4 text-xs text-slate-400">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="text-sm font-semibold text-white tracking-wide">
            Understanding Pairwise Sequence Alignment
          </h4>
          <p className="leading-relaxed">
            DNA sequence comparison matches each nucleotide in the reference locus with the corresponding base in the sample isolate. When differences occur, the algorithm classifies them into single nucleotide substitutions (transitions vs transversions), insertions (extra bases), and deletions (lost bases).
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400 font-mono">
            <span>• Scoring Matrix: Match (+2), Mismatch (-1), Gap (-2)</span>
            <span>• Reading Frame: Codon triplets mapped</span>
            <span>• GC Stoichiometry: Exact stoichiometric ratio</span>
          </div>
        </div>
      </div>
    </div>
  );
};

