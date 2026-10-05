# 📈 AnimMarket: Racionalidade vs. Emoção

> 🌐 **Acesso Online (GitHub Pages):** [https://ramaandrade.github.io/anim-market/](https://ramaandrade.github.io/anim-market/)  
> 📦 **Repositório GitHub:** [https://github.com/ramaandrade/anim-market](https://github.com/ramaandrade/anim-market)  
> 📱 **Aplicativo Web Gamificado de Teorias de Mercado (PWA - Progressive Web App Mobile-First)**  
> *Descubra na prática como os mercados são complexos, enfrentando o choque entre fundamentos econômicos e psicologia humana.*

---

## 📌 1. Visão Geral e Objetivo

**AnimMarket: Racionalidade vs. Emoção** é um Web App gamificado onde o usuário gerencia uma carteira de investimentos ao longo de vários ciclos econômicos, enfrentando o choque conceitual e prático entre as principais escolas de finanças.

O objetivo pedagógico é demonstrar a distinção vital entre o **valor intrínseco fundamental** de um ativo e sua **cotação de mercado** ditada por sentimentos, heurísticas, histeria de manada e estruturas financeiras de crédito.

---

## 👥 2. Os Três Teóricos Animados (Conselheiros Virtuais)

O jogador recebe conselhos conflitantes em tempo real de três conselheiros que reagem a cada decisão e fase do mercado:

| Personagem | Escola Teórica | Filosofia & Comportamento no Jogo |
| :--- | :--- | :--- |
| 🤖 **Robô CAPM** <br> *(O Racional)* | **Finanças Neoclássicas & HME** | Defende a Hipótese do Mercado Eficiente (HME) em sua forma semiforte. Afirma que os preços sempre refletem toda a informação pública e foca na maximização da utilidade. Calcula o risco sistemático relacionando o coeficiente **Beta ($\beta$)** ao prêmio de risco do mercado e adverte contra o giro excessivo de carteira. |
| 🧠 **Dr. Psique** <br> *(O Comportamental)* | **Finanças Comportamentais** | Baseado na Teoria da Perspectiva de Daniel Kahneman e Amos Tversky. Adverte sobre a **Aversão à Perda** (onde a dor de perder é $\approx 2.25\times$ mais intensa que o prazer de um ganho equivalente), desmascara o **Viés de Ancoragem** no preço médio de compra e previne contra o excesso de confiança e o efeito manada (FOMO). |
| ⚓ **Capitão Minsky** <br> *(O Pós-Keynesiano)* | **Visão Pós-Keynesiana** | Enfatiza a distinção entre risco calculável e incerteza fundamental não-quantificável (Keynes). Monitora o nível de especulação e dívida do ecossistema, avisando quando a estabilidade prolongada gera complacência e transita a economia de posições seguras (**Hedge**) para esquemas insustentáveis (**Ponzi**) até deflagrar o **Momento Minsky**. |

---

## 🎯 3. Mecânicas e Funcionalidades

### 📊 Mecânica de Precificação e Modelos Fatoriais
- **Filtros Fama-French**: O jogador pode alternar filtros para identificar ativos com exposição a fatores sistemáticos:
  - **Fator Tamanho (SMB - Small Minus Big)**: Identifica pequenas empresas com prêmio de risco histórico.
  - **Fator Valor (HML - High Minus Low)**: Ações de alto *Book-to-Market* e geração robusta de dividendos.
- **Sensibilidade Multi-Fatorial (Estilo APT)** e cálculo do Beta ponderado da carteira.
- Comparação visual contínua entre **Cotação de Mercado** e **Valor Intrínseco Fundamental**.

### 🗓️ Cartas de Anomalias de Calendário
Distorções empíricas históricas que desafiam a teoria pura:
- **Efeito Janeiro**: Ações de pequena capitalização (*Small Caps*) disparam com forte rotação informacional e fiscal.
- **"Vender em Maio e Ir Embora" (Sell in May)**: Retornos historicamente moderados contrapostos à euforia especulativa em tecnologia.

### ⚓ Sistema de Vieses Cognitivos
- **Armadilha de Ancoragem**: A interface sinaliza quando o jogador fica mentalmente fixado no preço original pago por uma ação e hesita em realizar prejuízos para não oficializar a dor da perda.
- **Medidor de FOMO e Excesso de Confiança**: Tentação de aumentar a alavancagem após meses consecutivos de ganhos.

### 💥 O "Momento Minsky" (Colapso de Liquidez)
- **Barra de Tensão de Minsky**: Transição visual de cores e atmosfera:
  - 🟢 **Hedge** (Azul/Verde: fluxos de caixa cobrem juros e principal)
  - 🟡 **Especulativo** (Âmbar: fluxos pagam juros, rolagem contínua de dívida)
  - 🟠 **Ponzi** (Laranja: dependência exclusiva de valorização de preços)
  - 🔴 **Momento Minsky** (Vermelho com sirene: congelamento de liquidez e vendas forçadas).
- No Mês 13, a pirâmide de complacência rui: ativos especulativos desabam, spreads explodem e ativos ilíquidos sofrem forte deságio de saída (*slippage*). Apenas ativos de refúgio (Tesouro Selic e Ouro) protegem o patrimônio.

---

## 🧪 4. Laboratório Teórico Interativo

O aplicativo conta com uma seção dedicada para experimentação didática:
1. **Calculadora CAPM**: Sliders em tempo real para $\beta$, Taxa Livre de Risco ($R_f$) e Retorno do Mercado ($R_m$), desenhando a *Security Market Line (SML)*.
2. **Matriz Fama-French**: Explicação conceitual de fatores além do Beta.
3. **Termômetro dos Regimes de Minsky**: Comparação dos fluxos de caixa e capacidade de solvência.
4. **Curva S da Teoria da Perspectiva**: Função valor assimétrica demonstrando a aversão à perda.

---

## 🗺️ 5. Jornada do Usuário (5 Fases)

1. **Fase 1: O Mundo Eficiente (Onboarding)** — Mercado em equilíbrio Hedge. O jogador aprende alocação, Sharpe e risco sistemático com o Robô CAPM.
2. **Fase 2: O Desafio das Anomalias** — O "Efeito Janeiro" e o Fator SMB desafiam a HME pura.
3. **Fase 3: A Dança da Irracionalidade** — Bolha especulativa em ativos tecnológicos e moedas meme. Alertas de ancoragem e FOMO pelo Dr. Psique.
4. **Fase 4: O Momento Minsky & Crise de Liquidez** — Eclosão do colapso sistêmico. Prova de sobrevivência e gestão de liquidez.
5. **Fase 5: A Grande Síntese & Relatório Final** — Diagnóstico analítico com radar de competências (*Racionalidade CAPM*, *Autocontrole Comportamental*, *Resiliência Minskyana*) e manifesto unificador.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS v4 + Design Dark Glassmorphism Mobile-First
- **Ícones:** Lucide React
- **Áudio:** Síntese procedural de efeitos sonoros via Web Audio API (sem dependências pesadas de arquivos de áudio)
- **PWA:** Service Worker para cache offline e `manifest.webmanifest` para instalação na tela de início.

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/ramaandrade/anim-market.git
   cd anim-market
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:5173
   ```
