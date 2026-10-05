import React from 'react';
import { Asset, PortfolioPosition } from '../types/market';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

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
  initialCapital,
  onTradeClick
}) => {
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  const positionsList = Object.values(portfolio).filter((p) => p.shares > 0);

  // Financial calculations
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
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Composição da Carteira & Métricas Teóricas
          </h3>
          <p className="text-xs text-slate-400">
            Acompanhe a alocação e a sensibilidade a fatores sistemáticos (CAPM e Fama-French).
          </p>
        </div>

        {/* Global Unrealized Return */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Resultado Não Realizado:</span>
          <span
            className={`font-mono font-bold text-xs sm:text-sm px-2 py-0.5 rounded flex items-center gap-1 ${
              unrealizedGain >= 0
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-red-950/80 text-red-400 border border-red-800'
            }`}
          >
            {unrealizedGain >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            R$ {unrealizedGain.toFixed(2)} ({unrealizedGainPct >= 0 ? '+' : ''}{unrealizedGainPct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Metrics Row: Beta, Factors, Asset Weight */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Portfolio Beta */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Beta Ponderado (β):</span>
            <span className="text-[10px] text-cyan-400 font-mono">CAPM</span>
          </div>
          <div className="font-mono font-black text-base text-white flex items-baseline gap-1">
            {portfolioBeta.toFixed(2)}
            <span className="text-[10px] font-normal text-slate-400">
              {portfolioBeta > 1.2 ? '(Agressivo)' : portfolioBeta < 0.8 ? '(Defensivo)' : '(Equilibrado)'}
            </span>
          </div>
        </div>

        {/* SMB Factor */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Fator Tamanho (SMB):</span>
            <span className="text-[10px] text-emerald-400 font-mono">Fama-French</span>
          </div>
          <div className="font-mono font-black text-base text-white">
            {portfolioSmb > 0 ? '+' : ''}{portfolioSmb.toFixed(2)}
          </div>
        </div>

        {/* HML Factor */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Fator Valor (HML):</span>
            <span className="text-[10px] text-amber-400 font-mono">Fama-French</span>
          </div>
          <div className="font-mono font-black text-base text-white">
            {portfolioHml > 0 ? '+' : ''}{portfolioHml.toFixed(2)}
          </div>
        </div>

        {/* Cash Ratio */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Reserva em Caixa:</span>
            <span className="text-[10px] text-indigo-400 font-mono">Liquidez</span>
          </div>
          <div className="font-mono font-black text-base text-white">
            {totalPortfolioValue > 0 ? ((cash / totalPortfolioValue) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {/* Visual Asset Allocation Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Distribuição de Capital:</span>
          <span>{positionsList.length} ativos investidos + Caixa</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
          {/* Cash segment */}
          <div
            className="h-full bg-slate-600 transition-all duration-300"
            style={{ width: `${totalPortfolioValue > 0 ? (cash / totalPortfolioValue) * 100 : 100}%` }}
            title={`Caixa: R$ ${cash.toFixed(2)}`}
          />
          {/* Invested asset segments */}
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
                title={`${asset.ticker}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Positions Table / Cards */}
      {positionsList.length === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
          Você ainda não possui ativos na carteira. 100% do seu capital está em caixa.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2">Ativo</th>
                <th className="pb-2">Cotas</th>
                <th className="pb-2">Preço Médio (Âncora)</th>
                <th className="pb-2">Cotação</th>
                <th className="pb-2">Total Atual</th>
                <th className="pb-2">Retorno</th>
                <th className="pb-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {positionsList.map((pos) => {
                const asset = assetMap.get(pos.assetId);
                if (!asset) return null;
                const currentValue = pos.shares * asset.price;
                const gain = currentValue - pos.shares * pos.averagePrice;
                const gainPct = ((asset.price - pos.averagePrice) / pos.averagePrice) * 100;
                const isProfitable = gain >= 0;

                return (
                  <tr key={pos.assetId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-mono font-bold text-white">
                      {asset.ticker}
                      <span className="block text-[10px] font-sans text-slate-400 font-normal">
                        {asset.name}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-200">{pos.shares}</td>
                    <td className="py-2.5 font-mono text-slate-300">
                      R$ {pos.averagePrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono text-white">
                      R$ {asset.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono font-bold text-white">
                      R$ {currentValue.toFixed(2)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`font-mono font-bold ${
                          isProfitable ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfitable ? '+' : ''}{gainPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onTradeClick(asset, 'SELL')}
                        className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Vender
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
