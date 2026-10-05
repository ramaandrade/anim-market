import { Theorist, TheoristSpeech, MinskyRegime } from '../types/market';

export const THEORISTS: Record<string, Theorist> = {
  capm_bot: {
    id: 'capm_bot',
    name: 'Robô CAPM',
    title: 'O Oráculo Racional',
    school: 'Finanças Neoclássicas & HME',
    color: '#38bdf8', // Sky blue
    accentBg: 'rgba(56, 189, 248, 0.15)',
    avatarIcon: 'Bot',
    philosophy: 'Os mercados são eficientes em sua forma semiforte. Todo ativo é precificado com base em seu risco sistemático (Beta). Bater o mercado consistentemente sem assumir risco adicional é matematicamente impossível.',
    keyConcepts: [
      'Hipótese do Mercado Eficiente (HME)',
      'Modelo CAPM: E(R) = Rf + β(Rm - Rf)',
      'Fator Fama-French: Tamanho (SMB) & Valor (HML)',
      'Diversificação de Markowitz (Fronteira Eficiente)'
    ]
  },
  dr_psyche: {
    id: 'dr_psyche',
    name: 'Dr. Psique',
    title: 'O Terapeuta de Mercado',
    school: 'Finanças Comportamentais',
    color: '#ec4899', // Pink / Fuchsia
    accentBg: 'rgba(236, 72, 153, 0.15)',
    avatarIcon: 'Brain',
    philosophy: 'Investidores não são computadores de maximização de utilidade. Suas decisões sofrem desvios sistemáticos causados por medo, ganância, aversão à perda e ancoragem em preços passados.',
    keyConcepts: [
      'Teoria da Perspectiva (Kahneman & Tversky)',
      'Aversão à Perda (Dor de perder é 2x maior que o ganho)',
      'Viés de Ancoragem (Apego ao preço de compra)',
      'Efeito Manada (Herding) & Excesso de Confiança'
    ]
  },
  captain_minsky: {
    id: 'captain_minsky',
    name: 'Capitão Minsky',
    title: 'O Velho Lobo dos Ciclos',
    school: 'Visão Pós-Keynesiana',
    color: '#eab308', // Amber / Gold
    accentBg: 'rgba(234, 179, 8, 0.15)',
    avatarIcon: 'Anchor',
    philosophy: 'A estabilidade gera complacência; a complacência gera alavancagem excessiva; e a alavancagem cria fragilidade estrutural que culmina no colapso da liquidez. O futuro é incerteza fundamental, não mero risco calculável.',
    keyConcepts: [
      'Hipótese da Instabilidade Financeira (HIF)',
      '3 Regimes: Hedge → Especulativo → Ponzi',
      'O "Momento Minsky" (Crise de Liquidez e Vendas Forçadas)',
      'Incerteza Fundamental (Keynes)'
    ]
  }
};

