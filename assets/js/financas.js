// assets/js/financas.js

const mesesNomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ===== TOTAL GERAL =====
function calcularTotal() {
  let totalGasto    = 0;
  let totalFalta    = 0;
  let totalPassou   = 0;

  document.querySelectorAll('.mes-card').forEach(card => {
    const orcamento = parseFloat(card.querySelector('.mes-orcamento').value.replace(',', '.')) || 0;
    let gastoMes    = 0;
    let faltaMes    = 0;

    card.querySelectorAll('.conta-item').forEach(item => {
      const valor = parseFloat(item.querySelector('.conta-valor').value.replace(',', '.')) || 0;
      gastoMes += valor;
      if (!item.querySelector('.conta-check').checked) {
        faltaMes += valor;
      }
    });

    totalGasto += gastoMes;
    totalFalta += faltaMes;

    if (orcamento > 0 && gastoMes > orcamento) {
      totalPassou += gastoMes - orcamento;
    }
  });

  const totalVermelho = totalPassou > 0 ? totalPassou + 100 : 0;

  document.getElementById('totalGeralValor').textContent    = formatBRL(totalGasto);
  document.getElementById('totalFaltaValor').textContent    = formatBRL(totalFalta);
  document.getElementById('totalPassouValor').textContent   = totalPassou > 0 ? formatBRL(totalPassou) : '✓ No azul';
  document.getElementById('totalVermelhoValor').textContent = totalVermelho > 0 ? formatBRL(totalVermelho) : '✓ Tudo ok';
}

// ===== ATUALIZA TOTAIS DO CARD =====
function atualizarMes(card) {
  const itens     = card.querySelectorAll('.conta-item');
  const orcamento = parseFloat(card.querySelector('.mes-orcamento').value.replace(',', '.')) || 0;
  let totalGasto  = 0;
  let totalPago   = 0;
  let countPago   = 0;

  itens.forEach(item => {
    const valor = parseFloat(item.querySelector('.conta-valor').value.replace(',', '.')) || 0;
    totalGasto += valor;
    if (item.querySelector('.conta-check').checked) {
      totalPago += valor;
      countPago++;
    }
  });

  card.querySelector('.mes-total').textContent = `falta: ${formatBRL(totalGasto - totalPago)}`;
  card.querySelector('.mes-total').textContent = `falta: ${formatBRL(totalGasto - totalPago)}`;
  card.querySelector('.mes-gasto-total').textContent = `total: ${formatBRL(totalGasto)}`; // ← aqui
  const pct = totalGasto > 0 ? Math.round((totalPago / totalGasto) * 100) : 0;
  card.querySelector('.progress-fill').style.width = pct + '%';
  card.querySelector('.progress-label').textContent = `${pct}% pago`;

  const orcLabel = card.querySelector('.orcamento-status');
  if (orcamento > 0) {
    const diff = orcamento - totalGasto;
    orcLabel.textContent = diff < 0
      ? `⚠ passou ${formatBRL(Math.abs(diff))} do orçamento`
      : `✓ sobram ${formatBRL(diff)}`;
    orcLabel.style.color = diff < 0 ? 'var(--red-margin)' : 'var(--green)';
  } else {
    orcLabel.textContent = '';
  }

  const tudoPago = itens.length > 0 && countPago === itens.length;
  card.style.borderColor = tudoPago ? 'var(--green)' : 'var(--ink-light)';
  card.style.boxShadow   = tudoPago ? '3px 3px 0 var(--green)' : '3px 3px 0 var(--ink-light)';

  calcularTotal();
}

