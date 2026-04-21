<!-- pages/projetos.php -->
<div class="view" id="view-projetos">
  <button class="back-btn" data-back>← Voltar</button>

  <div class="section">
    <h2 class="section-title" id="toggleProjetos" style="cursor:pointer;">🗂️ &nbsp;Novo Projeto</h2>
    <div class="project-form" id="formProjetos">
      <p class="project-form-title">Preencha as informações do projeto</p>

      <div class="form-row">
        <div class="field-group">
          <label>Nome do Projeto</label>
          <input type="text" id="projNome" placeholder="Ex: Dashboard Pessoal">
        </div>
        <div class="field-group">
          <label>Status</label>
          <select id="projStatus">
            <option value="ativo">🟢 Ativo</option>
            <option value="pausado">🟡 Pausado</option>
            <option value="concluido">🔴 Concluído</option>
          </select>
        </div>
      </div>

      <div class="field-group">
        <label>Descrição</label>
        <textarea id="projDesc" placeholder="O que é esse projeto? Qual o objetivo?"></textarea>
      </div>

      <div class="form-row">
        <div class="field-group">
          <label>Tecnologias / Tags (separadas por vírgula)</label>
          <input type="text" id="projTags" placeholder="Ex: PHP, JS, CSS">
        </div>
        <div class="field-group">
          <label>Link (GitHub, deploy, etc.)</label>
          <input type="text" id="projLink" placeholder="https://...">
        </div>
      </div>

      <div class="field-group">
        <label>Imagem do Projeto</label>
        <input type="file" id="projImg" name="imagem_arquivo" accept="image/*">
        <img id="imgPreview" src="" alt="Preview da imagem" style="display: none;">
      </div>

      <button class="add-project-btn" id="btnAddProject">+ Adicionar Projeto</button>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📂 &nbsp;Meus Projetos</h2>
     <div class="projects-grid" id="projectsGrid">
      <!-- Projetos criados ficarão aqui --> 
     </div>
  </div>

</div>
