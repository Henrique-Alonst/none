<!--pages/objetivos.php-->
<div class="view" id="view-objetivos">
    <button class="back-btn" data-back>← Voltar</button>

    <div class="section">
    <h2 class="section-title">🗂️ &nbsp;Novo Objetivo</h2>
    <div class="project-form">
      <p class="project-form-title">Preencha as informações do seu objetivo</p>

      <div class="form-row">
        <div class="field-group">
          <label>Nome do Objetivo</label>
          <input type="text" id="projNomeObj" placeholder="Ex: Dashboard Pessoal">
        </div>
        <div class="field-group">
          <label>Status</label>
          <select id="projStatusObj">
            <option value="ativo">🟢 Ativo</option>
            <option value="pausado">🟡 Pausado</option>
            <option value="concluido">🔴 Concluído</option>
          </select>
        </div>
      </div>

      <div class="field-group">
        <label>Descrição</label>
        <textarea id="projDescObj" placeholder="O que é esse projeto? Qual o objetivo?"></textarea>
      </div>

      <div class="field-group">
        <label>Imagem do Objetivo</label>
        <input type="file" id="projImgObj" accept="image/*">
        <img id="imgPreviewObj" src="" alt="Preview da imagem">
      </div>

      <button class="add-project-btn" id="btnAddProjectObj">+ Adicionar Projeto</button>
    </div>
  </div>

    <div class="section">
       <h2 class="section-title">📂 &nbsp;Meus Objetivos</h2>
        <div class="projects-grid" id="projectsGridObj">
          <!--  Objetivos que vou realizar ficarão aqui --> 
        </div>
    </div>

</div>

 