// ===== ADICIONAR CONTA =====
function adicionarConta(card, mesId, nome, valor, pago, contaId) {
  const lista = card.querySelector('.contas-lista');
  const item  = document.createElement('div');
  item.classList.add('conta-item');
  item.style.cssText = 'display:flex; align-items:center; gap:8px;';

  item.innerHTML = `
    <input type="checkbox" class="conta-check" ${pago ? 'checked' : ''} style="
      appearance:none; -webkit-appearance:none;
      width:14px; height:14px;
      border:1.5px solid var(--ink-light);
      border-radius:1px; flex-shrink:0;
      cursor:pointer; position:relative;
      background:${pago ? 'var(--green)' : 'transparent'};
      border-color:${pago ? 'var(--green)' : 'var(--ink-light)'};
      transition:all 0.15s;
    ">
    <span class="conta-nome" style="
      flex:1; font-family:'Lora',Georgia,serif;
      font-size:13px; color:var(--ink-faded);
      ${pago ? 'text-decoration:line-through; opacity:0.45;' : ''}
    ">${nome}</span>
    <input type="number" class="conta-valor" value="${parseFloat(valor).toFixed(2)}" step="0.01" min="0" style="
      width:72px; font-family:'Special Elite',monospace;
      font-size:11px; color:var(--ink-faded);
      background:transparent; border:none;
      border-bottom:1px dashed transparent;
      outline:none; text-align:right; padding:1px 2px;
    ">
    <button class="btn-rem-conta" style="
      background:none; border:none; cursor:pointer;
      color:var(--ink-light); font-size:12px; opacity:0.5;
    ">✕</button>
  `;

  const check  = item.querySelector('.conta-check');
  const nomeEl = item.querySelector('.conta-nome');

  // Marcar como pago
  check.addEventListener('change', () => {
    nomeEl.style.textDecoration = check.checked ? 'line-through' : 'none';
    nomeEl.style.opacity        = check.checked ? '0.45' : '1';
    check.style.background      = check.checked ? 'var(--green)' : 'transparent';
    check.style.borderColor     = check.checked ? 'var(--green)' : 'var(--ink-light)';

    fetch(`api/contas.php?id=${contaId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ pago: check.checked ? 1 : 0 })
    });

    atualizarMes(card);
  });

  // Editar valor
  item.querySelector('.conta-valor').addEventListener('change', () => {
    const novoValor = parseFloat(item.querySelector('.conta-valor').value) || 0;
    fetch(`api/contas.php?id=${contaId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ valor: novoValor })
    });
    atualizarMes(card);
  });

  // Remover conta
  item.querySelector('.btn-rem-conta').addEventListener('click', () => {
    fetch(`api/contas.php?id=${contaId}`, { method: 'DELETE' })
      .then(() => { item.remove(); atualizarMes(card); });
  });

  lista.appendChild(item);
  atualizarMes(card);
}

