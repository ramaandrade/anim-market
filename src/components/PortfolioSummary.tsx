import React from 'react';
import { Asset, PortfolioPosition } from '../types/market';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: Record<string, PortfolioPosition>;
  assets: Asset[];
  cash: number;
  initialCapital: number;
  onTradeClick: (asset: Asset, action: 'BUY' | 'SELL') => void;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolio,
  assets,
  cash,
  onTradeClick
}) => {
  const assetMap = new Map(assets.map((a) => [a.id, a]));
  const positionsList = Object.values(portfolio).filter((p) => p.shares > 0);

  let totalInvestedValue = 0;
  let totalCostBasis = 0;
  let weightedBetaSum = 0;
  let weightedSmbSum = 0;
  let weightedHmlSum = 0;

  positionsList.forEach((pos) => {
    const asset = assetMap.get(pos.assetId);
    if (asset) {
      const positionValue = pos.shares * asset.price;
      totalInvestedValue += positionValue;
      totalCostBasis += pos.shares * pos.averagePrice;

      weightedBetaSum += asset.beta * positionValue;
      weightedSmbSum += asset.smbExposure * positionValue;
      weightedHmlSum += asset.hmlExposure * positionValue;
    }
  });

  const totalPortfolioValue = totalInvestedValue + cash;
  const portfolioBeta = totalPortfolioValue > 0 ? weightedBetaSum / totalPortfolioValue : 0;
  const portfolioSmb = totalPortfolioValue > 0 ? weightedSmbSum / totalPortfolioValue : 0;
  const portfolioHml = totalPortfolioValue > 0 ? weightedHmlSum / totalPortfolioValue : 0;

  const unrealizedGain = totalInvestedValue - totalCostBasis;
  const unrealizedGainPct = totalCostBasis > 0 ? (unrealizedGain / totalCostBasis) * 100 : 0;

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 space-y-3 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-indigo-400" />
          Carteira de Investimentos
        </h3>

        <div className="flex items-center gap-1">
          <span
            className={`font-mono font-bold text-[11px] px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
              unrealizedGain >= 0
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {unrealizedGain >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {unrealizedGain >= 0 ? '+' : ''}{unrealizedGainPct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Metrics Row: Beta, Factors */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Beta (β)</span>
          <span className="font-mono font-black text-xs text-cyan-400">
            {portfolioBeta.toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Tamanho (SMB)</span>
          <span className="font-mono font-black text-xs text-emerald-400">
            {portfolioSmb > 0 ? '+' : ''}{portfolioSmb.toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">Valor (HML)</span>
          <span className="font-mono font-black text-xs text-amber-400">
            {portfolioHml > 0 ? '+' : ''}{portfolioHml.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Visual Allocation Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
          <div
            className="h-full bg-slate-600 transition-all duration-300"
            style={{ width: `${totalPortfolioValue > 0 ? (cash / totalPortfolioValue) * 100 : 100}%` }}
          />
          {positionsList.map((pos) => {
            const asset = assetMap.get(pos.assetId);
            if (!asset) return null;
            const val = pos.shares * asset.price;
            const pct = (val / totalPortfolioValue) * 100;
            const colors: Record<string, string> = {
              lft: 'bg-emerald-500',
              bova: 'bg-blue-500',
              valo3: 'bg-amber-500',
              smal3: 'bg-teal-500',
              tech3: 'bg-purple-500',
              meme: 'bg-rose-500',
              gold: 'bg-yellow-400'
            };
            return (
              <div
                key={pos.assetId}
                className={`h-full transition-all duration-300 ${colors[pos.assetId] || 'bg-indigo-500'}`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] text-slate-500">
          <span>Cinza = Caixa</span>
          <span>{positionsList.length} ativos em custódia</span>
        </div>
      </div>

      {/* Positions List */}
      {positionsList.length === 0 ? (
        <div className="py-4 text-center text-slate-500 text-[11px] bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
          Nenhum ativo em carteira. Capital 100% em caixa.
        </div>
      ) : (
        <div className="space-y-2 pt-1">
          {positionsList.map((pos) => {
            const asset = assetMap.get(pos.assetId);
            if (!asset) return null;
            const currentValue = pos.shares * asset.price;
            const gain = currentValue - pos.shares * pos.averagePrice;
            const gainPct = ((asset.price - pos.averagePrice) / pos.averagePrice) * 100;
            const isProfitable = gain >= 0;

            return (
              <div
                key={pos.assetId}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-mono font-bold text-white text-xs">
                    {asset.ticker}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {pos.shares} cotas • Médio: R$ {pos.averagePrice.toFixed(2)}
                  </div>
                </div>

                <div className="text-right flex items-center gap-2.5">
                  <div>
                    <div className="font-mono font-bold text-xs text-white">
                      R$ {currentValue.toFixed(2)}
                    </div>
                    <div
                      className={`font-mono font-bold text-[10px] ${
                        isProfitable ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfitable ? '+' : ''}{gainPct.toFixed(1)}%
                    </div>
                  </div>

                  <button
                    onClick={() => onTradeClick(asset, 'SELL')}
                    className="h-8 px-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Vender
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
