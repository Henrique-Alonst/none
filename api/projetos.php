<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

// Permite simular PATCH via POST com FormData
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
} else {
    $method = $_SERVER['REQUEST_METHOD'];
}

switch ($method) {

    case 'GET':
        $stmt = $pdo->query("SELECT * FROM projetos ORDER BY criado_em DESC");
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

        $stmt = $pdo->prepare("INSERT INTO projetos (nome, descricao, status, tags, link, imagem) VALUES (?,?,?,?,?,?)");
        $stmt->execute([$nome, $desc, $status, $tags, $link, $nome_imagem]);
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

            if (!is_dir($diretorio)) mkdir($diretorio, 0777, true);

            if (move_uploaded_file($_FILES['imagem_arquivo']['tmp_name'], $diretorio . $novo_nome)) {
                $nome_imagem = $novo_nome;

                // Apaga imagem antiga
                $stmtImg = $pdo->prepare("SELECT imagem FROM projetos WHERE id = ?");
                $stmtImg->execute([$id]);
                $item = $stmtImg->fetch();
                if ($item && $item['imagem']) @unlink('../uploads/' . $item['imagem']);
            }
        }

        if ($nome_imagem) {
            $stmt = $pdo->prepare("UPDATE projetos SET nome = ?, descricao = ?, imagem = ? WHERE id = ?");
            $stmt->execute([$nome, $desc, $nome_imagem, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?");
            $stmt->execute([$nome, $desc, $id]);
        }

        echo json_encode(['mensagem' => 'Projeto atualizado.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmtImg = $pdo->prepare("SELECT imagem FROM projetos WHERE id = ?");
        $stmtImg->execute([$id]);
        $projeto = $stmtImg->fetch();
        if ($projeto && $projeto['imagem']) @unlink('../uploads/' . $projeto['imagem']);

        $stmt = $pdo->prepare("DELETE FROM projetos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => "Projeto $id removido"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}