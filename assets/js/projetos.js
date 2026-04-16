// assets/js/projetos.js

const getImgProjeto = initImageUpload('projImg', 'imgPreview');

document.getElementById('btnAddProject').addEventListener('click', () => {
  const nome   = document.getElementById('projNome').value.trim();
  const desc   = document.getElementById('projDesc').value.trim();
  const tags   = document.getElementById('projTags').value.trim();
  const link   = document.getElementById('projLink').value.trim();
  const status = document.getElementById('projStatus').value;
  const imgSrc = getImgProjeto();

  if (!nome) { alert('Informe pelo menos o nome do projeto.'); return; }

  const tagHTML = tags
    ? tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')
    : '';

  const statusLabel = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído' }[status];

  const imgHTML = imgSrc
    ? `<img class="card-img" src="${imgSrc}" alt="${nome}">`
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

  document.getElementById('projectsGrid').prepend(card);

  ['projNome','projDesc','projTags','projLink'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('projStatus').value = 'ativo';
  document.getElementById('projImg').value = '';
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('imgPreview').src = '';
});