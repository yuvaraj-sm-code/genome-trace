# GENOME TRACE — Advanced DNA Sequence Analysis Platform

> **"Every Mutation Tells a Story."**

Genome Trace is a bioinformatics web platform designed for biotechnology researchers, computational biologists, and genomics students. It provides pairwise DNA sequence alignment, single nucleotide variant (SNV) detection, indel identification, stoichiometric nucleotide profiling, and dynamic mutational ambiance visualization.

---

## 🔬 Core Features & Modules

### 1. **Genome Overview (Dashboard)**
- **Executive Metric Cards**: Total Analyses (1,482+), Sequences Processed (3,840+), Mutations Detected (24,918+), and Average GC Content (51.8%) with monthly trend velocity.
- **Mutation Distribution Donut Chart**: Interactive SVG donut chart visualizing the exact proportions of Substitutions, Insertions, and Deletions with hover breakdowns.
- **Analysis Activity Line Chart**: High-resolution timeline displaying weekly comparison throughput and batch velocity.
- **Recent Projects**: Quick-load cards for benchmark genomes (Human HBB HbS, BRCA1 Exon 11, SARS-CoV-2 RBD, CRISPR Cas9 Edit).
- **Recent Analysis Ledger**: Filterable audit table with direct "View Details" action.

### 2. **DNA Sequence Analyzer (Core Engine)**
- **Two-Panel Input Workspace**: Side-by-side **Reference DNA** and **Sample DNA** sequence editors.
- **FASTA Drag-and-Drop Uploader**: Direct file reading supporting `.fasta`, `.fa`, `.fna`, `.txt`, and `.seq`.
- **Real-Time IUPAC Validation**: Instant detection and tagging of non-canonical nucleotide characters (A, T, G, C, N).
- **Live Stoichiometric Base Counter**: Dynamic tally of Adenine, Thymine, Guanine, and Cytosine.
- **Benchmark Presets**: One-click loading of clinically and academically validated loci.
- **Prominent "ANALYZE DNA" CTA**: Interactive alignment execution with pulse effects and compute states.

### 3. **Structured Sequence Comparison**
- **Dynamic Pairwise Alignment Matrix**: Needleman-Wunsch dynamic programming with affine gap penalties.
- **Three-Row Homology Visualizer**:
  - Row 1: Reference sequence (5' → 3') with nucleotide coordinates.
  - Row 2: Homology connector track showing match indicators (`|`), substitutions (`•`), insertions (`+`), and deletions (`×`).
  - Row 3: Sample variant sequence (5' → 3').
- **Visual Mutation Highlighting**:
  - 🟧 **Substitutions**: Amber badge with transition/transversion mapping.
  - 🟩 **Insertions**: Emerald badge with coordinate gap tracking.
  - 🟥 **Deletions**: Rose badge with gap hyphenation.
  - 🟦 **Homologous Matches**: Cyan background.
- **View Switchers**:
  - *Aligned View*: Complete 50-bp visual block layout.
  - *Side-by-Side*: Dual coordinate tracking.
  - *Differences Only*: Focused mutational cluster view.
- **Multi-Level Zoom**: Compact (80bp), Normal (50bp), and Detailed (30bp) inspection.

### 4. **Mutation Explorer**
- **Top Variation Statistics**: Substitutions, InDels, and total variant counts.
- **Comprehensive Mutation Table**: Searchable, sortable, and filterable by mutation type (All, Substitution, Insertion, Deletion) with pagination.
- **Mutation Details Inspector**:
  - Exact 1-based alignment coordinate.
  - Transition (Purine ↔ Purine) vs Transversion (Purine ↔ Pyrimidine) biochemical classification.
  - Codon triplet reading frame context and amino acid translation.
  - **Visual Transition Diagram**: Animated structural representation of original vs variant nucleotide.
  - **Flanking Context Window**: ±6bp surrounding sequence window.

### 5. **Sequence Statistics**
- **Stoichiometric Breakdown**: Base counts, strand lengths, and AT:GC ratios.
- **Circular GC Content Gauge**: Radial SVG meter calculating GC enthalpy and melting temperature ($T_m$).
- **Nucleotide Composition Donut Charts**: Proportional distribution comparison between reference and sample.
- **Comparative Statistics Matrix**: Reference vs Sample comparison of length, GC%, sequence identity, and molecular mass ($kDa$).

### 6. **Reports & Exports**
- **Audit Registry**: Filter by timeframe, search by locus or project.
- **Interactive Report Preview**: Clean presentation of sequence homology and mutation tally.
- **Export Options**:
  - **PDF Export**: Generates formatted scientific reports via `jsPDF`.
  - **CSV Export**: Exports variation ledgers for downstream Python/R workflows.

### 7. **Analysis History**
- **Chronological Timeline**: Session log of previously run sequence alignments.
- **One-Click Reopen**: Reloads any previous analysis directly into the Analyzer and Comparison views.
- **Filter by Mutation Range**: Filter by 0 variations, 1–5 variations, or &gt;5 variations.

### 8. **Settings & Design System**
- **Dynamic Theme Palette Studio**:
  - *Cyan Biotech* (Default)
  - *Emerald Genomics*
  - *Biotech Indigo*
  - *Ultraviolet Lab*
  - *Precision Monochrome*
- **Custom CSS Variables**: Live hex color pickers for primary accent, substitution, insertion, and deletion tints.
- **Dynamic Reactive Ambiance**: Background glow automatically shifts hue and intensity based on the ratio of substitutions, insertions, and deletions detected in the active sequence!

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript
- **Build System**: Vite 8, Rolldown engine
- **Styling**: Tailwind CSS v4, Custom CSS Variables
- **Icons**: Lucide React
- **Document Export**: jsPDF

---

## 🚀 Getting Started

To launch the development server:

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

To create a production build:

```bash
pnpm build
```

---

*Notice: Genome Trace is intended for molecular biology research, computational bioinformatics, and educational sequence exploration. This platform does not provide diagnostic clinical genetic evaluations.*