export function getRegimeQuotes(regime: MinskyRegime, _month: number): Record<string, TheoristSpeech> {
  switch (regime) {
    case 'HEDGE':
      return {
        capm_bot: {
          theoristId: 'capm_bot',
          mood: 'proud',
          message: 'Ambiente ideal: o prêmio de risco do mercado reflete o Beta dos ativos. Mantenha uma carteira diversificada na fronteira eficiente e evite custos desnecessários de corretagem!',
          detailedTip: 'No modelo CAPM, o risco não-sistemático (específico de cada empresa) é eliminado através da diversificação.',
          relevantConcept: 'Fronteira Eficiente de Markowitz'
        },
        dr_psyche: {
          theoristId: 'dr_psyche',
          mood: 'neutral',
          message: 'Tudo parece calmo, mas cuidado com o excesso de confiança precoce. Quando o mercado sobe sem sobressaltos, investidores começam a acreditar que são gênios da seleção de ações.',
          detailedTip: 'O viés de autossuficiência faz investidores atribuírem retornos de mercado às suas próprias habilidades.',
          relevantConcept: 'Viés de Excesso de Confiança'
        },
        captain_minsky: {
          theoristId: 'captain_minsky',
          mood: 'warning',
          message: 'Aproveitem o mar calmo, marinheiros! Em regime Hedge, o fluxo de caixa dos agentes cobre juros e dívida. Mas lembrem-se da minha lei: a própria estabilidade semeia a semente da instabilidade.',
          detailedTip: 'Quando a economia passa muito tempo sem choques, banqueiros e investidores reduzem suas margens de segurança.',
          relevantConcept: 'Financiamento Hedge'
        }
      };

    case 'SPECULATIVE':
      return {
        capm_bot: {
          theoristId: 'capm_bot',
          mood: 'warning',
          message: 'Alerta de variância anômala! Alguns ativos estão descolando do Beta fundamental. No entanto, se o mercado for eficiente, qualquer tentativa de arbitragem trará custos sem garantia de alfa.',
          detailedTip: 'O modelo de 3 fatores de Fama-French ajuda a explicar anomalias com os fatores de Tamanho (SMB) e Valor (HML).',
          relevantConcept: 'Modelo Fatorial de Fama-French'
        },
        dr_psyche: {
          theoristId: 'dr_psyche',
          mood: 'warning',
          message: 'Sinto o cheiro de FOMO (medo de ficar de fora)! O Dr. Shiller chama isso de "Exuberância Irracional". O efeito manada está acelerando e vejo você hesitando em rebalancear.',
          detailedTip: 'A ancoragem no preço de compra impede investidores de realizar prejuízos ou proteger lucros.',
          relevantConcept: 'Efeito Manada & FOMO'
        },
        captain_minsky: {
          theoristId: 'captain_minsky',
          mood: 'shocked',
          message: 'As águas estão mudando para o regime Especulativo! Agora, os fluxos de caixa mal pagam os juros, dependendo da rolagem de crédito. As margens de segurança estão encolhendo!',
          detailedTip: 'No regime especulativo, o sistema financeiro se torna altamente vulnerável a aumentos nas taxas de juros.',
          relevantConcept: 'Financiamento Especulativo'
        }
      };

    case 'PONZI':
      return {
        capm_bot: {
          theoristId: 'capm_bot',
          mood: 'shocked',
          message: 'ERRO 404: Racionalidade não encontrada! O prêmio de risco implícito em ativos especulativos não faz sentido matemático. A volatilidade implícita extrapolou 4 desvios padrão!',
          detailedTip: 'Mesmo a teoria do passeio aleatório reconhece que em bolhas os preços se afastam do valor fundamental.',
          relevantConcept: 'Limites da Arbitragem'
        },
        dr_psyche: {
          theoristId: 'dr_psyche',
          mood: 'shocked',
          message: 'Alucinação coletiva em curso! Investidores estão anestesiados pelo viés de recência: acham que porque subiu ontem, subirá para sempre. E a dor da aversão à perda será brutal quando virar!',
          detailedTip: 'Kahneman e Tversky demonstraram que a curva de utilidade para perdas é muito mais íngreme.',
          relevantConcept: 'Teoria da Perspectiva'
        },
        captain_minsky: {
          theoristId: 'captain_minsky',
          mood: 'warning',
          message: 'REGIME PONZI CONFIRMADO! Os participantes não conseguem pagar juros nem principal; dependem 100% de novos compradores pagando preços mais altos. Uma única faísca fará a liquidez evaporar!',
          detailedTip: 'Quando a liquidez some, o valor de mercado de ativos Ponzi despenca 70% a 90% em questão de dias.',
          relevantConcept: 'Financiamento Ponzi'
        }
      };

    case 'MINSKY_MOMENT':
      return {
        capm_bot: {
          theoristId: 'capm_bot',
          mood: 'shocked',
          message: 'COLAPSO SISTÊMICO! Este é um evento estatisticamente improvável sob distribuição normal (cisne negro). A correlação entre ativos arriscados convergiu para 1.0! A diversificação falhou temporariamente!',
          detailedTip: 'Em momentos de liquidação forçada, a distribuição de retornos apresenta caudas pesadas (leptocurtose).',
          relevantConcept: 'Causas de Cauda & Cisne Negro'
        },
        dr_psyche: {
          theoristId: 'dr_psyche',
          mood: 'shocked',
          message: 'PÂNICO ABSOLUTO! A aversão à perda se transformou em desespero visceral. Investidores estão vendendo tudo a qualquer preço para estancar a dor emocional. Cuidado para não vender no fundo do poço!',
          detailedTip: 'O medo desliga o córtex pré-frontal e ativa a amígdala cerebral, gerando decisões de fuga imediatistas.',
          relevantConcept: 'Pânico Comportamental & Capitulação'
        },
        captain_minsky: {
          theoristId: 'captain_minsky',
          mood: 'shocked',
          message: 'ESTE É O MOMENTO MINSKY! A ilusão da liquidez quebrou! Vendas forçadas (fire sales) derretem os preços e ativam chamadas de margem. Só quem guardou caixa no Tesouro e proteção sobrevive ao naufrágio!',
          detailedTip: 'No Momento Minsky, todos correm para a mesma porta de saída estreita ao mesmo tempo.',
          relevantConcept: 'O Momento Minsky & Crise de Liquidez'
        }
      };
  }
}
