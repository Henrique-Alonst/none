<?php 
header('Content-Type: application/json');
require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $stmt = $pdo->query("SELECT * FROM meses ORDER BY criado_em ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true);
        $nome = trim($body['nome'] ?? '');

        if (empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome não pode ser vazio.']);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO meses (nome) VALUES (?)");
        $stmt->execute([$nome]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'nome' => $nome]);
        break;

    case 'PATCH':
        $id       = intval($_GET['id'] ?? 0);
        $body     = json_decode(file_get_contents('php://input'), true);
        $nome     = trim($body['nome'] ?? '');
        $orcamento = floatval($body['orcamento'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("UPDATE meses SET nome = ?, orcamento = ? WHERE id = ?");
        $stmt->execute([$nome, $orcamento, $id]);
        echo json_encode(['mensagem' => 'Mês atualizado.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM meses WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'Mês removido.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}

