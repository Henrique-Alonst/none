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