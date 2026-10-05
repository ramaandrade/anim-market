import React from 'react';
import { GameMetrics } from '../types/market';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Bot, 
  Brain, 
  Anchor, 
  Sparkles, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface FinalReportModalProps {
  initialCapital: number;
  finalNetWorth: number;
  metrics: GameMetrics;
  onRestart: () => void;
  onContinueSandbox: () => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  initialCapital,
  finalNetWorth,
  metrics,
  onRestart,
  onContinueSandbox
}) => {
  const returnPct = ((finalNetWorth - initialCapital) / initialCapital) * 100;
  const isPositive = returnPct >= 0;

  // Theoretical competency scoring (0 to 100)
  // 1. CAPM Rationality score based on diversification & avoiding excessive turnover
  const capmScore = Math.max(20, Math.min(100, Math.round(95 - Math.max(0, metrics.totalTrades - 12) * 4)));
  
  // 2. Behavioral Self-Control score based on anchoring resistance & FOMO control
  const behavioralScore = Math.max(20, Math.min(100, Math.round(90 - metrics.fomoTrades * 15 - metrics.anchoringMistakesCount * 8)));

  // 3. Minsky Systemic Resilience score based on portfolio preservation during crash
  const minskyScore = Math.max(20, Math.min(100, Math.round(metrics.minskySurvivalRate * 100)));

  const averageScore = Math.round((capmScore + behavioralScore + minskyScore) / 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-indigo-500 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-5 sm:p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-2 right-3 opacity-20">
            <Trophy className="w-28 h-28" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Relatório de Conclusão da Jornada
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            A Grande Síntese de Mercado
          </h2>
          <p className="text-xs text-indigo-100 max-w-md mx-auto mt-1">
            Você navegou por ciclos de calmaria eficiente, bolhas de sentimento e colapsos de liquidez.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Financial Scoreboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Capital Inicial</span>
              <span className="font-mono font-bold text-slate-300 text-sm">
                R$ {initialCapital.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Patrimônio Final</span>
              <span className="font-mono font-bold text-white text-sm">
                R$ {finalNetWorth.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Retorno Total</span>
              <span
                className={`font-mono font-bold text-sm ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? '+' : ''}{returnPct.toFixed(2)}%
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">Índice Sintético</span>
              <span className="font-mono font-black text-amber-400 text-sm">
                {averageScore} / 100
              </span>
            </div>
          </div>

          {/* Theoretical Competency Scores (The 3 Schools) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              Avaliação nas Três Escolas Financeiras
            </h3>

            {/* School 1: CAPM */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-sky-300 font-semibold">
                  <Bot className="w-3.5 h-3.5" />
                  Racionalidade & Eficiência (Robô CAPM)
                </span>
                <span className="font-mono font-bold text-sky-400">{capmScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${capmScore}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">
                Mede a disciplina de diversificação e a minimização de custos desnecessários de giro de carteira.
              </p>
            </div>

            {/* School 2: Dr. Psique */}
            <div className="space-y-1 pt-1 border-t border-slate-800/60">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-pink-300 font-semibold">
                  <Brain className="w-3.5 h-3.5" />
                  Autocontrole Emocional (Dr. Psique)
                </span>
                <span className="font-mono font-bold text-pink-400">{behavioralScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${behavioralScore}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">
                Mede a resistência a vieses cognitivos (ancoragem, efeito manada e aversão paralisante à perda).
              </p>
            </div>

            {/* School 3: Capitão Minsky */}
            <div className="space-y-1 pt-1 border-t border-slate-800/60">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Anchor className="w-3.5 h-3.5" />
                  Resiliência Sistêmica (Capitão Minsky)
                </span>
                <span className="font-mono font-bold text-amber-400">{minskyScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${minskyScore}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">
                Mede a capacidade de antecipar o esgotamento da liquidez e proteger patrimônio no Momento Minsky.
              </p>
            </div>
          </div>

          {/* Synthesis Manifesto */}
          <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/80 space-y-2 text-xs leading-relaxed text-indigo-100">
            <h4 className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              A Lição Fundamental de AnimMarket:
            </h4>
            <p>
              Nenhuma teoria financeira isolada explica a totalidade do mercado:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>
                O <strong>Robô CAPM</strong> ensina que o risco sistemático existe e que a diversificação é o único "almoço grátis", mas peca ao assumir agentes perfeitamente hiper-racionais.
              </li>
              <li>
                O <strong>Dr. Psique</strong> revela que os preços flutuam sob o comando de heurísticas humanas, aversão à perda e histeria coletiva.
              </li>
              <li>
                O <strong>Capitão Minsky</strong> comprova que a estabilidade é enganosa: os próprios períodos de calmaria geram o endividamento e a fragilidade que desencadeiam os colapsos de liquidez.
              </li>
            </ul>
            <p className="pt-1 font-semibold text-white">
              O investidor bem-sucedido é aquele que integra a matemática do CAPM, a autoconsciência de Kahneman e a prudência de Minsky.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novamente a Campanha
          </button>

          <button
            onClick={onContinueSandbox}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            Continuar no Modo Sandbox Infinito
          </button>
        </div>
      </div>
    </div>
  );
};
