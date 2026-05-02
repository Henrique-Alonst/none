<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

// --- 1. DEFINIÇÕES INICIAIS (Obrigatório vir primeiro) ---

// Detecta o método (suporta simulação de PATCH via POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
} else {
    $method = $_SERVER['REQUEST_METHOD'];
}

// Lê o corpo da requisição (necessário para o JSON do drag and drop)
$input = json_decode(file_get_contents('php://input'), true);

// --- 2. LÓGICA DE ORDENAÇÃO (Drag and Drop) ---

if (isset($input['action']) && $input['action'] === 'update_order') {
    $ids = $input['ids']; 
    
    $pdo->beginTransaction();
    try {
        foreach ($ids as $index => $id) {
            $stmt = $pdo->prepare("UPDATE objetivos SET ordem = ? WHERE id = ?");
            $stmt->execute([$index, $id]);
        }
        $pdo->commit();
        echo json_encode(['status' => 'sucesso']);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['erro' => $e->getMessage()]);
    }
    exit; // Importante para não executar o switch abaixo
}

// --- 3. OPERAÇÕES CRUD NORMAIS ---

switch ($method) {

    case 'GET':
        // Busca ordenado pela coluna 'ordem'
        $stmt = $pdo->query("SELECT * FROM objetivos ORDER BY ordem ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $nome   = trim($_POST['nome']   ?? '');
        $desc   = trim($_POST['desc']   ?? '');
        $status = trim($_POST['status'] ?? 'ativo');
        $tags   = trim($_POST['tags']   ?? '');
        $link   = trim($_POST['link']   ?? '');

        $nome_imagem = null;
        if (isset($_FILES['imagem_arquivo']) && $_FILES['imagem_arquivo']['error'] === 0) {
            $extensao  = strtolower(pathinfo($_FILES['imagem_arquivo']['name'], PATHINFO_EXTENSION));
            $novo_nome = uniqid() . '.' . $extensao;
            $diretorio = '../uploads/';
            if (!is_dir($diretorio)) mkdir($diretorio, 0777, true);
            if (move_uploaded_file($_FILES['imagem_arquivo']['tmp_name'], $diretorio . $novo_nome)) {
                $nome_imagem = $novo_nome;
            }
        }

        if (empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome não pode ser vazio.']);
            break;
        }

        // Ao inserir novo, ele fica com ordem 0 por padrão (ou você pode pegar o MAX(ordem) + 1)
        $stmt = $pdo->prepare("INSERT INTO objetivos (nome, descricao, status, imagem, ordem) VALUES (?,?,?,?,?)");
        $stmt->execute([$nome, $desc, $status, $nome_imagem, 0]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'nome' => $nome]);
        break;

    case 'PATCH':
        $id   = intval($_GET['id'] ?? 0);
        $nome = trim($_POST['nome'] ?? '');
        $desc = trim($_POST['desc'] ?? '');

        if (!$id || empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados inválidos.']);
            break;
        }

        $nome_imagem = null;
        if (isset($_FILES['imagem_arquivo']) && $_FILES['imagem_arquivo']['error'] === 0) {
            $extensao  = strtolower(pathinfo($_FILES['imagem_arquivo']['name'], PATHINFO_EXTENSION));
            $novo_nome = uniqid() . '.' . $extensao;
            $diretorio = '../uploads/';
            if (move_uploaded_file($_FILES['imagem_arquivo']['tmp_name'], $diretorio . $novo_nome)) {
                $nome_imagem = $novo_nome;
                $stmtImg = $pdo->prepare("SELECT imagem FROM objetivos WHERE id = ?");
                $stmtImg->execute([$id]);
                $item = $stmtImg->fetch();
                if ($item && $item['imagem']) @unlink('../uploads/' . $item['imagem']);
            }
        }

        if ($nome_imagem) {
            $stmt = $pdo->prepare("UPDATE objetivos SET nome = ?, descricao = ?, imagem = ? WHERE id = ?");
            $stmt->execute([$nome, $desc, $nome_imagem, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE objetivos SET nome = ?, descricao = ? WHERE id = ?");
            $stmt->execute([$nome, $desc, $id]);
        }

        echo json_encode(['mensagem' => 'Atualizado com sucesso.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }
        $stmtImg = $pdo->prepare("SELECT imagem FROM objetivos WHERE id = ?");
        $stmtImg->execute([$id]);
        $objetivo = $stmtImg->fetch();
        if ($objetivo && $objetivo['imagem']) @unlink('../uploads/' . $objetivo['imagem']);

        $stmt = $pdo->prepare("DELETE FROM objetivos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => "Removido"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}