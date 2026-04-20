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
document.querySelectorAll('[data-back-financas]').forEach(btn => btn.addEventListener('click', () => showView('financas')));

// ===== METAS =====
function toggleGoal(checkbox) {
  checkbox.nextElementSibling.classList.toggle('done', checkbox.checked);
  // TODO: fetch(`api/metas.php?id=${id}`, { method: 'PATCH', body: JSON.stringify({ concluida: checkbox.checked }) })
}

// Inicializa checkboxes já marcados
document.querySelectorAll('.goal-item input[type="checkbox"]').forEach(cb => {
  if (cb.checked) cb.nextElementSibling.classList.add('done');
});

const newGoalInput = document.getElementById('newGoalInput');
const goalsList    = document.getElementById('goalsList');

function addGoal() {
  const texto = newGoalInput.value.trim();
  if (!texto) return;

  const label = document.createElement('label');
  label.classList.add('goal-item');
  label.innerHTML = `<input type="checkbox" onchange="toggleGoal(this)"><span>${texto}</span>`;

  // Botão apagar
  const btnDel = document.createElement('button');
  btnDel.textContent = '✕';
  btnDel.style.cssText = `
    background:none; border:none; cursor:pointer;
    color:var(--ink-light); font-size:12px;
    opacity:0.5; margin-left:auto; flex-shrink:0;
    transition: opacity 0.15s;
  `;
  btnDel.addEventListener('click', (e) => {
    e.preventDefault();
    label.remove();
  });

  label.appendChild(btnDel);
  goalsList.appendChild(label);
  newGoalInput.value = '';
}

document.getElementById('btnAddGoal').addEventListener('click', addGoal);
newGoalInput.addEventListener('keydown', e => { if (e.key === 'Enter') addGoal(); });

// ===== POST-IT DRAG, EDIT E MULTI =====
function initPostit(el) {
  // Drag
  let dx, dy, dragging = false;
  el.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') return;
    dragging = true;
    dx = e.clientX - el.getBoundingClientRect().left;
    dy = e.clientY - el.getBoundingClientRect().top;
    el.style.transition = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left   = (e.clientX - dx) + 'px';
    el.style.top    = (e.clientY - dy) + 'px';
    el.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; });

  // Editar ao clicar no texto
  const texto = el.querySelector('.postit-text');
  texto.setAttribute('contenteditable', 'true');
  texto.style.outline = 'none';
  texto.style.cursor  = 'text';
}

// Inicializa o post-it original
initPostit(document.querySelector('.floating-postit'));

// Duplo clique no fundo cria novo post-it
document.addEventListener('dblclick', e => {
  if (e.target.closest('.floating-postit') || e.target.closest('.page')) return;

  const cores = ['#e8c84a', '#f4a261', '#a8d8a8', '#a8d8ea', '#f4c4c4'];
  const cor   = cores[Math.floor(Math.random() * cores.length)];

  const novo = document.createElement('div');
  novo.classList.add('floating-postit');
  novo.style.left   = e.clientX + 'px';
  novo.style.top    = e.clientY + 'px';
  novo.style.bottom = 'auto';
  novo.style.background = cor;
  novo.innerHTML = `
    <div class="postit-label">lembrete</div>
    <div class="postit-text" contenteditable="true" style="outline:none;cursor:text;"></div>
    <button onclick="this.closest('.floating-postit').remove()" style="position:absolute;top:4px;right:6px;background:none;border:none;cursor:pointer;font-size:12px;opacity:0.5;">✕</button>
  `;
  document.body.appendChild(novo);
  initPostit(novo);

  // Foca direto no texto
  setTimeout(() => novo.querySelector('.postit-text').focus(), 50);
});





