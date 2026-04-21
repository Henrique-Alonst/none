// assets/js/cartao.js

function formatBRLCartao(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ===== TOTAL GERAL =====
function calcularTotalCartao() {
  let total = 0;
  document.querySelectorAll('.cartao-card').forEach(card => {
    card.querySelectorAll('.conta-item').forEach(item => {
      if (!item.querySelector('.conta-check').checked) {
        total += parseFloat(item.querySelector('.conta-valor').value.replace(',', '.')) || 0;
      }
    });
  });
  document.getElementById('totalCartaoValor').textContent = formatBRLCartao(total);
}

// ===== ATUALIZA TOTAIS DO CARD =====
function atualizarCartao(card) {
  const itens     = card.querySelectorAll('.conta-item');
  const limite    = parseFloat(card.querySelector('.cartao-orcamento').value.replace(',', '.')) || 0;
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

  card.querySelector('.cartao-total').textContent = `falta: ${formatBRLCartao(totalGasto - totalPago)}`;

  const pct = totalGasto > 0 ? Math.round((totalPago / totalGasto) * 100) : 0;
  card.querySelector('.progress-fill').style.width = pct + '%';
  card.querySelector('.progress-label').textContent = `${pct}% pago`;

  const orcLabel = card.querySelector('.orcamento-status');
  if (limite > 0) {
    const diff = limite - totalGasto;
    orcLabel.textContent = diff < 0
      ? `⚠ passou ${formatBRLCartao(Math.abs(diff))} do limite`
      : `✓ sobram ${formatBRLCartao(diff)}`;
    orcLabel.style.color = diff < 0 ? 'var(--red-margin)' : 'var(--green)';
  } else {
    orcLabel.textContent = '';
  }

  const tudoPago = itens.length > 0 && countPago === itens.length;
  card.style.borderColor = tudoPago ? 'var(--green)' : 'var(--ink-light)';
  card.style.boxShadow   = tudoPago ? '3px 3px 0 var(--green)' : '3px 3px 0 var(--ink-light)';

  calcularTotalCartao();
}

// ===== ADICIONAR GASTO =====
function adicionarGasto(card, cartaoId, nome, valor, pago, gastoId) {
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

  check.addEventListener('change', () => {
    nomeEl.style.textDecoration = check.checked ? 'line-through' : 'none';
    nomeEl.style.opacity        = check.checked ? '0.45' : '1';
    check.style.background      = check.checked ? 'var(--green)' : 'transparent';
    check.style.borderColor     = check.checked ? 'var(--green)' : 'var(--ink-light)';

    fetch(`api/gastos.php?id=${gastoId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ pago: check.checked ? 1 : 0 })
    });

    atualizarCartao(card);
  });

  item.querySelector('.conta-valor').addEventListener('change', () => {
    const novoValor = parseFloat(item.querySelector('.conta-valor').value) || 0;
    fetch(`api/gastos.php?id=${gastoId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ valor: novoValor })
    });
    atualizarCartao(card);
  });

  item.querySelector('.btn-rem-conta').addEventListener('click', () => {
    fetch(`api/gastos.php?id=${gastoId}`, { method: 'DELETE' })
      .then(() => { item.remove(); atualizarCartao(card); });
  });

  lista.appendChild(item);
  atualizarCartao(card);
}

