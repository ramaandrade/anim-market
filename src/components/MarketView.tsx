import React, { useState } from 'react';
import { Asset, PortfolioPosition, MinskyRegime } from '../types/market';
import { 
  TrendingUp, 
  TrendingDown, 
  Anchor as AnchorIcon, 
  DollarSign,
  Droplets
} from 'lucide-react';

interface MarketViewProps {
  assets: Asset[];
  portfolio: Record<string, PortfolioPosition>;
  regime: MinskyRegime;
  onTradeClick: (asset: Asset, action: 'BUY' | 'SELL') => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  assets,
  portfolio,
  regime,
  onTradeClick
}) => {
  const [factorFilter, setFactorFilter] = useState<'ALL' | 'VALUE' | 'SMALL' | 'HIGH_BETA' | 'HEDGE'>('ALL');

  // Filter logic based on Fama-French & CAPM factors
  const filteredAssets = assets.filter((asset) => {
    if (factorFilter === 'VALUE') return asset.hmlExposure > 0.3;
    if (factorFilter === 'SMALL') return asset.smbExposure > 0.4;
    if (factorFilter === 'HIGH_BETA') return asset.beta >= 1.5;
    if (factorFilter === 'HEDGE') return asset.category === 'RISK_FREE' || asset.category === 'HEDGE';
    return true;
  });

  return (
    <div className="w-full space-y-3 pb-4">
      {/* Factor Filter Navigation Pills (Fama-French & CAPM models) */}
      <div className="overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setFactorFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              factorFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Todos ({assets.length})
          </button>
          <button
            onClick={() => setFactorFilter('VALUE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              factorFilter === 'VALUE'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Valor (HML)
          </button>
          <button
            onClick={() => setFactorFilter('SMALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              factorFilter === 'SMALL'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Small (SMB)
          </button>
          <button
            onClick={() => setFactorFilter('HIGH_BETA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              factorFilter === 'HIGH_BETA'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Alto Beta (&gt;1.5)
          </button>
          <button
            onClick={() => setFactorFilter('HEDGE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              factorFilter === 'HEDGE'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Refúgios / Hedges
          </button>
        </div>
      </div>

      {/* Mobile Vertical Asset List */}
      <div className="space-y-3">
        {filteredAssets.map((asset) => {
          const position = portfolio[asset.id];
          const hasShares = position && position.shares > 0;
          
          // Monthly price change calculation
          const history = asset.historicalPrices;
          const prevPrice = history.length >= 2 ? history[history.length - 2] : asset.price;
          const monthlyChangePct = ((asset.price - prevPrice) / prevPrice) * 100;
          const isUp = monthlyChangePct >= 0;

          // Intrinsic value gap
          const valuationGapPct = ((asset.price - asset.intrinsicValue) / asset.intrinsicValue) * 100;
          const isOvervalued = valuationGapPct > 5;
          const isUndervalued = valuationGapPct < -5;

          // Anchoring trap detection
          const isAnchoredToLoss = hasShares && asset.price < position.averagePrice;
          const lossFromAveragePct = hasShares 
            ? ((asset.price - position.averagePrice) / position.averagePrice) * 100 
            : 0;

          // Liquidity risk during stress
          const isLiquidityCritical = (regime === 'PONZI' || regime === 'MINSKY_MOMENT') && asset.liquidityScore < 60;

          return (
            <div
              key={asset.id}
              className={`bg-slate-900/90 rounded-2xl border p-3.5 space-y-2.5 transition-all shadow-md ${
                isLiquidityCritical
                  ? 'border-red-600/70 shadow-red-950/40'
                  : hasShares
                  ? 'border-indigo-600/60 shadow-indigo-950/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Asset Header: Ticker, Name, Price and Monthly change */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-sm text-white">
                      {asset.ticker}
                    </span>
                    {hasShares && (
                      <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 px-1.5 py-0.2 rounded">
                        {position.shares} cotas
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs text-slate-400 truncate max-w-[200px]">
                    {asset.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-base text-white">
                    R$ {asset.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isUp ? '+' : ''}{monthlyChangePct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Intrinsic Value Comparison Row */}
              <div className="flex items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[11px]">
                {/* Mini Sparkline */}
                <div className="h-6 w-24 flex items-end gap-0.5">
                  {history.slice(-6).map((p, idx, arr) => {
                    const min = Math.min(...arr) * 0.95;
                    const max = Math.max(...arr) * 1.05;
                    const heightPct = Math.max(15, Math.min(100, ((p - min) / (max - min || 1)) * 100));
                    const isLast = idx === arr.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t ${
                          isLast 
                            ? isUp ? 'bg-emerald-500' : 'bg-red-500' 
                            : 'bg-slate-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    );
                  })}
                </div>

                {/* Valuation Info */}
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">
                    Valor Justo: R$ {asset.intrinsicValue.toFixed(2)}
                  </span>
                  <span
                    className={`font-semibold text-[10px] ${
                      isOvervalued
                        ? 'text-rose-400'
                        : isUndervalued
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {isOvervalued && `Sobrevalorizado (+${valuationGapPct.toFixed(0)}%)`}
                    {isUndervalued && `Subvalorizado (${valuationGapPct.toFixed(0)}%)`}
                    {!isOvervalued && !isUndervalued && 'Preço Justo'}
                  </span>
                </div>
              </div>

              {/* Factors Badges (CAPM β, SMB, HML, Liquidity) */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="px-1.5 py-0.5 rounded font-mono bg-slate-800 border border-slate-700 text-slate-300">
                  β: {asset.beta.toFixed(2)}
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono bg-slate-800 border border-slate-700 text-slate-300">
                  SMB: {asset.smbExposure > 0 ? '+' : ''}{asset.smbExposure.toFixed(1)}
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono bg-slate-800 border border-slate-700 text-slate-300">
                  HML: {asset.hmlExposure > 0 ? '+' : ''}{asset.hmlExposure.toFixed(1)}
                </span>
                <span className="px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-slate-800 border border-slate-700 text-slate-300">
                  <Droplets className="w-2.5 h-2.5 text-cyan-400" />
                  {asset.liquidityScore}%
                </span>
              </div>

              {/* Anchoring Trap Alert */}
              {isAnchoredToLoss && (
                <div className="bg-rose-950/50 border border-rose-800/80 rounded-xl p-2 text-[10px] text-rose-200 flex items-start gap-1.5">
                  <AnchorIcon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">⚓ Viés de Ancoragem!</span>
                    <p className="text-rose-300/90 leading-tight">
                      Preço médio: R$ {position.averagePrice.toFixed(2)} ({lossFromAveragePct.toFixed(1)}%).
                      Você reluta em vender por aversão à perda?
                    </p>
                  </div>
                </div>
              )}

              {/* Touch Action Buttons (Big Thumb Targets) */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => onTradeClick(asset, 'BUY')}
                  className="h-10 bg-emerald-600 active:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Comprar
                </button>

                <button
                  onClick={() => onTradeClick(asset, 'SELL')}
                  disabled={!hasShares}
                  className={`h-10 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 ${
                    hasShares
                      ? 'bg-rose-600 active:bg-rose-500 active:scale-95 text-white shadow-md cursor-pointer'
                      : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  Vender {hasShares && `(${position.shares})`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
