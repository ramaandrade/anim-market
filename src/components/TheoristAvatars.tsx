import React from 'react';
import { TheoristSpeech, TheoristId } from '../types/market';
import { THEORISTS } from '../data/theorists';
import { Bot, Brain, Anchor } from 'lucide-react';

interface TheoristAvatarsProps {
  currentQuotes: Record<string, TheoristSpeech>;
  selectedTheoristId: TheoristId | null;
  onSelectTheorist: (id: TheoristId) => void;
  onOpenLab: () => void;
}

export const TheoristAvatars: React.FC<TheoristAvatarsProps> = ({
  currentQuotes,
  selectedTheoristId,
  onSelectTheorist
}) => {
  const theoristsList: TheoristId[] = ['capm_bot', 'dr_psyche', 'captain_minsky'];

  return (
    <div className="w-full py-1">
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {theoristsList.map((id) => {
          const config = THEORISTS[id];
          const speech = currentQuotes[id];
          const isSelected = selectedTheoristId === id;

          return (
            <button
              key={id}
              onClick={() => onSelectTheorist(id)}
              className={`w-full p-2 rounded-xl border transition-all text-left flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 ring-1 ring-offset-1 ring-offset-slate-950 shadow-md'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
              style={{
                borderColor: isSelected ? config.color : undefined
              }}
            >
              {/* Mini Icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: config.accentBg,
                  borderColor: config.color,
                  color: config.color
                }}
              >
                {id === 'capm_bot' && <Bot className="w-4 h-4" />}
                {id === 'dr_psyche' && <Brain className="w-4 h-4" />}
                {id === 'captain_minsky' && <Anchor className="w-4 h-4" />}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate leading-tight">
                  {config.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-slate-400 truncate capitalize leading-tight">
                  {speech?.mood || 'observando'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
