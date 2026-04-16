<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Meu Ambiente</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <div class="page">

    <?php require_once 'includes/header.php'; ?>

    <!-- ====== HOME ====== -->
    <div class="view active" id="view-home">
      <div class="home-layout">

        <!-- COLUNA PRINCIPAL -->
        <div class="main-col">

          <div class="section">
            <h2 class="section-title">✎ &nbsp;Acesso Rápido</h2>
            <div class="quick-links">
              <a class="link-btn" href="https://github.com" target="_blank"><span>⌥</span> GitHub</a>
              <a class="link-btn" href="https://youtube.com" target="_blank"><span>▶</span> YouTube</a>
              <a class="link-btn" href="https://linkedin.com" target="_blank"><span>◈</span> LinkedIn</a>
              <a class="link-btn" href="https://chatgpt.com" target="_blank"><span>✦</span> ChatGPT</a>
              <a class="link-btn" href="https://members.kiwify.com/login?club=b6de4ed5-f0c2-48a7-b226-6c78e2c01048" target="_blank"><span>✈</span> Inglês</a>
              <a class="link-btn" href="https://portalaluno.qi.edu.br/" target="_blank"><span>모</span> FAQI</a>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">✐ &nbsp;Seções</h2>
            <div class="nav-cards">
              <div class="nav-card" id="btnCaderno">
                <span class="big-icon">📒</span>
                <div>
                  <div>Caderno</div>
                  <span class="card-sub">ANOTAÇÕES →</span>
                </div>
              </div>
              <div class="nav-card" id="btnFinanca">
                <span class="big-icon">📒</span>
                <div>
                  <div>Finanças</div>
                  <span class="card-sub">FINANÇAS →</span>
                </div>
              </div>
              <div class="nav-card" id="btnObjetivos">
                <span class="big-icon">📒</span>
                <div>
                  <div>Objetivos</div>
                  <span class="card-sub">OBJETIVOS →</span>
                </div>
              </div>
              <div class="nav-card" id="btnProjetos">
                <span class="big-icon">🗂️</span>
                <div>
                  <div>Projetos</div>
                  <span class="card-sub">VER TODOS →</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- SIDEBAR -->
        <div class="sidebar">

          <div class="section">
            <h2 class="section-title">◎ &nbsp;Metas</h2>
            <div class="goals-list" id="goalsList">
              <label class="goal-item">
                <input type="checkbox" onchange="toggleGoal(this)">
                <span>Terminar o dashboard</span>
              </label>
              <label class="goal-item">
                <input type="checkbox" checked onchange="toggleGoal(this)">
                <span>Criar o wireframe da ideia</span>
              </label>
              <label class="goal-item">
                <input type="checkbox" onchange="toggleGoal(this)">
                <span>Estudar PHP para o backend</span>
              </label>
              <label class="goal-item">
                <input type="checkbox" onchange="toggleGoal(this)">
                <span>Fazer um projeto pessoal do zero</span>
              </label>
            </div>
            <div class="new-goal-row">
              <input type="text" id="newGoalInput" placeholder="Nova meta...">
              <button id="btnAddGoal" title="Adicionar">＋</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ====== CADERNO ====== -->
    <?php require_once 'pages/caderno.php'; ?>

    <!-- ====== PROJETOS ====== -->
    <?php require_once 'pages/projetos.php'; ?>

    <!-- ====== OBJETIVOS ====== -->
    <?php require_once 'pages/objetivos.php'; ?>

    <!-- ====== FINANÇAS ====== -->
    <?php require_once 'pages/financas.php'; ?>


  </div><!-- /page -->

  <!-- RELÓGIO FLUTUANTE -->
  <div class="floating-clock">
    <div class="clock-time" id="clockTime">00:00</div>
    <div class="clock-date" id="clockDateSmall"></div>
  </div>

  <!-- POST-IT FLUTUANTE -->
  <div class="floating-postit">
    <div class="postit-label">lembrete</div>
    <div class="postit-text">Não esqueça de commitar o projeto hoje! 📌</div>
  </div>
  
  <script src="assets/js/utils.js"></script>
  <script src="assets/js/script.js"></script>
  
  <script src="assets/js/caderno.js"></script>
  <script src="assets/js/financas.js"></script>
  <script src="assets/js/objetivos.js"></script>
  <script src="assets/js/projetos.js"></script>
  
</body>
</html>
