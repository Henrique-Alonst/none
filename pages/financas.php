<!-- pages/financas.php -->
<div class="view" id="view-financas">
  <button class="back-btn" data-back>← Voltar</button>

  <div class="section">
    <div class="financas-header">
      <h2 class="section-title">💰 &nbsp;Finanças</h2>
      <button class="btn-cartao" id="btnCartao">💳 Cartões</button>
    </div>

    <!-- Total geral -->
    <div id="totalGeral" style="
      font-family: 'Special Elite', monospace;
      font-size: 12px;
      letter-spacing: 1px;
      color: var(--ink-faded);
      margin-bottom: 24px;
      padding: 16px;
      border: 1.5px dashed var(--ink-light);
      border-radius: 2px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    ">
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span>TOTAL GASTO</span>
        <span id="totalGeralValor" style="font-size:18px; color:var(--ink); font-family:'Caveat',cursive; font-weight:700;">R$ 0,00</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span>FALTA PAGAR</span>
        <span id="totalFaltaValor" style="font-size:18px; color:var(--accent-dark); font-family:'Caveat',cursive; font-weight:700;">R$ 0,00</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span>PASSOU DO ORÇAMENTO</span>
        <span id="totalPassouValor" style="font-size:18px; color:var(--red-margin); font-family:'Caveat',cursive; font-weight:700;">R$ 0,00</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:4px;">
        <span>PRECISA PRA FICAR NO VERDE</span>
        <span id="totalVermelhoValor" style="font-size:18px; color:var(--green); font-family:'Caveat',cursive; font-weight:700;">R$ 0,00</span>
      </div>
    </div>

    <!-- Grade de meses -->
    <div id="mesesGrid" style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    "></div>

    <!-- Botão adicionar mês -->
    <button id="btnAddMes" style="
      font-family: 'Special Elite', monospace;
      font-size: 12px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--ink);
      background: var(--paper-aged);
      border: 1.5px dashed var(--ink-light);
      border-radius: 2px;
      padding: 10px 22px;
      cursor: pointer;
      transition: background 0.18s;
    ">+ Novo Mês</button>
  </div>

  <!-- Anotação livre -->
  <div class="section">
    <h2 class="section-title">✎ &nbsp;Observações</h2>
    <textarea id="finObservacao" placeholder="Ex: esse mês preciso gastar menos..." style="
      width: 100%;
      min-height: 80px;
      background: transparent;
      border: none;
      border-bottom: 1.5px dashed var(--ink-light);
      outline: none;
      resize: vertical;
      font-family: 'Lora', Georgia, serif;
      font-size: 14px;
      color: var(--ink);
      line-height: 1.7;
      padding: 4px;
    "></textarea>
  </div>
</div>