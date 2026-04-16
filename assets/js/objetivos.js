// assets/js/objetivos.js

const getImgObjetivo = initImageUpload('projImgObj', 'imgPreviewObj');

document.getElementById('btnAddProjectObj').addEventListener('click', () => {
  const nome   = document.getElementById('projNomeObj').value.trim();
  const desc   = document.getElementById('projDescObj').value.trim();
  const status = document.getElementById('projStatusObj').value;
  const imgSrc = getImgObjetivo();

  if (!nome) { alert('Informe pelo menos o nome do objetivo.'); return; }

  const statusLabel = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído' }[status];

  const imgHTML = imgSrc
    ? `<img class="card-img" src="${imgSrc}" alt="${nome}">`
    : `<div class="card-img-placeholder">🎯</div>`;

  const card = document.createElement('div');
  card.classList.add('project-card');
  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <div class="card-name">${nome}</div>
      <div class="card-desc">${desc || 'Sem descrição.'}</div>
      <div class="card-tags">
        <span class="tag status-${status}">${statusLabel}</span>
      </div>
    </div>`;

  document.getElementById('projectsGridObj').prepend(card);

  ['projNomeObj','projDescObj'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('projStatusObj').value = 'ativo';
  document.getElementById('projImgObj').value = '';
  document.getElementById('imgPreviewObj').style.display = 'none';
  document.getElementById('imgPreviewObj').src = '';
});