import React from 'react';
import { MinskyRegime } from '../types/market';
import { 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  RotateCcw,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  currentMonth: number;
  totalMonths: number;
  phaseName: string;
  regime: MinskyRegime;
  netWorth: number;
  initialCapital: number;
  cash: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onAdvanceMonth: () => void;
  onResetGame: () => void;
  onOpenLab: () => void;
  isSandboxMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  totalMonths,
  phaseName,
  regime,
  netWorth,
  initialCapital,
  cash,
  isMuted,
  onToggleMute,
  onAdvanceMonth,
  onResetGame,
  isSandboxMode
}) => {
  const returnPct = ((netWorth - initialCapital) / initialCapital) * 100;
  const isPositive = returnPct >= 0;

  // Regime visual badge configuration
  const getRegimeConfig = () => {
    switch (regime) {
      case 'HEDGE':
        return {
          label: 'Hedge (Estável)',
          icon: <ShieldCheck className="w-3 h-3" />,
          textColor: 'text-emerald-400',
          barColor: 'bg-emerald-500',
          barWidth: '25%',
          borderGlow: 'border-emerald-600/40'
        };
      case 'SPECULATIVE':
        return {
          label: 'Especulativo',
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          textColor: 'text-amber-400',
          barColor: 'bg-amber-500',
          barWidth: '60%',
          borderGlow: 'border-amber-500/40'
        };
      case 'PONZI':
        return {
          label: 'Ponzi (Frágil)',
          icon: <Flame className="w-3 h-3 text-orange-400 animate-bounce" />,
          textColor: 'text-orange-400',
          barColor: 'bg-orange-500',
          barWidth: '88%',
          borderGlow: 'border-orange-500/50'
        };
      case 'MINSKY_MOMENT':
        return {
          label: 'Momento Minsky (Crash!)',
          icon: <AlertTriangle className="w-3 h-3 text-red-400 animate-ping" />,
          textColor: 'text-red-400',
          barColor: 'bg-red-500 animate-pulse',
          barWidth: '100%',
          borderGlow: 'border-red-500 shadow-lg shadow-red-950/80 animate-pulse'
        };
    }
  };

  const regConfig = getRegimeConfig();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 pt-[max(env(safe-area-inset-top),0.5rem)] px-3 pb-2.5 transition-colors">
      <div className="w-full space-y-2">
        {/* Top Status Bar: Logo, Phase & Mini Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Month indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">
                  AnimMarket
                </span>
                <span className="text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.5 rounded truncate max-w-[170px]">
                  Mês {currentMonth}{!isSandboxMode && `/${totalMonths}`} • {phaseName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Audio & Reset icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
              title={isMuted ? 'Ativar Som' : 'Mutar Som'}
              aria-label="Som"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onResetGame}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
              title="Reiniciar Jogo"
              aria-label="Reiniciar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Minsky Tension Bar (Compact mobile status meter) */}
        <div className={`p-1.5 rounded-xl bg-slate-900/80 border ${regConfig.borderGlow} space-y-1`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Tensão Sistêmica (Minsky):</span>
            <span className={`font-bold flex items-center gap-1 ${regConfig.textColor}`}>
              {regConfig.icon}
              {regConfig.label}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out ${regConfig.barColor}`}
              style={{ width: regConfig.barWidth }}
            />
          </div>
        </div>

        {/* Mobile Financial Dashboard Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
          {/* Net Worth */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Patrimônio Líquido</span>
              <span
                className={`text-[9px] font-bold px-1 rounded ${
                  isPositive 
                    ? 'text-emerald-400 bg-emerald-950/80' 
                    : 'text-rose-400 bg-rose-950/80'
                }`}
              >
                {isPositive ? '+' : ''}{returnPct.toFixed(1)}%
              </span>
            </div>
            <div className="font-mono font-black text-base text-white truncate">
              R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Wallet className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
              <span className="truncate">Caixa: R$ {cash.toFixed(2)}</span>
            </div>
          </div>

          {/* Big Thumb-friendly Advance Button */}
          <button
            onClick={onAdvanceMonth}
            className="h-11 px-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <span>Avançar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
