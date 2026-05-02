// assets/js/objetivos.js

function carregarobjetivos() {
  fetch('api/objetivos.php')
    .then(r => r.json())
    .then(objetivos => {
      const grid = document.getElementById('projectsGridObj');
      grid.innerHTML = '';
      objetivos.forEach(p => {
        adicionarCard(
          'projectsGridObj',
          p.nome,
          p.descricao,
          p.status,
          null,
          null,
          p.imagem ? `uploads/${p.imagem}` : null,
          '🗂️',
          p.id,
          'api/objetivos.php'
        );
      });
    });
}

initAccordion('toggleObjetivos', 'formObjetivos');
const getImgObjetivo = initImageUpload('projImgObj', 'imgPreviewObj');

document.getElementById('btnAddObjetivo').addEventListener('click', () => {
  const nome   = document.getElementById('projNomeObj').value.trim();
  const desc   = document.getElementById('projDescObj').value.trim();
  const status = document.getElementById('projStatusObj').value;
  const arquivoImg = document.getElementById('projImgObj').files[0];

  if (!nome) { alert('Informe pelo menos o nome do objetivo.'); return; }

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('desc', desc);
  formData.append('status', status);

  if(arquivoImg){
    formData.append('imagem_arquivo', arquivoImg);
  }

  fetch('api/objetivos.php', {
    method: 'POST',
    body: formData
  })
  .then(r => r.json())
  .then(() => {
    carregarobjetivos(); // recarrega tudo do banco, não precisa chamar adicionarCard aqui

    ['projNomeObj','projDescObj',].forEach(id => document.getElementById(id).value = '');
    document.getElementById('projStatusObj').value = 'ativo';
    document.getElementById('projImgObj').value = '';
    document.getElementById('imgPreviewObj').style.display = 'none';
    document.getElementById('imgPreviewObj').src = '';
  });
});

document.getElementById('btnObjetivos').addEventListener('click', () => {
  showView('objetivos');
  carregarobjetivos();
});

if (localStorage.getItem('viewAtual') === 'objetivos') {
  carregarobjetivos();
}

initDragDrop('projectsGridObj', 'api/objetivos.php');