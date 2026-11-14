import React from 'react';
import { useGenome } from '../../context/GenomeContext';

export const AmbientGlow: React.FC = () => {
  const { currentAnalysis, themeMode } = useGenome();
  const mutations = currentAnalysis?.result?.mutations || [];
  const subs = currentAnalysis?.result?.substitutions || 0;
  const ins = currentAnalysis?.result?.insertions || 0;
  const dels = currentAnalysis?.result?.deletions || 0;

  const isLight = themeMode === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background Subtle Dot Grid */}
      <div className={`absolute inset-0 bg-grid-pattern ${isLight ? 'opacity-30' : 'opacity-40'}`} />

      {/* Colorful Light-Mode Gradient Mesh */}
      {isLight && (
        <>
          {/* Soft Sky Blue Aurora Top */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-300/20 to-transparent blur-[120px]" />
          {/* Soft Amber Glow Right */}
          <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-amber-300/25 via-orange-200/20 to-transparent blur-[110px]" />
          {/* Soft Emerald Bio Tint Bottom Left */}
          <div className="absolute bottom-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-300/25 via-teal-200/20 to-transparent blur-[120px]" />
          {/* Soft Indigo / Violet Aura Bottom */}
          <div className="absolute -bottom-20 right-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-tl from-indigo-300/20 via-purple-200/15 to-transparent blur-[130px]" />
        </>
      )}

      {/* Primary Ambient Gradient Orbs Reacting to Mutations */}
      {/* Orb 1: Substitution Reactive (Warm Amber) */}
      <div
        className={`absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full transition-all duration-1000 ease-out ${
          isLight ? 'blur-[160px]' : 'blur-[140px]'
        }`}
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-1)',
          transform: `translate(${subs * 2}px, ${subs * 3}px) scale(${1 + Math.min(subs * 0.05, 0.4)})`
        }}
      />

      {/* Orb 2: Insertion Reactive (Emerald) */}
      <div
        className={`absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full transition-all duration-1000 ease-out ${
          isLight ? 'blur-[150px]' : 'blur-[130px]'
        }`}
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-2)',
          transform: `scale(${1 + Math.min(ins * 0.08, 0.35)})`
        }}
      />

      {/* Orb 3: Deletion Reactive (Rose) */}
      <div
        className={`absolute -bottom-[15%] left-[30%] w-[700px] h-[700px] rounded-full transition-all duration-1000 ease-out ${
          isLight ? 'blur-[170px]' : 'blur-[160px]'
        }`}
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-3)',
          transform: `scale(${1 + Math.min(dels * 0.08, 0.35)})`
        }}
      />

      {/* Subtle Top Edge Highlight Bar */}
      <div className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
        isLight ? 'via-cyan-500/50' : 'via-cyan-500/20'
      } to-transparent`} />
    </div>
  );
};
