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
          {/* Electric Purple Ambient Glow Top Right */}
          <div className="absolute -top-24 right-1/4 w-[550px] h-[450px] rounded-full bg-gradient-to-br from-purple-400/20 via-violet-300/15 to-transparent blur-[120px]" />
          {/* Soft Sky Blue Aurora Top Left */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-300/20 to-transparent blur-[120px]" />
          {/* Soft Amber Glow Right */}
          <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-amber-300/25 via-orange-200/20 to-transparent blur-[110px]" />
          {/* Soft Emerald Bio Tint Bottom Left */}
          <div className="absolute bottom-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-300/25 via-teal-200/20 to-transparent blur-[120px]" />
          {/* Soft Indigo / Electric Violet Aura Bottom */}
          <div className="absolute -bottom-20 right-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-tl from-purple-400/20 via-indigo-300/15 to-transparent blur-[130px]" />
        </>
      )}

      {/* Floating Bioluminescent Particle Nodes */}
      <div className="absolute top-[18%] left-[12%] w-3 h-3 rounded-full bg-cyan-400/30 blur-[1px] animate-float-1" />
      <div className="absolute top-[42%] left-[8%] w-4 h-4 rounded-full bg-purple-500/25 blur-[2px] animate-float-2" />
      <div className="absolute top-[28%] right-[15%] w-2.5 h-2.5 rounded-full bg-amber-400/35 blur-[1px] animate-float-3" />
      <div className="absolute top-[65%] right-[22%] w-3.5 h-3.5 rounded-full bg-emerald-400/30 blur-[1px] animate-float-1" />
      <div className="absolute bottom-[20%] left-[25%] w-2 h-2 rounded-full bg-rose-400/30 blur-[1px] animate-float-2" />
      <div className="absolute top-[80%] right-[12%] w-4 h-4 rounded-full bg-violet-400/25 blur-[2px] animate-float-3" />

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
