import React, { useState } from 'react';
import {
  BarChart3,
  Dna,
  PieChart,
  Thermometer,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useGenome } from '../context/GenomeContext';

export const SequenceStatisticsPage: React.FC = () => {
  const { currentAnalysis, setActiveTab } = useGenome();
  const [selectedBaseTooltip, setSelectedBaseTooltip] = useState<string | null>(null);

  if (!currentAnalysis) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800/80">
        <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">No Sequence Analysis Active</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Please run an alignment or load a benchmark genome in the DNA Analyzer to inspect statistical metrics.
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

  const { refStats, sampleStats, result, referenceName, sampleName } = currentAnalysis;

  // Base percentages for Donut chart
  const refTotal = refStats.validLength || 1;
  const aRefPct = Number(((refStats.aCount / refTotal) * 100).toFixed(1));
  const tRefPct = Number(((refStats.tCount / refTotal) * 100).toFixed(1));
  const gRefPct = Number(((refStats.gCount / refTotal) * 100).toFixed(1));
  const cRefPct = Number(((refStats.cCount / refTotal) * 100).toFixed(1));

  const smpTotal = sampleStats.validLength || 1;
  const aSmpPct = Number(((sampleStats.aCount / smpTotal) * 100).toFixed(1));
  const tSmpPct = Number(((sampleStats.tCount / smpTotal) * 100).toFixed(1));
  const gSmpPct = Number(((sampleStats.gCount / smpTotal) * 100).toFixed(1));
  const cSmpPct = Number(((sampleStats.cCount / smpTotal) * 100).toFixed(1));

  // Circular gauge calculations for GC% (Radius = 45, Circ = 282.74)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const refGcStroke = (refStats.gcContent / 100) * circumference;
  const smpGcStroke = (sampleStats.gcContent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Sequence Statistics
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Biochemical Metrics
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Stoichiometric nucleotide balance, GC enthalpy, and thermodynamic stability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono">
            {currentAnalysis.id}
          </span>
        </div>
      </div>

      {/* TOP ROW: A. SEQUENCE INFORMATION & B. GC CONTENT PROGRESS GAUGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. SEQUENCE INFORMATION (6 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Nucleotide Count & Length Breakdown
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Calculated Values</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Adenine Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400">Adenine (A)</span>
                <span className="text-[10px] text-slate-500 font-mono">Purine</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {refStats.aCount}
                <span className="text-xs text-slate-400 font-normal ml-1">({aRefPct}%)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Sample: <span className="text-slate-300 font-mono">{sampleStats.aCount}</span>
              </div>
            </div>

            {/* Thymine Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-400">Thymine (T)</span>
                <span className="text-[10px] text-slate-500 font-mono">Pyrim</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {refStats.tCount}
                <span className="text-xs text-slate-400 font-normal ml-1">({tRefPct}%)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Sample: <span className="text-slate-300 font-mono">{sampleStats.tCount}</span>
              </div>
            </div>

            {/* Guanine Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-400">Guanine (G)</span>
                <span className="text-[10px] text-slate-500 font-mono">Purine</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {refStats.gCount}
                <span className="text-xs text-slate-400 font-normal ml-1">({gRefPct}%)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Sample: <span className="text-slate-300 font-mono">{sampleStats.gCount}</span>
              </div>
            </div>

            {/* Cytosine Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-sky-400">Cytosine (C)</span>
                <span className="text-[10px] text-slate-500 font-mono">Pyrim</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {refStats.cCount}
                <span className="text-xs text-slate-400 font-normal ml-1">({cRefPct}%)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Sample: <span className="text-slate-300 font-mono">{sampleStats.cCount}</span>
              </div>
            </div>
          </div>

          {/* AT/GC Ratio & Thermodynamics bar */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Strand Length</span>
              <span className="font-mono text-white font-bold">{refStats.length} base pairs</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">AT / GC Stoichiometry</span>
              <span className="font-mono text-cyan-300 font-bold">
                {((refStats.atContent) / (refStats.gcContent || 1)).toFixed(2)} : 1
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Est. Melting Temp (Tm)*
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {refStats.tmEstimated}°C
              </span>
            </div>
          </div>
        </div>

        {/* B. GC CONTENT ANALYSIS (Circular Progress Indicator: 5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Percent className="w-4 h-4 text-cyan-400" />
              GC Content Analysis
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
              Calculated Value
            </span>
          </div>

          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 110 110">
              {/* Background Track */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />

              {/* Ref GC Progress */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="url(#gcGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${refGcStroke} ${circumference - refGcStroke}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              <defs>
                <linearGradient id="gcGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gauge Value Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-heading font-bold text-white tracking-tight">
                {refStats.gcContent}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 mt-0.5">
                Reference GC%
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Sample: {sampleStats.gcContent}%
              </span>
            </div>
          </div>

          {/* Enthalpy note */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            GC base pairs form <strong className="text-slate-200">3 hydrogen bonds</strong> versus 2 in AT pairs, conferring higher thermal annealing stability.
          </div>
        </div>
      </div>

      {/* C. NUCLEOTIDE COMPOSITION (DONUTS) & D. COMPARATIVE STATISTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. NUCLEOTIDE COMPOSITION DONUT CHARTS (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Nucleotide Composition (A, T, G, C)
            </h3>
            <span className="text-[11px] text-slate-400">Proportions</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reference Composition Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-cyan-300 block mb-3">
                Reference Strand
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">A (Ade):</span>
                  <span className="font-mono text-slate-200">{aRefPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${aRefPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-rose-400 font-bold">T (Thy):</span>
                  <span className="font-mono text-slate-200">{tRefPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${tRefPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-amber-400 font-bold">G (Gua):</span>
                  <span className="font-mono text-slate-200">{gRefPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${gRefPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sky-400 font-bold">C (Cyt):</span>
                  <span className="font-mono text-slate-200">{cRefPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${cRefPct}%` }} />
                </div>
              </div>
            </div>

            {/* Sample Composition Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-teal-300 block mb-3">
                Sample Strand
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">A (Ade):</span>
                  <span className="font-mono text-slate-200">{aSmpPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${aSmpPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-rose-400 font-bold">T (Thy):</span>
                  <span className="font-mono text-slate-200">{tSmpPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${tSmpPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-amber-400 font-bold">G (Gua):</span>
                  <span className="font-mono text-slate-200">{gSmpPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${gSmpPct}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sky-400 font-bold">C (Cyt):</span>
                  <span className="font-mono text-slate-200">{cSmpPct}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${cSmpPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* D. COMPARATIVE STATISTICS TABLE (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Comparative Statistics Matrix
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Reference vs Sample</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Metric Parameter</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Sample</th>
                  <th className="py-2.5 px-3">Difference (Δ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-200">Sequence Length</td>
                  <td className="py-2.5 px-3 font-mono">{refStats.length} bp</td>
                  <td className="py-2.5 px-3 font-mono">{sampleStats.length} bp</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {sampleStats.length - refStats.length > 0 ? `+${sampleStats.length - refStats.length}` : sampleStats.length - refStats.length} bp
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-200">GC Content %</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300">{refStats.gcContent}%</td>
                  <td className="py-2.5 px-3 font-mono text-teal-300">{sampleStats.gcContent}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {(sampleStats.gcContent - refStats.gcContent).toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-200">Sequence Identity</td>
                  <td className="py-2.5 px-3 font-mono">100%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{result.identityPercentage}%</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400 font-semibold">
                    -{(100 - result.identityPercentage).toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-200">Est. Melting Temp (Tm)*</td>
                  <td className="py-2.5 px-3 font-mono">{refStats.tmEstimated}°C</td>
                  <td className="py-2.5 px-3 font-mono">{sampleStats.tmEstimated}°C</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {(sampleStats.tmEstimated - refStats.tmEstimated).toFixed(1)}°C
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-200">Molecular Mass*</td>
                  <td className="py-2.5 px-3 font-mono">{refStats.molecularWeightKDa} kDa</td>
                  <td className="py-2.5 px-3 font-mono">{sampleStats.molecularWeightKDa} kDa</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {(sampleStats.molecularWeightKDa - refStats.molecularWeightKDa).toFixed(2)} kDa
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 italic">
            * Asterisk indicates estimated physical parameters (Wallace/Nearest-neighbor approximation). All other values are direct mathematical calculations.
          </div>
        </div>
      </div>
    </div>
  );
};