// ===== CRIAR CARD DE CARTÃO =====
function criarCartao(cartaoId, nomeCartao, limite = 0) {
  const card = document.createElement('div');
  card.classList.add('cartao-card');
  card.dataset.id = cartaoId;
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
      <div contenteditable="true" class="cartao-titulo" style="
        font-family:'Caveat',cursive; font-size:1.3rem;
        font-weight:700; color:var(--ink);
        outline:none; cursor:text; min-width:60px;
      ">${nomeCartao}</div>
      <div style="display:flex; gap:8px; align-items:center;">
        <span class="cartao-total" style="
          font-family:'Special Elite',monospace;
          font-size:11px; color:var(--ink-light); letter-spacing:1px;
        ">falta: R$ 0,00</span>
        <button class="btn-rem-cartao" style="
          background:none; border:none; cursor:pointer;
          color:var(--ink-light); font-size:14px; opacity:0.6;
        ">✕</button>
      </div>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-family:'Special Elite',monospace; font-size:10px; letter-spacing:1px; color:var(--ink-light); text-transform:uppercase;">Limite</span>
      <input type="number" class="cartao-orcamento" value="${limite}" placeholder="R$ 0,00" step="0.01" min="0" style="
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
      <input type="text" placeholder="Nome do gasto" class="nova-conta-nome" style="
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

  card.querySelector('.btn-rem-cartao').addEventListener('click', () => {
    fetch(`api/cartoes.php?id=${cartaoId}`, { method: 'DELETE' })
      .then(() => { card.remove(); calcularTotalCartao(); });
  });

  card.querySelector('.cartao-orcamento').addEventListener('change', () => {
    const lim = parseFloat(card.querySelector('.cartao-orcamento').value) || 0;
    fetch(`api/cartoes.php?id=${cartaoId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome: card.querySelector('.cartao-titulo').textContent, limite: lim })
    });
    atualizarCartao(card);
  });

  card.querySelector('.cartao-titulo').addEventListener('blur', () => {
    const nome = card.querySelector('.cartao-titulo').textContent.trim();
    const lim  = parseFloat(card.querySelector('.cartao-orcamento').value) || 0;
    fetch(`api/cartoes.php?id=${cartaoId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome, limite: lim })
    });
  });

  card.querySelector('.btn-add-conta').addEventListener('click', () => {
    const nome  = card.querySelector('.nova-conta-nome').value.trim();
    const valor = parseFloat(card.querySelector('.nova-conta-valor').value) || 0;
    if (!nome) return;

    fetch('api/gastos.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ cartao_id: cartaoId, nome, valor })
    })
    .then(r => r.json())
    .then(data => {
      adicionarGasto(card, cartaoId, data.nome, data.valor, 0, data.id);
      card.querySelector('.nova-conta-nome').value  = '';
      card.querySelector('.nova-conta-valor').value = '';
    });
  });

  card.querySelector('.nova-conta-nome').addEventListener('keydown', e => {
    if (e.key === 'Enter') card.querySelector('.btn-add-conta').click();
  });

  document.getElementById('cartaoGrid').appendChild(card);
  return card;
}

// ===== CARREGAR TUDO DO BANCO =====
function carregarCartoes() {
  fetch('api/cartoes.php')
    .then(r => r.json())
    .then(cartoes => {
      document.getElementById('cartaoGrid').innerHTML = '';

      if (cartoes.length === 0) {
        fetch('api/cartoes.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ nome: 'Nubank' })
        })
        .then(r => r.json())
        .then(data => criarCartao(data.id, data.nome));
        return;
      }

      cartoes.forEach(c => {
        const card = criarCartao(c.id, c.nome, c.limite);
        fetch(`api/gastos.php?cartao_id=${c.id}`)
          .then(r => r.json())
          .then(gastos => {
            gastos.forEach(g => adicionarGasto(card, c.id, g.nome, g.valor, g.pago, g.id));
          });
      });
    });
}

// ===== BOTÃO NOVO CARTÃO =====
document.getElementById('btnAddCartao').addEventListener('click', () => {
  const nomes = ['Nubank','Renner','Pernambucas','Caixa'];
  const idx   = document.querySelectorAll('.cartao-card').length;
  const nome  = nomes[idx] || 'Cartão ' + (idx + 1);

  fetch('api/cartoes.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome })
  })
  .then(r => r.json())
  .then(data => criarCartao(data.id, data.nome));
});

// ===== CARREGAR AO ENTRAR =====
document.getElementById('btnCartao').addEventListener('click', () => {
  showView('cartao');
  carregarCartoes();
});

if (localStorage.getItem('viewAtual') === 'cartao') {
  carregarCartoes();
}