import React from 'react';
import { useGenome } from '../../context/GenomeContext';

export const AmbientGlow: React.FC = () => {
  const { currentAnalysis } = useGenome();
  const mutations = currentAnalysis?.result?.mutations || [];
  const subs = currentAnalysis?.result?.substitutions || 0;
  const ins = currentAnalysis?.result?.insertions || 0;
  const dels = currentAnalysis?.result?.deletions || 0;
  const total = subs + ins + dels;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background Subtle Dot Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Primary Ambient Gradient Orbs Reacting to Mutations */}
      {/* Orb 1: Substitution Reactive (Warm Amber) */}
      <div
        className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full blur-[140px] transition-all duration-1000 ease-out"
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-1)',
          transform: `translate(${subs * 2}px, ${subs * 3}px) scale(${1 + Math.min(subs * 0.05, 0.4)})`
        }}
      />

      {/* Orb 2: Insertion Reactive (Emerald) */}
      <div
        className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full blur-[130px] transition-all duration-1000 ease-out"
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-2)',
          transform: `scale(${1 + Math.min(ins * 0.08, 0.35)})`
        }}
      />

      {/* Orb 3: Deletion Reactive (Rose) */}
      <div
        className="absolute -bottom-[15%] left-[30%] w-[700px] h-[700px] rounded-full blur-[160px] transition-all duration-1000 ease-out"
        style={{
          backgroundColor: 'var(--dynamic-ambient-glow-3)',
          transform: `scale(${1 + Math.min(dels * 0.08, 0.35)})`
        }}
      />

      {/* Subtle Top Edge Highlight Bar */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </div>
  );
};
