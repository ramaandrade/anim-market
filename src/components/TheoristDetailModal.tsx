import React from 'react';
import { TheoristId, TheoristSpeech, MinskyRegime } from '../types/market';
import { THEORISTS } from '../data/theorists';
import { X, Bot, Brain, Anchor, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';

interface TheoristDetailModalProps {
  theoristId: TheoristId | null;
  onClose: () => void;
  currentSpeech?: TheoristSpeech;
  regime: MinskyRegime;
}

export const TheoristDetailModal: React.FC<TheoristDetailModalProps> = ({
  theoristId,
  onClose,
  currentSpeech,
  regime
}) => {
  if (!theoristId) return null;
  const theorist = THEORISTS[theoristId];
  if (!theorist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ borderColor: theorist.color }}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800"
          style={{ backgroundColor: theorist.accentBg }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: theorist.color, color: theorist.color }}
            >
              {theoristId === 'capm_bot' && <Bot className="w-7 h-7" />}
              {theoristId === 'dr_psyche' && <Brain className="w-7 h-7" />}
              {theoristId === 'captain_minsky' && <Anchor className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {theorist.name}
              </h3>
              <p className="text-xs font-semibold" style={{ color: theorist.color }}>
                {theorist.title} • {theorist.school}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
          {/* Active Advice Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
              <AlertCircle className="w-4 h-4" style={{ color: theorist.color }} />
              Parecer Tático para o Ciclo Atual ({regime})
            </div>
            <p className="text-slate-100 font-medium text-sm leading-relaxed italic">
              "{currentSpeech?.message}"
            </p>
            {currentSpeech?.detailedTip && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentSpeech.detailedTip}</span>
              </div>
            )}
          </div>

          {/* Philosophy / Theoretical Foundation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Premissa Teórica Fundamental
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {theorist.philosophy}
            </p>
          </div>

          {/* Key Concepts List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Conceitos & Ferramentas desta Escola
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {theorist.keyConcepts.map((concept, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/70 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theorist.color }} />
                  {concept}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Entendido, voltar ao jogo
          </button>
        </div>
      </div>
    </div>
  );
};
