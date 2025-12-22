import React from 'react';
import { ToolMetadata } from '../types';

interface ToolCardProps {
  tool: ToolMetadata;
  isActive: boolean;
  onClick: () => void;
  iconColor: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isActive, onClick, iconColor }) => {
  return (
    <button
      onClick={onClick}
      style={{ '--theme-color': iconColor } as React.CSSProperties}
      className="group relative flex flex-col items-center p-8 rounded-[2rem] transition-all duration-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-[var(--theme-color)] hover:shadow-2xl hover:shadow-[var(--theme-color)]/20 hover:-translate-y-2 text-right"
    >
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 group-hover:bg-[var(--theme-color)] rounded-2xl mb-6 flex items-center justify-center text-[var(--theme-color)] group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-[var(--theme-color)]/30">
        {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 32 })}
      </div>
      <h3 className="font-black text-lg mb-3 text-slate-800 dark:text-white group-hover:text-[var(--theme-color)] transition-colors">
        {tool.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-center">
        {tool.description}
      </p>
      
      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-[var(--theme-color)] font-bold text-xs">
        <span>ابدأ الآن</span>
        <div className="w-5 h-5 bg-opacity-10 bg-[var(--theme-color)] rounded-full flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m15 18-6-6 6-6"/></svg>
        </div>
      </div>
    </button>
  );
};