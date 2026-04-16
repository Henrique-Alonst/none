// assets/js/utils.js

/**
 * Inicializa o upload e preview de imagem
 * @param {string} inputId  - id do input file
 * @param {string} previewId - id da tag img de preview
 * @returns {Function} getImageSrc - chama pra pegar o src atual da imagem
 */
function initImageUpload(inputId, previewId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) { preview.style.display = 'none'; return; }
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Retorna função pra pegar o src quando precisar
  return () => preview.style.display !== 'none' ? preview.src : null;
}