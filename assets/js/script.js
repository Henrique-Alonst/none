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
  financas: document.getElementById('view-financas'),
  objetivos: document.getElementById('view-objetivos'),
};

function showView(name) {
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btnCaderno') .addEventListener('click', () => showView('caderno'));
document.getElementById('btnProjetos').addEventListener('click', () => showView('projetos'));
document.getElementById('btnObjetivos').addEventListener('click', () => showView('objetivos'));
document.getElementById('btnFinanca').addEventListener('click', () => showView('financas'));
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showView('home')));

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






