import React, { useState } from 'react';
import { Asset, PortfolioPosition, MinskyRegime } from '../types/market';
import { X, DollarSign, AlertTriangle, Droplets, TrendingUp, Anchor as AnchorIcon, Bot, Brain } from 'lucide-react';

interface TradeModalProps {
  asset: Asset | null;
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
  if (!asset) return null;

  const maxSharesBuy = Math.floor(cash / asset.price);
  const maxSharesSell = position ? position.shares : 0;
  const maxShares = tradeType === 'BUY' ? maxSharesBuy : maxSharesSell;

  const [shares, setShares] = useState<number>(Math.max(1, Math.min(10, maxShares)));

  // Liquidity discount calculation during stress
  let slippagePct = 0;
  if ((regime === 'PONZI' || regime === 'MINSKY_MOMENT') && asset.liquidityScore < 70) {
    // Assets with low liquidity face heavy discounts when selling
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {tradeType === 'BUY' ? 'Ordem de Compra' : 'Ordem de Venda'}
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {asset.ticker}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{asset.name}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Price & Balance Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 text-xs">Cotação Atual:</span>
              <div className="font-mono font-bold text-base text-white">
                R$ {asset.price.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-xs">
                {tradeType === 'BUY' ? 'Caixa Disponível:' : 'Cotas em Carteira:'}
              </span>
              <div className="font-mono font-bold text-base text-white">
                {tradeType === 'BUY' ? `R$ ${cash.toFixed(2)}` : `${position?.shares || 0} cotas`}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-medium">Quantidade de Cotas:</label>
              <span className="font-mono font-bold text-indigo-400 text-base">{shares}</span>
            </div>

            <input
              type="range"
              min={1}
              max={Math.max(1, maxShares)}
              value={shares}
              disabled={maxShares === 0}
              onChange={(e) => setShares(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            {/* Quick Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-2.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handlePercentage(pct)}
                  disabled={maxShares === 0}
                  className="py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700/60 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Slippage & Financial Impact Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Valor Bruto:</span>
              <span className="font-mono text-white">R$ {baseTotal.toFixed(2)}</span>
            </div>

            {slippagePct > 0 && (
              <div className="flex items-center justify-between text-xs text-red-400 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  Deságio de Iliquidez ({slippagePct.toFixed(0)}%):
                </span>
                <span className="font-mono">- R$ {slippageValue.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm font-bold text-white pt-1.5 border-t border-slate-800">
              <span>Total Efetivo:</span>
              <span className="font-mono text-indigo-300 text-base">
                R$ {effectiveTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Behavioral Bias Warning on Sell (Anchoring & Loss Aversion) */}
          {isSellingBelowAverage && (
            <div className="p-3 bg-pink-950/50 border border-pink-700/60 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-pink-300">
                <Brain className="w-4 h-4 text-pink-400" />
                Dr. Psique: Alerta de Aversão à Perda!
              </div>
              <p className="text-pink-200/90 leading-relaxed text-[11px]">
                Você está realizando um prejuízo contábil de <strong className="font-mono">R$ {lossAmount.toFixed(2)}</strong> em relação ao seu preço de compra (R$ {position?.averagePrice.toFixed(2)}). A Teoria da Perspectiva mostra que essa dor psicológica é real, mas pergunte-se: <em>os fundamentos deste ativo justificam continuar segurando?</em>
              </p>
            </div>
          )}

          {/* CAPM Risk Insight */}
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] text-slate-300 flex items-start gap-2">
            <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span>
                <strong>Robô CAPM:</strong> O Beta deste ativo é <span className="font-mono text-cyan-300">{asset.beta.toFixed(2)}</span>.
                {asset.beta > portfolioBeta 
                  ? ' Esta transação elevará a sensibilidade sistemática da sua carteira.' 
                  : ' Esta transação reduzirá ou manterá o Beta geral da carteira.'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={maxShares === 0 || shares <= 0}
            className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ${
              maxShares === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : tradeType === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 hover:scale-102 active:scale-98'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40 hover:scale-102 active:scale-98'
            }`}
          >
            {tradeType === 'BUY' ? 'Confirmar Compra' : 'Confirmar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
};
