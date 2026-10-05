import React from 'react';
import { AnomalyEvent } from '../types/market';
import { Calendar, Bot, Brain, Anchor, ArrowRight, Zap } from 'lucide-react';

interface AnomalyCardModalProps {
  anomaly: AnomalyEvent | null;
  onDismiss: () => void;
}

export const AnomalyCardModal: React.FC<AnomalyCardModalProps> = ({
  anomaly,
  onDismiss
}) => {
  if (!anomaly) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-indigo-500/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-4 sm:p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
            <Calendar className="w-4 h-4" />
            Carta de Evento: Anomalia Empírica de Mercado
          </div>
          <h2 className="text-base sm:text-xl font-black text-white leading-tight">
            {anomaly.title}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Mês {anomaly.month} • Choque de Paradigma Financeiro
          </p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Anomaly Description */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed text-slate-200">
            {anomaly.description}
          </div>

          {/* Impact Banner */}
          <div className="bg-indigo-950/70 border border-indigo-800 p-3 rounded-xl flex items-start gap-2.5 text-xs text-indigo-200">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Impacto Observado nas Cotações:</span>
              <p className="mt-0.5">{anomaly.impactSummary}</p>
            </div>
          </div>

          {/* Clash of Theorists (Choque de Visões) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              O Choque dos Três Teóricos:
            </h4>

            {/* Robo CAPM */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-sky-900/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-600 text-sky-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-sky-300">Robô CAPM (HME):</span>
                <p className="text-slate-300 italic mt-0.5">"{anomaly.capmPerspective}"</p>
              </div>
            </div>

            {/* Dr. Psique */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-pink-900/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-950 border border-pink-600 text-pink-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-pink-300">Dr. Psique (Comportamental):</span>
                <p className="text-slate-300 italic mt-0.5">"{anomaly.behavioralPerspective}"</p>
              </div>
            </div>

            {/* Capitão Minsky */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-amber-900/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-600 text-amber-400 flex items-center justify-center shrink-0">
                <Anchor className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-300">Capitão Minsky (Pós-Keynesiano):</span>
                <p className="text-slate-300 italic mt-0.5">"{anomaly.minskyPerspective}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Compreendido, Continuar Operando</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
