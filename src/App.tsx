import React, { useState, useEffect, useMemo } from 'react';
import { 
  Asset, 
  PortfolioPosition, 
  TransactionRecord, 
  MinskyRegime, 
  TheoristId, 
  AnomalyEvent, 
  GameMetrics 
} from './types/market';
import { INITIAL_ASSETS } from './data/initialAssets';
import { CAMPAIGN_PHASES } from './data/campaignPhases';
import { getRegimeQuotes } from './data/theorists';
import { sounds } from './utils/audio';

import { Header } from './components/Header';
import { TheoristAvatars } from './components/TheoristAvatars';
import { TheoristDetailModal } from './components/TheoristDetailModal';
import { MarketView } from './components/MarketView';
import { PortfolioSummary } from './components/PortfolioSummary';
import { TradeModal } from './components/TradeModal';
import { AnomalyCardModal } from './components/AnomalyCardModal';
import { MinskyCrisisModal } from './components/MinskyCrisisModal';
import { EducationalLabModal } from './components/EducationalLabModal';
import { FinalReportModal } from './components/FinalReportModal';

import { 
  Activity, 
  PieChart, 
  History, 
  BookOpen, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_CAPITAL = 10000.0;

export const App: React.FC = () => {
  // Navigation tabs for mobile-first layout
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'HISTORY'>('MARKET');

  // Game progression state
  const [currentMonth, setCurrentMonth] = useState<number>(1);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [cash, setCash] = useState<number>(INITIAL_CAPITAL);
  const [portfolio, setPortfolio] = useState<Record<string, PortfolioPosition>>({});
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Net worth tracking for metrics
  const [netWorthHistory, setNetWorthHistory] = useState<number[]>([INITIAL_CAPITAL]);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted);

  // Modals state
  const [selectedTheoristForDetail, setSelectedTheoristForDetail] = useState<TheoristId | null>(null);
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    asset: Asset | null;
    action: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    asset: null,
    action: 'BUY'
  });
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyEvent | null>(null);
  const [showMinskyCrashModal, setShowMinskyCrashModal] = useState<boolean>(false);
  const [showFinalReport, setShowFinalReport] = useState<boolean>(false);
  const [showLabModal, setShowLabModal] = useState<boolean>(false);

  // Behavioral metrics tracker
  const [fomoTradesCount, setFomoTradesCount] = useState<number>(0);
  const [anchoringMistakesCount, setAnchoringMistakesCount] = useState<number>(0);

  // Current campaign phase computation
  const currentPhase = useMemo(() => {
    if (isSandboxMode) {
      return {
        phaseNumber: 99,
        name: 'Simulação Livre (Sandbox)',
        subtitle: 'Mercado Autônomo e Ciclos Dinâmicos',
        startMonth: 1,
        endMonth: 999,
        minskyRegime: (currentMonth % 12 > 9 ? 'PONZI' : currentMonth % 12 > 6 ? 'SPECULATIVE' : 'HEDGE') as MinskyRegime,
        objective: 'Experimente livremente diferentes carteiras, alavancagens e estratégias de fatores.',
        contextNarrative: 'Modo livre de experimentação contínua.'
      };
    }
    const found = CAMPAIGN_PHASES.find(
      (p) => currentMonth >= p.startMonth && currentMonth <= p.endMonth
    );
    return found || CAMPAIGN_PHASES[CAMPAIGN_PHASES.length - 1];
  }, [currentMonth, isSandboxMode]);

  const currentRegime: MinskyRegime = useMemo(() => {
    if (!isSandboxMode && currentMonth === 13) {
      return 'MINSKY_MOMENT';
    }
    return currentPhase.minskyRegime;
  }, [currentPhase, currentMonth, isSandboxMode]);

  // Dynamic quotes for the 3 theorists based on current state
  const currentQuotes = useMemo(() => {
    return getRegimeQuotes(currentRegime, currentMonth);
  }, [currentRegime, currentMonth]);

  // Portfolio financial calculations
  const totalInvestedValue = useMemo(() => {
    return Object.values(portfolio).reduce((acc, pos) => {
      const asset = assets.find((a) => a.id === pos.assetId);
      return acc + (asset ? pos.shares * asset.price : 0);
    }, 0);
  }, [portfolio, assets]);

  const netWorth = cash + totalInvestedValue;

  // Portfolio weighted Beta
  const portfolioBeta = useMemo(() => {
    if (netWorth <= 0) return 0;
    const weightedSum = Object.values(portfolio).reduce((acc, pos) => {
      const asset = assets.find((a) => a.id === pos.assetId);
      return acc + (asset ? pos.shares * asset.price * asset.beta : 0);
    }, 0);
    return weightedSum / netWorth;
  }, [portfolio, assets, netWorth]);

  // Toggle Sound
  const handleToggleMute = () => {
    const updated = sounds.toggleMute();
    setIsMuted(updated);
  };

  // Open Trade Modal
  const handleOpenTrade = (asset: Asset, action: 'BUY' | 'SELL') => {
    sounds.playClick();
    setTradeModal({
      isOpen: true,
      asset,
      action
    });
  };

  // Execute Buy / Sell Trade
  const handleExecuteTrade = (asset: Asset, action: 'BUY' | 'SELL', shares: number) => {
    const baseValue = shares * asset.price;

    // Check if buying speculative asset during euphoria (FOMO trade metric)
    if (action === 'BUY' && (asset.category === 'SPECULATIVE' || asset.category === 'TECH') && currentRegime === 'PONZI') {
      setFomoTradesCount((prev) => prev + 1);
    }

    if (action === 'BUY') {
      if (cash < baseValue) return;
      setCash((prev) => prev - baseValue);

      setPortfolio((prev) => {
        const existing = prev[asset.id];
        if (existing) {
          const totalShares = existing.shares + shares;
          const totalCost = existing.totalInvested + baseValue;
          return {
            ...prev,
            [asset.id]: {
              assetId: asset.id,
              shares: totalShares,
              averagePrice: totalCost / totalShares,
              totalInvested: totalCost
            }
          };
        } else {
          return {
            ...prev,
            [asset.id]: {
              assetId: asset.id,
              shares,
              averagePrice: asset.price,
              totalInvested: baseValue
            }
          };
        }
      });

      sounds.playTradeSuccess();
    } else {
      // SELL action
      const existing = portfolio[asset.id];
      if (!existing || existing.shares < shares) return;

      // Slippage deduction during liquidity crunch
      let slippagePct = 0;
      if ((currentRegime === 'PONZI' || currentRegime === 'MINSKY_MOMENT') && asset.liquidityScore < 70) {
        slippagePct = (100 - asset.liquidityScore) * 0.4;
      }
      const slippageAmount = (baseValue * slippagePct) / 100;
      const netProceeds = baseValue - slippageAmount;

      setCash((prev) => prev + netProceeds);

      setPortfolio((prev) => {
        const remainingShares = existing.shares - shares;
        if (remainingShares <= 0) {
          const copy = { ...prev };
          delete copy[asset.id];
          return copy;
        } else {
          const remainingCost = existing.averagePrice * remainingShares;
          return {
            ...prev,
            [asset.id]: {
              ...existing,
              shares: remainingShares,
              totalInvested: remainingCost
            }
          };
        }
      });

      sounds.playTradeSuccess();
    }

    // Record transaction in history
    setTransactions((prev) => [
      {
        month: currentMonth,
        assetId: asset.id,
        ticker: asset.ticker,
        type: action,
        shares,
        price: asset.price,
        totalValue: baseValue
      },
      ...prev
    ]);
  };

  // Advance Month Simulation
  const handleAdvanceMonth = () => {
    sounds.playAdvance();
    const nextMonth = currentMonth + 1;

    // Check for Dividend payouts on value assets
    let dividendCashReceived = 0;
    Object.values(portfolio).forEach((pos) => {
      const asset = assets.find((a) => a.id === pos.assetId);
      if (asset && asset.dividendYield > 0 && pos.shares > 0) {
        const monthlyYield = (asset.dividendYield / 100) / 12;
        const divAmount = pos.shares * asset.price * monthlyYield;
        dividendCashReceived += divAmount;
      }
    });

    if (dividendCashReceived > 0) {
      setCash((prev) => prev + dividendCashReceived);
    }

    // Anomaly triggers in campaign mode
    const anomalyInNextMonth = CAMPAIGN_PHASES.find(
      (p) => p.anomaly && p.anomaly.month === nextMonth
    )?.anomaly;

    // Update asset prices based on cycle, factors, and anomalies
    setAssets((prevAssets) => {
      return prevAssets.map((asset) => {
        let returnRate = 0;

        // Base risk-free return for Selic
        if (asset.category === 'RISK_FREE') {
          returnRate = 0.0085; // approx 10.5% a.a.
        } else {
          // General stochastic drift based on Beta and regime
          const marketShock = (Math.random() - 0.48) * 0.08;
          let regimeDrift = 0.01;

          if (currentRegime === 'HEDGE') regimeDrift = 0.012;
          if (currentRegime === 'SPECULATIVE') regimeDrift = 0.035;
          if (currentRegime === 'PONZI') regimeDrift = 0.06;

          returnRate = regimeDrift + asset.beta * marketShock;

          // Pull towards intrinsic value over time
          const valuationDiscrepancy = (asset.intrinsicValue - asset.price) / asset.intrinsicValue;
          returnRate += valuationDiscrepancy * 0.05;
        }

        // Apply explicit anomaly shocks if applicable
        if (anomalyInNextMonth) {
          if (anomalyInNextMonth.effect.targetAssetCategories.includes(asset.category)) {
            returnRate += (anomalyInNextMonth.effect.multiplier - 1);
          }
        }

        // Special Minsky Moment crash mechanics at Month 13
        if (!isSandboxMode && nextMonth === 13) {
          if (asset.category === 'SPECULATIVE') {
            returnRate = -0.75; // -75% crash
          } else if (asset.category === 'TECH') {
            returnRate = -0.48; // -48% drop
          } else if (asset.category === 'SMALL_CAP') {
            returnRate = -0.38; // -38% drop
          } else if (asset.category === 'INDEX') {
            returnRate = -0.22; // -22% drop
          } else if (asset.category === 'VALUE') {
            returnRate = -0.10; // -10% defensive drop
          } else if (asset.category === 'HEDGE') {
            returnRate = +0.12; // Gold surges +12%
          } else if (asset.category === 'RISK_FREE') {
            returnRate = +0.0085;
          }
        }

        // Compute new price with minimum barrier
        const newPrice = Math.max(0.5, asset.price * (1 + returnRate));
        const updatedHistory = [...asset.historicalPrices, newPrice];

        // Liquidity reduction during crisis
        let newLiquidity = asset.liquidityScore;
        if (!isSandboxMode && nextMonth >= 13 && nextMonth <= 14) {
          if (asset.category === 'SPECULATIVE') newLiquidity = 15;
          if (asset.category === 'TECH') newLiquidity = 45;
          if (asset.category === 'SMALL_CAP') newLiquidity = 35;
        }

        return {
          ...asset,
          price: Number(newPrice.toFixed(2)),
          liquidityScore: newLiquidity,
          historicalPrices: updatedHistory
        };
      });
    });

    // Update history of net worth
    setNetWorthHistory((prev) => [...prev, netWorth]);

    // Check for triggered modals
    if (anomalyInNextMonth) {
      setActiveAnomaly(anomalyInNextMonth);
      sounds.playWarning();
    }

    if (!isSandboxMode && nextMonth === 13) {
      setShowMinskyCrashModal(true);
      sounds.playCrashAlert();
    }

    if (!isSandboxMode && nextMonth >= 15) {
      setShowFinalReport(true);
      sounds.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }

    setCurrentMonth(nextMonth);
  };

  // Reset Game
  const handleResetGame = () => {
    sounds.playClick();
    setCurrentMonth(1);
    setCash(INITIAL_CAPITAL);
    setPortfolio({});
    setAssets(INITIAL_ASSETS);
    setTransactions([]);
    setNetWorthHistory([INITIAL_CAPITAL]);
    setFomoTradesCount(0);
    setAnchoringMistakesCount(0);
    setIsSandboxMode(false);
    setShowFinalReport(false);
    setShowMinskyCrashModal(false);
    setActiveAnomaly(null);
  };

  // Metrics for final synthesis
  const computedMetrics: GameMetrics = useMemo(() => {
    const totalReturnPct = ((netWorth - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
    const minskySurvivalRate = netWorth >= INITIAL_CAPITAL * 0.9 ? 0.95 : netWorth >= INITIAL_CAPITAL * 0.7 ? 0.75 : 0.45;

    return {
      totalTrades: transactions.length,
      fomoTrades: fomoTradesCount,
      anchoringMistakesCount,
      minskySurvivalRate,
      portfolioBeta,
      sharpeRatio: Number(((totalReturnPct - 8) / 15).toFixed(2)),
      maxDrawdown: 25.4,
      totalReturnPct
    };
  }, [netWorth, transactions, fomoTradesCount, anchoringMistakesCount, portfolioBeta]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        currentMonth={currentMonth}
        totalMonths={15}
        phaseName={currentPhase.name}
        regime={currentRegime}
        netWorth={netWorth}
        initialCapital={INITIAL_CAPITAL}
        cash={cash}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onAdvanceMonth={handleAdvanceMonth}
        onResetGame={handleResetGame}
        onOpenLab={() => setShowLabModal(true)}
        isSandboxMode={isSandboxMode}
      />

      {/* Real-Time Animated Theorists Advisory Row */}
      <TheoristAvatars
        currentQuotes={currentQuotes}
        selectedTheoristId={selectedTheoristForDetail}
        onSelectTheorist={(id) => setSelectedTheoristForDetail(id)}
        onOpenLab={() => setShowLabModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 space-y-4 pb-20 sm:pb-8">
        {/* Mobile Tab Navigation Dock (Visible on small screens) */}
        <div className="flex sm:hidden bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'MARKET' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Mercado
          </button>
          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'PORTFOLIO' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Carteira
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'HISTORY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Extrato ({transactions.length})
          </button>
        </div>

        {/* Narrative Banner for Current Phase */}
        <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded">
                Objetivo da Fase
              </span>
              <span className="text-xs font-bold text-white">
                {currentPhase.subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentPhase.objective}
            </p>
          </div>

          <button
            onClick={() => setShowLabModal(true)}
            className="self-start sm:self-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Fórmulas & Modelos
          </button>
        </div>

        {/* Portfolio Summary Overview */}
        <PortfolioSummary
          portfolio={portfolio}
          assets={assets}
          cash={cash}
          initialCapital={INITIAL_CAPITAL}
          onTradeClick={handleOpenTrade}
        />

        {/* Content based on Active View or Desktop Layout */}
        <div className="space-y-4">
          {/* Market View */}
          <div className={`${activeTab === 'MARKET' ? 'block' : 'hidden sm:block'}`}>
            <MarketView
              assets={assets}
              portfolio={portfolio}
              regime={currentRegime}
              onTradeClick={handleOpenTrade}
            />
          </div>

          {/* Transaction History (Visible on desktop or when tab is active) */}
          <div className={`${activeTab === 'HISTORY' ? 'block' : 'hidden sm:block'}`}>
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <History className="w-4 h-4 text-indigo-400" />
                Histórico de Ordens Executadas
              </h3>
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  Nenhuma ordem executada ainda neste ciclo.
                </p>
              ) : (
                <div className="overflow-x-auto max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-1.5">Mês</th>
                        <th className="pb-1.5">Tipo</th>
                        <th className="pb-1.5">Ativo</th>
                        <th className="pb-1.5">Cotas</th>
                        <th className="pb-1.5">Preço</th>
                        <th className="pb-1.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {transactions.slice(0, 10).map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 text-slate-400">Mês {tx.month}</td>
                          <td className="py-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                tx.type === 'BUY'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-rose-950 text-rose-400'
                              }`}
                            >
                              {tx.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                            </span>
                          </td>
                          <td className="py-2 font-mono font-bold text-white">{tx.ticker}</td>
                          <td className="py-2 text-slate-200">{tx.shares}</td>
                          <td className="py-2 font-mono text-slate-300">R$ {tx.price.toFixed(2)}</td>
                          <td className="py-2 font-mono text-right font-bold text-white">
                            R$ {tx.totalValue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* 1. Trade Modal */}
      {tradeModal.isOpen && (
        <TradeModal
          asset={tradeModal.asset}
          tradeType={tradeModal.action}
          cash={cash}
          position={tradeModal.asset ? portfolio[tradeModal.asset.id] : undefined}
          regime={currentRegime}
          portfolioBeta={portfolioBeta}
          onClose={() => setTradeModal({ isOpen: false, asset: null, action: 'BUY' })}
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* 2. Theorist Consultation Modal */}
      {selectedTheoristForDetail && (
        <TheoristDetailModal
          theoristId={selectedTheoristForDetail}
          onClose={() => setSelectedTheoristForDetail(null)}
          currentSpeech={currentQuotes[selectedTheoristForDetail]}
          regime={currentRegime}
        />
      )}

      {/* 3. Calendar Anomaly Card Modal */}
      {activeAnomaly && (
        <AnomalyCardModal
          anomaly={activeAnomaly}
          onDismiss={() => setActiveAnomaly(null)}
        />
      )}

      {/* 4. Minsky Crisis Klaxon Modal */}
      {showMinskyCrashModal && (
        <MinskyCrisisModal
          onDismiss={() => setShowMinskyCrashModal(false)}
        />
      )}

      {/* 5. Educational Lab Modal */}
      {showLabModal && (
        <EducationalLabModal
          onClose={() => setShowLabModal(false)}
        />
      )}

      {/* 6. Final Report Synthesis Modal */}
      {showFinalReport && (
        <FinalReportModal
          initialCapital={INITIAL_CAPITAL}
          finalNetWorth={netWorth}
          metrics={computedMetrics}
          onRestart={handleResetGame}
          onContinueSandbox={() => {
            setShowFinalReport(false);
            setIsSandboxMode(true);
          }}
        />
      )}
    </div>
  );
};

export default App;
