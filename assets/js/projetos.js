const projImg    = document.getElementById('projImg');
const imgPreview = document.getElementById('imgPreview');

projImg.addEventListener('change', () => {
  const file = projImg.files[0];
  if (!file) { imgPreview.style.display = 'none'; return; }
  const reader = new FileReader();
  reader.onload = e => { imgPreview.src = e.target.result; imgPreview.style.display = 'block'; };
  reader.readAsDataURL(file);
});

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