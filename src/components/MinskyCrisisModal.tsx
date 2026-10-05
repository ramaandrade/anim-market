import React from 'react';
import { Anchor, AlertTriangle, Flame, ArrowRight, ShieldAlert } from 'lucide-react';

interface MinskyCrisisModalProps {
  onDismiss: () => void;
}

export const MinskyCrisisModal: React.FC<MinskyCrisisModalProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-red-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-950 border-2 border-red-500 rounded-2xl overflow-hidden shadow-2xl shadow-red-950/80 flex flex-col max-h-[92vh]">
        {/* Siren Alert Banner */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/20 animate-bounce">
              <Flame className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-200">
                <AlertTriangle className="w-3.5 h-3.5" /> Alerta Máximo Sistêmico
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                O "Momento Minsky" Eclodiu!
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Main Theoretical Statement */}
          <div className="bg-red-950/40 p-4 rounded-xl border border-red-800/80 text-red-100 space-y-2">
            <p className="font-bold text-sm text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              "A estabilidade gerou sua própria instabilidade!"
            </p>
            <p className="leading-relaxed text-xs sm:text-sm">
              Após meses de calmaria e ganhos fáceis, os participantes do mercado abandonaram suas margens de segurança. O endividamento cresceu e o sistema transacionou do regime <strong>Hedge</strong> para o regime <strong>Ponzi</strong>.
            </p>
          </div>

          {/* How the crash mechanics work */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block mb-1">1. Fim da Ilusão</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                A liquidez só existe quando ninguém precisa dela. Quando todos querem vender, as contrapartes desaparecem.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-rose-400 block mb-1">2. Vendas Forçadas</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                Agentes alavancados recebem chamadas de margem e são obrigados a liquidar ativos a qualquer preço.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-cyan-400 block mb-1">3. Voo para a Qualidade</span>
              <p className="text-slate-300 text-[11px] leading-tight">
                O capital foge de ativos especulativos e corre para o Tesouro Selic e Ouro (reservas de valor).
              </p>
            </div>
          </div>

          {/* Captain Minsky Quote */}
          <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-800/70 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-600 text-amber-400 flex items-center justify-center shrink-0">
              <Anchor className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-amber-300">Capitão Minsky adverte:</span>
              <p className="text-slate-200 italic mt-0.5 leading-relaxed">
                "Não adianta gritar com a maré! Se sua carteira estava cheia de moedas meme e ações sem fluxo de caixa, você aprenderá agora o que é deságio de liquidez. Segurem o leme e protejam o capital sobrevivente!"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Assumir o Leme e Gerenciar a Crise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
