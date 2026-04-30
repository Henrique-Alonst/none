// assets/js/script.js
financas: document.getElementById('view-financas')
document.getElementById('btnFinanca').addEventListener('click', () => showView('financas'));
// ===== HELPERS =====
const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const dias   = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

function fmtDate(d) {
  return `${String(d.getDate()).padStart(2,'0')} ${meses[d.getMonth()].toUpperCase()} ${d.getFullYear()} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ===== RELÓGIO =====
function tickClock() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  document.getElementById('clockTime').textContent = `${h}:${m}`;
  document.getElementById('clockDateSmall').textContent =
    `${dias[d.getDay()]} · ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}
tickClock();
setInterval(tickClock, 1000);

// ===== DATA NO CABEÇALHO =====
const now = new Date();
document.getElementById('currentDate').innerHTML =
  `${dias[now.getDay()]}<br>${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}`;

// ===== NAVEGAÇÃO =====
const views = {
  home:     document.getElementById('view-home'),
  caderno:  document.getElementById('view-caderno'),
  projetos: document.getElementById('view-projetos'),
  financas: document.getElementById('view-financas'),
  objetivos: document.getElementById('view-objetivos'),
  cartao: document.getElementById('view-cartao'),
};

function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  localStorage.setItem('viewAtual', name); // salva a view
}

// Restaura a última view ao recarregar
const viewSalva = localStorage.getItem('viewAtual');
if (viewSalva && views[viewSalva]) {
  showView(viewSalva);
}

document.getElementById('btnCaderno') .addEventListener('click', () => showView('caderno'));
document.getElementById('btnProjetos').addEventListener('click', () => showView('projetos'));
document.getElementById('btnObjetivos').addEventListener('click', () => showView('objetivos'));
document.getElementById('btnFinanca').addEventListener('click', () => showView('financas'));
document.getElementById('btnCartao').addEventListener('click', () => showView('cartao'))
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showView('home')));
document.querySelectorAll('[data-back-financas]').forEach(btn => 
  btn.addEventListener('click', () => {showView('financas'); 
    carregarFinancas(); //
  })
);

// ===== METAS =====
const newGoalInput = document.getElementById('newGoalInput');
const goalsList    = document.getElementById('goalsList');

// Função para criar o elemento na tela (UI)
function renderMeta(id, texto, concluida) {
    const label = document.createElement('label');
    label.classList.add('goal-item');
    label.innerHTML = `
        <input type="checkbox" ${concluida ? 'checked' : ''}>
        <span class="${concluida ? 'done' : ''}">${texto}</span>
    `;

    const checkbox = label.querySelector('input');
    const span = label.querySelector('span');

    // Evento de marcar/desmarcar
    checkbox.addEventListener('change', () => {
        span.classList.toggle('done', checkbox.checked);
        fetch(`api/metas.php?id=${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ concluida: checkbox.checked ? 1 : 0 })
        });
    });

    // Botão apagar
    const btnDel = document.createElement('button');
    btnDel.textContent = '✕';
    btnDel.style.cssText = `background:none; border:none; cursor:pointer; color:var(--ink-light); font-size:12px; opacity:0.5; margin-left:auto;`;
    
    btnDel.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(`api/metas.php?id=${id}`, { method: 'DELETE' })
            .then(() => label.remove());
    });

    label.appendChild(btnDel);
    goalsList.appendChild(label);
}

// Função para adicionar nova meta (POST)
function addGoal() {
    const texto = newGoalInput.value.trim();
    if (!texto) return;

    fetch('api/metas.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ texto })
    })
    .then(r => r.json())
    .then(data => {
        renderMeta(data.id, data.texto, data.concluida);
        newGoalInput.value = '';
    });
}

// Função para carregar metas do banco (GET)
function carregarMetas() {
    fetch('api/metas.php')
        .then(r => r.json())
        .then(metas => {
            goalsList.innerHTML = '';
            metas.forEach(m => renderMeta(m.id, m.texto, m.concluida));
        });
}

// Listeners
document.getElementById('btnAddGoal').addEventListener('click', addGoal);
newGoalInput.addEventListener('keydown', e => { if (e.key === 'Enter') addGoal(); });

// Carrega ao iniciar
carregarMetas();


// ------ POSTITS -------- //
function initPostit(el, id) {
  let dx, dy, dragging = false;

  el.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON' || e.target.getAttribute('contenteditable') === 'true') return;
    dragging = true;
    dx = e.clientX - el.getBoundingClientRect().left;
    dy = e.clientY - el.getBoundingClientRect().top;
    el.style.transition = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left = (e.clientX - dx) + 'px';
    el.style.top = (e.clientY - dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      // SALVAR POSIÇÃO AO SOLTAR
      fetch(`api/postits.php?id=${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ x: parseFloat(el.style.left), y: parseFloat(el.style.top) })
      });
    }
  });

  // SALVAR TEXTO AO SAIR (blur)
  const texto = el.querySelector('.postit-text');
  texto.addEventListener('blur', () => {
    fetch(`api/postits.php?id=${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ texto: texto.innerText })
    });
  });
}

// CRIAR NOVO (POST)
document.addEventListener('dblclick', e => {
  if (e.target.closest('.floating-postit') || e.target.closest('.page')) return;

  const cores = ['#e8c84a', '#f4a261', '#a8d8a8', '#a8d8ea', '#f4c4c4'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  const x = e.clientX;
  const y = e.clientY;

  fetch('api/postits.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ x, y, cor })
  })
  .then(r => r.json())
  .then(data => {
    renderPostit(data.id, '', x, y, cor);
  });
});

function renderPostit(id, texto, x, y, cor) {
  const novo = document.createElement('div');
  novo.classList.add('floating-postit');
  novo.style.cssText = `left:${x}px; top:${y}px; background:${cor}; position:fixed;`;
  novo.innerHTML = `
    <div class="postit-label">lembrete</div>
    <div class="postit-text" contenteditable="true" style="outline:none;cursor:text;">${texto}</div>
    <button class="btn-del-postit" style="position:absolute;top:4px;right:6px;background:none;border:none;cursor:pointer;font-size:12px;opacity:0.5;">✕</button>
  `;
  
  novo.querySelector('.btn-del-postit').onclick = () => {
    fetch(`api/postits.php?id=${id}`, { method: 'DELETE' }).then(() => novo.remove());
  };

  document.body.appendChild(novo);
  initPostit(novo, id);
}

// CARREGAR TUDO (GET)
function carregarPostits() {
  fetch('api/postits.php')
    .then(r => r.json())
    .then(data => {
      data.forEach(p => renderPostit(p.id, p.texto, p.pos_x, p.pos_y, p.cor));
    });
}

carregarPostits();




