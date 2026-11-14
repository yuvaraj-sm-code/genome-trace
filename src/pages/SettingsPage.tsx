import React, { useState } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Palette,
  Sliders,
  Bell,
  HardDrive,
  LogOut,
  RefreshCw,
  Sparkles,
  Check,
  Moon,
  Sun,
  Eye,
  Database,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useGenome, PRESET_THEMES, CustomThemePalette } from '../context/GenomeContext';

export const SettingsPage: React.FC = () => {
  const {
    currentTheme,
    setThemeById,
    updateThemeColors,
    themeMode,
    setThemeMode,
    addToast,
    clearInputs,
    loadDemo
  } = useGenome();

  // Profile state
  const [researcherName, setResearcherName] = useState('Dr. Yuvaraj');
  const [labAffiliation, setLabAffiliation] = useState('Computational Genomics & Epigenetics Laboratory');
  const [emailAddress, setEmailAddress] = useState('yuvaraj@genometrace.bio');

  // Display preferences
  const [showCodonGrid, setShowCodonGrid] = useState(true);
  const [enableAmbientGlow, setEnableAmbientGlow] = useState(true);
  const [highContrastText, setHighContrastText] = useState(false);

  // Notifications
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [notifyOnMismatch, setNotifyOnMismatch] = useState(true);

  // Custom theme color pickers state
  const [customPrimary, setCustomPrimary] = useState(currentTheme.primary);
  const [customSub, setCustomSub] = useState(currentTheme.mutationSub);
  const [customIns, setCustomIns] = useState(currentTheme.mutationIns);
  const [customDel, setCustomDel] = useState(currentTheme.mutationDel);

  const handleApplyCustomColors = () => {
    updateThemeColors({
      primary: customPrimary,
      mutationSub: customSub,
      mutationIns: customIns,
      mutationDel: customDel
    });
  };

  const handleResetDefaults = () => {
    setThemeById('cyan-biotech');
    setCustomPrimary(PRESET_THEMES[0].primary);
    setCustomSub(PRESET_THEMES[0].mutationSub);
    setCustomIns(PRESET_THEMES[0].mutationIns);
    setCustomDel(PRESET_THEMES[0].mutationDel);
    addToast('info', 'Theme Reset', 'Reset to default Cyan Biotech palette.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile Updated', 'Researcher credentials and affiliation saved.');
  };

  const handleDataPurge = () => {
    if (window.confirm('Clear all session sequences and reset back to benchmark datasets?')) {
      loadDemo('hbb-sickle-cell');
      addToast('info', 'Session Re-initialized', 'Fresh benchmark datasets loaded.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Settings & Design System
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Laboratory Config
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Customize user credentials, display parameters, and biological palette theme variables.
          </p>
        </div>
      </div>

      {/* SECTION 1: THEME CUSTOMIZATION & DYNAMIC PALETTE STUDIO */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Theme Variables & Color Palette Studio
              </h3>
              <p className="text-xs text-slate-400">
                Preset themes with fully customizable theme variables. Note: Final palette will be chosen separately.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Preset Themes Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2.5">
            Select Scientific Preset Palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRESET_THEMES.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    setThemeById(theme.id);
                    setCustomPrimary(theme.primary);
                    setCustomSub(theme.mutationSub);
                    setCustomIns(theme.mutationIns);
                    setCustomDel(theme.mutationDel);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-slate-950 shadow-md shadow-cyan-500/15'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {theme.name}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>

                  {/* Swatches preview */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.primary }} title="Primary" />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.mutationSub }} title="Substitutions" />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.mutationIns }} title="Insertions" />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.mutationDel }} title="Deletions" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live CSS Variable Color Customizers */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Fine-tune Custom Theme Variables (CSS Hex Values)
            </span>
            <button
              onClick={handleApplyCustomColors}
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
            >
              Apply Color Overrides
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Primary Brand Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 font-mono text-slate-300 w-24 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Substitution Tint (Amber)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSub}
                  onChange={(e) => setCustomSub(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customSub}
                  onChange={(e) => setCustomSub(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 font-mono text-slate-300 w-24 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Insertion Tint (Green)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customIns}
                  onChange={(e) => setCustomIns(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customIns}
                  onChange={(e) => setCustomIns(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 font-mono text-slate-300 w-24 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Deletion Tint (Rose)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customDel}
                  onChange={(e) => setCustomDel(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customDel}
                  onChange={(e) => setCustomDel(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 font-mono text-slate-300 w-24 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: USER PROFILE & ACCOUNT */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Researcher Profile & Laboratory Account
              </h3>
              <p className="text-xs text-slate-400">
                Principal investigator credentials displayed on exported audit reports.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 font-medium">Researcher Full Name</label>
            <input
              type="text"
              value={researcherName}
              onChange={(e) => setResearcherName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-300 block mb-1 font-medium">Laboratory / Academic Affiliation</label>
            <input
              type="text"
              value={labAffiliation}
              onChange={(e) => setLabAffiliation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: DISPLAY & NOTIFICATION PREFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Preferences */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Display Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Color Mode Switcher */}
            <div>
              <span className="font-semibold text-slate-200 block mb-2">Display Theme Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    themeMode === 'dark'
                      ? 'border-cyan-500 bg-slate-950 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-xs">Dark Mode</div>
                    <div className="text-[10px] text-slate-500">Deep Lab Slate</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    themeMode === 'light'
                      ? 'border-cyan-500 bg-white text-slate-900 shadow-md'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-bold text-xs">Light Mode</div>
                    <div className="text-[10px] text-slate-500">Clinical White Lab</div>
                  </div>
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">Show Codon Reading Frame</div>
                <div className="text-[11px] text-slate-500">Display triplet groupings in detailed zoom</div>
              </div>
              <input
                type="checkbox"
                checked={showCodonGrid}
                onChange={(e) => setShowCodonGrid(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">Dynamic Mutation Ambiance</div>
                <div className="text-[11px] text-slate-500">Background glows tint to active mutation profile</div>
              </div>
              <input
                type="checkbox"
                checked={enableAmbientGlow}
                onChange={(e) => setEnableAmbientGlow(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Bell className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              System Notifications
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">Alignment Completion Alerts</div>
                <div className="text-[11px] text-slate-500">Toast notification when DP matrix finishes</div>
              </div>
              <input
                type="checkbox"
                checked={notifyOnComplete}
                onChange={(e) => setNotifyOnComplete(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">Invalid Character Warnings</div>
                <div className="text-[11px] text-slate-500">Alert on non-canonical characters in FASTA</div>
              </div>
              <input
                type="checkbox"
                checked={notifyOnMismatch}
                onChange={(e) => setNotifyOnMismatch(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 4: DATA MANAGEMENT & LOGOUT */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Data Management & Cache</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset test sequences or purge browser session cache without affecting system files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDataPurge}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Re-seed Benchmark Data
          </button>
          <button
            onClick={() => addToast('info', 'Session Logout', 'Signed out of Genome Trace workstation.')}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

