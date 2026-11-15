import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Flame,
  Dna,
  Percent,
  X,
  Share2,
  Printer,
  Presentation
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';
import { useGenome } from '../context/GenomeContext';
import { AnalysisRecord } from '../types/dna';

export const ReportsPage: React.FC = () => {
  const { history, currentAnalysis, addToast } = useGenome();

  const [searchFilter, setSearchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedReport, setSelectedReport] = useState<AnalysisRecord | null>(
    currentAnalysis || (history.length > 0 ? history[0] : null)
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  // Generate downloadable CSV
  const handleExportCsv = (record: AnalysisRecord) => {
    const lines = [
      `Genome Trace - Mutation Analysis Report`,
      `Analysis ID,${record.id}`,
      `Title,${record.title}`,
      `Reference,${record.referenceName}`,
      `Sample,${record.sampleName}`,
      `Date,${record.timestamp}`,
      `Sequence Length,${record.refStats.length} bp`,
      `Sequence Identity,${record.result.identityPercentage}%`,
      `Total Mutations,${record.result.mutations.length}`,
      `Substitutions,${record.result.substitutions}`,
      `Insertions,${record.result.insertions}`,
      `Deletions,${record.result.deletions}`,
      `Ref GC%,${record.refStats.gcContent}%`,
      `Sample GC%,${record.sampleStats.gcContent}%`,
      ``,
      `Mutation ID,Position,Type,Ref Base,Sample Base,Region,Classification,Details`
    ];

    record.result.mutations.forEach((m) => {
      lines.push(
        `"${m.id}",${m.position},"${m.type}","${m.refBase}","${m.sampleBase}","${m.region}","${m.classification}","${m.details.replace(/"/g, '""')}"`
      );
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `GenomeTrace_Report_${record.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Export Complete', `Report ${record.id} exported as CSV.`);
  };

  // Generate professional scientific PDF using jsPDF
  const handleExportPdf = (record: AnalysisRecord) => {
    try {
      const doc = new jsPDF();

      // Top branding banner
      doc.setFillColor(6, 14, 26);
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(56, 189, 248);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('GENOME TRACE', 15, 18);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Advanced DNA Sequence Analysis Platform — Every Mutation Tells a Story', 15, 26);

      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(`REPORT ID: ${record.id}`, 145, 18);
      doc.text(`DATE: ${record.timestamp}`, 145, 24);

      // Report Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(record.title, 15, 48);

      // Section 1: Executive Summary
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('1. EXECUTIVE SUMMARY & IDENTIFIERS', 15, 58);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Reference Sequence: ${record.referenceName}`, 15, 66);
      doc.text(`Sample Isolate: ${record.sampleName}`, 15, 72);
      doc.text(`Aligned Coordinate Length: ${record.result.totalPositions} bp`, 15, 78);
      doc.text(`Sequence Identity Homology: ${record.result.identityPercentage}%`, 15, 84);
      doc.text(`Total Detected Variations: ${record.result.mutations.length}`, 15, 90);

      // Section 2: Stoichiometry
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('2. GC STOICHIOMETRY & THERMAL STABILITY', 15, 102);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Reference GC Content: ${record.refStats.gcContent}% (AT: ${record.refStats.atContent}%)`, 15, 110);
      doc.text(`Sample GC Content: ${record.sampleStats.gcContent}% (AT: ${record.sampleStats.atContent}%)`, 15, 116);
      doc.text(`Estimated Melting Temp (Tm): ${record.refStats.tmEstimated}°C`, 15, 122);

      // Section 3: Mutation Breakdown Table
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('3. DETECTED VARIATIONS LEDGER', 15, 134);

      let yPos = 142;
      doc.setFillColor(241, 245, 249);
      doc.rect(15, yPos - 5, 180, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('ID', 18, yPos);
      doc.text('POS', 48, yPos);
      doc.text('TYPE', 65, yPos);
      doc.text('REF', 95, yPos);
      doc.text('SMP', 110, yPos);
      doc.text('CLASSIFICATION', 125, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      record.result.mutations.slice(0, 12).forEach((m) => {
        yPos += 8;
        doc.text(m.id, 18, yPos);
        doc.text(m.position.toString(), 48, yPos);
        doc.text(m.type, 65, yPos);
        doc.text(m.refBase, 95, yPos);
        doc.text(m.sampleBase, 110, yPos);
        doc.text(m.classification.substring(0, 32), 125, yPos);
      });

      if (record.result.mutations.length > 12) {
        yPos += 8;
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text(`... and ${record.result.mutations.length - 12} additional variations recorded.`, 18, yPos);
      }

      // Disclaimer footer
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('Notice: Research & educational bioinformatics use only. Not for clinical diagnosis or patient management.', 15, 280);

      doc.save(`GenomeTrace_${record.id}_Report.pdf`);
      addToast('success', 'PDF Generated', `Report ${record.id} exported successfully.`);
    } catch (err) {
      console.error(err);
      addToast('error', 'PDF Export Failed', 'Could not compile PDF document.');
    }
  };

  // Generate scientific PowerPoint Presentation using pptxgenjs
  const handleExportPpt = async (record: AnalysisRecord) => {
    try {
      const pres = new pptxgen();
      pres.layout = 'LAYOUT_WIDE'; // 16:9 widescreen presentation

      // Slide 1: Title Slide
      const slide1 = pres.addSlide();
      slide1.background = { color: '070C18' };

      slide1.addText('GENOME TRACE', {
        x: 1.0,
        y: 1.5,
        fontSize: 32,
        bold: true,
        color: '38BDF8',
        fontFace: 'Arial'
      });

      slide1.addText('DNA SEQUENCE ANALYSIS & MUTATION REPORT', {
        x: 1.0,
        y: 2.2,
        fontSize: 14,
        bold: true,
        color: '94A3B8',
        fontFace: 'Arial'
      });

      slide1.addText(record.title, {
        x: 1.0,
        y: 3.2,
        fontSize: 22,
        bold: true,
        color: 'FFFFFF',
        fontFace: 'Arial'
      });

      slide1.addText(`Report ID: ${record.id}   |   Date: ${record.timestamp}\nInvestigator: Dr. Yuvaraj — Computational Genomics Lab`, {
        x: 1.0,
        y: 4.5,
        fontSize: 11,
        color: 'CBD5E1',
        fontFace: 'Arial'
      });

      // Slide 2: Executive Summary & Stoichiometry
      const slide2 = pres.addSlide();
      slide2.background = { color: '0A1022' };

      slide2.addText('Executive Analysis Summary', {
        x: 0.8,
        y: 0.6,
        fontSize: 20,
        bold: true,
        color: '38BDF8'
      });

      // Metric boxes
      const metrics = [
        { title: 'Sequence Length', val: `${record.refStats.length} bp`, color: '0284C7' },
        { title: 'Sequence Identity', val: `${record.result.identityPercentage}%`, color: '10B981' },
        { title: 'Total Mutations', val: `${record.result.mutations.length}`, color: 'F59E0B' },
        { title: 'Reference GC%', val: `${record.refStats.gcContent}%`, color: '6366F1' }
      ];

      metrics.forEach((m, idx) => {
        const x = 0.8 + idx * 3.0;
        slide2.addShape(pres.ShapeType.rect, {
          x,
          y: 1.4,
          w: 2.7,
          h: 1.5,
          fill: { color: '131C35' },
          line: { color: m.color, width: 2 }
        });
        slide2.addText(m.title, { x, y: 1.6, w: 2.7, fontSize: 11, color: '94A3B8', align: 'center' });
        slide2.addText(m.val, { x, y: 2.1, w: 2.7, fontSize: 24, bold: true, color: 'FFFFFF', align: 'center' });
      });

      slide2.addText(
        [
          { text: `Reference Locus: ${record.referenceName}\n`, options: { bold: true, color: 'FFFFFF' } },
          { text: `Sample Isolate: ${record.sampleName}\n`, options: { bold: true, color: 'FFFFFF' } },
          { text: `Mutation Profile: ${record.result.substitutions} Substitutions, ${record.result.insertions} Insertions, ${record.result.deletions} Deletions\n`, options: { color: 'CBD5E1' } },
          { text: `Thermodynamic Estimate (Tm): ${record.refStats.tmEstimated}°C\n`, options: { color: 'CBD5E1' } },
          { text: `Compliance: Research and educational genomics use only. No clinical diagnoses provided.\n`, options: { italic: true, color: '94A3B8' } }
        ],
        { x: 0.8, y: 3.4, w: 11.5, h: 2.8, fontSize: 13 }
      );

      // Slide 3: Mutation Ledger Table
      const slide3 = pres.addSlide();
      slide3.background = { color: '0A1022' };

      slide3.addText('Detected Variations Ledger', {
        x: 0.8,
        y: 0.6,
        fontSize: 20,
        bold: true,
        color: '38BDF8'
      });

      const tableRows: any[] = [
        [
          { text: 'Mutation ID', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          { text: 'Position', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          { text: 'Type', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          { text: 'Ref Base', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          { text: 'Sample Base', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          { text: 'Classification', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } }
        ]
      ];

      record.result.mutations.slice(0, 8).forEach((m) => {
        tableRows.push([
          { text: m.id, options: { color: '38BDF8' } },
          { text: `bp ${m.position}`, options: { color: 'FFFFFF' } },
          { text: m.type.toUpperCase(), options: { color: m.type === 'substitution' ? 'F59E0B' : m.type === 'insertion' ? '10B981' : 'F43F5E' } },
          { text: m.refBase, options: { color: 'CBD5E1' } },
          { text: m.sampleBase, options: { color: '38BDF8' } },
          { text: m.classification, options: { color: '94A3B8' } }
        ]);
      });

      slide3.addTable(tableRows, {
        x: 0.8,
        y: 1.4,
        w: 11.5,
        fontSize: 11,
        fill: { color: '131C35' },
        border: { color: '334155', pt: 1 }
      });

      await pres.writeFile({ fileName: `GenomeTrace_${record.id}_Presentation.pptx` });
      addToast('success', 'Presentation Exported', `Generated PPTX presentation for ${record.id}`);
    } catch (err: any) {
      console.error('PPT export error:', err);
      addToast('error', 'PPTX Generation Failed', err?.message || 'Could not export PPTX presentation.');
    }
  };

  const filteredHistory = history.filter((item) => {
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.referenceName.toLowerCase().includes(q) ||
        item.sampleName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Analysis Reports
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Audit Registry
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Search, preview and export verified bioinformatics reports in PDF, PowerPoint (PPTX) and CSV format.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {selectedReport && (
            <>
              <button
                onClick={() => handleExportPdf(selectedReport)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                title="Download verified laboratory report in PDF format"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (PDF)</span>
              </button>

              <button
                onClick={() => handleExportPpt(selectedReport)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                title="Download scientific presentation deck in PowerPoint (PPTX) format"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Download Presentation (PPTX)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search report ID, title, sequence..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hidden sm:inline">Timeframe:</span>
          {(['all', 'today', 'week', 'month'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                dateFilter === d
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN REPORTS TABLE */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Project / Title</th>
                <th className="py-3 px-4">Reference Sequence</th>
                <th className="py-3 px-4">Sample Sequence</th>
                <th className="py-3 px-4">Analysis Date</th>
                <th className="py-3 px-4">Mutation Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredHistory.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400 whitespace-nowrap">
                    {rec.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white max-w-[180px] truncate">
                    {rec.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 max-w-[130px] truncate">
                    {rec.referenceName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 max-w-[130px] truncate">
                    {rec.sampleName}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {rec.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {rec.result.mutations.length}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedReport(rec);
                          setPreviewOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px] font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleExportCsv(rec)}
                        title="Download CSV"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExportPpt(rec)}
                        title="Download PowerPoint Presentation (PPTX)"
                        className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
                      >
                        <Presentation className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExportPdf(rec)}
                        title="Download PDF"
                        className="p-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT DETAILS PREVIEW DRAWER / MODAL */}
      {previewOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    {selectedReport.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>{selectedReport.id}</span>
                    <span>•</span>
                    <span>{selectedReport.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCsv(selectedReport)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  title="Export tabular comma-separated data"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExportPpt(selectedReport)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-600/25 cursor-pointer"
                  title="Export slide presentation deck"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Export PPTX</span>
                </button>
                <button
                  onClick={() => handleExportPdf(selectedReport)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer"
                  title="Export publication-ready PDF audit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Project & Sequence Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Sequence Identity
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {selectedReport.result.identityPercentage}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {selectedReport.result.matches} of {selectedReport.result.totalPositions} bp match
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Mutation Tally
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    {selectedReport.result.mutations.length} Variants
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {selectedReport.result.substitutions} Sub · {selectedReport.result.insertions} Ins · {selectedReport.result.deletions} Del
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    GC Stoichiometry
                  </span>
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {selectedReport.refStats.gcContent}% / {selectedReport.sampleStats.gcContent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Ref vs Sample
                  </span>
                </div>
              </div>

              {/* Mutations Position List */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Mutation Positions & Changes
                </h4>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2 space-y-1.5">
                  {selectedReport.result.mutations.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{m.id}</span>
                        <span className="text-slate-400">bp {m.position}</span>
                        <span className="font-semibold text-slate-200">
                          {m.refBase} → {m.sampleBase}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {m.classification}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sequence Snippet */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Alignment Preview (First 80bp)
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 overflow-x-auto font-mono-sequence">
                  <div className="text-cyan-400 flex gap-2">
                    <span className="w-12 text-slate-500 select-none">REF:</span>
                    <span>{selectedReport.result.alignedRef.substring(0, 80)}</span>
                  </div>
                  <div className="text-teal-400 flex gap-2">
                    <span className="w-12 text-slate-500 select-none">SMP:</span>
                    <span>{selectedReport.result.alignedSample.substring(0, 80)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 flex justify-end bg-slate-950/60">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

