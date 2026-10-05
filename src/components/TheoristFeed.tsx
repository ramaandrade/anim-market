import React from 'react';
import { TheoristSpeech, TheoristId } from '../types/market';
import { THEORISTS } from '../data/theorists';
import { Bot, Brain, Anchor, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

interface TheoristFeedProps {
  currentQuotes: Record<string, TheoristSpeech>;
  onSelectTheorist: (id: TheoristId) => void;
  onOpenLab: () => void;
}

export const TheoristFeed: React.FC<TheoristFeedProps> = ({
  currentQuotes,
  onSelectTheorist,
  onOpenLab
}) => {
  const theoristsList: TheoristId[] = ['capm_bot', 'dr_psyche', 'captain_minsky'];

  return (
    <div className="w-full space-y-3.5 pb-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Conselho dos 3 Teóricos
          </h2>
          <p className="text-[11px] text-slate-400">
            Três visões conflitantes sobre risco, psicologia e liquidez.
          </p>
        </div>

        <button
          onClick={onOpenLab}
          className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Fórmulas</span>
        </button>
      </div>

      {/* The 3 Theorists Feed Cards */}
      <div className="space-y-3">
        {theoristsList.map((id) => {
          const config = THEORISTS[id];
          const speech = currentQuotes[id];

          return (
            <div
              key={id}
              onClick={() => onSelectTheorist(id)}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-3.5 space-y-2.5 transition-all cursor-pointer shadow-md active:scale-98"
              style={{
                borderLeftColor: config.color,
                borderLeftWidth: '4px'
              }}
            >
              {/* Theorist Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: config.accentBg,
                      borderColor: config.color,
                      color: config.color
                    }}
                  >
                    {id === 'capm_bot' && <Bot className="w-6 h-6" />}
                    {id === 'dr_psyche' && <Brain className="w-6 h-6" />}
                    {id === 'captain_minsky' && <Anchor className="w-6 h-6" />}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {config.name}
                    </h3>
                    <p className="text-[10px] font-semibold" style={{ color: config.color }}>
                      {config.title} • {config.school}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold">
                  <span>Ver tese</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Dialogue Speech Bubble */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed italic">
                "{speech?.message}"
              </div>

              {/* Concept Tag */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                <span className="truncate max-w-[220px]">
                  📌 {speech?.relevantConcept || config.keyConcepts[0]}
                </span>
                <span className="text-slate-500 font-mono">
                  {speech?.mood?.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
