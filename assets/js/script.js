// assets/js/script.js

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
};

function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btnCaderno') .addEventListener('click', () => showView('caderno'));
document.getElementById('btnProjetos').addEventListener('click', () => showView('projetos'));
document.getElementById('btnMetas').addEventListener('click', () => showView('metas'));
document.getElementById('btnFinancas').addEventListener('click', () => showView('financas'));
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showView('home')));

// ===== CADERNO =====
const notaTexto = document.getElementById('notaTexto');
const notesList = document.getElementById('notesList');

document.getElementById('btnSalvar').addEventListener('click', () => {
  const texto = notaTexto.value.trim();
  if (!texto) return;

  // TODO: substituir por fetch('api/notas.php', { method: 'POST', body: JSON.stringify({ texto }) })
  const nota = document.createElement('div');
  nota.classList.add('note-item');
  nota.innerHTML = `<p class="note-meta">${fmtDate(new Date())}</p><p class="note-text">${texto}</p>`;
  notesList.prepend(nota);
  notaTexto.value = '';
});

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

  // TODO: fetch('api/metas.php', { method: 'POST', body: JSON.stringify({ texto }) })
  const label = document.createElement('label');
  label.classList.add('goal-item');
  label.innerHTML = `<input type="checkbox" onchange="toggleGoal(this)"><span>${texto}</span>`;
  goalsList.appendChild(label);
  newGoalInput.value = '';
}

document.getElementById('btnAddGoal').addEventListener('click', addGoal);
newGoalInput.addEventListener('keydown', e => { if (e.key === 'Enter') addGoal(); });

// ===== PROJETOS — PREVIEW DE IMAGEM =====
const projImg    = document.getElementById('projImg');
const imgPreview = document.getElementById('imgPreview');

projImg.addEventListener('change', () => {
  const file = projImg.files[0];
  if (!file) { imgPreview.style.display = 'none'; return; }
  const reader = new FileReader();
  reader.onload = e => { imgPreview.src = e.target.result; imgPreview.style.display = 'block'; };
  reader.readAsDataURL(file);
});

// ===== PROJETOS — ADICIONAR =====
const projectsGrid = document.getElementById('projectsGrid');

document.getElementById('btnAddProject').addEventListener('click', () => {
  const nome   = document.getElementById('projNome').value.trim();
  const desc   = document.getElementById('projDesc').value.trim();
  const tags   = document.getElementById('projTags').value.trim();
  const link   = document.getElementById('projLink').value.trim();
  const status = document.getElementById('projStatus').value;
  const hasImg = imgPreview.style.display !== 'none' && imgPreview.src;

  if (!nome) { alert('Informe pelo menos o nome do projeto.'); return; }

  // TODO: fetch('api/projetos.php', { method: 'POST', body: JSON.stringify({ nome, desc, status, tags, link }) })

  const tagHTML = tags
    ? tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')
    : '';

  const statusLabel = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído' }[status];

  const imgHTML = hasImg
    ? `<img class="card-img" src="${imgPreview.src}" alt="${nome}">`
    : `<div class="card-img-placeholder">🗂️</div>`;

  const linkHTML = link
    ? `<a class="card-link" href="${link}" target="_blank">↗ VER PROJETO</a>`
    : '';

  const card = document.createElement('div');
  card.classList.add('project-card');
  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <div class="card-name">${nome}</div>
      <div class="card-desc">${desc || 'Sem descrição.'}</div>
      <div class="card-tags">
        <span class="tag status-${status}">${statusLabel}</span>
        ${tagHTML}
      </div>
      ${linkHTML}
    </div>`;

  projectsGrid.prepend(card);

  // Limpa formulário
  ['projNome','projDesc','projTags','projLink'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('projStatus').value = 'ativo';
  projImg.value = '';
  imgPreview.style.display = 'none';
  imgPreview.src = '';
});
