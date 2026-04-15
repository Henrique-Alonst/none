<!-- pages/caderno.php -->
<div class="view" id="view-caderno">
  <button class="back-btn" data-back>← Voltar</button>

  <div class="section">
    <h2 class="section-title">✎ &nbsp;Nova Anotação</h2>
    <div class="notes-form">
      <label for="notaTexto">O que você quer registrar?</label>
      <textarea id="notaTexto" rows="4" placeholder="Escreva aqui sua anotação..."></textarea>
      <button class="save-btn" id="btnSalvar">Salvar nota</button>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📌 &nbsp;Anotações</h2>
    <div class="notes-list" id="notesList">
      <!-- Futuramente: notas virão do banco via api/notas.php -->
      <div class="note-item">
        <p class="note-meta">07 ABR 2026 · 14:32</p>
        <p class="note-text">Revisar capítulos 3 e 4 do livro de estrutura de dados antes da prova de quinta.</p>
      </div>
      <div class="note-item">
        <p class="note-meta">05 ABR 2026 · 09:15</p>
        <p class="note-text">Fazer o endpoint de autenticação em PHP: POST /api/login — retornar JWT.</p>
      </div>
      <div class="note-item">
        <p class="note-meta">01 ABR 2026 · 21:47</p>
        <p class="note-text">Ideia: dashboard pessoal com acesso rápido a links, caderno e progresso de objetivos.</p>
      </div>
    </div>
  </div>
</div>
