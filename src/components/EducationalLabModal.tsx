import React, { useState } from 'react';
import { X, BookOpen, Bot, Brain, Anchor, Sliders, Layers, Activity } from 'lucide-react';

interface EducationalLabModalProps {
  onClose: () => void;
}

export const EducationalLabModal: React.FC<EducationalLabModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'CAPM' | 'FAMA_FRENCH' | 'MINSKY' | 'PROSPECT'>('CAPM');

  // CAPM interactive state
  const [rf, setRf] = useState<number>(10.0);
  const [rm, setRm] = useState<number>(16.0);
  const [beta, setBeta] = useState<number>(1.4);

  const marketPremium = rm - rf;
  const expectedReturn = rf + beta * marketPremium;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-indigo-500/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-600 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Laboratório Teórico Interativo
              </h2>
              <p className="text-xs text-slate-400">
                Explore as fórmulas, modelos matemáticos e dinâmicas comportamentais do mercado.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none px-3 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('CAPM')}
            className={`px-3 py-2 rounded-t-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'CAPM'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            1. CAPM & SML
          </button>

          <button
            onClick={() => setActiveTab('FAMA_FRENCH')}
            className={`px-3 py-2 rounded-t-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'FAMA_FRENCH'
                ? 'bg-slate-900 text-emerald-400 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Fama-French (Fatores)
          </button>

          <button
            onClick={() => setActiveTab('MINSKY')}
            className={`px-3 py-2 rounded-t-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'MINSKY'
                ? 'bg-slate-900 text-amber-400 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Anchor className="w-4 h-4" />
            3. Regimes de Minsky
          </button>

          <button
            onClick={() => setActiveTab('PROSPECT')}
            className={`px-3 py-2 rounded-t-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'PROSPECT'
                ? 'bg-slate-900 text-pink-400 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            4. Teoria da Perspectiva
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* TAB 1: CAPM */}
          {activeTab === 'CAPM' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    Capital Asset Pricing Model (CAPM)
                  </h3>
                  <span className="font-mono text-cyan-300 font-bold bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded text-xs">
                    William Sharpe (1964)
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  O CAPM estabelece que em equilíbrio o retorno esperado de qualquer ativo é uma função linear de seu risco sistemático não-diversificável, medido pelo coeficiente <strong>Beta (β)</strong>.
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs sm:text-sm text-cyan-300 border border-slate-700 text-center">
                  E(Rᵢ) = R_f + βᵢ × [ E(R_m) - R_f ]
                </div>
              </div>

              {/* Interactive SML Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sliders */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Parâmetros Interativos
                  </h4>

                  {/* Beta Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Beta do Ativo (β):</span>
                      <span className="font-mono font-bold text-cyan-400">{beta.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={-0.5}
                      max={3.0}
                      step={0.05}
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>-0.5 (Hedge)</span>
                      <span>1.0 (Mercado)</span>
                      <span>3.0 (Hiper-Risco)</span>
                    </div>
                  </div>

                  {/* Rf Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Taxa Livre de Risco (Rf):</span>
                      <span className="font-mono font-bold text-white">{rf.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={18}
                      step={0.5}
                      value={rf}
                      onChange={(e) => setRf(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Rm Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Retorno do Mercado (Rm):</span>
                      <span className="font-mono font-bold text-white">{rm.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={25}
                      step={0.5}
                      value={rm}
                      onChange={(e) => setRm(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>

                {/* SML Graph / Calculation Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2">
                      Retorno Justo Calculado
                    </h4>
                    <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-xl space-y-1">
                      <div className="text-xs text-slate-400">Prêmio de Risco do Mercado:</div>
                      <div className="font-mono text-sm text-cyan-300 font-bold">
                        {marketPremium.toFixed(1)}% ao ano
                      </div>
                      <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                        Retorno Esperado E(Rᵢ):
                      </div>
                      <div className="font-mono text-xl sm:text-2xl text-white font-black">
                        {expectedReturn.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Interpretation Note */}
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-3">
                    {beta === 0 && 'Ativo livre de risco: retorno esperado coincide estritamente com Rf.'}
                    {beta > 0 && beta < 1 && 'Ativo defensivo: varia menos do que o índice de mercado.'}
                    {beta === 1 && 'Ativo de mercado neutro: risco sistemático idêntico à carteira teórica.'}
                    {beta > 1 && 'Ativo agressivo: amplifica oscilações positivas e negativas da economia.'}
                    {beta < 0 && 'Ativo de correlação negativa: funciona como seguro / proteção patrimonial.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAMA-FRENCH */}
          {activeTab === 'FAMA_FRENCH' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Modelo dos Três Fatores de Fama-French (1993)
                  </h3>
                  <span className="font-mono text-emerald-300 font-bold bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded text-xs">
                    Prêmio Nobel Eugene Fama & Kenneth French
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Eugene Fama e Kenneth French demonstraram que o Beta do CAPM sozinho não consegue explicar anomalias empíricas históricas. Eles adicionaram dois fatores fundamentais de risco:
                </p>
                <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs sm:text-sm text-emerald-300 border border-slate-700 text-center">
                  Rᵢ - R_f = αᵢ + βᵢ(R_m - R_f) + sᵢ(SMB) + hᵢ(HML) + εᵢ
                </div>
              </div>

              {/* Factor Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">1. Fator SMB (Small Minus Big)</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Tamanho</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Ações de pequena capitalização (Small Caps) historicamente superam grandes empresas devido à menor liquidez, maior risco de insolvência e assimetria informacional.
                  </p>
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                    No jogo: <strong className="text-white">SMAL3</strong> possui SMB +0.9 (reage com força no Efeito Janeiro).
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">2. Fator HML (High Minus Low)</span>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Valor vs Growth</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Compara empresas de Valor (alta relação Book-to-Market / fluxo de caixa atual) com empresas de Crescimento/Growth (baixo Book-to-Market / lucros em futuro incerto).
                  </p>
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                    No jogo: <strong className="text-white">VALO3</strong> tem HML +0.85; <strong className="text-white">NEO-TECH</strong> tem HML -0.9.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MINSKY */}
          {activeTab === 'MINSKY' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-amber-400" />
                    Hipótese da Instabilidade Financeira (HIF)
                  </h3>
                  <span className="font-mono text-amber-300 font-bold bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded text-xs">
                    Hyman Minsky (1986)
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Minsky propôs que o capitalismo moderno é intrinsecamente instável. Em períodos de estabilidade econômica prolongada, agentes tornam-se complacentes e aumentam seu endividamento, empurrando o sistema através de três regimes:
                </p>
              </div>

              {/* 3 Regimes Diagram */}
              <div className="space-y-2.5">
                <div className="bg-emerald-950/40 border border-emerald-800 p-3.5 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-300 text-xs sm:text-sm">Regime Hedge (Financiamento Seguro)</h4>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                      Os fluxos de caixa operacionais dos agentes são suficientes para pagar tanto os juros quanto amortizar o principal das dívidas. O sistema é robusto e resiliente a choques.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-950/40 border border-amber-800 p-3.5 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-900 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300 text-xs sm:text-sm">Regime Especulativo (Complacência)</h4>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                      Os fluxos de caixa conseguem pagar apenas os juros da dívida, mas não o principal. Os agentes dependem da capacidade contínua de refinanciar e rolar seus empréstimos.
                    </p>
                  </div>
                </div>

                <div className="bg-red-950/40 border border-red-800 p-3.5 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-900 text-red-300 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-red-300 text-xs sm:text-sm">Regime Ponzi & O "Momento Minsky"</h4>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                      Os fluxos de caixa não cobrem sequer os juros. Os agentes dependem unicamente da contínua valorização dos ativos e da entrada de novos especuladores. Qualquer aperto de crédito desencadeia vendas forçadas, colapsando a liquidez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROSPECT THEORY */}
          {activeTab === 'PROSPECT' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-pink-400" />
                    Teoria da Perspectiva & Vieses Cognitivos
                  </h3>
                  <span className="font-mono text-pink-300 font-bold bg-pink-950/70 border border-pink-800 px-2 py-0.5 rounded text-xs">
                    Daniel Kahneman & Amos Tversky (1979)
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  A teoria neoclássica presume que tomadores de decisão são perfeitamente racionais. Kahneman e Tversky demonstraram experimentalmente desvios sistemáticos conhecidos como heurísticas e vieses:
                </p>
              </div>

              {/* S-Curve Explanation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-pink-300 text-xs uppercase tracking-wider">
                  A Função de Valor em "S" e a Aversão à Perda
                </h4>
                <div className="p-3 bg-pink-950/30 border border-pink-800/60 rounded-xl text-xs space-y-2">
                  <p className="text-slate-200">
                    A função de valor psicológica é côncava para ganhos (aversão ao risco em território positivo) e convexa para perdas (propensão ao risco para evitar prejuízos).
                  </p>
                  <p className="font-bold text-white">
                    Coeficiente de Aversão à Perda (λ ≈ 2.25):
                    <span className="font-normal text-slate-300 block mt-0.5">
                      A dor emocional de perder R$ 1.000 é 2 a 2.5 vezes mais intensa do que a felicidade de ganhar R$ 1.000.
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-slate-200 block mb-1">Viés de Ancoragem</strong>
                    <span className="text-slate-400 text-[11px] leading-tight block">
                      O investidor se fixa mentalmente no preço inicial pago pela ação e se recusa a vender no prejuízo esperando "voltar ao zero a zero".
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-slate-200 block mb-1">Efeito Manada & FOMO</strong>
                    <span className="text-slate-400 text-[11px] leading-tight block">
                      O medo de ficar de fora leva investidores a abandonarem a análise de valor intrínseco e comprarem ativos inflados na máxima da bolha.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Fechar Laboratório
          </button>
        </div>
      </div>
    </div>
  );
};
