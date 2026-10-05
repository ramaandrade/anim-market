import React, { useState, useMemo } from 'react';
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
import { TheoristFeed } from './components/TheoristFeed';
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
  Brain, 
  BookOpen, 
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_CAPITAL = 10000.0;

export const App: React.FC = () => {
  // Mobile Bottom Navigation Bar Tabs
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'THEORISTS' | 'LAB'>('MARKET');

  // Game progression state
  const [currentMonth, setCurrentMonth] = useState<number>(1);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [cash, setCash] = useState<number>(INITIAL_CAPITAL);
  const [portfolio, setPortfolio] = useState<Record<string, PortfolioPosition>>({});
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  // Net worth tracking for metrics
  const [, setNetWorthHistory] = useState<number[]>([INITIAL_CAPITAL]);

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
      const existing = portfolio[asset.id];
      if (!existing || existing.shares < shares) return;

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

    const anomalyInNextMonth = CAMPAIGN_PHASES.find(
      (p) => p.anomaly && p.anomaly.month === nextMonth
    )?.anomaly;

    setAssets((prevAssets) => {
      return prevAssets.map((asset) => {
        let returnRate = 0;

        if (asset.category === 'RISK_FREE') {
          returnRate = 0.0085;
        } else {
          const marketShock = (Math.random() - 0.48) * 0.08;
          let regimeDrift = 0.01;

          if (currentRegime === 'HEDGE') regimeDrift = 0.012;
          if (currentRegime === 'SPECULATIVE') regimeDrift = 0.035;
          if (currentRegime === 'PONZI') regimeDrift = 0.06;

          returnRate = regimeDrift + asset.beta * marketShock;
          const valuationDiscrepancy = (asset.intrinsicValue - asset.price) / asset.intrinsicValue;
          returnRate += valuationDiscrepancy * 0.05;
        }

        if (anomalyInNextMonth) {
          if (anomalyInNextMonth.effect.targetAssetCategories.includes(asset.category)) {
            returnRate += (anomalyInNextMonth.effect.multiplier - 1);
          }
        }

        if (!isSandboxMode && nextMonth === 13) {
          if (asset.category === 'SPECULATIVE') {
            returnRate = -0.75;
          } else if (asset.category === 'TECH') {
            returnRate = -0.48;
          } else if (asset.category === 'SMALL_CAP') {
            returnRate = -0.38;
          } else if (asset.category === 'INDEX') {
            returnRate = -0.22;
          } else if (asset.category === 'VALUE') {
            returnRate = -0.10;
          } else if (asset.category === 'HEDGE') {
            returnRate = +0.12;
          } else if (asset.category === 'RISK_FREE') {
            returnRate = +0.0085;
          }
        }

        const newPrice = Math.max(0.5, asset.price * (1 + returnRate));
        const updatedHistory = [...asset.historicalPrices, newPrice];

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

    setNetWorthHistory((prev) => [...prev, netWorth]);

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
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Mobile Smartphone Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative shadow-2xl border-x border-slate-800/80">
        {/* Mobile Header Bar */}
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

        {/* Mobile Content Area (Padded for fixed bottom navigation dock) */}
        <main className="flex-1 p-3 space-y-3 pb-24 overflow-y-auto">
          {/* TAB 1: MERCADO */}
          {activeTab === 'MARKET' && (
            <div className="space-y-3">
              {/* Top Theorist Story Chips */}
              <TheoristAvatars
                currentQuotes={currentQuotes}
                selectedTheoristId={selectedTheoristForDetail}
                onSelectTheorist={(id) => setSelectedTheoristForDetail(id)}
                onOpenLab={() => setShowLabModal(true)}
              />

              {/* Current Narrative Phase Banner */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-bold text-indigo-400 block truncate">
                    {currentPhase.subtitle}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-tight truncate">
                    {currentPhase.objective}
                  </p>
                </div>
              </div>

              {/* Asset Market Cards */}
              <MarketView
                assets={assets}
                portfolio={portfolio}
                regime={currentRegime}
                onTradeClick={handleOpenTrade}
              />
            </div>
          )}

          {/* TAB 2: CARTEIRA */}
          {activeTab === 'PORTFOLIO' && (
            <div className="space-y-3">
              <PortfolioSummary
                portfolio={portfolio}
                assets={assets}
                cash={cash}
                initialCapital={INITIAL_CAPITAL}
                onTradeClick={handleOpenTrade}
              />

              {/* Transaction History Card */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  Extrato de Ordens ({transactions.length})
                </h4>

                {transactions.length === 0 ? (
                  <p className="text-[11px] text-slate-500 py-2 text-center">
                    Nenhuma ordem executada ainda.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {transactions.slice(0, 10).map((tx, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1 py-0.2 rounded font-bold text-[9px] ${
                                tx.type === 'BUY'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-rose-950 text-rose-400'
                              }`}
                            >
                              {tx.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                            </span>
                            <span className="font-mono font-bold text-white">{tx.ticker}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Mês {tx.month} • {tx.shares} cotas
                          </span>
                        </div>
                        <div className="font-mono font-bold text-white text-xs">
                          R$ {tx.totalValue.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEÓRICOS (CHAT & FEED) */}
          {activeTab === 'THEORISTS' && (
            <TheoristFeed
              currentQuotes={currentQuotes}
              onSelectTheorist={(id) => setSelectedTheoristForDetail(id)}
              onOpenLab={() => setShowLabModal(true)}
            />
          )}

          {/* TAB 4: LABORATÓRIO TEÓRICO */}
          {activeTab === 'LAB' && (
            <div className="space-y-3 pb-4">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Laboratório Teórico Mobile
                </h3>
                <p className="text-xs text-slate-400">
                  Explore as fórmulas e modelos que governam o comportamento dos preços.
                </p>
              </div>

              <button
                onClick={() => setShowLabModal(true)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-4 h-4" />
                <span>Abrir Calculadora & Modelos Interativos</span>
              </button>
            </div>
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation Dock (Thumb-friendly tab bar) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'MARKET' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Mercado</span>
          </button>

          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'PORTFOLIO' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px]">Carteira</span>
          </button>

          <button
            onClick={() => setActiveTab('THEORISTS')}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'THEORISTS' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-[10px]">Teóricos</span>
          </button>

          <button
            onClick={() => setActiveTab('LAB')}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'LAB' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Laboratório</span>
          </button>
        </nav>

        {/* Mobile Bottom Sheets & Dialogs */}
        {tradeModal.isOpen && tradeModal.asset && (
          <TradeModal
            key={`${tradeModal.asset.id}-${tradeModal.action}`}
            asset={tradeModal.asset}
            tradeType={tradeModal.action}
            cash={cash}
            position={portfolio[tradeModal.asset.id]}
            regime={currentRegime}
            portfolioBeta={portfolioBeta}
            onClose={() => setTradeModal({ isOpen: false, asset: null, action: 'BUY' })}
            onExecuteTrade={handleExecuteTrade}
          />
        )}

        {selectedTheoristForDetail && (
          <TheoristDetailModal
            theoristId={selectedTheoristForDetail}
            onClose={() => setSelectedTheoristForDetail(null)}
            currentSpeech={currentQuotes[selectedTheoristForDetail]}
            regime={currentRegime}
          />
        )}

        {activeAnomaly && (
          <AnomalyCardModal
            anomaly={activeAnomaly}
            onDismiss={() => setActiveAnomaly(null)}
          />
        )}

        {showMinskyCrashModal && (
          <MinskyCrisisModal
            onDismiss={() => setShowMinskyCrashModal(false)}
          />
        )}

        {showLabModal && (
          <EducationalLabModal
            onClose={() => setShowLabModal(false)}
          />
        )}

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
    </div>
  );
};

export default App;