// ===== CRIAR CARD DE MÊS =====
function criarMes(mesId, nomeMes, orcamento = 0) {
  const card = document.createElement('div');
  card.classList.add('mes-card');
  card.dataset.id = mesId;
  card.style.cssText = `
    background: var(--paper-dark);
    border: 1.5px solid var(--ink-light);
    border-radius: 2px;
    box-shadow: 3px 3px 0 var(--ink-light);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.3s, box-shadow 0.3s;
  `;

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div contenteditable="true" class="mes-titulo" style="
        font-family:'Caveat',cursive; font-size:1.3rem;
        font-weight:700; color:var(--ink);
        outline:none; cursor:text; min-width:60px;
      ">${nomeMes}</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <span class="mes-gasto-total" style="
          font-family:'Special Elite',monospace;
          font-size:11px; color:var(--ink-light); letter-spacing:1px;
        ">total: R$ 0,00</span>
        <span style="color:var(--ink-light); opacity:0.4;">|</span>
        <span class="mes-total" style="
          font-family:'Special Elite',monospace;
          font-size:11px; color:var(--ink-light); letter-spacing:1px;
        ">falta: R$ 0,00</span>
        <button class="btn-rem-mes" style="
          background:none; border:none; cursor:pointer;
          color:var(--ink-light); font-size:14px; opacity:0.6;
        ">✕</button>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-family:'Special Elite',monospace; font-size:10px; letter-spacing:1px; color:var(--ink-light); text-transform:uppercase;">Orçamento</span>
      <input type="number" class="mes-orcamento" value="${orcamento}" placeholder="R$ 0,00" step="0.01" min="0" style="
        width:90px; font-family:'Lora',Georgia,serif; font-size:13px;
        color:var(--ink); background:transparent; border:none;
        border-bottom:1px dashed var(--ink-light); outline:none; padding:2px 4px;
      ">
      <span class="orcamento-status" style="font-family:'Special Elite',monospace; font-size:10px; letter-spacing:0.5px;"></span>
    </div>

    <div>
      <div style="height:6px; background:var(--paper-aged); border-radius:3px; overflow:hidden; margin-bottom:3px;">
        <div class="progress-fill" style="height:100%; width:0%; background:var(--green); border-radius:3px; transition:width 0.3s ease;"></div>
      </div>
      <span class="progress-label" style="font-family:'Special Elite',monospace; font-size:10px; color:var(--ink-light); letter-spacing:1px;">0% pago</span>
    </div>

    <div class="contas-lista" style="display:flex; flex-direction:column; gap:6px;"></div>

    <div style="display:flex; gap:6px; margin-top:4px;">
      <input type="text" placeholder="Nome da conta" class="nova-conta-nome" style="
        flex:1; font-family:'Lora',Georgia,serif; font-size:13px;
        color:var(--ink); background:transparent; border:none;
        border-bottom:1px dashed var(--ink-light); outline:none; padding:2px 4px;
      ">
      <input type="number" placeholder="R$" class="nova-conta-valor" step="0.01" min="0" style="
        width:80px; font-family:'Lora',Georgia,serif; font-size:13px;
        color:var(--ink); background:transparent; border:none;
        border-bottom:1px dashed var(--ink-light); outline:none; padding:2px 4px;
      ">
      <button class="btn-add-conta" style="
        font-family:'Special Elite',monospace; font-size:16px;
        background:none; border:none; color:var(--green); cursor:pointer;
      ">＋</button>
    </div>
  `;

  // Remover mês
  card.querySelector('.btn-rem-mes').addEventListener('click', () => {
    fetch(`api/meses.php?id=${mesId}`, { method: 'DELETE' })
      .then(() => { card.remove(); calcularTotal(); });
  });

  // Salvar orçamento ao sair do campo
  card.querySelector('.mes-orcamento').addEventListener('change', () => {
    const orc = parseFloat(card.querySelector('.mes-orcamento').value) || 0;
    fetch(`api/meses.php?id=${mesId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome: card.querySelector('.mes-titulo').textContent, orcamento: orc })
    });
    atualizarMes(card);
  });

  // Salvar nome ao sair do título editável
  card.querySelector('.mes-titulo').addEventListener('blur', () => {
    const nome = card.querySelector('.mes-titulo').textContent.trim();
    const orc  = parseFloat(card.querySelector('.mes-orcamento').value) || 0;
    fetch(`api/meses.php?id=${mesId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome, orcamento: orc })
    });
  });

  // Adicionar conta
  card.querySelector('.btn-add-conta').addEventListener('click', () => {
    const nome  = card.querySelector('.nova-conta-nome').value.trim();
    const valor = parseFloat(card.querySelector('.nova-conta-valor').value) || 0;
    if (!nome) return;

    fetch('api/contas.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ mes_id: mesId, nome, valor })
    })
    .then(r => r.json())
    .then(data => {
      adicionarConta(card, mesId, data.nome, data.valor, 0, data.id);
      card.querySelector('.nova-conta-nome').value  = '';
      card.querySelector('.nova-conta-valor').value = '';
    });
  });

  // Enter adiciona conta
  card.querySelector('.nova-conta-nome').addEventListener('keydown', e => {
    if (e.key === 'Enter') card.querySelector('.btn-add-conta').click();
  });

  document.getElementById('mesesGrid').appendChild(card);
  return card;
}

// ===== CARREGAR TUDO DO BANCO =====
function carregarFinancas() {
  fetch('api/meses.php')
    .then(r => r.json())
    .then(meses => {
      document.getElementById('mesesGrid').innerHTML = '';

      if (meses.length === 0) {
        // Se não tiver nenhum mês, cria o mês atual
        const nomeMes = mesesNomes[new Date().getMonth()];
        fetch('api/meses.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ nome: nomeMes })
        })
        .then(r => r.json())
        .then(data => criarMes(data.id, data.nome));
        return;
      }

      meses.forEach(m => {
        const card = criarMes(m.id, m.nome, m.orcamento);
        // Carrega as contas de cada mês
        fetch(`api/contas.php?mes_id=${m.id}`)
          .then(r => r.json())
          .then(contas => {
            contas.forEach(c => adicionarConta(card, m.id, c.nome, c.valor, c.pago, c.id));
          });
      });
    });
}

// ===== BOTÃO NOVO MÊS =====
document.getElementById('btnAddMes').addEventListener('click', () => {
  const idx  = document.querySelectorAll('.mes-card').length;
  const nome = mesesNomes[idx % 12];

  fetch('api/meses.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome })
  })
  .then(r => r.json())
  .then(data => criarMes(data.id, data.nome));
});

// ===== CARREGAR AO ENTRAR =====
document.getElementById('btnFinanca').addEventListener('click', () => {
  showView('financas');
  carregarFinancas();
});

if (localStorage.getItem('viewAtual') === 'financas') {
  carregarFinancas();
}