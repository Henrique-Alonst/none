// ===== OBJETIVOS — PREVIEW DE IMAGEM =====
const projImgObj    = document.getElementById('projImgObj');
const imgPreviewObj = document.getElementById('imgPreviewObj');

projImgObj.addEventListener('change', () => {
  const file = projImgObj.files[0];
  if (!file) { imgPreviewObj.style.display = 'none'; return; }
  const reader = new FileReader();
  reader.onload = e => { imgPreviewObj.src = e.target.result; imgPreviewObj.style.display = 'block'; };
  reader.readAsDataURL(file);
});

// ===== OBJETIVOS — ADICIONAR =====
document.getElementById('btnAddProjectObj').addEventListener('click', () => {
  const nome   = document.getElementById('projNomeObj').value.trim();
  const desc   = document.getElementById('projDescObj').value.trim();
  const status = document.getElementById('projStatusObj').value;

  if (!nome) { alert('Informe pelo menos o nome do objetivo.'); return; }

  // montar card aqui quando quiser
  alert('Objetivo salvo: ' + nome);
});