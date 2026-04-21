// assets/js/projetos.js

function carregarProjetos() {
  fetch('api/projetos.php')
    .then(r => r.json())
    .then(projetos => {
      const grid = document.getElementById('projectsGrid');
      grid.innerHTML = '';
      projetos.forEach(p => {
        adicionarCard(
          'projectsGrid',
          p.nome,
          p.descricao,
          p.status,
          p.tags,
          p.link,
          p.imagem ? `uploads/${p.imagem}` : null,
          '🗂️',
          p.id,
          'api/projetos.php'
        );
      });
    });
}

initAccordion('toggleProjetos', 'formProjetos');
const getImgProjeto = initImageUpload('projImg', 'imgPreview');

document.getElementById('btnAddProject').addEventListener('click', () => {
  const nome   = document.getElementById('projNome').value.trim();
  const desc   = document.getElementById('projDesc').value.trim();
  const tags   = document.getElementById('projTags').value.trim();
  const link   = document.getElementById('projLink').value.trim();
  const status = document.getElementById('projStatus').value;
  const arquivoImg = document.getElementById('projImg').files[0];

  if (!nome) { alert('Informe pelo menos o nome do projeto.'); return; }

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('desc', desc);
  formData.append('status', status);
  formData.append('tags', tags);
  formData.append('link', link);

  if(arquivoImg){
    formData.append('imagem_arquivo', arquivoImg);
  }

  fetch('api/projetos.php', {
    method: 'POST',
    body: formData
  })
  .then(r => r.json())
  .then(() => {
    carregarProjetos();


    ['projNome','projDesc','projTags','projLink'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('projStatus').value = 'ativo';
    document.getElementById('projImg').value = '';
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('imgPreview').src = '';
  });
});

document.getElementById('btnProjetos').addEventListener('click', () => {
  showView('projetos');
  carregarProjetos();
});

if (localStorage.getItem('viewAtual') === 'projetos') {
  carregarProjetos();
}