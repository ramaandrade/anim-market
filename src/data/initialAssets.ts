import { Asset } from '../types/market';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'lft',
    ticker: 'LFT-SELIC',
    name: 'Tesouro Selic (Livre de Risco)',
    category: 'RISK_FREE',
    price: 100.0,
    intrinsicValue: 100.0,
    historicalPrices: [100.0, 100.8, 101.6, 102.5, 103.3, 104.2],
    beta: 0.0,
    smbExposure: 0.0,
    hmlExposure: 0.0,
    liquidityScore: 100,
    speculativeIndex: 0,
    dividendYield: 10.5,
    description: 'Ativo de refúgio absoluto com taxa livre de risco (Rf). Liquidez diária sem volatilidade.'
  },
  {
    id: 'bova',
    ticker: 'IBOV-ETF',
    name: 'Fundo de Índice Amplo (Mercado)',
    category: 'INDEX',
    price: 120.0,
    intrinsicValue: 122.0,
    historicalPrices: [115.0, 117.5, 116.0, 119.0, 120.0, 120.0],
    beta: 1.0,
    smbExposure: 0.0,
    hmlExposure: 0.0,
    liquidityScore: 98,
    speculativeIndex: 25,
    dividendYield: 4.2,
    description: 'A carteira de mercado do CAPM. Representa o risco sistemático geral do ecossistema.'
  },
  {
    id: 'valo3',
    ticker: 'VALO3',
    name: 'Cimento & Energia Nacional',
    category: 'VALUE',
    price: 45.0,
    intrinsicValue: 52.0,
    historicalPrices: [42.0, 43.5, 44.0, 43.0, 44.5, 45.0],
    beta: 0.65,
    smbExposure: -0.5, // Grande empresa (Big)
    hmlExposure: 0.85, // Fator Valor Alto (High Book-to-Market)
    liquidityScore: 85,
    speculativeIndex: 15,
    dividendYield: 7.8,
    description: 'Empresa madura com forte geração de caixa e dividendos. Favorita do modelo Fama-French (Fator HML).'
  },
  {
    id: 'smal3',
    ticker: 'SMAL3',
    name: 'BioLog Tech & Varejo Ágil',
    category: 'SMALL_CAP',
    price: 18.0,
    intrinsicValue: 20.0,
    historicalPrices: [16.0, 16.8, 15.5, 17.2, 17.8, 18.0],
    beta: 1.45,
    smbExposure: 0.9, // Pequena empresa (Small)
    hmlExposure: -0.2,
    liquidityScore: 65,
    speculativeIndex: 45,
    dividendYield: 1.5,
    description: 'Pequena capitalização. Sujeita a fortes assimetrias de informação e protagonista do "Efeito Janeiro".'
  },
  {
    id: 'tech3',
    ticker: 'NEO-TECH',
    name: 'Sintética AI Cloud',
    category: 'TECH',
    price: 85.0,
    intrinsicValue: 70.0, // Já negociando acima do valor intrínseco
    historicalPrices: [60.0, 68.0, 72.0, 79.0, 82.0, 85.0],
    beta: 1.85,
    smbExposure: 0.4,
    hmlExposure: -0.9, // Growth puro (Low Book-to-Market)
    liquidityScore: 78,
    speculativeIndex: 70,
    dividendYield: 0.0,
    description: 'Ação de hiper-crescimento e múltiplos esticados. Alimentada por expectativas de lucros em futuro distante.'
  },
  {
    id: 'meme',
    ticker: 'MOON-COIN',
    name: 'HyperMeme Protocol 42',
    category: 'SPECULATIVE',
    price: 12.0,
    intrinsicValue: 1.0, // Quase zero fundamento!
    historicalPrices: [3.0, 4.5, 7.0, 9.5, 10.8, 12.0],
    beta: 2.8,
    smbExposure: 0.8,
    hmlExposure: -1.0,
    liquidityScore: 35, // Liquidez ilusória que congela na crise!
    speculativeIndex: 98,
    dividendYield: 0.0,
    description: 'Ativo puramente Ponzi. Não gera caixa, sobe apenas porque novos investidores acreditam que subirá. Risco extremo de corrida bancária.'
  },
  {
    id: 'gold',
    ticker: 'AURO-HEDGE',
    name: 'Contratos de Ouro Físico',
    category: 'HEDGE',
    price: 250.0,
    intrinsicValue: 250.0,
    historicalPrices: [248.0, 249.0, 250.0, 248.5, 251.0, 250.0],
    beta: -0.25, // Correlação negativa ou nula com o mercado
    smbExposure: 0.0,
    hmlExposure: 0.3,
    liquidityScore: 90,
    speculativeIndex: 20,
    dividendYield: 0.0,
    description: 'Reserva de valor clássica para incerteza fundamental keynesiana e proteção contra colapso de crédito.'
  }
];
