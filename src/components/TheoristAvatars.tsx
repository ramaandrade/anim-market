import React from 'react';
import { TheoristSpeech, TheoristId } from '../types/market';
import { THEORISTS } from '../data/theorists';
import { Bot, Brain, Anchor, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface TheoristAvatarsProps {
  currentQuotes: Record<string, TheoristSpeech>;
  selectedTheoristId: TheoristId | null;
  onSelectTheorist: (id: TheoristId) => void;
  onOpenLab: () => void;
}

export const TheoristAvatars: React.FC<TheoristAvatarsProps> = ({
  currentQuotes,
  selectedTheoristId,
  onSelectTheorist,
  onOpenLab
}) => {
  const theoristsList: TheoristId[] = ['capm_bot', 'dr_psyche', 'captain_minsky'];

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 p-3 sm:p-4 backdrop-blur-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Conselho dos Teóricos em Tempo Real
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              Debate Ativo
            </span>
          </div>

          <button
            onClick={onOpenLab}
            className="text-xs flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            title="Abrir Laboratório de Fórmulas e Teorias"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laboratório Teórico</span>
            <span className="sm:hidden">Teorias</span>
          </button>
        </div>

        {/* The 3 Theorists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
          {theoristsList.map((id) => {
            const config = THEORISTS[id];
            const speech = currentQuotes[id];
            const isSelected = selectedTheoristId === id;

            // Mood-based badges and visual cues
            let moodBadge = null;
            if (speech?.mood === 'warning') {
              moodBadge = (
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-950/70 border border-amber-800/80 px-1.5 py-0.5 rounded">
                  <AlertTriangle className="w-2.5 h-2.5" /> Alerta
                </span>
              );
            } else if (speech?.mood === 'shocked') {
              moodBadge = (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/70 border border-red-800/80 px-1.5 py-0.5 rounded animate-pulse">
                  <AlertTriangle className="w-2.5 h-2.5" /> Crise!
                </span>
              );
            } else if (speech?.mood === 'proud' || speech?.mood === 'happy') {
              moodBadge = (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-2.5 h-2.5" /> Seguro
                </span>
              );
            }

            return (
              <div
                key={id}
                onClick={() => onSelectTheorist(id)}
                className={`relative flex flex-col justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-offset-slate-950 shadow-lg'
                    : 'hover:border-slate-600 bg-slate-950/60'
                }`}
                style={{
                  borderColor: isSelected ? config.color : 'rgba(51, 65, 85, 0.6)',
                  backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.9)' : undefined,
                  boxShadow: isSelected ? `0 0 20px ${config.accentBg}` : undefined
                }}
              >
                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3">
                  {/* Avatar Icon */}
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: config.accentBg,
                      borderColor: config.color,
                      color: config.color
                    }}
                  >
                    {id === 'capm_bot' && (
                      <div className="relative">
                        <Bot className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                    )}
                    {id === 'dr_psyche' && (
                      <div className="relative">
                        <Brain className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400" />
                      </div>
                    )}
                    {id === 'captain_minsky' && (
                      <div className="relative">
                        <Anchor className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      </div>
                    )}
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {config.name}
                      </h4>
                      {moodBadge}
                    </div>
                    <p className="text-[11px] font-medium" style={{ color: config.color }}>
                      {config.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {config.school}
                    </p>
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="mt-2 text-[11px] sm:text-xs text-slate-200 line-clamp-3 bg-slate-900/90 rounded-lg p-2 border border-slate-800/80 italic relative">
                  <span className="text-slate-400">"{speech?.message || 'Observando os fluxos...'}"</span>
                </div>

                {/* Bottom hint */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                  <span className="truncate text-slate-400">
                    {speech?.relevantConcept || config.keyConcepts[0]}
                  </span>
                  <span className="text-indigo-400 font-medium hover:underline shrink-0 ml-1">
                    Ver parecer &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
