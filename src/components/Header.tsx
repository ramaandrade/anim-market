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
  Sparkles,
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
  onOpenLab,
  isSandboxMode
}) => {
  const returnPct = ((netWorth - initialCapital) / initialCapital) * 100;
  const isPositive = returnPct >= 0;

  // Regime visual badge configuration
  const getRegimeConfig = () => {
    switch (regime) {
      case 'HEDGE':
        return {
          label: 'HEDGE (Estável)',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          bgColor: 'bg-emerald-950/80',
          borderColor: 'border-emerald-600',
          textColor: 'text-emerald-400',
          barWidth: '25%',
          barColor: 'bg-emerald-500',
          hint: 'Fluxos cobrem dívida'
        };
      case 'SPECULATIVE':
        return {
          label: 'ESPECULATIVO (Complacência)',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          bgColor: 'bg-amber-950/80',
          borderColor: 'border-amber-600',
          textColor: 'text-amber-400',
          barWidth: '60%',
          barColor: 'bg-amber-500',
          hint: 'Depende de rolagem de dívida'
        };
      case 'PONZI':
        return {
          label: 'PONZI (Fragilidade Máxima)',
          icon: <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />,
          bgColor: 'bg-orange-950/90',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-400',
          barWidth: '90%',
          barColor: 'bg-orange-500',
          hint: 'Depende de contínua valorização'
        };
      case 'MINSKY_MOMENT':
        return {
          label: 'MOMENTO MINSKY (Crash!)',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-ping" />,
          bgColor: 'bg-red-950/95',
          borderColor: 'border-red-600',
          textColor: 'text-red-400',
          barWidth: '100%',
          barColor: 'bg-red-600 animate-pulse',
          hint: 'Vendas forçadas & Liquidez congelada'
        };
    }
  };

  const regConfig = getRegimeConfig();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 transition-colors duration-500">
      {/* Top Banner: Brand, Controls & Regime Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base tracking-tight text-white">
                AnimMarket
              </span>
              <span className="text-[10px] font-medium bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 px-1.5 py-0.2 rounded">
                MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Racionalidade vs. Emoção</p>
          </div>
        </div>

        {/* Minsky Instability Tension Bar (Center on desktop) */}
        <div className="flex flex-col items-center justify-center min-w-[200px] max-w-[280px]">
          <div className="flex items-center justify-between w-full text-[10px] font-semibold mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              Regime de Minsky:
            </span>
            <span className={`flex items-center gap-1 font-bold ${regConfig.textColor}`}>
              {regConfig.icon}
              {regConfig.label}
            </span>
          </div>
          
          {/* Tension Bar Meter */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div 
              className={`h-full transition-all duration-700 ease-out ${regConfig.barColor}`} 
              style={{ width: regConfig.barWidth }}
            />
          </div>
          <span className="text-[9px] text-slate-400 self-end mt-0.5">
            {regConfig.hint}
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetGame}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reiniciar Simulação"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onAdvanceMonth}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Avançar Mês</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Secondary Bar: Financial Overview & Timeline */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-3 sm:px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Month & Phase */}
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded text-xs border border-slate-700">
              Mês {currentMonth}{!isSandboxMode && ` / ${totalMonths}`}
            </span>
            <span className="font-semibold text-slate-200">
              {phaseName}
            </span>
            {isSandboxMode && (
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700 px-1.5 py-0.2 rounded font-medium">
                Modo Sandbox
              </span>
            )}
          </div>

          {/* Capital & Portfolio Net Worth */}
          <div className="flex items-center gap-4">
            {/* Cash Available */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Caixa:</span>
              <span className="font-mono font-bold text-white">
                R$ {cash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Total Net Worth */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Patrimônio Líquido:</span>
              <span className="font-mono font-black text-sm text-white">
                R$ {netWorth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                  isPositive 
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' 
                    : 'bg-red-950/80 text-red-400 border border-red-800/80'
                }`}
              >
                {isPositive ? '+' : ''}{returnPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
