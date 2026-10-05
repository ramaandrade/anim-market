import { GamePhase } from '../types/market';

export const CAMPAIGN_PHASES: GamePhase[] = [
  {
    phaseNumber: 1,
    name: 'O Mundo Eficiente',
    subtitle: 'A Era Neoclássica do Robô CAPM',
    startMonth: 1,
    endMonth: 3,
    minskyRegime: 'HEDGE',
    objective: 'Construa uma carteira diversificada e compare o retorno esperado dos ativos com a previsão do CAPM baseada no Beta.',
    contextNarrative: 'Você entra no mercado em um período de calmaria e equilíbrio. A Hipótese do Mercado Eficiente reina soberana: as informações são digeridas instantaneamente pelos preços. O Robô CAPM o orienta a alocar seus recursos na Fronteira Eficiente.',
  },
  {
    phaseNumber: 2,
    name: 'O Desafio das Anomalias',
    subtitle: 'Fama-French contra o CAPM Puro',
    startMonth: 4,
    endMonth: 7,
    minskyRegime: 'HEDGE',
    objective: 'Enfrente o "Efeito Janeiro" e a anomalia "Vender em Maio". Use filtros fatoriais (Small Minus Big e High Minus Low) para ajustar sua estratégia.',
    contextNarrative: 'Distorções empíricas começam a abalar a teoria pura. Padrões de calendário e prêmios de risco por tamanho de empresa desafiam o Robô CAPM, que insiste se tratar de mero ruído transitório.',
    anomaly: {
      id: 'anom_jan',
      title: 'Anomalia do Calendário: Efeito Janeiro & Rotação de Fatores',
      month: 5,
      description: 'Historicamente no início do ano e períodos de rotação fiscal, ações de pequena capitalização (Small Caps) apresentam valorizações muito acima do predito pelo Beta tradicional.',
      anomalyType: 'CALENDAR_JANUARY',
      impactSummary: 'Small Caps (SMAL3) recebem impulso de +28% de retorno. Ações de Valor (VALO3) mantêm resiliência com Fator HML.',
      capmPerspective: 'Isto é uma anomalia empírica passageira. Tentar explorá-la ativamente gera custos de transação que anulam o retorno!',
      behavioralPerspective: 'Investidores vendem ativos perdedores em dezembro para abater impostos e recompram euforicamente em janeiro, gerando essa distorção comportamental!',
      minskyPerspective: 'A liquidez está farta, facilitando especulações em empresas menores. Observe o volume antes de se empolgar!',
      effect: {
        targetAssetCategories: ['SMALL_CAP'],
        multiplier: 1.28
      }
    }
  },
  {
    phaseNumber: 3,
    name: 'A Dança da Irracionalidade',
    subtitle: 'Manada, FOMO e Euforia Comportamental',
    startMonth: 8,
    endMonth: 11,
    minskyRegime: 'SPECULATIVE',
    objective: 'Resista às tentações de excesso de confiança e overtrading enquanto ativos especulativos disparam sem respaldo de caixa.',
    contextNarrative: 'A economia aquece e os participantes esquecem os riscos. O Dr. Psique alerta: o medo de ficar de fora (FOMO) e a ancoragem cognitiva estão empurrando a manada para ativos de crescimento esticado e moedas meme.',
    anomaly: {
      id: 'anom_may',
      title: 'Anomalia: "Vender em Maio e Ir Embora" & Bolha Tech',
      month: 9,
      description: 'O ditado secular de Wall Street alerta que retornos de maio a outubro são historicamente fracos, mas a euforia com ativos tecnológicos desafia a sabedoria convencional!',
      anomalyType: 'SELL_IN_MAY',
      impactSummary: 'Ações de tecnologia e cripto disparam +45%, enquanto índices amplos lateralizam.',
      capmPerspective: 'Retornos passados não garantem retornos futuros. Seguir ditados populares viola a hipótese de mercado eficiente!',
      behavioralPerspective: 'O excesso de confiança está em nível crítico! Investidores novatos estão dobrando apostas por acreditarem que os preços nunca mais cairão.',
      minskyPerspective: 'Entramos oficialmente no regime Especulativo! O endividamento subiu e os fluxos de caixa apenas rolam dívidas. O perigo se aproxima!',
      effect: {
        targetAssetCategories: ['TECH', 'SPECULATIVE'],
        multiplier: 1.45
      }
    }
  },
  {
    phaseNumber: 4,
    name: 'O Momento Minsky',
    subtitle: 'A Crise de Liquidez e o Choque Sistêmico',
    startMonth: 12,
    endMonth: 14,
    minskyRegime: 'PONZI', // Transição rápida para MINSKY_MOMENT no mês 13
    objective: 'Sobreviva ao estouro da bolha, proteja seu patrimônio com ativos de refúgio (Tesouro / Ouro) e vivencie a evaporação da liquidez.',
    contextNarrative: 'A estabilidade acumulada gerou uma pirâmide frágil. De repente, a liquidez some, o crédito trava e as ordens de venda forçada deflagram o lendário Momento Minsky!',
    anomaly: {
      id: 'anom_minsky_crash',
      title: 'O Estouro do Momento Minsky: Liquidez Congelada!',
      month: 13,
      description: 'A corrida para a porta de saída gera uma espiral de vendas forçadas. Ativos especulativos sofrem desconto brutal e não encontram compradores!',
      anomalyType: 'LIQUIDITY_FREEZE',
      impactSummary: 'Ativos especulativos desabam até -75%. Spreads explodem e liquidez evapora. Títulos públicos e Ouro tornam-se o único porto seguro.',
      capmPerspective: 'O modelo previu risco, mas a velocidade da queda violou premissas de distribuição normal. O Beta de todos os ativos convergiu!',
      behavioralPerspective: 'Aversão à perda extrema! Investidores em pânico paralisam ou vendem no fundo do poço para estancar a dor psicológica.',
      minskyPerspective: 'Eu avisei, marujos! A ilusão da liquidez foi desmascarada: liquidez só existe se ninguém mais precisar dela ao mesmo tempo!',
      effect: {
        targetAssetCategories: ['SPECULATIVE', 'TECH', 'SMALL_CAP'],
        multiplier: 0.35,
        liquidityDrain: 0.70
      }
    }
  },
  {
    phaseNumber: 5,
    name: 'A Grande Síntese',
    subtitle: 'Racionalidade, Psicologia e Dinâmica Sistêmica',
    startMonth: 15,
    endMonth: 15,
    minskyRegime: 'HEDGE',
    objective: 'Examine seu relatório analítico de performance, seus vieses comportamentais e descubra como integrar as 3 escolas financeiras.',
    contextNarrative: 'A poeira baixou e os mercados entram em reconstrução. Agora, Robô CAPM, Dr. Psique e Capitão Minsky sentam-se à mesa para avaliar as lições da sua jornada.',
  }
];
