import React, { useState } from 'react';
import { Asset, PortfolioPosition, MinskyRegime } from '../types/market';
import { 
  TrendingUp, 
  TrendingDown, 
  Anchor as AnchorIcon, 
  AlertCircle, 
  Filter, 
  Layers, 
  Zap, 
  Shield, 
  DollarSign,
  Droplets,
  Activity
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
    <div className="w-full space-y-4">
      {/* Factor Filter Navigation Pills (Fama-French & CAPM models) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-800">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Mercado de Ativos & Fatores de Precificação
          </h2>
          <p className="text-xs text-slate-400">
            Compare o valor intrínseco fundamental com a cotação de mercado ditada pelas forças de sentimento.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] mr-1 hidden md:flex">
            <Filter className="w-3 h-3" /> Filtro:
          </span>
          <button
            onClick={() => setFactorFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              factorFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Todos ({assets.length})
          </button>
          <button
            onClick={() => setFactorFilter('VALUE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              factorFilter === 'VALUE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
            title="Fama-French High Minus Low (HML): Ações de Valor com alto Book-to-Market"
          >
            Fator Valor (HML)
          </button>
          <button
            onClick={() => setFactorFilter('SMALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              factorFilter === 'SMALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
            title="Fama-French Small Minus Big (SMB): Empresas de Menor Capitalização"
          >
            Fator Tamanho (SMB)
          </button>
          <button
            onClick={() => setFactorFilter('HIGH_BETA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              factorFilter === 'HIGH_BETA'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
            title="Ativos com Beta > 1.5: Alta volatilidade sistemática"
          >
            Alto Beta (&gt;1.5)
          </button>
          <button
            onClick={() => setFactorFilter('HEDGE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              factorFilter === 'HEDGE'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
            title="Títulos Livres de Risco e Hedges Antifrágeis"
          >
            Refúgios & Hedging
          </button>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
              className={`relative bg-slate-900/80 rounded-2xl border transition-all p-3.5 sm:p-4 flex flex-col justify-between ${
                isLiquidityCritical
                  ? 'border-red-600/70 shadow-lg shadow-red-950/40'
                  : hasShares
                  ? 'border-indigo-600/60 shadow-md shadow-indigo-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Ticker, Name & Category */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
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
                    <h3 className="text-xs text-slate-300 font-medium truncate max-w-[190px]">
                      {asset.name}
                    </h3>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm sm:text-base text-white">
                      R$ {asset.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isUp ? '+' : ''}{monthlyChangePct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="w-full h-8 flex items-end gap-1 my-2 bg-slate-950/50 p-1 rounded-lg border border-slate-800/60">
                  {history.slice(-8).map((p, idx, arr) => {
                    const min = Math.min(...arr) * 0.95;
                    const max = Math.max(...arr) * 1.05;
                    const heightPct = Math.max(10, Math.min(100, ((p - min) / (max - min || 1)) * 100));
                    const isLast = idx === arr.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all ${
                          isLast 
                            ? isUp ? 'bg-emerald-500' : 'bg-red-500' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`Mês ${idx + 1}: R$ ${p.toFixed(2)}`}
                      />
                    );
                  })}
                </div>

                {/* Intrinsic Value vs Market Price Bar */}
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[11px] space-y-1 mb-2.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Valor Intrínseco:</span>
                    <span className="font-mono text-slate-200">R$ {asset.intrinsicValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avaliação Relativa:</span>
                    <span
                      className={`font-semibold ${
                        isOvervalued
                          ? 'text-rose-400'
                          : isUndervalued
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {isOvervalued && `Sobrevalorizado (+${valuationGapPct.toFixed(0)}%)`}
                      {isUndervalued && `Subvalorizado (${valuationGapPct.toFixed(0)}%)`}
                      {!isOvervalued && !isUndervalued && 'Precificação Justa'}
                    </span>
                  </div>
                </div>

                {/* Factor Exposure Badges (CAPM & Fama-French) */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-2.5">
                  {/* Beta Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono border ${
                      asset.beta >= 1.5
                        ? 'bg-red-950/70 border-red-800 text-red-300'
                        : asset.beta <= 0.5
                        ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    title="Beta do CAPM: sensibilidade ao risco sistemático do mercado"
                  >
                    β: {asset.beta.toFixed(2)}
                  </span>

                  {/* Fama-French SMB Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono border ${
                      asset.smbExposure > 0.3
                        ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    title="Fator SMB (Small Minus Big): sensibilidade a pequenas empresas"
                  >
                    SMB: {asset.smbExposure > 0 ? '+' : ''}{asset.smbExposure.toFixed(1)}
                  </span>

                  {/* Fama-French HML Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono border ${
                      asset.hmlExposure > 0.3
                        ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    title="Fator HML (High Minus Low): sensibilidade ao fator valor"
                  >
                    HML: {asset.hmlExposure > 0 ? '+' : ''}{asset.hmlExposure.toFixed(1)}
                  </span>

                  {/* Liquidity Badge */}
                  <span
                    className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 border ${
                      asset.liquidityScore < 50
                        ? 'bg-red-950/80 border-red-700 text-red-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                    title="Índice de Liquidez: facilidade de venda sem sofrer deságio"
                  >
                    <Droplets className="w-2.5 h-2.5" />
                    {asset.liquidityScore}%
                  </span>
                </div>

                {/* Anchoring Trap Alert (Behavioral Bias) */}
                {isAnchoredToLoss && (
                  <div className="mb-2.5 bg-rose-950/60 border border-rose-800/80 rounded-xl p-2 text-[11px] text-rose-200 flex items-start gap-1.5">
                    <AnchorIcon className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Viés de Ancoragem Ativo!</span>
                      <p className="text-[10px] text-rose-300/90 leading-tight">
                        Você pagou R$ {position.averagePrice.toFixed(2)} ({lossFromAveragePct.toFixed(1)}%).
                        Dr. Psique adverte: sua mente resiste a vender para não oficializar a dor da perda!
                      </p>
                    </div>
                  </div>
                )}

                {/* Minsky Liquidity Warning */}
                {isLiquidityCritical && (
                  <div className="mb-2.5 bg-orange-950/70 border border-orange-800 rounded-xl p-2 text-[11px] text-orange-200 flex items-start gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Alerta de Iliquidez Ponzi!</span>
                      <p className="text-[10px] text-orange-300 leading-tight">
                        Durante choques sistêmicos, ativos com baixa liquidez sofrem severo desconto de saída.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trade Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onTradeClick(asset, 'BUY')}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Comprar
                </button>

                <button
                  onClick={() => onTradeClick(asset, 'SELL')}
                  disabled={!hasShares}
                  className={`flex-1 py-1.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 ${
                    hasShares
                      ? 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-sm cursor-pointer'
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
