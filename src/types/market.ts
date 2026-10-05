export type MinskyRegime = 'HEDGE' | 'SPECULATIVE' | 'PONZI' | 'MINSKY_MOMENT';

export type TheoristId = 'capm_bot' | 'dr_psyche' | 'captain_minsky';

export interface Theorist {
  id: TheoristId;
  name: string;
  title: string;
  school: string;
  color: string;
  accentBg: string;
  avatarIcon: string;
  philosophy: string;
  keyConcepts: string[];
}

export interface TheoristSpeech {
  theoristId: TheoristId;
  mood: 'neutral' | 'happy' | 'warning' | 'shocked' | 'proud';
  message: string;
  detailedTip?: string;
  relevantConcept?: string;
}

export type AssetCategory = 'RISK_FREE' | 'INDEX' | 'VALUE' | 'SMALL_CAP' | 'TECH' | 'SPECULATIVE' | 'HEDGE';

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  price: number;
  intrinsicValue: number;
  historicalPrices: number[];
  
  // CAPM & Factor Model attributes
  beta: number; // Systematic risk relative to market
  smbExposure: number; // Small Minus Big factor (-1 to +1)
  hmlExposure: number; // High Minus Low factor (-1 to +1)
  
  // Minsky & Behavioral attributes
  liquidityScore: number; // 0 to 100% (ability to sell without slippage)
  speculativeIndex: number; // 0 to 100% (how much driven by pure sentiment vs cash flow)
  dividendYield: number; // annual yield %
  description: string;
}

export interface PortfolioPosition {
  assetId: string;
  shares: number;
  averagePrice: number; // Anchoring reference point!
  totalInvested: number;
}

export interface TransactionRecord {
  month: number;
  assetId: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  totalValue: number;
  slippageIncurred?: number;
}

export interface AnomalyEvent {
  id: string;
  title: string;
  month: number;
  description: string;
  anomalyType: 'CALENDAR_JANUARY' | 'SELL_IN_MAY' | 'MOMENTUM_EXPLOSION' | 'LIQUIDITY_FREEZE' | 'CREDIT_EXPANSION';
  impactSummary: string;
  capmPerspective: string;
  behavioralPerspective: string;
  minskyPerspective: string;
  effect: {
    targetAssetCategories: AssetCategory[];
    multiplier: number;
    liquidityDrain?: number;
  };
}

export interface GamePhase {
  phaseNumber: number;
  name: string;
  subtitle: string;
  startMonth: number;
  endMonth: number;
  minskyRegime: MinskyRegime;
  objective: string;
  contextNarrative: string;
  anomaly?: AnomalyEvent;
}

export interface GameMetrics {
  totalTrades: number;
  fomoTrades: number;
  anchoringMistakesCount: number; // Times held a declining asset just to recover average price
  minskySurvivalRate: number;
  portfolioBeta: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalReturnPct: number;
}
