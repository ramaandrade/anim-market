import React, { useState } from 'react';
import { Asset, PortfolioPosition, MinskyRegime } from '../types/market';
import { X, Droplets, Bot, Brain } from 'lucide-react';

interface TradeModalProps {
  asset: Asset;
  tradeType: 'BUY' | 'SELL';
  cash: number;
  position: PortfolioPosition | undefined;
  regime: MinskyRegime;
  portfolioBeta: number;
  onClose: () => void;
  onExecuteTrade: (asset: Asset, type: 'BUY' | 'SELL', shares: number) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  asset,
  tradeType,
  cash,
  position,
  regime,
  portfolioBeta,
  onClose,
  onExecuteTrade
}) => {
  const maxSharesBuy = Math.floor(cash / asset.price);
  const maxSharesSell = position ? position.shares : 0;
  const maxShares = tradeType === 'BUY' ? maxSharesBuy : maxSharesSell;

  const [shares, setShares] = useState<number>(() => Math.max(1, Math.min(10, maxShares)));


  // Liquidity discount calculation during stress
  let slippagePct = 0;
  if ((regime === 'PONZI' || regime === 'MINSKY_MOMENT') && asset.liquidityScore < 70) {
    slippagePct = (100 - asset.liquidityScore) * 0.4;
  }

  const baseTotal = shares * asset.price;
  const slippageValue = tradeType === 'SELL' ? (baseTotal * slippagePct) / 100 : 0;
  const effectiveTotal = tradeType === 'SELL' ? baseTotal - slippageValue : baseTotal;

  // Anchoring check on sell
  const isSellingBelowAverage = tradeType === 'SELL' && position && asset.price < position.averagePrice;
  const lossAmount = isSellingBelowAverage ? (position.averagePrice - asset.price) * shares : 0;

  const handlePercentage = (pct: number) => {
    const calculated = Math.floor((maxShares * pct) / 100);
    setShares(Math.max(1, Math.min(maxShares, calculated)));
  };

  const handleConfirm = () => {
    if (shares <= 0 || shares > maxShares) return;
    onExecuteTrade(asset, tradeType, shares);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div className="w-full max-w-md mx-auto bg-slate-900 border-t border-slate-700 rounded-t-3xl shadow-2xl p-4 sm:p-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[85vh]">
        {/* Drag Handle */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3 shrink-0" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {tradeType === 'BUY' ? 'Comprar' : 'Vender'}
              </span>
              <span className="font-mono font-bold text-white text-base">
                {asset.ticker}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[240px] mt-0.5">
              {asset.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-3 space-y-3.5 text-xs">
          {/* Price & Balance Quick Info */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400">Preço Unitário:</span>
              <div className="font-mono font-bold text-sm text-white">
                R$ {asset.price.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">
                {tradeType === 'BUY' ? 'Disponível em Caixa:' : 'Em Custódia:'}
              </span>
              <div className="font-mono font-bold text-sm text-white">
                {tradeType === 'BUY' ? `R$ ${cash.toFixed(2)}` : `${position?.shares || 0} cotas`}
              </div>
            </div>
          </div>

          {/* Quantity Selector Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-300 font-semibold text-xs">Quantidade:</span>
              <span className="font-mono font-black text-indigo-400 text-base">{shares} cotas</span>
            </div>

            <input
              type="range"
              min={1}
              max={Math.max(1, maxShares)}
              value={shares}
              disabled={maxShares === 0}
              onChange={(e) => setShares(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            {/* Quick Percentage Chips */}
            <div className="grid grid-cols-4 gap-1.5 mt-2.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentage(pct)}
                  disabled={maxShares === 0}
                  className="py-1.5 bg-slate-800/80 active:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700/60 transition-colors disabled:opacity-40"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Impact and Totals */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono text-white">R$ {baseTotal.toFixed(2)}</span>
            </div>

            {slippagePct > 0 && (
              <div className="flex items-center justify-between text-red-400 text-[11px] pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  Deságio de Iliquidez ({slippagePct.toFixed(0)}%):
                </span>
                <span className="font-mono">- R$ {slippageValue.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between font-bold text-white pt-1.5 border-t border-slate-800 text-sm">
              <span>Total da Ordem:</span>
              <span className="font-mono text-indigo-300 text-base">
                R$ {effectiveTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Behavioral Bias Alert on Sell (Anchoring) */}
          {isSellingBelowAverage && (
            <div className="p-2.5 bg-pink-950/40 border border-pink-700/60 rounded-xl space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-pink-300">
                <Brain className="w-3.5 h-3.5 text-pink-400" />
                Dr. Psique: Alerta de Ancoragem!
              </div>
              <p className="text-pink-200/90 leading-tight">
                Você pagou R$ {position?.averagePrice.toFixed(2)} por cota. Vender agora oficializa a perda de R$ {lossAmount.toFixed(2)}. Não hesite se os fundamentos pioraram!
              </p>
            </div>
          )}

          {/* CAPM Risk Insight */}
          <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-xl text-[10px] text-slate-300 flex items-start gap-1.5">
            <Bot className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Robô CAPM:</strong> Beta {asset.beta.toFixed(2)}. {asset.beta > portfolioBeta ? 'Aumenta o risco sistemático geral.' : 'Reduz ou mantém o risco sistemático.'}
            </span>
          </div>
        </div>

        {/* Big Full-Width Touch Action Button */}
        <button
          onClick={handleConfirm}
          disabled={maxShares === 0 || shares <= 0}
          className={`w-full h-12 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center cursor-pointer active:scale-98 ${
            maxShares === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : tradeType === 'BUY'
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
              : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
          }`}
        >
          {tradeType === 'BUY' ? `Comprar ${shares} Cotas` : `Vender ${shares} Cotas`}
        </button>
      </div>
    </div>
  );
};
